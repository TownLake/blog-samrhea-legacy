---
author: "Sam Rhea"
date: 2019-12-01
linktitle: 📂📰 open sourcing rough drafts
title: 📂📰 open sourcing rough drafts
description: "What if a public blog was also weirdly transparent?"
images: [https://blog.samrhea.com/static/serverless-cms/stack-compare-new.png]
tags: ["Workers",",","Cloudflare",",","blog",",","walkthrough"]
---

Earlier this winter, I published two posts documenting the [migration](https://blog.samrhea.com/post/wrangler-sites/) of my personal blog to Cloudflare Workers Sites and my initial [deployment pipeline](https://blog.samrhea.com/post/deploy-pipeline/) in that new framework.

> **👔 I work there.** I work at Cloudflare, but not on the Workers or network team. As far as the topics covered here, I'm a customer and [pay](https://twitter.com/LakeAustinBlvd/status/1200380340382191617) my own invoice for the services to run this blog.

My old stack consisted of a WordPress instance running on a prebuilt image from Google Cloud Platform (GCP). That image included a g1-small VM for compute and a persistent disk for storage. WordPress handled the CMS. I logged into the WordPress admin console to manage content.

The migration replaced GCP with Cloudflare Workers for compute. On the storage side, I traded that GCP peristent disk for Workers KV. Those changes lowered the cost of running this tiny blog and I removed some of the hassle - instead of managing a GCP deployment, I could use the [Wrangler](https://github.com/cloudflare/wrangler) command line tool to push my static site to Cloudflare.

<div style="text-align:center">
<img src="/static/serverless-cms/stack-compare-new.png" class="center"/>
</div>

The delivery component continues to use Cloudflare's network. However, the content management system (CMS) layer changed significantly. I introduced GitHub as a repository for saving content and Hugo for static site generation. I could have stored the blog locally, backing it up to Dropbox or another service, but the GitHub component made for a simple way to warehouse the work.

As I settle in, I really like this new structure. I assumed that leaving WordPress would leave me without some of its more robust CMS features. And, to be fair, it did. I no longer have access to the thousands of plugins, ecommerce integrations, or add-ons that make the WP ecosystem so rich.

However, most of those solve problems well beyond the scope of a personal blog like this one. Instead, GitHub as a CMS layer has started to offer some interesting and unique advantages. Some of them I'm only now starting to use and, for the rest, I'm excited about the possibilities both for me and others.

For a blog like this one, this new CMS workflow just might be ideal. I am going to cover a few features only available in this stack that I find valuable or intriguing:

* Open sourcing the blog content
* GitHub issues for post backlog
* GitHub for guest posts
* Workers Sites for anyone to deploy

## Open sourcing the blog content

When I migrated my blog to Workers Sites and began using GitHub to store content, I made that repository private. The repository itself did not contain anything of substance that did not get packaged into the public blog. I kept it hidden more from a fear that the churn and edits and commit history might not "look" polished. I placed more emphasis on the finished product and wanted to only present that layer.

That seems silly, but even more so, I think the less presentable history of a blog is potentially way more interesting. For some of my favorite blogs, I would love to dig into the post history of the author. To see how different posts evolved from outlines to drafts to final versions, and then to edits and updates.

The finished product, the actual blog at its hostname, is still shiny. If users only want to interact with blogs at that level, then it's available. However, using GitHub as a CMS makes this a potential new way for audiences to connect with stories and topics.

So I'm going to [open source](https://github.com/AustinCorridor/blog-samrhea) the GitHub repository that houses the blog - including its content and configuration.

<div style="text-align:center">
<img src="/static/serverless-cms/github-open.png" class="center" width="500"/>
</div>

The audience for my blog is extraordinarily tiny, and that's fine by me, but I hope this is an experiment other blogs consider. Feel free to take a look at the commit history for this post [here](https://github.com/AustinCorridor/blog-samrhea/commits/draft/serverless-cms).

> **💭 An aside on permanence.** I spend a lot of time thinking about the idea of digital permanence. In some ways, digital records provide security against any number of risks to other methods of storage. For example, my personal photos are backed up to two different providers and not subject to wear-and-tear. This also gives things a new level of portability. When I moved to Lisbon, my entire photo library and all the documents I've ever needed traveled in my pocket with me.
> 
> However, maybe scarier is just how easy it is to delete everything. It takes work to permanently delete paper records. I'd have to actively try to shred all the documents I wrote in college or the letters I received from friends. My cloud drives? Probably about 5 clicks away from never existing.
> 
> Open sourcing a blog like this provides another way to archive ideas. Keeping it in a change control system, like Git, also gives the evolution of those ideas some memory too.

## GitHub issues for post backlog

I write this blog mostly for me. I enjoy putting ideas into words and then reflecting on them at a later time. I also hope that some posts, especially tutorials, help others build their own things. In either case, I try to capture ideas for new posts before I lose them.

I previously kept post ideas on a few scattered notes. This is acceptable and fine.

However, I'm a product manager by day and feel a compulsive need to open tickets for things. I also prefer the way that tickets with comment histories can allow a quick note to develop into a real thesis.

I have started to use the same public GitHub repo that stores this content to create issue tickets for new post ideas.

<div style="text-align:center">
<img src="/static/serverless-cms/github-issues-table.png" class="center"/>
</div>

That gives this new blog format a couple advantages beyond just the benefit of ticket tracking and comments:

* Anyone can see what I'm thinking about and suggest feedback or ideas while a post is in backlog or in-progress.
* Anyone can submit new tickets based on existing posts.

It's something of an open-sourced forum. This model doesn't scale to a forum for a more popular blog with active membership, like Stratechery's community, but it's a pretty useful proxy for that without any real set-up.

## GitHub for guest posts

This blog is called "Sam Rhea's blog" and lives at "blog.samrhea.com". Not exactly a community of authors. And it's not really meant to be.

However, your blog might be. If it is, and if you use a traditional CMS, you have a couple options for helping guest authors publish:

**Extend invites to your CMS platform.**

You can add other posters to your CMS platform. They now have new credentials to manage. They have to learn a potentially new system. You have to remember to offboard them.

**Receive the handoff**

You could also just have them send over a document, and the associated images, and you can post it on their behalf. That's fine, but can lead to errors or issues.

Instead, if the blog is open-sourced, guest authors can open a PR. I recognize that might present a new hurdle for people not familiar with a system like Git or a format like markdown. I don't have a good solution for that. However, it can be a fun way for guest authors who do feel comfortable with that workflow to contribute. The blog becomes a living project.

## Workers Sites for anyone to deploy

Anyone who wants to use this blog template can grab it from GitHub and follow the examples in the two `.toml` files to have their own blog up-and-running with Cloudflare Workers Sites. Every config change, theme edit, or deployment pipeline setting is available for any author who wants to use it as a reference. That feels easier than trying to teach someone how to start an image in GCP and configure and maintain their own CMS and blog.

I find following examples to be really helpful when learning something new. By open sourcing a blog like this, hopefully that is useful to someone else.

## What this isn't

Open sourcing a blog on GitHub is probably only a good idea for personal or hobby blogs.

**End-to-end serverless**

GitHub has servers. I just don't manage them. The entire process for me, including GitHub actions, is driven by configuring workflows that execute actions on an ephemeral basis or per-request events.

**Useful for a company**

This is a personal blog. Nothing is announced here. For teams and companies, that's not viable - announcements and releases involve coordination that, for good reason, should be done behind the scenes.

**Helpful if your blog is a business**

WordPress plugins make life easy for people who run their blogs as their businesses. Static site generators like Hugo just don't have the same functionality.

**An everyday blogging platform**

I spent some time in this post comparing this model to the WordPress workflow. That of course ignores platforms like Medium. I like the idea of open sourcing a blog with GitHub because of the potential that transparency provides. If you need to start a blog right now with no maintenance burden or development time, this is not the best workflow.

## What's next?

This is the first post being deployed using a new GitHub actions workflow for my blog (including a staging workflow!). My next post will walk through how that is set up.

## Update

In the process of writing about the value in open sourcing my blog post, I broke my blog. The thing I feared - that people could now see my dumb mistakes, came true. Immediately.

(I managed to break how the Hugo theme I modified, but kept as a submodule, was used during the Hugo build in my GitHub action...)

The blog is working, again, and now that mistake is part of its history too.