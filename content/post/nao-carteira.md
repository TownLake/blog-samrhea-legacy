---
author: "Sam Rhea"
date: 2019-12-28
linktitle: ⛔💳 ditching my wallet for MB Way
title: ⛔💳 ditching my wallet for MB Way
images: ["https://blog.samrhea.com/static/nao-carteira/confirm-pin.png"]
description: A bizarre, Portuguese version of retail finance solved my fear of loss.
tags: ["Portugal",",","walkthrough"]
---

I do not think that I'm more prone to losing objects than the average person. It just bothers me more than it probably should. Careless mistakes, like misplacing keys or a wallet, are unforced errors - the worst kind of error. Not tragedies, but painfully unnecessary.

I lose things that I carry and I carry a wallet. At some point in time, I'll lose that too.

At the start of this decade, I assumed that I could remove "wallet" from my fear of loss because I would no longer need to carry a wallet. Our mobile, cloud-delivered, future would remove that requirement.

Sadly, that dream never materialized, at least not in the United States. We got *close*. However, I would never feel comfortable leaving home for the day without my wallet. The biggest pain point? Probably dining out. Restaraunts in the US rely on static point-of-sale (POS) systems, meaning you handover your card, the staff walks back to a terminal and runs it, and then they return your card to you. And I sure don't want to give them my phone.

Meanwhile, Portugal is living in the future. Contactless payments are available everywhere, similar to other places outside of the US, but one additional unique service makes it actually possible to live without a wallet: the baffling and wonderful world of Multibanco. A bizarre, Portuguese version of retail finance solved my fear of loss. Here's how.

---

**🎯 I have a few goals for this project:**

* I do not want to carry a wallet anymore.
* I want to use a mix of American and Portuguese credit cards, depending on the situation.
* I want to help my friends and family visiting Portugal by removing some of the friction when using their American cards.
* I need to be able to produce cash, within a 5-10 minute walk of where I am standing, somewhat frequently.

---

**🗺️ This walkthrough covers how to:**

* Reduce the friction of using American credit cards in Europe with Apple Pay.
* Set up MB Way with a Portuguese bank account to summon cash from your phone.
* Effectively ditch your wallet.

**⏲️Time to complete: ~15 minutes**⏲️

*Assuming you have a Portuguese bank account*

>🆔 This post mostly ignores requirements for carrying identity, which I recognize can vary widely by region and situation.

---

## Apple Pay abroad

I still keep two American credit cards active. I use them when I'm back in the US and spoardically in Portugal and on travel (nothing in Europe matches travel point rewards schemes). They also are my go-to method of finance for big ticket items (we bought a MacBook Air last week and the warranty included from Chase is great).

That's only possible because neither card charges a foreign transaction fee. I make a purchase in Portugal, in EUR, and the card issuer converts that to USD on my bill. That puts me at risk of some exchange rate variability, but nothing too wild to discourage use altogether.

