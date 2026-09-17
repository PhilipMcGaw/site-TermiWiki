---
title: Zaphod
source: dokuwiki
source_path: sites:termiwiki:zaphod
created: 2023-01-02
tags:
  - termisoc
  - servers
  - relation
  - references
---
Zaphod was installed on the 2nd of May 2006, replacing Arthur, and passed away unexpectedly during the start of the 2010-11 academic year. Vroomfondel was hastily constructed and brought into service to replace him.

Zaphod was the main login server, providing shell and web access. He also hosted non-excessive projects and probably a few excessive ones too (* cough * CamCrew * cough *).

He sported PHP5 with CGI-PHP4 backwards compatibility, MySQL and PostgreSQL databases, Ruby, Perl, Python, and so on.

He also self-claimed how much cooler he was than any other server on PlymNet. In fact, so cool, you could keep a side of meat in him for a month. So hip, he had difficulty seeing over his own pelvis. He should be with all those fans we put in him. ;)

## Zaphod Mk. 1 Specification

    CPU: AMD Duron 1.2Ghz (welded onto board)
    Hard Disk(s): 1 x Seagate 200GB, 1 x Seagate 20GB)
    RAM: 768MB DIMM (1 x 512MB, 1 x 256MB)

This server was actually built into an old black 3U rack-mounted cabinet with 7 fans (including 4 just to cool the hard drives!) and glowy blueness… sadly no dual-heads though. Plans to build two motherboards into this case were greatly exaggerated.

Elements of it were the mythical server Kumquat, which was originaly built for [UPSU:Radio](upsu_radio.md).

However, something dawned on us a couple of days before we were to install it: Zaphod wasn't much better than [Arthur](arthur.md) specs-wise. When you're installing a new server, it's always nice to upgrade a machine rather than just replace it for no reason - plus we realised that the cooling would suck due to the monitor having to go on top. So…

## Zaphod Mk. 2 Specification

    CPU: AMD Sempron 2400+
    Hard Disks: 1x Seagate 200GB, 1 x Seagate 20GB, 1 x Western Digital 40GB)
    RAM: 1GB DIMM (2 x 512MB)

Our shiny black server, with a new reformed sense of cool. It's like 'none more black'.

Luckily, we were (nearly) able to just install the hard drives from Mk. 1 and turn it on, except the drivers weren't loaded properly (initrd problem) so a quick play using Knoppix fixed it.

It doesn't sport a blue glow, it has one less fan (there isn't a fan pointed over the RAM like Mk. 1), and it ain't rackmountable, but it's still 1.5x faster and that's what counts to you, the discerning user.

Zaphod runs Debian GNU/Linux (the "Stable" distribution, currently named Lenny).
