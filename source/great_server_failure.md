---
title: "Great server failure"
source: dokuwiki
source_path: "sites:termiwiki:great_server_failure"
created: 2023-01-01
tags:
  - "termisoc"
  - "myths_legends"
  - "relation"
  - "references"
  - "david_pithouse"
  - "apple"
  - "daved"
  - "ben_a_lee"
  - "orange"
  - "area51_website"
  - "rich_jeffery"
  - "gemma_peter"
  - "ils"
  - "termisoc_cupboard"
  - "arthur"
  - "babbage_building"
  - "banana"
  - "dan_cosser"
  - "philip_mcgaw"
  - "trillian"
  - "the_cd_library"
  - "ford"
---
# So, what happened?
Right, let's start at the top. In 2004, [Dave](TermiPeople/david_pithouse.md) installed a basic backup system for Apple which gzipped everything up into a file so it could be recovered if anything went wrong. To be honest, its primary function was less of a backup system in case anything hardware-wise went wrong with the servers, it was primarily a restore point system for when anything [Daved](Glossary/daved.md). There were two major flaws with this backup system:
- It was a single gzip file, so every day it just backed-up onto itself; and
- the backups were held on the **actual** hard drive it was backing up. 

Now, skip forward to the evening of Friday, the 27th of May 2005:

[Ben](TermiPeople/ben_a_lee.md) notices the big gaping problems with the server backup system. The exec has a chat and concludes the best way to run the backups is to transfer them onto Orange each day, on a 7-day cycle of files. We decide that we shall begin doing that on Tuesday, due to an upcoming bank holiday weekend.
28/05/2005

In the morning, odd things start occurring on the websites. Some websites are fine, some are not appearing, and things like this [website](area51_website.md) are fritzing out with database errors all over the place. [Ben](TermiPeople/ben_a_lee.md), [Rich](TermiPeople/rich_jeffery.md) and [Gem](TermiPeople/gemma_peter.md) try to SSH in, only to find that Apple was refusing SSH connections. This is a major, MAJOR headache because we have a single solitary problem standing in our way to try and access the servers. It's a Saturday.

Not only a normal, every day Saturday, but a Bank Holiday Saturday. And the staff of [ILS](Glossary/ils.md) don't work on Bank Holiday Mondays. Something similar to Rollocks springs to mind. So, the server goes down and there's nothing we can do to cure the problem. So, in an aid to let people know what's going on and to make sure nothing is lost, Orange is set-up with a page explaining what's happening and a mail server to grab any e-mails coming in. The DNS records are then re-pointed, and the burden is taken off Apple, so it can sit there quietly and not churn itself up any further.

## 31/05/2005
It's Tuesday, and we can finally get into the [Cupboard](termisoc.md). We are delighted to find there is no smoke or flood damage, but to be honest that would have been a blessing compared to what we found. Turning on the monitor to be greeted with endless lines of 'read failure', 'bad sector', 'error reading…' was **really not** what we hoped for. Apple is disconnected and taken to [Gemma's](TermiPeople/gemma_peter.md) for further diagnostics. Oh, and a hard drive was bought because it was blatantly obvious that a new hard drive was needed to bring the server back to life.

We analysed what we had. We concluded that one head on the drive had gouged a pretty Spirographesque pattern into one of its platters, a symptom of a hard drive that's been running constantly for over 9000 hours. We checked how much it would cost to repair it at the nearest hard drive restoration company. It had three figures and started with an 8 for a reasonable timescale in the South West. We went slightly hysterical.

Anyway, we installed the new hard drive (and a bit of new RAM too), and installed Fedora Core 3. [Ben](TermiPeople/ben_a_lee.md) and [Gem](TermiPeople/gemma_peter.md) lose their rags over how difficult it was to install apt4rpm. Install Debian (which was opposed by [Rich](TermiPeople/rich_jeffery.md) after long discussions between exec and members over the past weeks that Debian would not be installed when the next server upgrade occurred. In fact, I recall it was a majority vote of 5 to 2, with [Ben](TermiPeople/ben_a_lee.md) and [Gem](TermiPeople/gemma_peter.md) opposed. The cheeky gets).

Anyway, after installation, the server was dumped off with [Ben](TermiPeople/ben_a_lee.md) so he could set about trying to recover data. Trouble is, he forgot to pick up the power cable, so wouldn't be able to sort anything until he got one. But by the 6th, the server was back in its rightful home but re-branded [Arthur](arthur.md).

I really wish I could say that was the end of the story, but unfortunately, it's not.

# Early June 2005
Now, obviously, there was something funny in the electricity down in the [Building](Glossary/babbage_building.md) because it wasn't long before Banana went the way of Apple before it. It started with a simple upgrade from Debian Woody to Debian Sarge, with the slight snag that LILO didn't get run after the new kernel was installed. Cue running across campus to get to it before 5pm. [Dan](TermiPeople/dan_cosser.md) and [Ben](TermiPeople/ben_a_lee.md) took it to [Skippy](TermiPeople/philip_mcgaw.md)'s to borrow an AT keyboard; [Skippy](TermiPeople/philip_mcgaw.md) expressed concern about the noises that the hard drive made. And, true to form, the very next morning…

However, upon investigation we found it to be cheaper to buy a second-hand computer than buy a small brand-new hard drive. So, Banana was sadly retired (to be honest, the howling of the old exec was starting to grate on the ears anyway) and Trillian took her place as the new (unfortunately pre-built) DNS server.

# Mid - August 2005
Now, this is just getting ridiculous. No sooner had we fixed Banana than Orange goes the same way. But (sort of) luckily for us, there was hardly anything on Orange that hadn't got backups (even [CD Library](the_cd_library.md) survived, though hasn't been re-installed yet). Also, it meant that it could get the spring clean we had been promising it for a very long time (due to some glitches in the system, it could only run 2.2 kernel. Now it's shiny 2.6!). During this period, it was re-christened, Ford. It ended off the worst up for upgrades with only a new-ish hard drive installed, but it gives us a nice conclusion to this peculiar and basically hard-to-believe tale in the TermiSoc story.