However, American cards can still be annoying to use. Most major American cards added support for [EMV](https://network.americanexpress.com/globalnetwork/products-and-services/security/emv-chip-card-payments/), or chip, around 2015-2016, several years after widespread adoption in Europe. Replacing a swipe with a dip makes the cards less unusual, but most still require a signature when used abroad. It's clunky.

Oddly, when the same cards are used via Apple Pay, they do not require a signature. Most POS terminals in Europe support contactless payments, even at restaraunts (where the POS termains are handheld). If the terminal supports NFC contactless payments (I have yet to find one in Portugal that does not) I can simply hover my phone over the device and pay faster, no signature required.

This works great and, if you're visiting Portugal or elsewhere in Europe, set up Apple Pay before you leave. This step is easy enough: Apple Pay (or some other contactless method) removes the need for a signature or the actual card when traveling.

That said, in many places within Portugal, and situations, cash is either required or significantly more convenient. If I'm not carrying it, which I prefer not to, I need to find a way to grab some occassionaly. Portugal's unique banking layer, Multibanco, provides a solution to that challenge without requiring a debit card.

## MB Way

Multibanco is not a bank, but it is banks and banking in Portugal. You know how you like to buy tickets, transfer money, and pay bills on the Internet? Well, with Multibanco, you can do all of that from the comfort of your nearest ATM.

[Multibanco](https://www.sibs.com/marcas/multibanco/) is a network of Portuguese ATMs operated by the payment processor SIBS. Essentially all banks in Portugal participate and every one of the 12,000 ATMs available operate on Multibanco's platform.

However, calling them "ATMs" is a real disservice. Each Multibanco ATM is an entirely self-contained, comprehensive, financial portal. Multibanco is like a steampunk universe version of ecommerce and Internet banking, all powered by your physical key (your debit card). I love it so much and am fascinated by it. I **definitely** plan to write a more thorough post focused on Multibanco, Until then, I'm going to move on to their mobile app: MB Way.

In 2014, Multibanco launched [MB Way](https://www.mbway.pt/), a mobile application that brings the featureset of each Multibanco ATM and each Multibanco card to your device. You can perform peer-to-peer transactions, check balances, and pay at registers with NFC or QR codes. For the purpose of this blog post, it is important that it also works in the other direction.

With MB Way enrolled on my phone, I can also use it as a replacement for my physical debit card at any Multibanco ATM. And finding those ATMs is easy. They proliferated with the prominence of Multibanco as a financial platform for Portugal. To set it up, I visited one of those 12,000 ATMs.

### Enrolling in MB Way

Setting up MB Way feels odd. You use an ATM, with your debit card and PIN, to enroll your mobile app by way of your phone with a separate PIN. I'm going to document the steps in painful detail because I'm really curious about how this alternate system bridges financial systems (my bank account) with digital (the app on my phone) via the physical (ATM and debit card).

>🏦 Some banks let you enroll from just the app. Honestly, it's more fun to get the full experience at the ATM.

At the ATM, I inserted my debit card and input my card PIN as if I was starting any other type of transaction. Once validated, I instead picked "MB Way" and was prompted to enroll by connecting my phone number.

<div style="text-align:center">
<img src="/static/nao-carteira/link-to-card.png"
 width="400" class="center"/>
</div>

I punched in my Portuguese number and was then prompted to set a PIN code.

<div style="text-align:center">
<img src="/static/nao-carteira/confirm-pin.png"
 width="400" class="center"/>
</div>

Once saved, I had now informed MB Way of my phone number and set a PIN code. I returned to the app on my phone, where I need to validate my SMS number - the same one I used at the ATM.

<div style="text-align:center">
<img src="/static/nao-carteira/validate-phone.png"
 width="300" class="center"/>
</div>

>🔐 **Is this vulnerable to SMS hijack?** To my knowledge, you cannot recover an account with SMS alone - I would need to either have both my MB Way PIN and phone number, or start over with my debit card and PIN at a physical ATM.

Once I validated my phone number in the app, I was prompted for my MB Way pin:

<div style="text-align:center">
<img src="/static/nao-carteira/input-pin.png"
 width="300" class="center"/>
</div>

And just like that, my card was now enrolled 

<div style="text-align:center">
<img src="/static/nao-carteira/mbway-home.png"
 width="300" class="center"/>
</div>

I can now use the app alone to withdraw cash.

### Withdrawing cash with MB Way

Selecting "Levantar Dinheiro" in the homepage of the MB Way app above, I can select a cash amount that I want to withdraw, up to 200 €.

<div style="text-align:center">
<img src="/static/nao-carteira/mbway-valor.png"
 width="300" class="center"/>
</div>

I picked 20 € to test this out. Notice I could also share this code with someone else! I imagine that could be convenient for sharing with kids, without giving them a debit card.

After generating the code, MB Way displays a code that is valid for [single use and 30 minutes](https://www.mbway.pt/perguntas-frequentes/).

<div style="text-align:center">
<img src="/static/nao-carteira/withdraw-pin.png"
 width="300" class="center"/>
</div>

Back at the ATM, I can enter that code to withdraw cash. MB Way will notify me when the cash was withdrawn (including in the event that I shared the code with someone else).

MB Way provides much more than just cardless withdrawals. Users can send instant peer-to-peer payments to other bank accounts, no delay or hold required. Also, the app will read a QR code at POS terminals and function as a non-NFC contactless payment method.

### Fees are finding MB Way transfers

Seperate from withdrawals, the MB Way transfer feature is a common method for paying service providers. Uncommon for peer-to-peer transactions, the transfer is instant by default.

From what I understand, at launch no participating bank charged commission on MB Way transfers. [It seems that is changing](https://www.dinheirovivo.pt/banca/mb-way-comissoes-estao-nos-precarios-mas-maioria-dos-bancos-nao-cobra/). For example, we use a local dog daycare in our neighborhood and pay them via MB Way. We paid a 0,90 € commission, which came out to about 5%, on top of the transaction, which seems extraordinarily high. Right now, that appears limited to the peer-to-peer transfers via the app.

The bank sets these rates, not SIBS (the entity behind MB Way). A fee on top of instant peer-to-peer transactions puts MB Way more in line with something like Venmo Instant Transfer, where immediate transfers carry a small fee.

## What's next?

I can now comfortably go without a wallet most days, something I wanted in the US but only found here in Portugal.

I don't miss carrying a wallet. I do have ghost anxiety about it. I'll briefly think I forgot or lost it, but then find comfort in the knowledge that Multibanco is there for me.

Some thoughts:

* Enrolling a card into MB Way is clunkier than enrolling in Apple Pay (beyond just the requirement to visit a physical ATM. Initial setup requires the generation and/or entry of three different PIN codes.
* That said, it does something Apple Pay skipped altogether: bridging digital retail banking to physical cash.
* We have a strange relationship between digital and physical money.
* NFC payments will never be as convenient as handing over a 2 € coin for a beer at a bar.