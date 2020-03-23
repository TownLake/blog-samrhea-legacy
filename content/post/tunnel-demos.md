---
author: "Sam Rhea"
date: 2020-03-21
linktitle: 🚇🖥️ share real demos in 5 minutes
title: 🚇🖥️ share real demos in 5 minutes
images: ["https://blog.samrhea.com/static/tunnel-demos/marquee-image.png"]
description: One-click demos that your audience can use
tags: ["cloudflare",",","Tunnel",",","Access",",","walkthrough"]
---

I had a coworker, a few jobs ago, who started his career in investment banking. He loved to tell this one story about his passion for keyboard shortcuts. On his first day at the bank, his boss stopped by his desk, pulled out scissors, and cut the cord of the computer mouse on that desk.

His boss then then handed him a printout guide of basic shortcuts and walked away. I've always been suspicious that this story happened as described, and it feels like a silly display of hazing if it did, but the image stuck with me.

As a product manager, I have my own mouse: slide deck presentations. And my manager still lets my G Suite account use Google Slides.

When I share a slide about a product, I'm asking my audience to look at a weird shadow of the product itself. With the exception of case study quotes and architectural diagrams, most of my slide decks just becomes a way to fill time.

I do this because sometimes I get lazy and demos are hard. Live demos require you to tell a story about your product, while using it in real-time. You're asking your audience to step out of the cave and look at the real object in the daylight, and you don't want them to be disappointed.

This challenge becomes more difficult thanks to two factors:

* The demo might not work. Always a risk and often out of our control.
* Sharing a demo over a video call is clunky. Customers cannot "drive". Instead, we screen share. This part we can change.

When customers get to test drive a product, with you leading the discovery, they can begin to better imagine how they'll use it and how it could solve their problems. However, asking them to sign up for trial accounts adds friction. Sharing something on the open Internet might also not be an option.

Instead, I can give my audience the ability to interact with the product through a secure connection that prompts for a simple password. With this set up, I can move out of the driver's seat and become more of a guide than anything else.

**🎯 I have a few goals for this project:**

* Have a one-click demo setup that I can use to share applications running in a cloud provider or my laptop with an audience who can then interact directly
* Avoid making changes to my application or modifying how I deploy it

---

**🗺️ This walkthrough covers how to:**

* Start a secure, outbound-only, connection from an application running locally on my laptop or machine to a specific audience using Cloudflare Argo Tunnel
* Give my audience a URL they can reach without any agent or client app setup
* Have the option to require a simple passcode to connect to the application with Cloudflare Access

**⏲️Time to complete: ~10 minutes**

---

