---
title: "🤖🖋️ AI Tone Rewriter"
date: "2024-08-08"
template: "post"
draft: false
slug: "/posts/2024/tone-rewriter"
category: "technology"
tags:
  - "technology"
description: "iOS 18 features before iOS 18."
socialImage: ""
---

iOS 18 [plans to introduce](https://www.apple.com/ios/ios-18-preview/) Apple Intelligence (AI\*), a suite of Large Language Model (LLM) services baked into the operating system. One of those capabilities will be the ability to rewrite text for you. Highlight what you just typed, select a tone, and the AI will replace it with a new version.

That should make us a bit nervous - for a few reasons.

First, the more that humans “writing” consists of just LLM output, the worse the training of those LLMs will be. The data becomes more and more garbage as we essentially try to train it on itself. At least that seems to be the impact right now.

Second, this is pretty cold. I am not sure I want my friends communicating with me “through” an LLM. At what point will it just respond on their behalf and suddenly you are conversing with an AI impersonation of your friend or family member?

Where I **am** excited about this is a small answer to a topic that I have obsessed over for years \- what tools I rely on. I spend too much thinking about the devices and software I use in my life. Like previous hype cycles, I want to believe that AI can be a utility tool answer.

Nearly half a decade ago I [wrote a post](https://blog.samrhea.com/posts/2020/siri-keyboard) about skipping out on iPads because I just did not have a use case in the middle ground between laptop and phone. I figured I could use a real keyboard with my iphone (which I don’t ever) or, increasingly, just use my voice with airpods.

I have tried that off-and-on over the last five years. Every time it makes me miss a keyboard. I am particular about what I write. I find dictation to be a poor medium for drafting. I tend to dictate and then go back through and rewrite/format/clean up. It probably takes as long as just thumb typing on the phone keyboard.

I think the same technology that Apple plans to bring to iOS 18 can help solve that, but I need to work beyond the discrete categories they plan to provide. I want my rambling dictation to be rewritten based on nuance about how I like to communicate. It doesn’t look like I’ll be able to do that in iOS 18 (yet) but I can do that today by building an OpenAI ChatGPT bot and using the mobile app. This will definitely be clunkier than the in-line option that iOS 18 will provide, but let’s see if it’s worth it.

## Why a rewriter?

I feel awkward with the dictation of what I say. I find myself stuttering and second guessing my word choice. I am not sure why. I just feel like the way I talk is pretty different from how I write. Different enough for me to notice, at least.

I do still believe I am getting across the general idea, though. And for cases outside of this blog or certain emails, when I have a keyboard anyway, I just want something to clean up the garbled dictation.

iOS 18 provides an interface to do this, but it looks like the options will be pretty narrow. You can decide to make something friendly, professional, or concise. You do not have control over what those options entail \- which both means that a lot of what people are about to write will look way too similar and you lose your own unique voice.

So what I need is a rewriter that I can tailor to my own preferences. Fortunately, ChatGPT offers an out-of-the-box answer.

## Building the bot

OpenAI allows paid users to create their own tailored GPTs. This mostly consists of custom system prompts and a dedicated slot in their app, which is exactly what I need for most use cases. I want it to translate between EN-US and PT-PT without having to tell it each time, for example.

I’ve [written about this capability before](https://blog.samrhea.com/posts/2024/alda-bot) and have used it repeatedly since then. I picked it back up for this particular experiment to create a Rewriter Bot.

I started with these guidelines in the bot creator flow.

```
I want a GPT that can take text as input and rewrite that text based on a style guide. The input text will be my personal dictation, so it might be messy or rambling or have words that were incorrectly transcribed. I want it to be rewritten without modifying the intent or tone, but with cleaner formatting and corrections based on my specific preferences.
```

And added on the following prompt. Nothing too complex at this point.

```
* the tone should maintain the tone of the input text, in general pretty conversational * your mission is not to rewrite entirely. your mission is to clean up and organize * add or edit punctuation when it makes sense * add line breaks, bullet points, or numbered lists when it makes sense * clean up clearly incorrectly transcribed words that do not fit the content * if you have to make edits, be friendly
```

## Testing the bot

This works really well\! When I open ChatGPT, and select this GPT, I can talk directly to it and it spits out ready-to-send text that I can copy paste.

However, the problem is the number of verbs above…

## So what?

This works but it is clunky, which is not a surprise. And certainly way clunker than the in-line option that iOS will introduce later this year.

The tool simply does not live where I want to use the tool. I would like to dictate and rewrite text in Messages, WhatsApp, and Mail. Using this tool requires me to leave the app, dictate into ChatGPT’s app, and then return with my pasted content. This should really live in the keyboard \- where iOS 18 will introduce it.

Some keyboard-based options seem to exist [out there](https://apps.apple.com/us/app/omni-ai-keyboard-chat/id6446796339). Some real privacy concerns there and I don’t think it offers the customization I’m looking to use.

For now, I think the only place this makes sense are for longer emails. That’s fine \- it’s a tool in my back pocket for now.
