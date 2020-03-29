---
author: "Sam Rhea"
date: 2020-03-28
linktitle: 🚀📰 a complete guide to migrating your blog to Cloudflare Workers
title: 🚀📰 a complete guide to migrating your blog to Cloudflare Workers
images: ["https://blog.samrhea.com/static/deploy-pipeline/pipeline-feature.png"]
description: a weekend project for a better, faster blog
tags: ["cloudflare",",","Workers",",","wrangler",",","walkthrough"]
---

Last fall, I migrated my WordPress blog to Cloudflare Workers. I wrote a series of posts documenting the process start-to-finish. These walk throughs cover everything from the lift-and-shift of a WP blog to a serverless platform to automated deployments with GitHub.

Are you social distancing? Good! Me too. If you have some free time indoors now, this is a fun project that totals about 6 hours of work. Keeping a blog can also be a fun way to stay engaged with your community, to share stories and read others.

By the end of this course, you'll have a lightning-fast blog, that runs you (at most) $5 per month, and you'll learn more about serverless computing and automating deployments with GitHub.

## Part One: Migrate your blog to Workers
### 🤠🦀 porting my WordPress blog to Cloudflare Workers Sites

Stop paying server bills and migrate a WordPress blog to a faster, more manageable, format and deploy to a global network.

**Blog post [walk through](https://blog.samrhea.com/post/wrangler-sites/).**

|Topic|Notes|
|---|---|
|**Time to complete:**| ~1 hour|
|**Originally published:**| October 1, 2019 |
|**Steps covered:**| * Port a WordPress blog to Hugo <br> * Use Wrangler to publish to Cloudflare Workers |

### 📂📰 open sourcing rough drafts

Keep your blog content safe in a GitHub repository and make it easy for others to contribute posts.

**Blog post [walk through](https://blog.samrhea.com/post/serverless-cms/).**

|Topic|Notes|
|---|---|
|**Time to complete:**| ~30 minutes|
|**Originally published:**| December 1, 2019 |
|**Steps covered:**| * Use GitHub as a serverless CMS <br> * Maintain a blog that can easily publish guest posts |

---

## Part Two: Deployments and automation

### 🚚🔐 a deploy pipeline for Cloudflare Workers Sites

Deploy staging versions of your blog with Wrangler and lock them down from the public Internet with Cloudflare Access.

Blog post [walk through](https://blog.samrhea.com/post/deploy-pipeline/).

|Topic|Notes|
|---|---|
|**Time to complete:**| ~1 hour|
|**Originally published:**| October 8, 2019 |
|**Steps covered:**| * Set staging deployment variables in Wrangler <br> * Automatically protect staging deployments and require a login with Access |

### 🏭🚢 Cloudflare Workers Sites and GitHub Actions

Save yourself even more time by automating your deployment using GitHub Actions.

**Blog post [walk through](https://blog.samrhea.com/post/github-actions/).**

|Topic|Notes|
|---|---|
|**Time to complete:**| ~2 hours|
|**Originally published:**| December 14, 2019 |
|**Steps covered:**| * Configure GitHub actions for automated deployments <br> * Configure staging deployments that trigger based on keywords |

---

## Part Three: Adding video content

### 📽️🔑 ad-free private screening with Cloudflare Access and Stream

This post focuses mostly on publishing a site with password-protected content, but you can skip the Access piece and just use Cloudflare Stream to add ad-free videos to your blog.

**Blog post [walk through](https://blog.samrhea.com/post/home-movie/).**

|Topic|Notes|
|---|---|
|**Time to complete:**| ~45 minutes|
|**Originally published:**| March 1, 2019 |
|**Steps covered:**| * Configure GitHub actions for automated deployments <br> * Configure staging deployments that trigger based on keywords |

## What's next?

Do you have any questions? Please feel free to post them in the [blog repository](https://github.com/AustinCorridor/blog-samrhea/issues).