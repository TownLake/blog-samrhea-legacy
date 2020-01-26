---
author: "Sam Rhea"
date: 2019-10-01
linktitle: 🤠🦀 porting my WordPress blog to Cloudflare Workers Sites
title: 🤠🦀 porting my WordPress blog to Cloudflare Workers Sites
description: "Getting rid of server bills."
tags: ["Workers"]
---

When I launched this blog, I started by paying Google Cloud Platform (GCP) to run a virtual server. I used GCP's prebuilt VM image for WordPress and the WordPress admin panel to write and post content. I then had to SSH into the machine to configure some details before setting its DNS, tinkering with the firewall, and then finally using the application's admin panel to start. It was cumbersome and, once running, maintenance became an ongoing chore.

It was also surprisingly expensive. I paid GCP **$18.44** last month to run this blog. While I appreciate your readership, this is not a popular blog. On days when no one was reading the blog, I was still paying GCP to keep the lights on for that VM powering my WordPress instance.

Last week, Cloudflare Workers [announced](https://blog.cloudflare.com/workers-sites/) support for quickly deploying entire sites to the Workers platform. No server required. The feature uses Wrangler, a CLI published by the Cloudflare team that can use the output of static site generators, like Hugo. I've been looking for an excuse to use Hugo for a while, so Wrangler's native support gave me a reason to port my blog over to the Hugo framework.

**🎯I have a few goals for this project:**

* Reduce the cost of hosting my blog by migrating it from a legacy server to Cloudflare Workers
* Port my previous blog posts from WordPress to Hugo

**⏲️Time to complete: ~1 hour**
Can increase depending on how you format your old blog posts

> **📑 Read their docs.**  Hugo, Workers, and Wrangler all have fantastic documentation. Much better than anything in this post; this really just stitches parts of them together and documents my experience. I link to all three sets in this post and encourage you to read and reference those materials

I’m a Product Manager at Cloudflare, but I'm not on the Workers team. This was just a fun project and I was excited to try out their latest features. They're friendly people who build cool things.

---

## Hugo

[Hugo](https://gohugo.io) is an open-source static site generator. Hugo provides a command-line tool, a markdown-friendly framework, and a gallery of community-built themes.

Hugo lets me focus on the Markdown. I can build a folder with Markdown format blogposts, a folder with the images they use, and Hugo handles assembling them into a site with a layout I choose. Most importantly, the output from Hugo can be consumed by Wrangler and published to Cloudflare Workers.

### Setting up Hugo

The Hugo [Quick Start guide](https://gohugo.io/getting-started/quick-start/) breaks down the steps to get up and running with Hugo. You should follow those instructions if you're new to Hugo. This section

First, I need to install Hugo. I'll use `Homebrew`, which makes installing new packages easy. Need Homebrew? Install it with the instructions [here](https://docs.brew.sh/Installation).

```bash
brew install hugo
```

Once installed, I can create a new site for my blog with a single command:

```bash
hugo new site blog-samrhea
```

The `new site` command creates a directory and the scaffolding I need to use Hugo to create a website. Here's a quick guide to the relevant parts of that folder and file structure:

| Folder or File | How does it fit? |
|---|---|
| `config.toml` | Defines global settings about your site; selects the theme to be used and your theme will pick up the config details and apply them |
| `content` | Contains the Markdown files for your pages (about, post) as well as the images linked in those files (static). |
| `themes` | Folders that define different Hugo themes, one of which is selected in your config.toml file. Themes consist of layout files in HTML and static files, including fonts and css, that style the site |
| `layouts` | This will be empty if you are using a theme; the layouts folder in the theme folder will apply |

### Selecting a theme

Selecting a Hugo theme was the most difficult part of this project. Hugo themes take the *mostly* standard files and folder structure in a Hugo project and apply layouts, fonts, and CSS to style the pages. The Hugo community has [built hundreds](https://themes.gohugo.io) and I took my time to find one. I eventually chose [Cactus](https://themes.gohugo.io/cactus/), a simple blog theme with a name that coincidentally matches Wrangler.

I need to add that theme to my Hugo project. To do so, I'll navigate to the `themes` folder in my new Hugo project and clone the Cactus folders. The `themes` folder in your Hugo project can contain multiple themes; I'll select which to use next.

```bash
cd blog-samrhea/themes
$ git clone https://github.com/digitalcraftsman/hugo-cactus-theme.git
```

The Cactus theme installs with a folder that contains a full example site, including a sample `config.toml` file, to serve as a reference. I'm starting from scratch, so I copied most of the details in the `config.toml` example file into the global equivalent for my project. That file includes options like configuring my Twitter handle and naming the site. Some of those are common to all Hugo sites and others are unique to Cactus. You can take a look at the full config details of my setup at the Gist [here](https://gist.github.com/AustinCorridor/771cc0f337b9b0a1e0dfc9dff352fbbd).

<p>

## Porting the content

Hugo builds pages from Markdown files in the `content` folder. [Markdown](https://daringfireball.net/projects/markdown/) is both a syntax and a tool for converting plain text into HTML. Do you remember using Microsoft Word in the 90's and being furious when you could not figure out why spacing kept changing? Markdown feels the opposite way.

Most Wordpress platforms, mine included, provide a what-you-see-is-what-you-get (WYSIWYG) editor when composing new content. Administrators author a post in an editor that displays the content as it will appear on the published page, as opposed to a plain text editor. However, the syntax used by WordPRess is still Markdown and that saves some time here. I could have used something like WP2Static, instead of Hugo and this small rewrite, but I want to fully deprecate my WordPress server.

Thankfully, I was able to essentially copy-paste most of the content from my blog into new Markdown files in my `blog-samrhea` directory without too much trouble. Images were more work. I had to rebuild the links and I used a bit of HTML to center images on the page (a feature I was able to just toggle in my Wordpress console). Example here:

```html
<div style="text-align:center">
<img src ="/static/signal-traffic-noise/signals-enabled.png" width="500" class="center"/>
</div>
```

Once complete, the file structure looks like this:

<div style="text-align:center">
<img src ="/static/wrangler-static/markdown-files.png" width="300" class="center"/>
</div>

While my text editor does not display the page as the user will see it, I can still view my work in real-time in my browser. Hugo will build and serve the site locally with the following command:

```bash
$ hugo server -D
```
`server -D` launches a local server that serves the site at "http://localhost:1313". I can visit that URL in my browser and see how the site will appear as a webpage. The content will update on the page each time I save my progress on a given file.

<div style="text-align:center">
<img src = "/static/wrangler-static/server-edit.png" width="700" class="center"/>
</div>

After a few tweaks, I'm happy with this version and ready to create the site. Hugo will take my config file, the theme, and the content I created and generate a static `public` folder with the command below. That folder contains the CSS, JS, and HTML files of my static site.

```bash
$ hugo
```

<p>

## Wrangler and Cloudflare Workers

Cloudflare Workers is a cloud computing platform that, unlike container or VM models, responds to requests from Cloudflare data centers using V8 isolates. You can read more about how the platform works [here](https://blog.cloudflare.com/cloud-computing-without-containers/), how to develop with Workers [here](https://blog.cloudflare.com/just-write-code-improving-developer-experience-for-cloudflare-workers/), and the storage component of Workers [here](https://blog.cloudflare.com/introducing-workers-kv/). Please do check out those links - those posts, and several others on the Cloudflare blog, speak to the depth of the platform much more eloquently than this post.

Last week, Cloudflare [announced](https://blog.cloudflare.com/extending-the-workers-platform/) a new feature in Wrangler to quickly deploy static sites in Workers and Workers KV. While this was possible before, Wrangler makes it easy.

If you don't have Wrangler, you can install it in a couple minutes. I use `cargo` to install and update Wrangler, but you can also use `npm`.

> **⚠️ Check your versions.**  You'll need to make sure your version of `rustc` is up-to-date. I [ran into that issue](https://github.com/cloudflare/wrangler/issues/741) when attempting to update my version of Wrangler.

Once installed, you'll need to use your Cloudflare API key to configure Wrangler's permission to create Workers and KV data in your account. Full instructions [here](https://github.com/cloudflare/wrangler). Wrangler prompts users through that process with the following command:

```bash
$ wrangler config
```

### Wrangler site creation and deployment
The earlier sections of this post abridged steps and linked to real product documentation. This section is shorter, but details all steps required. Creating a site and publishing it with Wrangler really is this simple.

First, I'll make sure that I'm working in the folder containing my Hugo project.

```bash
$ cd blog-samrhea
```

Once there, I just need to run one command to create my Workers site:

```bash
$ wrangler init --site blog-samrhea
```

The command above creates two things:
* the `workers-site` folder which will handle creating the Worker from the Hugo output, and
* a `wrangler.toml` file, which I'll configure next.

The `wrangler.toml` file defines where Wrangler will deploy my site. I'll add my `account_id` and the `zone-id` for "samrhea.com" from Cloudflare. I'll also define the route used, in this case "blog.samrhea.com/*". Finally, I need to specficy the destination of the folder created by Hugo for my static site, `public`, in the `bucket` field.

> **⚠️ Don't forget the wildcard.**  Be sure to include a `*` at the end of the route used.

```json
account_id = "d3m0"
name = "blog-samrhea"
type = "webpack"
route = "blog.samrhea.com/*"
workers_dev = false
zone_id = "t3st"

[site]
bucket = "public"
entry-point = "workers-site"
```

With that config set, I can deploy my site:

```bash
$ wrangler publish
```

Wrangler will take the static assets from my `public` folder and publish them to Workers KV storage. Wrangler will then create a Worker for that route and update the asset manifests of the Worker to reference those files. I don't need to visit the Cloudflare dashboard or configure anything else.

<div style="text-align:center">
<img style='border:1px solid #000000' src ="/static/wrangler-static/hugo-wrangler-publish.png" width="500" class="center"/>
</div>

> **🧪 Need a staging environment?**  Wrangler integrates with Cloudflare Zoneless Workers which you can use to deploy test versions of your site to a route of "cloudflareworkers.com". Just run the command `wrangler preview --watch`.

<p>

## Saving money
I was spending nearly $20 per month hosting this blog in GCP. That's a lot of money for a blog read by my parents and like 4-5 friends.

<div style="text-align:center">
<img style='border:1px solid #000000' src ="/static/wrangler-static/gcp-bill.png" width="500" class="center"/>
</div>

Below is my bill for Workers. Not only is it less than half the cost, I'm not taking advantage of its full usage yet. I could keep scaling up my usage for other sites without coming close to the old expense to run this blog alone.

<div style="text-align:center">
<img style='border:1px solid #000000' src ="/static/wrangler-static/workers-bill.png" width="500" class="center"/>
</div>

I'm pretty happy about that. I recognize that I could have probably tuned my GCP usage more thoroughly, but that would take work, experience, and some trial-and-error. Workers is cheaper and it just works, no careful calibration required since I'm only paying for what I use.

<p>

## What's next?

I spent way more time writing this blog post than I spent building this entire site and publishing it to Workers. The blog is faster, cheaper, and I get to use Hugo so I have more control over its configuration.

I also just had fun doing this. I like writing in Markdown, a lot, and this was an excuse to do that. WYSIWYG editors are fine, but writing in plain text Markdown files feels like I'm closer to creating the actual post. It's also not that much more difficult to see the finished product, live, with `hugo server -D` and/or `wrangler preview`.

Like I said earlier, I work at Cloudflare, but not on the Workers team. They're building really cool stuff and building it fast. While I was drafting this post, they [announced](https://blog.cloudflare.com/html-rewriter-beta/) a new HTMLRewriter to further extend sites, which is now my next project.