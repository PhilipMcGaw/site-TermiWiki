---
title: "TermiSoc historical username-space archaeology — pass 1"
date: 2026-09-17
status: research
confidence: medium
---

# TermiSoc historical username-space archaeology — pass 1

## Source

Web search performed 2026-09-17 against indexed historical material for URLs and references matching `termisoc.org/~...` and `www.termisoc.org/~...`.

Primary/relevant sources recovered:

- MHonArc Users archive, November 1999: `https://www.mhonarc.org/archive/html/mhonarc-users/1999-11/msg00067.html`
- Wikibooks chemistry information sources page: `https://en.wikibooks.org/wiki/Chemical_Information_Sources/SIRCh/Chemistry_Blogs_and_Discussion_Groups/Listserves%2C_Discussion_Lists%2C_and_Newsgroups_for_Chemistry`
- Mail-Archive London Perl Mongers search for Aaron Trevena: `https://www.mail-archive.com/search?f=1&l=london-pm%40lists.dircon.co.uk&o=newest&q=from%3A%22Aaron+Trevena%22`
- PC Review, 10 November 2003: `https://www.pcreview.co.uk/threads/search-and-replace-9000-times.958365/`
- Erowid, archived Harl page: `https://www.erowid.org/chemicals/barbiturates/barbiturates_info2.shtml`
- SlideServe copy of David Pithouse's PHP/MySQL tutorial: `https://www.slideserve.com/matteo/mysql-and-php-tutorial-powerpoint-ppt-presentation`

## Direct evidence

The pass did not recover a clearly new personal namespace that can currently be attributed to a previously unknown person. It did, however, strengthen the evidence for several already-known namespaces:

### `~andyk`

The Wikibooks chemistry reference explicitly records the English-language ChemFan page at `http://www.termisoc.org/~andyk/chemfan/`, together with the TermiSoc-hosted Mailman subscription address `chemfan-request@termisoc.org` and the TermiSoc list-management URL.

A 1999 MHonArc Users message also quotes the ChemFan archive at `http://www.termisoc.org/~andyk/chemfan/archive/threads.html` and discusses its MHonArc configuration. This is useful because it shows that the `~andyk` namespace was not merely a page reference: it hosted an archive for a mailing-list service.

Identity of `andyk` remains unresolved. Do not expand the alias to a person's full name without further evidence.

### `~moose`

The David Pithouse PHP/MySQL tutorial preserves multiple references to `http://www.termisoc.org/~moose/tutorials`, including a concrete filesystem path `/home/hons/moose/public_html/tutorials/mysql1.php`. The same presentation identifies David Pithouse as TermiSoc Secretary. This strengthens the existing `~moose` → David Pithouse mapping and provides evidence that the namespace corresponded to a university-style home directory/public_html account.

### `~j`

The November 2003 PC Review discussion preserves two files under `http://www.termisoc.org/~j/files/`: `example.xls` and `SWdata.xls`. The identity of `j` remains unresolved.

### `~harl`

Erowid records that its barbiturate/tranquilliser page was archived from `http://www.termisoc.org/~harl/tranqs.html`. The alias remains unresolved. The underlying historical content is sensitive and is not reproduced here.

### `~betty`

The London Perl Mongers archive contains repeated 2001 signatures linking Aaron Trevena to `http://termisoc.org/~betty` and the label `Betty @ termisoc.org`. This was already known and is included here only as a namespace cross-check, not as new evidence.

## Interpretation

The indexed evidence supports a picture of TermiSoc providing Unix-style per-user web namespaces, apparently backed by university-style home directories (`/home/hons/<username>/public_html/`) and used for both personal pages and externally visible services.

The `~andyk` evidence is particularly useful because the namespace hosted a web-accessible MHonArc archive associated with ChemFan. This demonstrates that the historical username space could support more than simple personal home pages: it could also host service/application content associated with a mailing list.

The evidence does **not** establish that all content under `termisoc.org/~username` was TermiSoc-owned work. As with Aaron Trevena's `~betty` namespace, hosting location and domain membership must be kept separate from project ownership.

## Corroboration

The pass cross-checks the previously recovered namespace set:

- `~betty` — Aaron Trevena
- `~moose` — David Pithouse
- `~andyk` — identity unresolved; ChemFan archive
- `~j` — identity unresolved; spreadsheet files
- `~harl` — identity unresolved; archived personal page

No reliable new mapping was found for the other previously identified aliases during this pass.

## Open questions

1. Who was `andyk`?
2. Who was `j`?
3. Who was `harl`?
4. Can the old web directory or search indexes reveal additional `termisoc.org/~username` paths not surfaced by normal search engines?
5. Can the ChemFan archive expose author/signature information sufficient to identify `andyk`?
6. Can historical TermiSoc or D&C LUG mailing-list archives reveal additional usernames through message signatures, Reply-To addresses, or home-page links?
7. Can the old `termisoc.org` Wiki or directory listings be recovered from web archives to enumerate namespaces systematically?

## Publication impact

No new person should be added to the published TermiSoc people list from this pass. The `~andyk`, `~j`, and `~harl` aliases remain useful unresolved leads. The `~andyk` MHonArc evidence should be considered when reconstructing TermiSoc's historical hosted services and username-space architecture.
