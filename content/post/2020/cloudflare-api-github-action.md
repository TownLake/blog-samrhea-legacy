---
author: "Sam Rhea"
date: 2020-06-21
linktitle: 🤖🎛️ Dynamic config-as-code for Cloudflare's API with GitHub Actions
title: 🤖🎛️ Dynamic config-as-code for Cloudflare's API with GitHub Actions
images: ["https://blog.samrhea.com/static/cloudflare-api-github-action/skip-update.png"]
description: Deploy to Cloudflare without a UI or CLI
tags: ["Cloudflare",",","blog",",","walkthrough"]
---

Last October, I [began deploying](https://blog.samrhea.com/post/deploy-pipeline/) this blog by using GitHub Actions to build the site and publish its contents to Cloudflare Workers using [Wrangler](https://github.com/cloudflare/wrangler). Since then, I have not had to touch the command line for any updates to this blog. When I merge a post, even from my iPad with Working Copy, the GitHub Action takes care of pushing the content to Cloudflare's edge.

I love this model because I do not have to remember anything. The GitHub Action `YAML` [file](https://github.com/TownLake/blog-samrhea/tree/master/.github/workflows) serves as an automated, living memory of how to publish this blog. However, the workflow still required me to prepare some actions in Cloudflare, like creating DNS records and an Access policy for the staging subdomain.

I'd like to automate those steps too for future projects. If I can bring an end-to-end deployment to Cloudflare into a single GitHub Action, that file becomes a comprehensive runbook that also eliminates one-off CLI or UI changes. Even better, I can version it by reviewing earlier commits and the Actions they triggered.

Unlike the blog workflow, I am interacting with an external API directly. I'll by connecting to the Cloudflare API from the GitHub Action shell, and I'll have to do that by structuring `curl` commands within the requirements of a GitHub Action `.yml` file. I also need to think about dependencies: some of these commands depend on previous steps, so I'll need to grab the responses to those `curl` commands with `jq` and create new variables.

That will be some work, but once I can get the format right I can ditch the command line and UI and build this as config-as-code within a GitHub Action. Hopefully the work I put into this makes it much easier for your own deployment.

The finished product is [available here](https://gist.github.com/TownLake/1ea70c0399e3215525a8f5782b454eef) and I would recommend having it open during this tutorial. This post focuses on walking through what the file is doing so that you can modify it for your own needs. You can also find it in the collapsed section below.

<details>
    <summary>Full configuration file</summary>

{{< gist TownLake 1ea70c0399e3215525a8f5782b454eef >}}

</details>

<p>

**Is this somewhat similar to Terraform if it were dynamic?**

The outcome of this project is a YAML file that, when applied, configures or updates services within Cloudflare. That begins to veer into the world of config-as-code, similar to something like Terraform. Cloudflare has [extensive Terraform support](https://blog.cloudflare.com/getting-started-with-terraform-and-cloudflare-part-1/). However, these two methods are pretty different in functionality.

> *One note, Terraform [has a own GitHub Actions provider](http://hashicorp/terraform-github-actions@master) - it's config all the way down).*

Terraform has several advantages over relying on Actions for config, most notably:

* Terraform can preview changes and confirm.
* Terraform is generally easier to structure than formatting `curl` commands in a YAML file.
* Terraform is the authoritative record of your configuration; the GitHub Action model either adds or overwrites what you had. This becomes something challenging that I'll address down the road when we need to check if a setting exists or not.
* I have to test a GitHub Action by running it, something that becomes [painfully tedious](https://twitter.com/LakeAustinBlvd/status/1274461317546606593?s=20).

However, I've started to like the GitHub Actions approach for my purposes. Mostly because the workflow can be sequential and dynamic. I can structure steps that have outputs that can then be used by subsequent jobs. I can also keep everything in one place.

---

**🎯 I have a few goals for this project:**

* Deploy configuration changes to Cloudflare in an automated workflow via the API without using a command line or the UI
* Configure the deployment as code so I can version it
* Keep everything within GitHub Actions, where other steps in my pipeline already operate

---

**🗺️ This walkthrough covers how to:**

* Use a multistep GitHub Action to interact with the Cloudflare API
* Use `curl` with environment variables in GitHub Actions, structured in a `YAML` file
* Use `jq` to parse values from `JSON` responses from the Cloudflare API and set those as environment variables for subsequent steps

**⏲️Time to complete: ~2 hours**

---

> **👔 I work there.** I work at Cloudflare, but not on the Workers or API team. For most of what's covered here, like Workers and DNS, I'm a [customer](https://twitter.com/LakeAustinBlvd/status/1200380340382191617).

## GitHub Actions

I've talked about GitHub Actions [before](https://blog.samrhea.com/post/github-actions/), so I'll pull from that material to move quickly through an introduction.

> [GitHub Actions](https://github.com/features/actions) read from a configuration file in your repository, saved in a specific path, and follow the instructions in that file.
> You can specify the OS and OS version; GitHub will launch a VM or container based on that spec and then execute the steps in the file.

## Structure

Each GitHub Action depends on a `.yml` file saved in the repository. In my case, I'm going to structure my configuration file in 5 broad segments. 3 of those segments are unique jobs; the other 2 set the stage for what will happen.

|Phase|Segment|Purpose|
|---|---|---|
|Event|`on:`|Defines what event triggers an Action. This example uses pushes to `main`, but you can also schedule actions independently of an event.|
|Variables|`env:`|Sets environment variables that can be used by commands in the Action. I also have my Cloudflare API token saved as a GitHub Secret, which I then set as a variable here to be used in `curl` commands. You'll notice other blocks that include `env:` further down; the ones set here are global to all steps below. The ones further down apply to their specific command.|
|`jobs`|`clean`|This section begins the Cloudflare action integration. I'm using this section to clean up any DNS records I had for the zone I'm using. This is necessary, but helped me test that the Action was working and kept here for an example.|
|`jobs`|`build`|This section creates a new DNS record and then proceeds to create an Access application and policy to protect that subdomain.
|`jobs`|`publish`|This section builds the Hugo site from this repository and publishes it to Cloudflare Workers using Wrangler. This section is identical to the previous tutorial.|

Rather than breaking down the file section-by-section, I'm going to call out **4 patterns that make this entire workflow possible**:

* The use of `curl` with variables, both global and job-specific variables.
* The use of `jq` to parse responses from the Cloudflare API and set those as new, dynamic variables.
* The use of `if:` to add conditionals to specific `run:` commands.
* The use of `needs:` to give an order to the jobs.

## `curl` and variables

I'm using `curl` to interact with the Cloudflare API. Each configuration step in this GitHub Action will consist of a distinct `curl` command. However, I need to structure the `curl` commands within the `.yml` format required by GitHub Action. This gets tricky. To keep it organized, I'm going to rely only on environment variables (both global and job-specific).

The example below creates a DNS record in Cloudflare. This step relies on the two variables defined within it, as well as two variables set globally earlier in the config file.

{{< gist TownLake c2d575cb7a1dedbcdb650e370ac09934 >}}

<p>

**Broken out:**

|Command or argument|Description|
|---|---|
| `curl` | `curl` command used to interact with the Cloudflare API |
| `${{ env.POST }}` | A variable, defined below, that contains the content of the `POST` method. Within that variable, specifically in the URL, I also reference `${{ env.ZONE_TAG }}`, which is set globally across all steps. I have to use that tag value several times throughout this file, so it's easier to set it once.
| `${{ env.CURL_AUTH }}` | Defined globally, this contains my Cloudflare API token which is housed in a GitHub Secret and structures it in an auth header. |
| `${{ env.CURL_CONTENT }}` | Every request I'm sending has the same content-type, so I've defined this globally above. |
| `${{ env.CURL_DATA }}` | Contains the payload of the request, structured as `JSON` |

Setting these values as variables also avoids the hassle of escaping the `"` marks within the file, which I would need to do were I including these details directly into the `run:` command.

When converted by the Action, the command runs like a normal `curl` request would and Cloudflare's API returns the response.

<div style="text-align:center">
<img src ="/static/cloudflare-api-github-action/dns-create.png" width="700" class="center"/>
</div>

<p>

## `jq` and setting new variables

This is the most interesting and challenging part.

I need to use multiple unique identifiers to build my Cloudlfare deployment. For example, to build an Access policy I need to know the UID of the Access application where I am applying the policy. The challenge in doing that is that I do not know the UID of the Access application ahead of time. The workflow creates the Access application, so I need an automated way to gather the UID generated and inject it into the next step in real-time.

Thankfully, I can take care of that within the Action.

{{< gist TownLake a655c7df77f2dde248b26ca697d84e1b >}}

Cloudflare responds to API calls with `JSON`, and I can use that structure to find the generated values of certain calls. However, I don't want the entire response, I just want a certain field within it. I also want to save that value to use in subsequent steps as a new variable.

To solve those problems, I'm going to use `jq`, a tool that can parse a JSON response and select certain values. I can tell `jq` which value I care about, even nested values. The example below grabs any error codes from the creation of a new Access application, which I'll need later to determine if the application was created for the first time.

```bash
echo ::set-env name=APP_STATE::$(curl ${{ env.POST_APP }} ${{ env.CURL_AUTH }} ${{ env.CURL_CONTENT }} ${{ env.CURL_DATA_APP }} | jq -r '.errors[].code')
```

This command pipes the output of the `curl` command into `jq`, and then tells it to grab the error code returned (if there is one).

One other critical step happens in that example: setting a new variable. The `curl` and `jq` commands are nested within an `echo` command, along with the unique structure of setting a new environment variable in GitHub Actions. When `jq` parses that error code value, the output is then saved as `${{ env.APP_STATE }}` and will be available to use across jobs.

You can see where this approach is put through the ringer when creating an Access policy.

{{< gist TownLake 3527a831a5681f5b632724a5a8f58081 >}}

The policy relies on **7** variables, 2 of which were created in prior steps (`APP_UID` and `POL_UID`). And, after some trial and error with formatting, this works. You'll also see one additional line here, `if:`, which I'll walk through next.

## `if:` and apps that exist

Unlike Terraform, GitHub Actions cannot tell me that a given configuration exists and confirm if I am modifying it or overwriting it. These are just sequences of `curl` commands, so I'll need to inject some logic to avoid creating a new configuration change every time this runs.

In my example, I want to either create an Access policy if one does not exist or update the Access policy if one does. If I just rely on the create action, I'll create a new one every time. Instead, I need to check if the Application itself already exists.

Earlier in this post, I used `jq` to capture the response from the Cloudflare API when created an Access application. I can use that value, because the API returns a known code `11010` when the application already exists. I can then use the `if:` line in steps that either create or update the policy of that application.

If the application is new, the code is empty and the Action will create a new policy to match. If the application existed already, prior to this Action run, then the workflow will skip creating a new policy and instead update it. The run below was creating a new Access application, so it skipped the update policy step.

<div style="text-align:center">
<img src ="/static/cloudflare-api-github-action/skip-update.png" width="700" class="center"/>
</div>

This behavior is the biggest difference from Terraform and both a positive and negative. Unlike Terraform, I don't have to take a snapshot of my configuration and then set my Terraform as the primary. That makes one-off updates easy. However, I do now have to deal with conditionals that could really spiral out of control on a more complex project.

## Ordering jobs

GitHub Actions can be broken across multiple jobs. My example has three: `clean`, `build`, `publish`. They can be run simultaneously, but in my case I want to make sure that they follow an order. I want the DNS record created first, then I want the Access policy deployed, and I definitely need both of those two steps to complete before the content is published.

Within the file, I use `needs:` lines to tell GitHub Actions that this particular job should only start when a specific previous job has completed.

## What's next?

First, I hope these patterns are helpful when building your own GitHub Actions. I built this mostly as a proof-of-concept to confirm that it was possible, but I'm sure that I both missed some obvious improvements. Feel free to comment on the repository if you notice any.

Second, I plan to tinker with this a bit more. GitHub Actions combines automation and documentation; I have a versioned record of how I built something at a given time. It's a fun project and one that also scales.

### Special thanks

Special thanks to Edward Thomson, Program Manager for GitHub Actions, and their [fantastic tutorial](https://www.edwardthomson.com/blog/github_actions_advent_calendar.html).