---
author: "Sam Rhea"
date: 2020-01-18
linktitle: 📤🖼️ the only good way to share photos in iOS
title: 📤🖼️ the only good way to share photos in iOS
images: ["https://blog.samrhea.com/static/ios-photos/tile.png"]
description: Let's all agree on a new standard
tags: ["iOS",",","walkthrough"]
---

The photos that we take on our phones are one of the few things that we'll probably "own" for our entire lives. I put `own` in quotes because we can keep photos indefinitely because we rely on someone else to worry about storing them.

So we take more. And that's fine. Low-cost cloud storage for back-ups will continue to exceed the pace with which an average user captures moments.

What hasn't scaled is how we share them with others. These photos are portable, enough to back them up across multiple providers, but we still struggle to send them without compromising quality, organization, or both.

And for some reason iOS, the operating system behind the world's most popular camera, makes that even more difficult than it needs to be.

Which is odd, because they have an option that solves this problem. It's just hidden. But it's worth it.

---

**🎯 I have a few goals for this project:**

* I want to share photos in iOS with friends and family.
* I want the photos sent to be high-quality, in the case that someone wants to store my photo in their library.
* I want to share photos across multiple platforms.
* I want to share photos in a way that I can later revoke.

---

**🗺️ This walkthrough covers how to:**

* Use a semi-hidden share sheet option for iOS photos to send others full-resolution, location-optional, photos.
* Review iOS Photos' app for photos shared and revoke them if necessary.

**⏲️Time to complete: ~15 minutes**

---

## Problems with iOS photo sharing

**iMessage and SMS**

If you use iOS, the Messages app is the most natural place to share photos. iOS (and Mac) recipients receive them over iMessage and users on other platforms receive them as SMS. However, both have drawbacks in terms of usability and file quality.

* Photos sent in iMessage are received in a vertical list. Each photo takes up almost the entire screen and requires the recipient to scroll to view them.
* Photos are not always sent at their original resolution. Carrier limits on file size can impact photos sent over SMS. iOS users can toggle an option, "Low Quality Image Mode", in their settings to send compressed photos. That's helpful when data is in short supply, but easy to forget to disable.

**iCloud Shared Albums**

How are these so broken? I don't know where to start. iOS has a feature where users can build and contribute to a shared album. A great use case would be "our family is taking a holiday trip together and want to put all of our photos in one place."

This would be fantastic if it worked well. It does not. I'm so baffled.

* No duplicate detection. You can inadvertently add the same photo more than once and clutter the album.
* No sorting. Images are listed according to the time when they were added.
* You can't just create a shared album. Try it - navigate to the Shared Album folder. You won't find a plus sign or `Add New` modal. In that panel, you have to click `Edit` and **then** a `+` is revealed.
* Want to save a photo that someone else took? The photo will be time stamped to when you saved it, not the actual date it was taken.

## iCloud Link

Hidden deep inside the iOS share sheet is the only good way to share photos, `iCloud Link`. To get there, you first need to select one or more photos and open the share sheet.

<div style="text-align:center">
<img src ="/static/ios-photos/share-sheet.png" width="300" class="center"/>
</div>

<p></p>

Once there, select `Options` in the top. This is the part that is hidden. This should be the default.

<div style="text-align:center">
<img src ="/static/ios-photos/icloud-link-option.png" width="300" class="center"/>
</div>

<p></p>

Once opened, select the option `iCloud Link`. This will create a URL where the images are organized into an album. You can even opt to include the original location metadata, if you'd like.

You can now take this link and send it to someone either in Messages or any app that you choose. If you select Messages, the link renders in a nice tile that gives the date range and selects a preview image for the recipient.

<div style="text-align:center">
<img src ="/static/ios-photos/tile.png" width="300" class="center"/>
</div>

<p></p>

Want to keep track of the photo groups you've shared? The `For You` tab keeps them organized in a carousel. They even automatically have an expiration. You can also revoke the links and take down the photos.

<div style="text-align:center">
<img src ="/static/ios-photos/for-you.png" width="300" class="center"/>
</div>

<p></p>

And when you open the group, you can review the photos added.

<div style="text-align:center">
<img src ="/static/ios-photos/group.png" width="300" class="center"/>
</div>

### Recipient behavior

When someone receives this link, they can view the photos and opt to download them with their original metadata and quality.

If they are on iOS, this will happen in the Photos app. Other devices (both mobile and desktop) open a browser link where they can download the files.

<div style="text-align:center">
<img src ="/static/ios-photos/browser-view.png" width="600" class="center"/>
</div>

<p></p>

### Known limitations

Yes, this means you cannot collaborate on an album with friends where you all contribute photos together. This path is better when you are sharing a batch of photos with an audience, not organizing photos as a group.

This also has a kind of "use it or lose it" outcome for the recipient. These links expire. The only behavior they can take is either view them in a moment in time or save them for eternity.

## What's next?

The right answer here is fixing shared albums and bringing them more in line with the features that are available in Google Photos. Google's app handles things like sorting and duplicate detection. Until then, this is the best approach.

Why? At least for me, family. I moved to Lisbon, Portugal a few months ago - some 4,800 miles away from everyone I'm related to. When I send photos to my mom, grandmother, and other members of my family - they save them.

And that is really special. When we printed photos, they kept archives of collections over the decades. Family history that we sorted and chatted around. Now, they are casually assembling digital collections, from across the family.

For friends, the organization of iCloud Links makes this a bit better, but it matters so much more for family saving them long-term.