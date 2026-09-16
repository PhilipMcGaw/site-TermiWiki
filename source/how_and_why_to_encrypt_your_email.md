---
title: "How and Why To Encrypt Your Email"
source: dokuwiki
source_path: "sites:termiwiki:how_and_why_to_encrypt_your_email"
created: 2023-01-01
tags:
  - "termisoc"
  - "relation"
  - "references"
  - "ben_a_lee"
---
# How and Why To Encrypt Your Email

Note: this article really lives at http://subvert.org.uk/~bma/articles/gpg-howandwhy/. I shall try to remember to keep the two in sync, but that version is the more likely to be up-to-date. 

## Why To Do It
E-mail has been around for quite a long time - since the 1970s, in fact. It's older than the internet; it was used on the ARPAnet, the precursor to the internet, and it hasn't really changed much at all since the early 1980s.

One of the assumptions that e-mail makes is that everybody is relatively trustworthy; specifically, it assumes that every user can be trusted to put their own real name on all the messages they send (it makes some other silly assumptions, too, but I'll not get into those here). This was a perfectly reasonable assumption to make in 1972, when the ARPAnet consisted of only a few computers at a dozen universities in America; for a start, if you received an e-mail in 1972 you probably knew everyone in the entire world who could possibly have sent it.

As time has passed, it has become clear that this is a stupid assumption to make, but it's one that's fairly hard to avoid - the standards make no attempt to require the sender to prove they are who they say they are.

There's another issue with e-mail, in that your message is basically readable by anybody. If we both connected to an unencrypted wireless network, I could most likely read every email you send and receive; it's also quite likely that I could find out your password and use it to read all your emails in future, too. This can be partially avoided by using an encrypted connection, but that only covers part of the route - can you rely on the recipient using an encrypted connection (possibly), or on every step in between to be encrypted (almost certainly not)?

Fortunately, there's one technology that can solve both of these problems - public-key encryption. Normal encryption requires both the sender and the recipient to know the key (the password, for example), which is very insecure - especially if you want to send something to more than one person. Public-key encryption works by having two parts to the key - the public part, which you can give to anyone you like (it's usual to upload it to the internet for anyone who wants it to get), and the private part, which you keep to yourself.

It works like this:

   Encrypt with private key -> Decrypt with public key
   (only you can do this)      (anyone can do this)
   
   Encrypt with public key -> Decrypt with private key
   (anyone can do this)       (only you can do this)

The first part is called signing the message. When you do this, a checksum is calculated. This is a very quick way of seeing if a file has been modified - if it has the same checksum, it's the same. Then, you encrypt it with your private key. Anyone can decrypt it and see the checksum, and therefore see if the message has been altered, and since it's been encrypted by your private key, they can rely on it being sent by you.

The second part is the encryption. For this, you encrypt the message using the recipient's (or recipients') public key(s). That way, only they can read it; it'll be complete gibberish to anyone who doesn't have the private key.
## How To Do It
First, you'll need GnuPG. GnuPG, the GNU Privacy Guard, is a free software implementation of PGP, Phil Zimmerman's "Pretty Good Privacy", which was the original implementation of public-key cryptography for email (and anything else, as far as I know), and caused serious uproar when it was transferred out of the US for the first time - cryptographic software was (and sometimes still is, I think) considered to be a "munition" by the US Government, and therefore giving it to foreigners was an act of terrorism. Or something. (Zimmerman apparently got around this by publishing the entire source code in a book - exporting books is free speech, and therefore protected by the First Amendment. Those crazy Yanks...)

When you have GnuPG (get it from http://gnupg.org/ or your friendly local package-management system - APT, ports, pkgsrc, et al.), you'll need to go to a terminal. There are graphical interfaces for GPG, but I don't know how to use them. Type the following:

   gpg --gen-key

Then press enter. You'll get asked some questions. Go with the defaults. Then, when it asks for a name and e-mail address, enter them. You should go with your usual e-mail address, but you can add more later. You don't need to fill in the comment bit.

Now, you have your key; you just need to be able to use it. If you use web-based email (GMail, Hotmail, etc.), there are sometimes ways to do it. Never, ever, use them, and don't trust the key of anyone who does (more on that later). To use them, you need to transfer your key across the Internet to a machine that you can't trust, which is something you should avoid at all costs. Instead, you should use a proper e-mail client. I like Mutt, which has excellent support for encryption. You may want to look at Mozilla Thunderbird, though, as it's generally considered more user-friendly; if you do, you'll also need the Enigmail extension.

When you've installed Enigmail, go to Account Options and, for each account you want to use GPG for, select OpenPGP Security. Choose Enable OpenPGP Security, then "Sign Non-encrypted messages by default", "Sign encrypted messages by default", and "Always use PGP/MIME".

Now, when you send a message, it'll prompt you for the passphrase you set on your key. When your message is received, the recipient can be reasonably sure that it's really from you (unless you've been arrested by the NSA and had the key beaten out of you, or something).
## Trust
So, you receive an e-mail signed by "Benjamin A'Lee", and you think 'Hmm, I didn't realise Ben had a PGP key'. Well, ignore the fact that I wouldn't really be in a position to write this if I didn't. How do you know that that key really is mine?

GPG allows you to mark keys as trusted, i.e., you're sure that it belongs to the person it claims to belong to. If you meet me in person, I can tell you that my key is indeed 0xDEADBEEF, and you can mark it as being trusted. You can also sign my key, which says that you trust that the key belongs to who it says it does; then, other people who trust you and your key can in turn trust mine even if they never meet me. This way, everyone gets connected up in what's known as the web of trust.

## Copyright
Copyright © 2004-2008 a'lee|Benjamin A'Lee <bma@subvert.org.uk>

This work is free software: you can redistribute it and/or modify it
under the terms of the GNU General Public Licence, version 3, as
published by the Free Software Foundation.

This work is distributed in the hope that it will be useful, but
WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
General Public Licence for more details.

You should have received a copy of the GNU General Public Licence
along with this work.  If not, see <http://www.gnu.org/licenses/>.

 

(Note that this is less restrictive than the Creative Commons Attribution-NonCommercial-ShareAlike licence on the rest of this wiki, since it allows commercial use.)
