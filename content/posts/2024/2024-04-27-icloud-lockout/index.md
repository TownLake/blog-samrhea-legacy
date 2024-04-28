---
title: "🍎🔐 What happens if you find yourself locked out?"
date: "2024-04-27"
template: "post"
draft: false
slug: "/posts/2024/icloud-lock"
category: "technology"
tags:
  - "technology"
description: "What is the playbook?"
socialImage:
---

![iCloud Vault](./media/icloud-vault.webp)

Late last night (my time) users around the world [began](https://9to5mac.com/2024/04/26/signed-out-of-apple-id-account-problem-password/) [reporting](https://www.macrumors.com/2024/04/27/apple-id-accounts-logging-out-users/) that they were suddenly locked out of their Apple iCloud accounts.

I imagine Apple will respond today or tomorrow that a system-wide change in account security prompted some bucket of users to reauthenticate. The users will regain access. Rumors about upcoming AI features in iOS 18 will again take center stage.

This would be annoying on a temporary basis. How destructive would it be on a permanent basis?

## Scenario

One of the following events has taken place:

* Someone has stolen my phone (or, less likely, my laptop) and taken over my iCloud account for the purposes of erasing the settings on those devices in order to resell them. I have lost access to my account and potentially any data on the stolen devices.
* A system-wide bug, like the event captured above, has locked me out of my iCloud account.
* For some reason Apple has shut down my iCloud account.

## Data

I think we should make a distinction between what is lost-and-gone and what is lost-and-tedious. If I am locked out of my iCloud account and have to buy a new phone and start from scratch, I would be annoyed. I would have to reconfigure everything. That is doable and, to some extent, maybe even a positive exercise - I might forget to install an app that was just a time waster.

However, if I lost data and could no longer access it, I would be crushed. This exercise considers scenarios where I am just losing my iCloud account, but I want to first explore what that would mean for the data I care about.

### Photos

I treasure the digital photos I have collected over decades more than maybe anything in my life. These snapshots are irreplaceable. They capture everything from my first date with Rachel in high school, the scenes of life in my college house, the first weeks of my son's life. They matter to me.

They also matter to just me. Again, this exercise is about an account lockout. In most scenarios above it would make no sense for a thief to painstakingly delete all my photos. They have no value to anyone but me (and those around me). And zero value to anyone deleted. So, what happens if I am locked out?

I rely on iCloud to back up and sync my photos across devices. Each device still retains a full quality local copy, though. In the event that I am locked out, I would still have access to the local copies on my devices.

However, the "grabbed backpack" scenario would still cause data loss. If all of my devices were stolen simultaneously **and** the data erased as a consequence of an account takeover, I'd be hosed. I do not have a good offline backup plan.

### Files

Like my photos, I rely on iCloud for file storage and sync. This is a little less concerning, oddly enough. These files consist of mostly PDF copies of something that also happened somewhere else. For example, I have records of my eyeglass prescription that also lives in my hospital system's account on me. I have my paper will that my attorney also retains. I have tax returns that also sit in my accountants' records (accountants plural because I am an American abroad and pay taxes to everyone and their dog).

Not to say this would not be a huge pain, but it would not be catastrophic. I also need these files somewhat less often than I thought. I was incredibly diligent about file retention as a teenager and in my 20s (this will surprise no one). Turns out, I have never once needed the 2011 service record PDF for my Nissan Altima's maintenance.

The actual files that really matter, things like birth certificates and my marriage license, exist in the physical world in a safety deposit box. I should probably still invest in a digital offline backup, but this is less urgent. iCloud lockout would not matter here thanks to local storage and a full device-and-account-loss event would be manageable.

### Other Data

The third category of data that I really care about is the written output of things like this blog or my writings [elsewhere](https://blog.cloudflare.com/author/sam). That almost entirely sits in GitHub so is outside of the scope of this experiment.

Contacts would be a nightmare. I do not know the numbers of anyone in my life - even my wife. I would need a solid backup option here.

Some other datasets exist that would still frustrate me to lose - and these are vulnerable to an account lockout (I think). Namely, my Apple Fitness and Health data. I wear an Apple Watch and record my workouts and other health data in their Health app. I think I can export this (the Health side) but I would be bummed to lose my workout data for no reason other than I like to keep track of trends.

I manage most of my calendar through my work account, just because that is where I need to be most conscious of where I need to be and when.

Other than that, I don't lean too heavily on Apple for the storage of other data. I use Notes sporadically, Reminders holds one-off tasks, and I treat iMessage as ephemeral. Where these things would become painful is not data retention, but configuration.

## Configuration

I love the concept of a `YAML` configuration file. A single file with line-by-line booleans or settings that control my setup. I wish I could export a version of this from iOS and store it in GitHub.

I cannot (to my knowledge) and losing access to my iCloud account would lead to some serious headaches. These are not data loss events, but potential account and setup loss situations.

I have broken this down in order from `least burdensome` to `most`. I also indicate what would apply in a total loss event compared to the more likely account lockout one.

### Device Settings - Full Loss

Configuration details like my alarm, Focus sets, wallpaper. These are all kept local, so this would only apply in a full loss event, but still annoying.

### Apple Card

I have an Apple Card, through the Apple Wallet, that I mostly use to pay for Apple things. Subscriptions for Apple services all go to this card because of the points earned. I do not put much else on it, though, because I have other credit cards with better reward programs or I use cards issued out here in Europe.

### Sign in with Apple - Account Lockout

### Passkey and 2FA - Account Lockout

### iMessage - Account Lockout

I rely on my iMessage email address for most iMessage contacts. I do this because I spend time in both Portugal and the US with two different numbers that can be inactive at anytime and iMessage does not handle this well. Instead, I send-and-receive from my email.

This is an email address on a domain that I control, which I think makes a tremendous amount of difference in a recovery event. I just don't know if Apple would let me recover the account even if I have control over the email domain.

## What's next?

**1. Offline Backups**

I should invest in some offline backups of:

* Photos
* Contacts
* Files
* This repo, a couple others too

These cover the cases where I am locked out and have lost all of my devices. A very unlikely event, but one that would be catastrophic without a back up plan (especially the Photos). I should also invest in some Git repository back ups of the repositories that I care about, public and private, which is tangential to this exercise.

**2. Account Sign In?**



**3. Email Control**