---
author: "Sam Rhea"
date: 2020-04-05
linktitle: 🦊🔐 zero-trust CI/CD with GitLab and Cloudflare Access
title: 🦊🔐 zero-trust CI/CD with GitLab and Cloudflare Access
images: ["https://blog.samrhea.com/static/gitlab/install.png"]
description: What if our self-managed apps felt like SaaS tools?
tags: ["cloudflare",",","Access",",","walkthrough"]
---

SaaS applications make things easy. I am not responsible for server maintenance, scaling, or uptime. I just sign-up and go.

However, running a self-managed application still has advantages. I can control the version, the features, and the data. I also have more discretion over the security model. Whether for these reasons, or requirements like compliance, some teams choose to host their own tools.

That decision typically comes with a convenience cost, and that cost takes two forms:

|Form|Pain point|
|---|---|
|**Admin**| I have to maintain the application and the infrastructure on which it runs.|
|**User**| In most cases, I have to use a VPN client to connect to the managed application.|

On the Admin side, this is getting better. Public cloud providers, image templates, and better management tools make it easier than ever to host your own application. It's work, but it's not as bad as it was.

The user-side, however, is still painful. Users have two options for connecting to self-managed applications: a VPN client, which degrades the experience, or the application can be exposed to the public Internet, leaving it vulnerable.

The subtitle of this post is "What if our self-managed apps felt like SaaS tools?" and I think that's a real option. This post walks through using Cloudflare Access and Argo Tunnel to add a zero trust security layer to GitLab. I cover a lot of detail, including setting up GitLab, but if you want you can [skip to the video](https://blog.samrhea.com/post/gitlab-auth/#so-what-does-it-look-like-as-a-user) at the end - it captures the SaaS-like experience for an end user.

Want to see all the configuration? Keep reading.

---

**🎯 I have a few goals for this project:**

* Deploy GitLab to a cloud environment that I control
* Secure GitLab with a zero trust framework without server-side code changes
* Integrate multiple identity provider options for authentication
* Connect to GitLab over HTTP and SSH without a VPN

---

**🗺️ This walkthrough covers how to:**

* Deploy an instance of GitLab in a public cloud provider
* Lock down all inbound connections to that instance and use Argo Tunnel to set outbound connections to Cloudflare
* Build policies with Cloudflare Access to control who can reach GitLab
* Connect over HTTP and SSH through Cloudflare's smart routing feature

**⏲️Time to complete: ~1 hour**

---

