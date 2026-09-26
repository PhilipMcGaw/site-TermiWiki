---
title: tSNIPS
source: dokuwiki
source_path: sites:termiwiki:tsnips
created: 2023-01-02
tags:
  - termisoc
  - projects
  - relation
  - references
aliases:
  - ../tsnips
---
tSNIPS is the TermiSoc Network Integrated Password System being implemented for the TermiSoc servers. It consists of a PostgreSQL-8.1 user database and a collection of applications to manipulate that database.

Stuff we're going to keep in this database
- Everything traditionally kept in /etc/passwd:
- Username
- Password
- Shell
- Home directory 
- Servers the user is authorised to access. (This will enable us to allow a user to connect to another server in seconds, rather than setting up a completely separate account).
- TermiSoc-specific data, like UPSU membership number, UoP e-mail address. 
- We'd also like to set up NFS or some other network filesystem, so that users only have one homedir no matter which server they're connected to; this would also make mail handling simpler since it would always go into the right mailbox
- there'd only be one mailbox per user. 
