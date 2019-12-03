---
author: "Sam Rhea"
date: 2019-12-03
linktitle: 🏭🚢 Cloudflare Workers Sites and GitHub Actions
title: 🏭🚢 Cloudflare Workers Sites and GitHub Actions
images: ["https://blog.samrhea.com/static/eot/eot-overlap.png"]
description: One step closer to writing this blog on my iPad.
---



```
name: Deploy to Workers Staging

on:
  push:
    branches:
      - 'draft/*'

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@master

      - name: Install Hugo
        run: sudo snap install hugo

      - name: Install Wrangler
        run: sudo npm i @cloudflare/wrangler -g

      - name: Build
        run: hugo

      - name: config wrangler
        run: CF_API_TOKEN=${{ secrets.CF_API_TOKEN }} wrangler publish --env staging 
```

| Section | Description |
|---|---|
| `name` | This assigns a name to the entire GitHub action. Each GitHub action can contain one sequence of events. I'm going to call this "Deploy to Workers Staging" to differentiate from the action that deploys to production. |
| `on` | This is the most important piece of the workflow. It's the trigger that initiates this action. I have it configured with the "draft" wildcard there, telling GitHub that anytime I push to a branch that starts with "draft", to run this action and deploy to staging. |
| `jobs` | This gives GitHub the heads up that the following sections will contain the jobs I want it to run. This also tells it the type of machine operating system that I need; in this case, I'm using the latest version of Ubuntu. If I was concerned about compatability, I would define a particular version so that future versions did not break this flow. |
| `steps` | This tells GitHub that the following sections contain the detailed recipe to follow. |
| `uses: actions/checkout@master` | With GitHub actions, I'm talking this machine to do the steps I used to take myself. In this case, I want to make sure it grabs the current action. `master` refers to the master version of this script, not the master branch of my repository. |
| `Install Hugo` | Tells GitHub to install Hugo, the static site generator I use. |
| `Install Wrangler` | Tells GitHub to install Wrangler, the Workers CLI tool I use. |
| `Build` | Now that this machine has Hugo, from the install step earlier, I cann tell it to run a command that I used to run manually. Running "hugo" creates the static site content from my branch. |
| `config wrangler` | In the previous steps, I installed Hugo, built the site, and installed Wrangler. All things I used to do on my laptop. Now, this GitHub machine has those pieces. I can have the machine run the same command I would run to deploy to staging. |
| `--env staging` | The command I'm telling GitHub to run includes the staging flag. Take a look at the wrangler.toml file in this repository; that defines where to publish when I give it this flag. Here, that means the staging draft hits "blog-staging.samrhea.com" |

<div style="text-align:center">
<img src="/static/github-actions/staging-run.png" class="center"/>
</div>

## Troubleshooting

### Theme and submodule management

Repositories for Hugo sites consist of three primary components: the content you create (living in the `content` folder), the site configuration (the `config.toml`) file, and the Hugo theme. Unless you built your own, the Hugo theme consists of `.css` and `.html` and example files that define how your built site will look and feel.

Many common Hugo themes, including the one for this blog post, are open-sourced and available as public repositories. You can add these as submodules into your repository or clone them directly into the `themes` folder. Either way, you now have a living repository.

If added as a submodule, you'll need to make sure that the checkout step in your GitHub action adds `with: submodules`. Otherwise you might see this:

```
##[error]Process completed with exit code 255.

Run hugo

Total in 14 ms

Error: module "hugo-cactus-theme-avatar-mod" not found; either add it as a Hugo Module or store it in "/home/runner/work/blog-samrhea/blog-samrhea/themes".: module does not exist

##[error]Process completed with exit code 255.
```

In my case, I make edits to the theme for some of the site-wide files (like the avatar image). To reduce the confusion over grabbing the submodule, I just download the theme repository and upload it as part of my blog repo. This is not a great practice and leaves a bunch of files in the repo that could otherwise be referenced dynamically. I'll try and clean it up at some point.

### What about my environment variables in my `wrangler.toml` config file?

