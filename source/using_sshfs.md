---
title: "Using SSHFS"
source: dokuwiki
source_path: "sites:termiwiki:using_sshfs"
created: 2023-01-02
tags:
  - "termisoc"
  - "relation"
  - "references"
  - "ils"
  - "connecting_to_the_vpn_using_linux"
  - "zaphod"
---
This is a quick tutorial on how to use SSHFS: a wonderful file-system driver that allows you to use your Termisoc space as if it was a drive on your computer.

As of September 2009 it's only possible to connect to the SSH port from within the University's firewall. This can be achieved either by using a computer connected to the University's network or through a VPN connection, [ILS](Glossary/ils.md) provide instructions for creating a VPN connection on Windows and Mac OSX at [http://www.plymouth.ac.uk/roaming](http://www.plymouth.ac.uk/roaming) while the wiki has [To The VPN Using Linux](connecting_to_the_vpn_using_linux.md).

For this tutorial I will be using Ubuntu 7.10 Gutsy Gibbon, but it should work on any Linux system that supports FUSE. No Windows I'm afraid.

Installing SSHFS
Install the sshfs package using your preferred method. I use the graphical Synaptic front-end, but

    $ sudo apt-get install sshfs

will work fine. Fuse, if not installed already, will happily install itself alongside sshfs.
Fiddling with Permissions

The tricky part of using sshfs is getting the permissions right. For this I'm going to assume it's just you who wants to connect using sshfs. Extrapolate out using groups if you wish to make sshfs available for all users.
Firstly, you'll need to create a mount point. Pop open a terminal and use sudo to become root:

    $ sudo -i
    # 

(just enter your regular password when prompted) and then navigate to the /mnt directory:

    # cd /mnt

Create a folder there, naming it appropriately:

    # mkdir zaphod

You need to have permissions on the folder in question, so that a regular joe user like yourself can mount and access it. We'll use chgrp to add the folder to the 'fuse' group, and then add ourselves to that group. Using this method means that several users could use the same mount point. Replace 'danbjorn' with your own username.

    # chgrp fuse zaphod
    # adduser danbjorn fuse

In order for the group change to propagate we must logout; but before we do that, we'll test it. Exit from being root, and then cheat by using su to login as yourself:

    # exit
    $ su - danbjorn
    Password:
    $

This fakes adding yourself to the relevant groups, but this change won't propogate to other terminals. It works well enough for testing however.
Connecting/Mounting

Let's connect to [Zaphod](zaphod.md).

    $ sshfs termisoc.org: /mnt/zaphod
    Password:
    $

If prompted to approve the key, just type 'yes' and hit enter. Assuming no errors, let's navigate to the mount point:

    $ cd /mnt/zaphod
    $ ls
    mail   public_html   ....

Wow! Isn't that cool? You can read, write and screw around with files as if they were on your hard-drive, albeit a bit slower.
Disconnecting/Un-Mounting

When you're done, you need to un-mount the driver. Ensure you're not using the folder in anyway (make sure Nautilus hasn't got a window open, or any text editors have open files), then:

    $ fusermount -u /mnt/zaphod
    $ cd /mnt/zaphod
    $ ls
    $

And so the folder appears empty again. If you can't ls the folder, or it starts behaving odd, it probably hasn't unmounted properly. Double check every possibility and then try again.
Troubleshooting

If you're having problems, they're normally either down to some failing of SSH (check the cable is plugged in and you have a net connection etc) or you have a problem with permissions. If you're followed the steps above, then as long as you are a member of the fuse group then you should be able to do what you want. Check which groups you belong to with the 'groups' command:

     $ groups
     danbjorn cdrom floppy admin fuse
     $

Make sure 'fuse' is in the list.

SSHFS is a very popular tool; look around the net a bit for help, and check the resources listed below. Also consider asking us, as some of us have used it before. At the very least we could probably point you in the right direction.
Resources

    SSHFS home - https://web.archive.org/web/20120106075834/http://fuse.sourceforge.net/sshfs.html
    FUSE wiki - https://web.archive.org/web/20120106075834/http://fuse.sourceforge.net/wiki/
