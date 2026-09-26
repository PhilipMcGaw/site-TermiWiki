---
title: "Connecting To IRC With Pidgin"
source: dokuwiki
source_path: "sites:termiwiki:connecting_to_irc_with_pidgin"
created: 2023-01-01
tags:
  - "termisoc"
  - "relation"
  - "references"
  - "termichat"
---
# Connecting To IRC With Pidgin

Pidgin is a wonderful Instant Messenger client (it used to be called gAIM until AOL got on their back in 2006), and with some poking, it can fake being an IRC client as well. As it's a client that a lot of people use anyway, this tutorial will walk you through connecting to (and using) [TermiChat](Projects/termichat.md) through Pidgin.

## Installation
- First, if you have not already done so, get the latest version of Pidgin from www.pidgin.im and install it. If you're still using Gaim, upgrade!
- Next, nip over to here and grab the latest Purple Plugin Pack for your platform (For Linux, the major distros have packages in their repositories called pidgin-plugin_pack (for Pidgin only) or purple-plugin-pack (for all UIs that use purple) but you may have to compile the plugin yourself using the downloads on the site) This is a pile of plugins for Pidgin, and whilst you can use IRC without it, we recommend it.
- From the Plugin Pack, get the irchelper plugin and install it.
- For Windows, this means copying the irchelper.dll file into your plugins directory, probably C:\windows\pidgin\plugins.
- For Linux - package managers will have auto-installed them or you'll have to compile it. 

### Setting up Pidgin
- Start Pidgin. Go to Tools -> Plugins and activate the IRC Helper plugin.
- Go to Accounts -> Manage and click 'Add' to create a new account.
- Choose 'IRC' as the protocol, and 'chat.termisoc.org' as the server. Pick yourself a screen name. (If you've used chat.termisoc.org before, use your old screen name and jump straight to 'Automatically identifying yourself').
- Click 'Save', and Pidgin will connect you to the server. 

Odds are on the first person to talk to you will be NickServ, OFTC's all-seeing eye of nicks, who will complain about your nick.

This is because, on OFTC at least, you should always identify yourself. This helps prevent fraud and nick-stealing, and is so easy you might as well.
Registering with NickServ

In the conversation window that NickServ opened, type 'register <password> <email address>', replacing the obvious.

You will then be able to identify yourself with 'identify <password>', but typing that every time is a pain, so let's automate it.

Go to Accounts -> Manage and modify the IRC account. Under the 'Advanced' tab, enter 'NickServ' for 'Auth Name' and your password for 'Nick Password'. Now, whenever you connect to IRC, Pidgin will automatically identify you.
Joining the Chatroom

In order to speak to anyone, you must join the #termisoc channel.

To do this:

    Goto Buddies -> Add Chat.
    Make sure the IRC account is selected, and enter '#termisoc' for 'Channel'.
    If you wish to automatically connect to the room when you sign in to IRC, click the 'Autojoin' checkbox.
    Finish by clicking 'Add'. 

Now you can double-click #termisoc to join us in the nattering. 