> **👔 I work there.** I [work](https://www.linkedin.com/in/samrhea/) at Cloudflare. Many of my posts on this blog that discuss Cloudflare focus on building things with Workers Sites. I'm a Workers customer and [pay](https://twitter.com/LakeAustinBlvd/status/1200380340382191617) my invoice to use it. However, this experiment uses a product where I'm on the team.

## Starting my application

I'm going to use the [open source version of Grafana](https://grafana.com/oss/grafana/) as a stand-in for an application that I want to demo. Grafana builds charts and graphs from data sources. Those visualizations are useful for reporting, diagnosing problems, and determining the significance of a change. I use it daily at Cloudflare.

```bash
brew update 
brew install grafana
```

```bash
brew services start grafana
```

Grafana defaults to run `localhost:3000`. You can change this in the config file if needed.

Now, when I navigate to `localhost:3000`, I can see Grafana. If I wanted to just present a screen share demo of this app, over a video call, I could stop here.

<div style="text-align:center">
<img src="/static/tunnel-demos/grafana-local.png" class="center" width="700"/>
</div>

However, that would not give them a real sense for the product. They couldn't click around and ask questions while they take it for a test drive. To do that, I need to connect this locally-running application to my audience. To do that, I'm going to use Cloudflare's Argo Tunnel.

> **This works in any environment.** I'm running this app running on my MacBook as an example, but the steps that follow would work wherever your application runs (AWS, on-premise data center, server in your home office closet).

## Cloudflare Argo Tunnel

Cloudflare's [Argo Tunnel](https://developers.cloudflare.com/argo-tunnel/) product connects your environment to Cloudflare's network. The outbound-only approach adds security to the deployment while the daemon that enables this connection makes it possible to start your demo without any UI or API configuration.

### Safer

In a traditional reverse proxy deployment, the network sitting in front of your application knows the real address (the public IP) of the environment where that application runs. That network can then proxy traffic to the destination by passing through open firewall ports.

This model relies on obscurity to stay safe; if an attacker discovers that public IP, they could end-run the network and attack the application directly.

Argo Tunnel starts in the other direction. Argo Tunnel runs a daemon, `cloudflared`, in the environment of the application (or in a common local network). That daemon initiates an outbound-only connection to Cloudflare and proxies requests back to the application over that connection.

With Tunnel, the application does not need a public IP or open firewall ports.

### Easier

In that traditional model, with open ports, when I want to share the application with the world I rely on a DNS record that points traffic bound for my hostname (`app.com` for example) to the IP address.

That takes a bit of work to do. I need to either use an API or a UI to create the record, input the IP address, and then update that record if the IP ever changes.

Tunnel handles all of that work for a user through `cloudflared`. I need to first authenticate the machine or environment with a certificate, but after that I can start any demo in about 15 seconds. With just two commands, the daemon will grab a certificate for your hostname and then create the DNS record as well. All without leaving the environment of your application.

### Tunnel authentication

I have Grafana running on my computer, and I want to share the application across the Internet with Cloudflare's network and Argo Tunnel. The first thing I need to do is [download](https://developers.cloudflare.com/argo-tunnel/downloads/) `cloudflared`.

`cloudflared` is available for amd54 x86, ARMv6 architectures in multiple formats. I'm going to just install it via HomeBrew.

```bash
brew install cloudflare/cloudflare/cloudflared
```

Now that I have the daemon installed, I need to authenticate this machine. I'm going to use a hostname `samrhea.com`, that is active in my Cloudflare account. I now need to tell Cloudflare that the instance of `cloudflared` running on this MacBook has permission to set DNS records for that hostname.

```bash
cloudflared tunnel login
```

This command will launch a browser window that will prompt me to login with my Cloudflare account. Once logged in, I can pick the hostname I want to use. Cloudflare will then issue a wildcard certificate for subdomains of that hostname. I only need to do this once for this machine.

<div style="text-align:center">
<img src="/static/tunnel-demos/auth-tunnel.png" class="center" width="700"/>
</div>

I picked `samrhea.com` and returned to my command line, where `cloudflared` confirms that a cert has been downloaded.

<div style="text-align:center">
<img src="/static/tunnel-demos/cert-download.png" class="center" width="500"/>
</div>

### Starting a Tunnel

With the certificate for `samrhea.com`, I'm now ready to start Argo Tunnel to connect my application to Cloudflare.

```bash
cloudflared tunnel --hostname graf-demo.samrhea.com --url localhost:3000
```

This command does all of the work for me, more on that below.

<div style="text-align:center">
<img src="/static/tunnel-demos/connection-start.png" class="center" width="500"/>
</div>

With that single command, `cloudflared` starts an outbound tunnel to Cloudflare, registers a DNS record for `graf-demo.samrhea.com`, and proxies traffic to the address of Grafana on my machine.

Now, when I visit that hostname over the Internet, I see the application.

<div style="text-align:center">
<img src="/static/tunnel-demos/grafana-internet.png" class="center" width="700"/>
</div>

## Adding a simple, universal password

I could share this URL directly with my demo audience or, if I want to keep it more locked down, add a simple password screen with [Cloudflare Access](https://teams.cloudflare.com/access/index.html).

Cloudflare Access is a bouncer that asks for identity at the door (each and every door). When a user makes a request to a site protected by Access, that request hits Cloudflare's network first. Access can then check if the user is allowed to reach the application. When integrated with Argo Tunnel, the architecture looks like this:

<div style="text-align:center">
<img src="/static/tunnel-demos/teams-diagram.png" class="center" width="500"/>
</div>

To determine who can reach the application, Cloudflare Access relies on integration with identity providers like Okta or AzureAD to issue the identity cards that get checked at the door. However, when you demo to a new audience, those users are not going to be part of your SSO roster.

Instead, I can use the one-time pin feature in Access to add a user or set of users to that list so they can login without ever caring what SSO they use.

First, I need to build a [simple Access policy](https://developers.cloudflare.com/access/setting-up-access/securing-applications/) to determine who can reach this application.

<div style="text-align:center">
<img src="/static/tunnel-demos/access-policy.png" class="center" width="500"/>
</div>

The policy above will allow anyone at Cloudflare to reach the application as well as this user. Now, when either group navigates to the URL, employees can login with our SSO while the audience member can request a code.

<div style="text-align:center">
<img src="/static/tunnel-demos/login.png" class="center" width="300"/>
</div>

## Demo video

<stream src="dc2161785a72cd8507bc35d26a014b84" controls></stream>
<script data-cfasync="false" defer type="text/javascript" src="https://embed.videodelivery.net/embed/r4xu.fla9.latest.js?video=dc2161785a72cd8507bc35d26a014b84"></script>

## What's next?

When I demo my own products this way, my audience can build their own understanding of what the product is and what it isn't. Their questions become more tailored to how they could use it, rather than asking about bullet points about the product. Those conversations are always more fun.

This flow can also be made even easier. I [published a short script](https://gist.github.com/AustinCorridor/3a759ad0f05291e2d60fda418813ac8f) to GitHub Gists that will start my blog server and then the Argo Tunnel connection. Please feel free to reuse it for your demo setup.

You can get started with Cloudflare Access and Argo Tunnel today, at no cost. Need more help? [We're around](https://calendly.com/cloudflare-for-teams/onboarding) to walk through onboarding with you, too.