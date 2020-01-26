---
author: "Sam Rhea"
date: 2019-04-07
linktitle: 🔎📺 a guide to overanalyzing your media habits
title: 🔎📺 a guide to overanalyzing your media habits
description: "My own Soderbergh media diet."
tags: ["Cloudflare",",","Access",",","blog",",","walkthrough"]
---

Steven Soderbergh publishes an [annual list](http://extension765.com/soderblogh/33-seen-read-2018) of all media he watches or reads each year. I keep a list too, but I’m not brave enough to share it with the internet yet.

I find that keeping the record can be a powerful way to reflect on what books or shows influenced my perspectives in years past. Instead of a running note, I jot down the episodes and novels into a Google Sheet. I miss a few things, but I make a good faith effort to keep it somewhat comprehensive. Netflix also makes this really easy [with a CSV export](https://help.netflix.com/en/node/101917), if you want to jumpstart your own review.

After a few years collecting my own Soderbergh lists, I wanted to review the data in-depth. Scrutinizing my media habits to this degree is definitely more reflection than I need, but it’s a fun excuse to build out a data analysis project.

I have a few goals for this project:

* Take my Google Sheet records and load them into a dedicated data analysis tool
* Host that data analysis tool myself
* Be able to interact with the data from anywhere with a web browser, so I’ll need to expose it to the internet
* Control who can reach the tool and the data it reviews
I decided to use Redash, a tool meant for teams to analyze large datasets, to query and review my own media diet. I hosted the application on Google Cloud Platform so I could have more control over the dataset and the project. I used [Cloudflare’s Argo Tunnel](https://www.cloudflare.com/products/argo-tunnel/) tool to make my Redash instance available to the internet and [Cloudflare’s Access](https://www.cloudflare.com/products/cloudflare-access/) product to lock down who could reach it.

I prefer to write walkthroughs with too much detail so that anyone, with any background, could follow the same steps to create something similar. Feel free to skip over any sections where you already have experience. When possible, each step includes links to actual product or service guides that provide even more extensive documentation.

Also, I’m the Product Manager for Cloudflare Access and Argo Tunnel, so I’m definitely biased.

---

**This tutorial covers how to:**

* Set up and host a business intelligence application on Google Cloud Platform.
* Import data into that tool from Google Sheets.
* Expose that application securely to the internet through Cloudflare Argo Tunnel.
* Lock down who can reach that application, and its data, with Cloudflare Access.

**⏲️Time to complete: ~2 hours**

## Setting up Redash on GCE

I saved the data that I collected over the last few years into a multi-tab Google Sheet. I skipped some days, but it’s mostly complete. I find Sheets useful for data gathering, creating charts, and formulas for evaluating data. However, I want to write, save, and run different queries on this data set.

To do so, I need a real SQL client. Structured Query Language (SQL) is a language that can be used to handle datasets in relational database management systems. SQL provides a framework that can be used to pull together and analyze data in the form of SQL queries – questions asked about the data. I only need a limited set of its functionality for this project, but having a SQL client makes writing and managing these questions easier by providing an application layer .

Bonus points for one that offers a pleasant UI for sharing this dataset and the queries with others. Redash solves both of these problems.

[Redash](https://redash.io) is a data analysis tool that combines a SQL client with data visualization features. You can add several type of dataset to Redash and join and query the data to learn more about your business or, in my case, your television genre habits. They provide a hosted solution, but it’s more fun to host my own and Redash makes it pretty easy to do so.

First, I need to find a place to run my Redash instance. Some years ago, I would need to go out and buy a physical server and start replacing furniture in my house. Today, I can instead purchase time from a virtual equivalent instantly and for a few pennies. For this project, I’m going to use Google Compute Engine (GCE). GCE provides me with a virtual machine (VM) that can run Redash and serve the application. That VM lives in a Google datacenter and I can decide how to make it available to the internet.

To begin, I’ll [create a new project](https://cloud.google.com/resource-manager/docs/creating-managing-projects) in Google Cloud Platform (GCP), the umbrella cloud platform from Google that includes GCE. A project in GCP organizes my GCE VMs, functions, and network settings into a single management layer. GCP also provides Cloud Shell, a browser-based command-line tool, to manage my project.

<div style="text-align:center">
<img src ="/static/media-habits/new-gcp.png" class="center"/>
</div>

Once my project is created, I need to set up Redash. Redash [provides](https://redash.io/help/open-source/setup#gce) an “image” for GCE. A VM image is just a template that selects the necessary configurations for my VM to host a given application and, in the case of Redash, loads the software to run the application. Like ready-to-bake cookie dough, they did the hard work for me and I just need to follow a couple steps.

Since I’m using a template for this project and need to do very minimal work on the machine, I’ll use Google’s Cloud Shell to connect to my VM over SSH from a browser window. With Cloud Shell (launched from the top toolbar of the Project dashboard), I can use a single command to grab that template.

```bash
$ glcoud compute images create "Redash-5-0-2" --source-uir gs://redash-images/redash.5.0.2-b5486-build2.tar.gz
```

The screenshot below shows that command being run in the Cloud Shell.

<div style="text-align:center">
<img style='border:1px solid #000000' src="/static/media-habits/cloud-shell.png" class="center"/>
</div>

With the Redash image added, I can now launch an instance with this image with a second command in the Cloud Shell.

```bash
$ gcloud compute instances create redash --image redash-5-0-2
```

That command will launch the VM and, after a few seconds, I have my own Redash instance up and running. GCE will assign the VM a couple IP addresses: one internal and one external. The internal IP address is only available to other services running in my VPC – a private network I control. The external IP can be made available to the internet.

At this point, I still have GCP’s default network configuration settings in place. I can’t reach that external IP from my web browser. To open the application, and test that it’s working, I want to make it available over HTTP. GCP provides a full firewall configuration panel (which we’ll use later) but also surfaces a simple toggle in the instance details page to turn on HTTP. Toggling that button will set my firewall to accept traffic over HTTP.

<div style="text-align:center">
<img style='border:1px solid #000000' src="/static/media-habits/allow-http.png" class="center"/>
</div>

I can now input my VM’s external IP into my web browser’s address bar and connect to the server over HTTP. The web page loads the Redash admin panel and I can start configuring it.

<div style="text-align:center">
<img src ="/static/media-habits/redash-initial.png" width="300" class="center"/>
</div>

## Configuring Redash and my data
Once I have created my Redash admin account, I can configure the application. Redash provides a guided walkthrough in the tool for connecting and querying a dataset.

<div style="text-align:center">
<img src ="/static/media-habits/redash-start.png" class="center"/>
</div>

Redash supports integrations with a number of data storage tools, most of which are far more powerful than a single Google Sheet. To pull data from Google Sheets, I need to create a service account that Redash can use to read data. Redash provides in-depth instructions on how to set up a Google Service Account that I can follow. I first need to first return to GCP and create a service account key. I’ll give this key to Redash so that it can use it to reach my Google Sheet.

<div style="text-align:center">
<img src ="/static/media-habits/service-key-create.png" width="300" class="center"/>
</div>

GCP will generate a JSON file that contains the private key for this account. I’ll download this file and then upload it to my Redash instance in the step below.

<div style="text-align:center">
<img src ="/static/media-habits/load-json.png" class="center"/>
</div>

Once saved, I need to navigate to the Google Sheet that stores this data and grant this service account access to reach it. I’ll share it with the service account’s ID (example in the GCP screenshot above) in the same way I would with another Google account user – from the Share button in the particular sheet.

<div style="text-align:center">
<img src ="/static/media-habits/share-sheet.png" class="center"/>
</div>

The Redash Google Sheets integration requires a couple of additional steps to load the data that are better documented in their walkthrough here. In short, I need to create a standalone query using the spreadsheet ID. That query will load all data in the sheet into Redash, creating a basic data source. I can then write additional queries, instructions [here](https://redash.io/help/data-sources/querying/google-spreadsheet), to review the data and join it with other sets.

<div style="text-align:center">
<img src ="/static/media-habits/query.png" class="center"/>
</div>

At this point, I have Redash set up and loaded with the data I want to review. However, two problems still exist:

* The application is accessible only at an IP address
* The application is accessible at an IP address

I still have the firewall setting that allows HTTP traffic to reach the IP address right now. If that IP was shared, any user could reach the application. Also, the address is hard to remember. I need a way to share the tool through a domain name, instead, and I need to lock down the machine’s firewall settings so that it’s only accessible from that domain name.

## Creating an Argo Tunnel

[Cloudflare Argo Tunnel](https://www.cloudflare.com/products/argo-tunnel/) can run a process on the machine to make outbound calls to Cloudflare’s network and proxy requests from a domain name to this machine. Since only outbound calls are being initiated, I can restrict ingress to the machine.

To use Argo Tunnel, I first need to add a site to Cloudflare. Adding a site to Cloudflare involves changing its nameservers at the domain’s registrar, making Cloudflare the site’s authoritative DNS. I already have one, samrhea.com, configured – you can follow instructions [here](https://support.cloudflare.com/hc/en-us/articles/201720164-Step-2-Create-a-Cloudflare-account-and-add-a-website) to add yours.

I could create a DNS record in the Cloudflare dashboard that points a subdomain to the external IP of my machine (I’m going to use “media.samrhea.com” for this project). However, that would need me to continue to make my external IP available. Instead, Argo Tunnel will create that record for me automatically in addition to giving me a chance to lock down the firewall altogether.

To start using Argo Tunnel, I need to download cloudflared on the VM. cloudflare is a command-line tool that will start the Argo Tunnel process. I’ll install the linux-amd64 / x86-64 Debian package by running the the wget command, a Linux command that can download files from a server. I’ll use the same Cloud Shell from earlier (I can launch the SSH connection to the machine from a browser window with the SSH button in my VM instances page).

<div style="text-align:center">
<img style='border:1px solid #000000' src="/static/media-habits/ssh-start.png" class="center"/>
</div>

```bash
$ wget https://bin.equinox.io/c/VdrWdbjqyF/cloudflared-stable-linux-amd64.deb
```

Once that command downloads the package, I can install it with the dpkg command, a Debian package manager already available on this Linux machine.

```bash
$ sudo dpkg -i ./cloudflared-stable-linux-amd64.deb
```

The output of both commands should look like the screenshot below:

<div style="text-align:center">
<img src ="/static/media-habits/dpkg-output.png" class="center"/>
</div>

Next, I need to login to my Cloudflare account. The login command will provide me with a link I can visit in a browser to prove I control the domain “samrhea.com”. Once I login to my account in that window, I’ll pick the website I plan to use – “samrhea.com” in this case. cloudflared will then download a certificate for that site so that my VM can prove to Cloudflare that it can create DNS records on my behalf to proxy requests for a given hostname to an address on this VM.

```bash
$ cloudflared tunnel login
```

Once the VM has the certificate, I should consider how to start the Tunnel in a way that keeps it running after I leave this SSH session. Production use cases of Argo Tunnel should probably run cloudflared as a systemd process and be configured to automatically restart. For this hobby project, I’m going to take a shortcut and keep this process running by using nohup a command to ignore the hangup that would occur after I leave this session.

```bash
$ nohup cloudflared tunnel --hostname media.samrhea.com 10.128.0.2 &
```

Here’s a breakdown of that command:

| Command | Breakdown|
|---|---|
| `nohup` | Tells the machine to ignore the hangup signal that would occur after I leave this SSH session; ensures that `cloudflared` continues to run |
| `cloudflared` | Indicates that what follows will be a command from the `cloudflared` tool |
| `tunnel` | Stars the tunnel command which will create a tunnel with the flags that follow |
| `--hostname media.samrhea.com` | This will register a DNS record for the subdomain of “samrhea.com” – I’m able to do so because when I logged in to Cloudflare I downloaded a wildcard certificate for the domain that covers any subdomains |
| `10.128.0.2` | The internal IP of this machine; `cloudflared` will proxy requests for the hostname to this IP |
| `&` | Concludes the nohup command; everything after “nohup” and before the & will ignore the session ending |

After running this command, `cloudflared` will create the tunnel. Since I’m using `nohup`, the output is not printed in my terminal. Without the nohup command, the output would look like this:

<div style="text-align:center">
<img src ="/static/media-habits/nohup-output.png" class="center"/>
</div>

Creating a tunnel will automatically generate DNS records for this subdomain in my Cloudflare account – I don’t need to add the external IP of my machine as an A or AAAA record.

## Testing the Tunnel

With my Tunnel created, I can test that it’s working by visiting “media.samrhea.com” and confirming that Redash loads. I can also see my active tunnel in the the Cloudflare dashboard. The Argo Tunnel card in the Traffic tab lists all active tunnels for this hostname.

<div style="text-align:center">
<img src ="/static/media-habits/tunnel-ui.png" class="center"/>
</div>

Argo Tunnel creates a CNAME DNS record for the subdomain I specified in the `--hostname` flag. I can confirm that the record was created in the DNS tab of the dashboard. Note: Argo Tunnel does not delete DNS records for older tunnels, so previously tested subdomains are still listed.

<div style="text-align:center">
<img src ="/static/media-habits/dns-records.png" class="center"/>
</div>

## Locking down the machine

Argo Tunnel is now making outbound calls to the Cloudflare network from my VM and proxying requests for the hostname “media.samrhea.com” to the internal IP of my VM. However, if someone discovered the external IP of the machine they could still bypass Cloudflare and reach my Redash instance.

In older setups, I would have prevented this by configuring complicated access control lists and open firewall ports. With Argo Tunnel, I can instead restrict all ingress traffic to my VM with a single [GCP firewall rule](https://cloud.google.com/vpc/docs/firewalls).

I’ll navigate to the “VPC network” tab in the GCP console. Select the “Firewall rules” page. A set of default rules will appear. I can start by deleting any rules that allow ingress traffic over HTTP, HTTPS, RDP or ICMP. I’ll keep “default-allow-ssh” enabled for when I need to reach the VM over SSH; that connection will still require SSH keys. Depending on the application you host, you may also consider keeping “default-allow-internal” to permit other instances in your network to reach this particular VM, but it’s not required for my project.

GCP firewall always enforces two “implied” rules: one to allow all egress traffic and one to deny all ingress traffic; neither are shown in the UI.They both are at the lowest priority setting, so any rules created with a higher priority will be enforced first.

Since I don’t have any firewall rules that allow ingress traffic, the implied ingress rule blocks any connections made to the machine. In the other direction, the implied egress rule allows the machine to make outbound connections which enables Argo Tunnel to keep functioning. The cloudflared process initiates connections and proxies requests to the assigned internal IP. Any attempts to reach the external IP will now fail. Since the implied rules are hidden, the only rule displayed in the GCP firewall dashboard is the one allowing SSH traffic.

<div style="text-align:center">
<img src ="/static/media-habits/only-ssh.png" class="center"/>
</div>

## Controlling who can reach Redash with Cloudflare Access

### Integrating Google

“media.samrhea.com” is now available to the internet; anyone who connects to that domain will hit my Redash instance. Unlike Soderbergh, I’m not ready to share this data with the world. I want to lock it down to a smaller group. In order to control who can reach this hostname, I need to find a way to validate user identity.

Cloudflare Access integrates with several identity providers. Most of those options are tailored to organizations and businesses. For this project, I’ll be sharing it with a small group of friends who share my pop culture enthusiasm – I don’t want to onboard them to an identity provider, but I do still want to limit access to that group. They all have a Google account, so I’ll use [that integration](https://developers.cloudflare.com/access/configuring-identity-providers/google/).

In the GCP dashboard, I can create an OAuth client ID that can be used to verify user identity. The OAuth flow will allow me to request users give my application (in this case, Access) permission to validate their identity with Google.

<div style="text-align:center">
<img src ="/static/media-habits/create-api.png" class="center"/>
</div>

I need to use the authentication domain from my Cloudflare Access account (in my case, I’m using widgetcorp.cloudflareaccess.com) as the “Authorized Javascript origins” address and I’ll add the Access callback path to that address in the redirect URI field. Once I hit “Create”, Google will generate a Client ID and Secret for this service.

<div style="text-align:center">
<img src ="/static/media-habits/oauth-setup.png" class="center"/>
</div>

I can now take my Client ID and Secret and use those to integrate Google as an identity provider with Cloudflare Access. On the Access tab of the Cloudflare dashboard, I can begin by selecting Google as a login method.

<div style="text-align:center">
<img src ="/static/media-habits/idp-add.png" class="center"/>
</div>

I can then input the Client ID and Secret from GCP. Hitting “Save and test” allows me to check that the integration is configured correctly.

<div style="text-align:center">
<img src ="/static/media-habits/save-idp.png" class="center"/>
</div>

Once saved, any visitor to my site can prove who they are by authenticating with their Google account. Now I need some rules to determine if that user, once authenticated, has permission to reach my site.

### Deciding who can see how much Game of Thrones I watched

In the Access tab, I can create a policy to define who can reach my site or, in this case, a subdomain of the site. Access will only check for identity on requests made to “media.samrhea.com” which makes it possible for you to read this on “blog.samrhea.com”.

<div style="text-align:center">
<img src ="/static/media-habits/create-policy.png" class="center"/>
</div>

With the rule above, I can add the email address of visitors who should be allowed to reach this subdomain. When they first attempt to reach the site, they’ll be redirected to a login page with the option to authenticate with Google. After authenticating, Cloudflare Access will use the integration with my Google service to create a token that validates their identity and store that in the visitor’s browser. Access will then look for that cookie on all subsequent requests; if the cookie represents a user who is allowed access, they’ll be redirected to the application and be able to scrutinize how much I love the show 30 Rock.

## Wrapping up

In 2014, I watched seasons 1-4 of Game of Thrones over the course of two months to catch up to my now-wife who was reading the books. I never got around to reading the books. I am not proud of my decisions in either of those sentences.

I did learn that I almost never finish books on ereaders but consistently complete them when they are hard copies, particularly when they are gifts from others. I probably “knew” that, but now I have data to justify buying the physical versions.

TV shows do not represent all media, but Americans do watch a [tremendous amount of television](https://www.theatlantic.com/technology/archive/2018/05/when-did-tv-watching-peak/561464/). We should probably think about cutting back. Overanalyzing the entertainment I watch and read almost always leads to “I spend too much time on this.” However, I do need to consider how the entertainment I consume, in any quantity, shapes my own perspective (or how it influenced that perspective in a particular phase of life).

Last thought – I forgot just how good Andy Daly’s *Review* is. Maybe it’s time to revisit…