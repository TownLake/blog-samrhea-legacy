# Sam Rhea's Blog

This repository contains the content and configuration for [my personal blog](https://blog.samrhea.com).

## 🏗️ Gatsby

The blog is a Gatsby static site. [Gatsby](https://www.gatsbyjs.com/) is a React-based open-source framework for creating websites and apps.

## ✨ Cloudflare Workers Sites

[Workers Sites](https://developers.cloudflare.com/workers/sites/) serves the blog. The post [here](https://blog.samrhea.com/posts/2020/migrate-blog-to-workers) walks through that setup in detail.

## 🤠 wrangler

A [GitHub Action](https://github.com/TownLake/blog-samrhea/tree/draft/2021-end-of-year/.github/workflows) and the `wrangler` CLI tool publishes the blog. You can learn more about `wrangler` [here](https://github.com/cloudflare/wrangler). The post [here](https://blog.samrhea.com/posts/2019/workers-github-deploy) breaks down how I deploy the blog.

## 💡 Gatsby Lumen theme

The site uses the [Lumen Gatsby starter theme](https://www.gatsbyjs.com/starters/alxshelepenok/gatsby-starter-lumen), maintained by [this team](https://github.com/alxshelepenok/gatsby-starter-lumen#contributors).

### Edits to Lumen
These are the edits I have made from the theme default above.

* `gatsby-config.ts` changed to use my `sam-task.jpeg` photo
* `src/components/Meta/Meta.tsx` edits `meta name="og:image"` to `meta property="og:image"` which LinkedIn requires.
* Add files so that this site can be built using Cloudflare Wrangler.
* Removes the "Read" link option in the post list page from `src/components/Feed/Feed.tsx`. I found this cluttered the view and was redundant since clicking on the post title will open the post.
* Default behavior of this theme floats mobile views down to the posts. I removed the `useEffect` for `scrollIntoView` lines in `src/components/Feed/Feed.tsx`.
* Removed `.circleci` and `.husky` directories.
* Removed `Code of Conduct` and `Contributing` guidelines; these document rules for the project above.
