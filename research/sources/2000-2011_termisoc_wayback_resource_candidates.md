---
type: source
status: reviewed
subject: "Wayback resource candidates for TermiWiki preservation"
source_type: web-archive-cdx
retrieved: 2026-09-17
---
# Wayback resource candidates for TermiWiki preservation

A CDX inventory of `termisoc.org` and its subdomains identified the following candidates. Local comparison found that several are not currently present in `source/Media/`.

## Recommended first grabs

These are small, clearly relevant, and likely to add documentary value:

1. **Scheme tutorial** — [Schemetutorial08.pdf](https://web.archive.org/web/20090107085635id_/http://wiki.termisoc.org/uploads/7/71/Schemetutorial08.pdf), captured 7 January 2009, 114,279 bytes. A WikiHistory upload that may preserve tutorial material.
2. **TermiSoc 2003–04 document** — [tsoc304.pdf](https://web.archive.org/web/20030612010850id_/http://area51.termisoc.org/~bramley/tsoc304/tsoc304.pdf), captured 12 June 2003, approximately 339 KB. The filename and path suggest a TermiSoc document associated with the 2003–04 period; contents should be checked before classification.
3. **2007 LAN documents** — [LAN October 2007](https://web.archive.org/web/20090107122711id_/http://www.termisoc.org/events-1/lan%20oct%202007.pdf), 121,446 bytes, and [Winter LAN poster](https://web.archive.org/web/20090107121301id_/http://www.termisoc.org/events-1/winterlan%20a4%20for%20web.pdf), 128,621 bytes. These may provide dated event evidence and promotional artwork.
4. **2004 membership form** — [CPAAmembershipform.pdf](https://web.archive.org/web/20040615141104id_/http://www.termisoc.org/~cpaa/CPAAmembershipform.pdf), captured 15 June 2004, 103,072 bytes. Check for personal-data fields before preservation or publication.
5. **Early executive portraits** — the CDX index contains images for the 2003–04 executive at `termisoc.org/termisoc/exec0304/dragon.jpg`, `moose.jpg`, and `ryan.jpg`, plus earlier executive and member images. These should be matched against existing profiles before adding duplicates.

## Worth checking, but compare first

- The 2006 Constitution and Security Policy files may be alternate versions of documents already present locally. Compare hashes and content before downloading duplicates.
- `termisoc.org/termisoc/images/` contains older portraits and graphics, including `alexm.gif`, `alexs.gif`, `chas.gif`, `hal.gif`, `jasong.gif`, `jiff.gif`, `penf.gif`, `rictus.gif`, and `steves.gif`. Some may already exist locally under `source/Media/`.
- The 2005 `~aande` collection contains a TermiSoc image, an UPSU logo, a kit-list photograph, and several personal photo galleries. These may be valuable, but context, consent, and personal-data considerations should be checked first.
- Archived `Constitution.pdf` and `Security Policy.pdf` copies also appear on several later member subdomains. These are probably replicated files, not separate evidence.

## Large or technically sensitive resources

- The project owner has confirmed that the podcast.termisoc.org and morris.termisoc.org media is cleared from a copyright perspective. These files may therefore be preserved selectively, with source URLs, capture dates, checksums, and file metadata. The archived `TermiSoc_LOGin_05.mp3` replay was checked and is byte-for-byte identical to the existing local `termisoc_login_05.mp3`, so no duplicate was retained. Their size and any personal content should still be considered before bulk retrieval.

- Various .zip, .tar, .exe, database, and project files may contain useful technical archaeology, but should be downloaded individually after identifying their contents and relevance.

## Method

The candidates came from the Wayback CDX API using a domain query for `termisoc.org` and subdomains, limited to HTTP 200 responses and filtered by MIME type. The CDX API supports domain and prefix matching, date ranges, filters, collapsing, and pagination.[^cdx]

[^cdx]: Internet Archive, [Wayback CDX Server API documentation](https://github.com/internetarchive/wayback/blob/master/wayback-cdx-server/README.md), retrieved 17 September 2026.