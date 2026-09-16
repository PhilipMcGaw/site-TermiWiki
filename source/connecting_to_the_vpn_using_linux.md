---
title: "Connecting To The VPN Using Linux"
source: dokuwiki
source_path: "sites:termiwiki:connecting_to_the_vpn_using_linux"
created: 2023-01-01
tags:
  - "termisoc"
  - "relation"
  - "references"
  - "ils"
---
# Connecting To The VPN Using Linux

This isn't a proper tutorial yet - but there is one in the pipeline. Instead, this is an email sent to us by [ILS](Glossary/ils.md) that describes how to connect to the University VPN using a Linux box.

The actual message as posted to the TermiList can be found on the GMane archive
The Email

The VPN service uses the PPTP, MPPE and GRE protocols. As such you require a PPTP client, and I would suggest going to sourceforge for this:

      http://pptpclient.sourceforge.net/

The sidebar shows documentation for various Linux distros.

Users of older kernels, pre-2.6.15, will need to pay attention to the MPPE and PPP support sections. Users of anything after this, which basically means any distro from the past two or three years, can ignore those parts as the kernel and pppd package automatically includes MPPE support.

Follow the instructions relevant for your distro. Some may seem out of date, for example it mentions 'Fedora Core 6' but nothing after that. That does not matter, it just means that the instructions have not changed since then.

For the VPN server DNS name you need to use 'vpn.plymouth.ac.uk'. The 'authentication domain name' can be left blank, in which case do not include the '
' characters, or it can be set to 'UOPNET'. You will need to use encryption (128-bit).

Ii is recommended to include a specific network route such that all 141.163.0.0/16 (UoP) traffic goes down the VPN tunnel.

Debian users may also want to look at the Ubuntu documentation at https://help.ubuntu.com/community/VPNClient as this includes information which may now be relevant to Debian. It uses the NetworkManager to create the VPN tunnel, and, since it uses a graphical interface, is somewhat easier than using the command line.

For users of RPM-based distros - redhat, fedora, mandriva, centos etc - basically what is required is the 'pptpconfig' GUI. It should be fairly straight-forward how to create the VPN tunnel using this interface.

I have created VPN tunnels using the Ubuntu and FC6 instructions with no problems.
Comments

(I'm going to try this on my Kubuntu box when I get a moment, I'll write about my experience here). danbjorn

FWIW, everything worked pretty smoothly for me (on Debian Sid). Just follow the instructions. For reference, the command to add a new route is route add -net 141.163.0.0/16 ppp0. bma 