> **👔 I work there.** I [work](https://www.linkedin.com/in/samrhea/) at Cloudflare. Several of my posts on this blog that discuss Cloudflare focus on building things with Cloudflare Workers. I'm a Workers customer and [pay](https://twitter.com/LakeAustinBlvd/status/1200380340382191617) my invoice to use it. However, this experiment uses products where I'm on the team (Access and Tunnel).

## GitLab

[GitLab](https://about.gitlab.com/) is more than just Git repository software. The application includes services for the entire development lifecycle, like issue tracking, code quality analysis, package management and release tools.

GitLab is available in two models: a SaaS offering and as licensed software that you can run in your own environment.

I'm going to deploy GitLab in an environment that I control. Historically, I would have made it available to team members through a private network. I would punch holes in the firewall around that environment and they would connect through VPN clients.

That's clunky, for administrators and users, and ultimately less secure. Instead of a private network, I want to check every request for identity. And instead of a VPN client, I want end users to feel like this is any other SaaS application.

### Deploying to my "own" infrastructure

First, I'm going to create a Droplet that has 16 GB of RAM and 6 CPUs. This should make it possible to support 500 users, based on [GitLab's resource recommendations](https://docs.gitlab.com/ee/install/requirements.html). I recognize that is like buying a dining table for 50 people in my flat, I don't have personal projects that involve 500 people, but this is just a demo for now and I want to test it out.

<div style="text-align:center">
<img src="/static/gitlab/create.png" class="center" width="500"/>
</div>

GitLab will give me an external IP that is exposed to the Internet (for now). I'm going to use that to connect over SSH to the machine. I have [previously added my SSH keys](https://www.digitalocean.com/community/tutorials/how-to-set-up-ssh-keys--2) to my Digital Ocean account.

```bash
$ ssh root@142.93.XXX.XXX
```

Now I need to install GitLab. I'm going to use the [Ubuntu package](https://about.gitlab.com/install/#ubuntu) and the steps in their documentation, with a couple exceptions below.

```bash
sudo apt-get update

sudo apt-get install -y curl openssh-server ca-certificates
curl https://packages.gitlab.com/install/repositories/gitlab/gitlab-ee/script.deb.sh | sudo bash   
```

The commands above download the GitLab software to this machine. I now need to install it. This is the first place this tutorial will diverge from the operations in the GitLab documentation. The next step in the GitLab docs sets an external hostname; we don't need to worry about that for now. Instead, we'll just install the software.

```bash
sudo apt-get install gitlab-ee
```

After a minute or so, GitLab has been installed on this machine.

<div style="text-align:center">
<img src="/static/gitlab/install.png" class="center" width="400"/>
</div>

However, the application is not running yet. If I check to see what ports are listening:

```bash
sudo netstat -tulpn | grep LISTEN
```

I'm only going to see the services already active for this machine:

<div style="text-align:center">
<img src="/static/gitlab/just-services.png" class="center" width="600"/>
</div>

<p>

To start GitLab, I'll run its reconfigure command.

```bash
sudo gitlab-ctl reconfigure
```

GitLab will launch its component services and, once complete, I can confirm that GitLab is running and listening on both ports 22 and 80.

<div style="text-align:center">
<img src="/static/gitlab/gitlab-services.png" class="center" width="600"/>
</div>

I need both. Users connect to GitLab over SSH (port 22 here) and HTTP for the web app (port 80). In the next step, I'll make it possible for users to try both through Cloudflare Access. I'll leave this running and head over to the Cloudflare dashboard.

## Killing the VPN, closing the gates

### Building Access policies

Cloudflare Access is a bouncer that asks for identity at the door (each and every door). When a user makes a request to a site protected by Access, that request hits Cloudflare's network first. Access can then check if the user is allowed to reach the application. When integrated with Argo Tunnel, the zero-trust architecture looks like this:

<div style="text-align:center">
<img src="/static/tunnel-demos/teams-diagram.png" class="center" width="500"/>
</div>

To determine who can reach the application, Cloudflare Access relies on integration with identity providers like Okta or AzureAD or Google to issue the identity cards that get checked at the door. While a VPN allows me inside free range on a private network unless someone builds an active rule to stop me, Access enforces that identity check on every request (and at any granularity configured).

For GitLab, I'm going to build two policies. Users will connect to GitLab in a couple of methods: in the web app and over SSH. I'm going to create policies to secure a subdomain for each. First, the web app.

<div style="text-align:center">
<img src="/static/gitlab/gitlab-web.png" class="center" width="600"/>
</div>

The policy above will only allow members of Cloudflare and my own Google account to reach the web app. Next, I'm going to build an equivalent policy for SSH connections.

<div style="text-align:center">
<img src="/static/gitlab/gitlab-ssh.png" class="center" width="600"/>
</div>

Like the web app, this policy will check every request to connect for identity and allow allow those who meet these rules. Unlike the web app, this will happen over SSH connections - bringing SSO to SSH in a way that is easier for users and administrators. I'll connect both to Cloudflare in the next step.

### Cloudflare Argo Tunnel

Cloudflare Argo Tunnel creates a secure, outbound-only, connection between this machine and Cloudflare's network. Why does outbound-only matter? I can then prevent any direct access to this machine and lock down any externally exposed points of ingress. And with that, no open firewall ports.

Argo Tunnel is made possible through a lightweight daemon from Cloudflare called `cloudflared`. I need to first download and then install that on this machine with the two commands below.

```bash
sudo wget https://bin.equinox.io/c/VdrWdbjqyF/cloudflared-stable-linux-amd64.deb
sudo dpkg -i ./cloudflared-stable-linux-amd64.deb
```

Once installed, I need to authenticate this machine. `cloudflared` will create DNS records for the hostname that I have in Cloudflare and I need to get a certificate that tells Cloudflare's network that this instance is allowed to register DNS entries on my behalf.

```bash
cloudflared login
```

`cloudflared` will print a URL that I need to visit in a browser. Once there, I'll login with my Cloudflare account and select the hostname I want to use here. In this case, I'll pick `samrhea.com`. Once I click "Authorize", Cloudflare will send a certificate to `cloudflared` on this Droplet.

<div style="text-align:center">
<img src="/static/gitlab/tunnel-login.png" class="center" width="500"/>
</div>

### Web app flow

Now that I have a certificate for `samrhea.com`, I can connect the web application component of GitLab to Cloudflare. I only need a single command to do so. `cloudflared` will handle creating the DNS records for this subdomain and proxy requests back to the HTTP port specified.

> This command should be run as a `systemd` service for long-term use; if it terminates, the web app will be unavailable.

```bash
cloudflared tunnel --hostname gitlab.samrhea.com --url localhost:80
```

That command will start launch the tunnel and connect this machine to two nearby Cloudflare data centers.

<div style="text-align:center">
<img src="/static/gitlab/cfd-start.png" class="center" width="600"/>
</div>
<p>

Now, I can visit `gitlab.samrhea.com` in my browser, where I'll be prompted to login with my Google account. Once authenticated, I can start setting up GitLab.

<div style="text-align:center">
<img src="/static/gitlab/gitlab-web-start.png" class="center" width="700"/>
</div>

I'm going to create my first project, a repository to store a new Gatsby project that I am going to try to create.

<div style="text-align:center">
<img src="/static/gitlab/gatsby-project.png" class="center" width="700"/>
</div>

I'll hit "Create project" and I'm ready to start building.

> **⚠️ Note:** One of the quiet superpowers of Cloudflare Access impacts the third radio button here, "Public". Often, with both self-managed and SaaS applications, users accidentally make URLs available to every user without a login, even though they meant to restrict it to just their entire team. GitLab does a good job here specifying Public, but not every application does. With Access, even if I accidentally set it to Public, Cloudflare would still protect that URL and require at least one login.


### Configuring SSH

I am going to work on the project locally and push and pull commits to GitLab as I need. I want to do so over SSH, which is easier to manage with my code editor and local file system.

To make it possible to connect over SSH to GitLab without a VPN, I am going to run a second Tunnel. Like the web flow, I want to avoid opening up firewall ports and still require authentication via my SSO.

To do that, I'll return to the Droplet and use `cloudflared` again. In a separate process, I'm going to create a new tunnel that will proxy SSH traffic. I'm going to use the hostname I created in the second policy earlier.

```
cloudflared tunnel --hostname gitlab-ssh.samrhea.com --url ssh://localhost:22
```

This command will start a connection that proxies SSH traffic, bound for that hostname, to the SSH port for GitLab.

While that is starting, I need to complete a couple one-time steps on my laptop. First, I need `cloudflared` on my machine. I can install that here via HomeBrew.

```bash
$ brew install cloudflare/cloudflare/cloudflared
```

`cloudflared` will handle proxying SSH traffic from my laptop through Cloudflare's network. I do not need any special commands or wrappers, but I do need to add a couple lines to my SSH configuration file. `cloudflared` will print those out for me.

```bash
$ cloudflared access ssh-config --hostname gitlab-ssh.samrhea.com

Add to your /Users/samuelrhea/.ssh/config:

Host gitlab-ssh.samrhea.com
  ProxyCommand /usr/local/bin/cloudflared access ssh --hostname %h
```
I'll append those two lines to my configuration file and that's it. Now, I can clone the project that I created earlier.

```bash
$ git clone git@gitlab-ssh.samrhea.com:samrhea/gatsby-project
```

`cloudflared` will prompt me to login with my identity provider and, once succesful, my feeble attempt at building something in Gatsby is now underway.

<div style="text-align:center">
<img src="/static/gitlab/git-clone.png" class="center" width="600"/>
</div>
<p>

### Locking down exposed ports

Meanwhile, in Digital Ocean, I can configure my firewall with the easiest rule possible: block any inbound traffic.

<div style="text-align:center">
<img src="/static/gitlab/disable-ingress.png" class="center" width="700"/>
</div>
<p>

Argo Tunnel will continue to run outbound-only connections and I can avoid this machine getting caught up in a crypto mining operation, or something worse.

## So what does it look like as a user?

With my SSH configuration file set, when I clone a repository I am prompted to login with my identity provider. Once I select "Google", Cloudflare sends a token to `cloudflared` which allows me to connect and the repository is cloned.

For a web user, I can visit the URL `gitlab.samrhea.com` directly, where I will login with my identity provider, and be redirected to the application. Compared to starting a VPN client for either, this makes the self-managed instance of GitLab closer to a SaaS application without any open ports or application login pages exposed directly to the Internet.

<stream src="d0fafb9d43ba50f533127805f3ffee67" controls></stream>
<script data-cfasync="false" defer type="text/javascript" src="https://embed.videodelivery.net/embed/r4xu.fla9.latest.js?video=d0fafb9d43ba50f533127805f3ffee67"></script>

## What's next?

With this setup, I have full control over a GitLab instance, while also making it as easy as a SaaS app for users. Like that dining table, I'm not planning to have a hobby project that involves up to 500 people right now but, when that day comes, I'll need about 30 minutes to make it possible.

Want to try it out? Cloudflare for Teams, including Access and Tunnel, [is free to use through September](https://teams.cloudflare.com).
