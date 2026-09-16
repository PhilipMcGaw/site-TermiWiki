---
title: "Connecting to your account over SSH using PuTTY"
source: dokuwiki
source_path: "sites:termiwiki:connecting_to_your_account_over_ssh_using_putty"
created: 2023-01-01
tags:
  - "termisoc"
  - "relation"
  - "references"
---
# Connecting to your account over SSH using PuTTY

 Why?

As part of your termisoc account, you are able to access a command line terminal on our server, this allows you to easily see and manipulate your files without resorting to FTP. SSH is very secure (and infinitely better than Telnet) and is the preferred way of playing with the servers.

As of September 2009 it's only possible to connect to the SSH port from within the University's firewall. This can be achieved either by using a computer connected to the University's network or through a VPN connection, ILS provide instructions for creating a VPN connection on Windows and Mac OSX at http://www.plymouth.ac.uk/roaming while the wiki has Connecting To The VPN Using Linux.
Cool. How do I do it?

Well, you'll need an SSH client. If you run a Linux box, odds are on you already have the OpenSSH client installed. This article focuses on Windows however, and Windows does not come with an SSH client (the observant among you may notice it does come with a telnet client, but telnet is very insecure and we do not allow telnet access to our boxes). Instead we'll use Putty, a small and simple piece of software available on the web. Head over to this page and grab putty.exe

It's not an installer or anything; that one tiny file is all you need. I reccommend sticking it in c:\windows\ or something so that it's on your path, and then creating a shortcut on your desktop, but that's your choice. For now, just run it by double clicking it.

Putty Configuration
Wow. That's a lot of options. What the hell do I do now?

I promise you, it's very easy. In the "Host Name" box, you must type the host name of the server you are trying to connect to. Generally this will be zaphod (at the time of writing), our main box for members. However, "termisoc.org" redirects to Zaphod (or whatever our main box is), so type that in the Host Name field.

Now, we're going to be connecting using SSH, so make sure the "SSH" is selected under "Protocol". Putty should correctly guess that it should use port 22 to connect. Now you've got the important stuff entered (that's it!), hit "Open".

    Note:* If you are on Resnet port 22 *will not work*. This is because they don't trust students so pretty much every port is blocked. If you pull one of the exec aside at some point, we will absolutely not tell you of another port that is open on the Resnet firewall, and is quite definitely not set up on Zaphod for SSH, nudge nudge, wink wink. Honest. 

The terminal screen
That was easy. But what's this?

Putty should now pop up a nice empty black terminal window. If this is the first time you've connected, it's likely to pop up a warning about keys. Just click "yes" and it won't come back. Assuming everything is fine, Putty should be sitting there saying "login as:". This isn't very friendly, but is pretty self explanatory. Type in your termisoc username and hit enter, followed by your password. Note that nothing will appear when entering your password, but be assured it works.
Help! I didn't get a login prompt!

If you're having trouble connecting, odds are on the firewall on your PC is blocking Putty. Refer to your documentation on how to allow it. Anything else, come find one of the exec on IRC or the TermiList, and we'll see what we can do.
So I'm in. Now what?

That's it! You should have got the message of the day, and then be presented with a prompt, the use of which can wait for another day (If you're itching to get going, search the web for a tutorial on using Bash). For now, just type "ls" and hit enter. It should present you with the contents of your home directory on Zaphod. Try "users", to see who else is on the server.
Great. How do I get out of here?

To leave the server, you must exit the shell. Putty will detect this and close of its own accord. So, how do you quit the shell? Simple. Type "exit" and hit enter. Putty should disappear.
That's easy! But typing "termisoc.org" each time is a pain. Can I make it easier?

Sure. Fire up putty again, and fill in the fields, but don't hit Open. Instead, in the blank box under "Saved Sessions", type a name for the connection. In the picture, I've called it "termisoc". Now click "Save". From now on, you can just double click "termisoc" in the Saved Sessions list, and it will connect you to the server, easy as pie.

You can also change the URL to <username>@termisoc.org - that way you will only be prompted for your password. 
