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
socialImage: "./media/icloud-vault.webp"
---

![iCloud Vault](./media/icloud-vault.webp)

Late last night (Euro time) users around the world [began](https://9to5mac.com/2024/04/26/signed-out-of-apple-id-account-problem-password/) [reporting](https://www.macrumors.com/2024/04/27/apple-id-accounts-logging-out-users/) that they were suddenly locked out of their Apple iCloud accounts.

I imagine Apple will respond today or tomorrow that a system-wide change in account security prompted some bucket of users to reauthenticate. The users will regain access. Rumors about upcoming AI features in iOS 18 will again take center stage. Life moves on.

I decided to fixate on it. This kind of black swan event would be annoying on a temporary basis. How destructive would it be on a permanent basis?

## Scenario

Imagine that one of the following events has taken place:

* Someone has stolen my phone (or, less likely, my laptop). Despite having `Stolen Device Protection` enabled, they have managed to navigate to `Find My` and erased my other devices in an attempt to prevent me from tacking them further.
* Someone has taken over my iCloud account and started the process of erasing other devices to keep me locked out.
* A system-wide bug, like the event captured above, has locked me out of my iCloud account.
* Apple has shut down my iCloud account.

These vary in motivation and impact. Apple accidentally killing my iCloud account would still (I think) leave data on the device that I could back up but would interrupt service usage. A determined thief nuking all of my devices and then essentially squatting on my account would leave me up a creek without a paddle.

## Data

First, I think we should make a distinction between what is `lost-and-gone` and what is `lost-and-tedious`. If my phone is stolen and my iCloud account is not available, I have to buy a new phone and start from scratch. I would be annoyed. I would have to reconfigure everything. That is doable and, to some extent, maybe even a positive exercise - I might forget to install an app that just wastes time.

However, if I lost data and could no longer access it, I would be crushed. This exercise considers scenarios where I am just losing my iCloud account, but I want to first explore what that would mean for the data I care about.

### Photos

I treasure the digital photos I have collected over decades more than maybe any possession in my life. These snapshots are irreplaceable. They matter to me.

I rely on iCloud to back up and sync my photos across devices. Each device still retains a full quality local copy, though. In the event that I am locked out, I would still have access to the local copies on my devices.

However, the "grabbed backpack" scenario would still cause data loss. If all of my devices were stolen **and** the data erased as a consequence of an account takeover, I'd be hosed. Or if just my phone is snatched and they use `Find My` to erase other devices. I do not have a good offline backup plan.

### Files

Like my photos, I rely on iCloud for file storage and sync. Oddly enough, this is a little less concerning. These files mostly consist of PDF copies of something that also happened elsewhere. For example, I have records of my eyeglass prescription that also lives in my hospital system's account. I have my paper will that my attorney also retains. I have tax returns that also sit in my accountants' records (accountants _plural_ because I am an American abroad and pay taxes to everyone and their dog).

This would still be a hassle, but it would not be catastrophic. I also need these files somewhat less often than I thought. I was incredibly diligent about file retention as a teenager and in my 20s (this will surprise no one). Turns out, I have never once needed the 2011 service record PDF for my Nissan Altima's maintenance.

The actual files that really matter, things like birth certificates and my marriage license, exist in the physical world in a safety deposit box. I should probably still invest in a digital offline backup, but that is relatively easy - the total size of these files is very small and the PDFs are easily backed up to a flash drive. iCloud lockout would not matter here thanks to local storage and a full device-and-account-loss event would be manageable.

### Other Data

The third category of data that I really care about is the written output of things like this blog or my writings [elsewhere](https://blog.cloudflare.com/author/sam). That almost entirely sits in GitHub which is outside of the scope of this experiment.

Contacts would be a nightmare. I do not know the numbers of anyone in my life - even my wife. I need a backup option here.

Some other datasets exist that would still frustrate me to lose - and these are vulnerable to an account lockout (I think). Namely, my Apple Fitness and Health data. I wear an Apple Watch and record my workouts and other health data in their Health app. I think I can export this (the Health side) but I would be bummed to lose my workout data for no reason other than I like to keep track of trends.

Other than that, I don't lean too heavily on Apple for the storage of other data. I manage most of my calendar through my work account, just because that is where I need to be most conscious of where I need to be and when. I use Notes sporadically, Reminders holds one-off tasks, and I treat iMessage as ephemeral. Where these things would become painful is not data retention, but service availability.

## Services

Losing access to my iCloud account would immediately impact the iCloud services that I use. Again, I am listing this from `most burdensome` to `least`.

### iMessage

I rely on a unique email address as my iMessage contact, rather than my phone number, for all iMessage exchanges. I do this because I spend time in both Portugal and the US with two different numbers that can be inactive at anytime and iMessage does not handle this well. Instead, I send-and-receive from my email.

This is an email address on a domain that I control, which I think makes a difference in a recovery event. I just don't know if Apple would let me recover the account if I have control over the email domain. Even if I control the email, could I sign up again for an iCloud account with that email despite another account "squatting" on it in a lock out? I'm not sure.

Most of my friends have my phone numbers so I could at least begin again, but I've painstakingly begged them over five years to switch to the email address.

### Find My and AirTags

An account lockout would brick the dozen or so AirTags I have. I would also be at risk of losing the things that those AirTags mark. Expensive and annoying.

### Passkey and 2FA

I use the new iOS passkey feature as a login method for some services. I also rely on the built-in WebAuthN capabilities of iOS as a second factor option for others. My understanding is that these are tied to my iCloud account and losing access to it would likely stop me from relying on these options. Fortunately I have a pretty good backup strategy here.

### Sign in with Apple

I use the `Sign in with Apple` feature to avoid making new accounts for services that I really do not care about or intend to use one time. For example, applications that I was just testing like old experiments with Adobe Creative Cloud and Nomad. I also use it when I want to buy something quickly from a new ecommerce app like StopckXor Drizly. I would not lose much sleep if I lost access to every one of these essentially one-off accounts.

### Mail

This is easy. I use iCloud mail today but with my own custom email domain. I'd just change the DNS records and move forward.

### Apple Card - Account Lockout

I have an Apple Card, through the Apple Wallet, that I mostly use to pay for Apple things. Subscriptions for Apple services all go to this card because of the points earned. I do not put much else on it, though, because I have other credit cards with better reward programs or I use cards issued out here in Europe.

## Configuration

I love the concept of a `YAML` configuration file. A single file with line-by-line booleans or settings that control my setup. I wish I could export a version of this from iOS and store it in GitHub.

I cannot (to my knowledge) and losing access to my iCloud account would lead to some headaches.

### Device Settings - Full Loss

Configuration details like my alarm, Focus sets, wallpaper. These are all kept local, so this would only apply in a full loss event, but still annoying.

## What's next?

**1. Offline Backups**

I should invest in better offline backups of:

* Photos
* Contacts
* Files

These cover the cases where I am locked out and have lost all of my devices. A very unlikely event, but one that would be catastrophic without a back up plan (especially the Photos). I should also invest in some Git repository back ups of the repositories that I care about, public and private, which is tangential to this exercise.

**2. Account Sign In and 2FA**

Again, I have pretty good 2FA backup options. In the event that I am only locked out, too, but still have a physical device I believe I could access at least some of the saved 2FA options if not the passkeys. The backup options I have for this are pretty solid so I am less concerned.

**3. Account Username Control**

This is the most vexing. If someone hijacks my account or if Apple inadvertently  killed it, would I be able to create a new account with the same username - if that username is a custom email and not an `@me` address? I don't know. I doubt it. I'd have to almost start a new life on this front...
