---
type: evidence-bundle
status: review
subject: "Publicly retrievable derivatives of TermiSoc historical tilde spaces"
date: 2026-09-17
source_type: web-archive-and-third-party-reproduction
confidence: High
---

# Tilde-space review bundle

This directory is a **research-only review bundle**. It is not a source-vault media import and must not be published or treated as a complete backup of the historical TermiSoc server. Files were retrieved on 17 September 2026 from the public URLs recorded below.

## Retrieved material

| Local item | Original TermiSoc relationship | Public source | What it directly establishes |
|---|---|---|---|
| `moose-tutorial-slides/` (16 JPEGs) | `~moose/tutorials` | [SlideServe PHP/MySQL tutorial](https://www.slideserve.com/matteo/mysql-and-php-tutorial-powerpoint-ppt-presentation) | A preserved 16-slide tutorial attributed to David Pithouse, identified on-slide as “Termisoc Secretary”, and referring to `~moose/tutorials`, `scary.txt`, `mysql1.php`, `phpmyadmin.termisoc.org`, and `termisoc@termisoc.org`. |
| `moose-tutorial-slideserve.html` | Same as above | Same SlideServe page | The downloaded HTML/transcript from which the slide URLs were recovered. |
| `betty-mail-archive.html` | `~betty` | [Mail Archive message](https://www.mail-archive.com/london-pm%40lists.dircon.co.uk/msg02279.html) | A 2001 Aaron Trevena message carrying the `http://termisoc.org/~betty` link in its signature. It is evidence of the URL, not a copy of the `~betty` site. |
| `andyk-chemfan-wikibooks.html` | `~andyk/chemfan/` | [Wikibooks ChemFan reference](https://en.wikibooks.org/wiki/Chemical_Information_Sources/SIRCh/Chemistry_Blogs_and_Discussion_Groups/Listserves%2C_Discussion_Lists%2C_and_Newsgroups_for_Chemistry) | A reference to the English-language ChemFan page and related TermiSoc Mailman addresses. It is not a copy of the `~andyk` directory. |
| `mooseblaster-guru-meditation.gif` | `mooseblaster.termisoc.org` (not a `~` directory) | [Wikimedia Commons file attribution](https://commons.wikimedia.org/wiki/File:Guru_meditation.gif) | A 652×93 GIF publicly preserved with historical attribution to `http://mooseblaster.termisoc.org/404.htm`. It does not establish that `mooseblaster` and `~moose` were the same account. |

## Not retrieved

- `~harl/tranqs.html`: Erowid rejected an ordinary direct retrieval with HTTP 403, so no local copy was taken. However, a user-opened browser session visibly confirmed the page title *Barbiturates and Tranquilizers*, the byline `by Harl`, the statement `Archived from http://www.termisoc.org/~harl/tranqs.html`, and Erowid's footer `Archived by Erowid with permission of Author`. The review link remains [Erowid’s archived page](https://erowid.org/chemicals/barbiturates/barbiturates_info2.shtml). This is a page-level preservation, not evidence of a complete `~harl` directory mirror.
- `~j/files/example.xls` and `~j/files/SWdata.xls`: live URLs return 404 and no successful Internet Archive or Arquivo.pt capture was found.
- No complete `~username` directory listing or server-wide mirror was found.

## Integrity

SHA-256 checksums for the four top-level retrieved files:

```text
e3d35888b520bb2736d14bba648d8915a351cb16e10cf979dad0548b3c2aef17  andyk-chemfan-wikibooks.html
90c35e97b6b86bcc9a26f08cf30eccb3f0661edcb25433dfbabf71876d864803  betty-mail-archive.html
1adbcff4ea574cdd79c379640b560913dd69c79e2f1b3e301f072ff8d01878a4  moose-tutorial-slideserve.html
2447bf8991b774ecfe44a30881b80abddced86843b1e66ccc6da6c0f2b0a2a5e  mooseblaster-guru-meditation.gif
```

Each JPEG in `moose-tutorial-slides/` was checked as a 1024×768 JPEG after retrieval. The complete bundle is approximately 1.4 MB.

## Interpretation

The `~moose` tutorial is the only currently recovered substantial content set from a TermiSoc personal web space. The other saved artefacts preserve provenance, references, or a related graphic rather than a mirrored user directory.

## Open questions

- Can an authorised user obtain an export or accessible capture of Erowid’s `~harl` derivative?
- A 17 September 2026 exact-path search for `termisoc.org/~harl/` and `www.termisoc.org/~harl/` returned only `tranqs.html`. This is **Low** confidence evidence that no further `~harl` pages are presently indexed; it is not evidence that no other pages existed.
- Does any former TermiSoc member retain the `~j` workbooks or an old home-directory backup?
- Can University of Plymouth, UPSU, or the UK Web Archive locate server-level preservation?

## Publication impact

No files in this bundle should be moved into `source/` or published without a separate provenance and rights review. The bundle supports the existing infrastructure and David Pithouse research records.
