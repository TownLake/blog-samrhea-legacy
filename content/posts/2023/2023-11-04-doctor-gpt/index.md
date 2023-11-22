---
title: "🤖🏥 Paging Dr. GPT"
date: "2023-11-04"
template: "post"
draft: false
slug: "/posts/2023/doctor-gpt"
category: "walkthrough"
tags:
  - "walkthrough"
  - "AI"
description: "So, should I skip my annual check up?"
socialImage: ""
---

You aren't supposed to do this. My wife does not want me to do this and insists that I still visit my doctor. My wife's father is a physician and has opinions about this (see below). ChatGPT repeatedly warned me not to do this. This blog walks through how I did it.

A few weeks ago I visited my hospital here in Portugal for my annual physical. In my case, that consists of a blood work panel, a chest x-ray, and a cardio stress test. I received my results last week while walking to a meeting in Lisbon. The genuinely great iOS app from the hospital system shared five pages of exam observations and data in medical, European Portuguese. I speak conversational Portuguese but most dinner parties do not discuss gamma-glutamyl transferase.

I also only had my phone on me - translating this word-by-word would be tough. So I took five screenshots of the results and shared them with OpenAI's ChatGPT and asked for a translation.

This amazes me. I'm not just translating medical terms on my phone - I'm doing so by sharing a screenshot in a format that ChatGPT likely has never seen before. A piece of software is taking these images as inputs, reading them, thinking through what they mean, and printing out a near perfect translation while attempting to keep the formatting intact.

![]()

I wanted to know a little more while I had more time on this walk. I typically schedule a follow up with my general practitioner to review the results each year. The meeting tends to be boring - I'm fortunate to be relatively healthy. However, this time I started by asking ChatGPT some questions that I would otherwise ask my doctor.

## A quick primer on my health

First, I'm lucky - I am healthy. I am in my mid-thirties, I don't smoke, and I am able to maintain a healthy weight. I eat a relatively strict and balanced diet. I walk my dogs all over Portugal most days. I work out six days a week. A few Sundays ago I rolled out of bed and ran the Lisbon Half Marathon in under two hours after preparing for just a couple of weeks.

The foundation of this is a combination of luck and privilege. I was born without any serious health complications. I grew up in an environment with clean air, abundant food, and safe water. I was rarely if ever in serious physical danger. I have combined those advantages with a commitment to diet and exercise. I also have good health insurance. I am fortunate.

_Of course this is part of what terrifies me about being alive. Someone can have that healthcare history and a blood clot could find them one morning. Or a neurological disease. Or they just fall backwards funny. Being a human is sometimes horrifying in its unpredictability. That's a discussion for another time._

I haven't escaped entirely unscathed - a spontaneous pneumothorax when I was 19 has left me with some lingering respiratory issues that pop up from time to time. My knees are also banged up but I don't think most boys who grew up playing sports in Texas could say otherwise.

All that to say, a stupid experiment like this is relatively without consequence. My annual physical last year revealed that every single value that could be tested sits within the normal range. The direct translation of this report suggested very little changed. Time to use that window to get weird.

## And a heads up about medicine in Portugal

I have found the Portuguese healthcare system to be phenomenal. I am fortunate enough to have private insurance through my employer, but the experience in the private system exceeds what I found in the United States and the cost is lower. I also have not had any serious healthcare scares in my four years in Portugal. A few annual check ups, a broken hand, and some dry eyes represent the bulk of my visits. I have never needed to see the kind of specialist where the best in the world could only be found in a place like Houston.

I also have not invested much time in learning medical terms in Portuguese. I know enough to describe or triage an emergency, but the `pericardium` is not high on my flash card list.

## Start with a summary

The original report provides both normal reference ranges and values from my tests last year. Even if I didn't understand a single word of medical Portuguese I could scan through the results and find that almost nothing sits outside of the reference ranges; the one or two values that do measure higher or lower only do so by insignificant margins.

With that safe clearance, I felt comfortable asking ChatGPT to go ahead and summarize the results.

![]()

So far, no surprises. ChatGPT has confirmed what I suspected when I scanned the reference values - I am healthy and within a normal range. Again, I'm shocked by this technology. I am now interrogating this service in a different language based on some grainy pictures of a medical report.

## What changed?

I am also interested in progress, or at least change. If all the values are normal, did some get more or less normal? My lifestyle in 2023 looks very similar to my lifestyle in 2022, but I have paid more attention to my diet. Most of my healthcare sins consist of traveling way too much. I have crossed the Atlantic about 30 times in 2022 and 2023. When I do so, I blow away [my routines](https://blog.samrhea.com/posts/2023/habits-q2). I sleep less, I eat poorly, I drink more, I even miss the gym on rare days.

Turns out, paying more attention to my diet and running more had minor impact. I'm not sure if this is because most of my values last year were already solid for someone my age and there isn't much I could do to improve them. None of these are purely directional - you don't want to pursue infinitely higher LDL values. You probably want to sit in the middle of a bell curve on most of these.

![]()

I do think this is where the kind of ChatGPT interpretation can thrive - here are two data sets, nuanced in a particular subject area and written in a foreign language - go ahead and summarize the differences.

## What did ChatGPT miss?

* I was using ChatGPT 4 prior to their November 2023 updates from OpenAI Dev Day. The service, at that time, still struggled with some deterministic math. For example, they were cases where the chat would highlight that my values increased from 21 to 18.

## What does a real doctor think?

"These answers are both overly detailed and lacking all context" is the summary from my father-in-law, a retired nephrologist (a physician that specializes in kidney diseases). He called out how it bogs down in minutiae while making recommendations "straight of of a Whole Foods ad" when asked for ideas about how to improve next year.

He also hit me with a prompt that we give to junior Product Managers and I should have known better. He chided me by asking "what do you want form a doctor?" AI can read and interpret the labs, but a physician benefits from a lot more context and observation of you. That is true, but assumes that the physician has the time and energy to invest in that level of diagnosis and that I even have a physician.

## What do I really want?

Where should this, and really all AI experiences, live? Should hospital applications rely on LLM APIs to bake this kind of functionality into their application? Or should tools like ChatGPT exist as a kind of "super app" that sits on top of data sources. Their move to launch "Create a GPT" seems to suggest that is a more and more viable option. I could see a hospital system wanting to avoid investing in building their own front-end experience on top of an LLM API and instead just letting it live in ChatGPT (like businesses that use WhatsApp for customer support). Alternatively, the data privacy and ownership of the customer relationship suggests they won't and that some vendor will emerge who provides you with a generic "storefront" for your application built on top of those APIs - like what Shopify does for merchants.

You can also imagine a world where companies like Apple become the gateway to our healthcare. The Apple Watch knows more about my health than anything I regularly use - if tools like continuous glucose monitoring are added. If the other rumors are true about Apple, that they're going to introduce their own LLM functionality into iOS and macOS next year, this gets even easier. Bonus points that they are a company with a privacy-first perception.

## So, what does this mean?

We could probably make preventative healthcare more efficient. I could give back one hour of physician time if a (trusted) LLM service could read my results in the future and says, to some extent, "you are basically fine right now and do not need to have a conversation with a physician but you can if you want to." I feel somewhat comfortable using the off-the-shelf GPT4 here to confirm that but only because my values sit neatly within normal ranges and my results last year were fine.

I'm not sure how eager I would be to trust this, yet, if something looked off. If any of these values skewed far outside of the normal ranges I'd still go to a doctor. For now.