---
title: Archive recovery pass 2
status: research
created: 2026-09-17
confidence: medium
---

# Archive recovery pass 2

## Source

Search performed 17 September 2026 against indexed web material for exact historical TermiSoc asset paths and archive traces.

Key sources:

- Sublime Forum discussion preserving two exact TermiSoc wiki image URLs: `http://termisoc.org/wiki/uploads/d/d3/Scrn1.jpg` and `http://termisoc.org/wiki/uploads/a/a5/Scrn2.jpg`.
- SlideServe transcript preserving the historical `~moose` tutorial paths and `phpmyadmin.termisoc.org`.
- A 2001 academic-web study, *Small-World Link Structures across an Academic Web Space*, which reports that 99.0% of the sampled SCC university sub-sites were identified in the Internet Archive. The study is not itself evidence that a particular TermiSoc URL was archived, but it provides a useful methodological reason to continue URL-specific Internet Archive archaeology.

## Direct evidence

The exact wiki image URLs remain recoverable as historical references, but no archived image binary was obtained during this pass. The current search index only exposes the URLs through the 2016 Sublime Forum post.

The academic-web study reports that, within its 2001 UK academic-web dataset, 1,874 of 1,893 SCC sub-sites were identified in the Internet Archive (99.0%). It also reports an overall 89.6% identification rate across 7,669 investigated sub-sites. This is methodological evidence about Internet Archive coverage, not direct evidence about TermiSoc.

## Interpretation

The lack of a search-indexed Wayback result for the exact TermiSoc assets does not establish that the assets were never archived. Search-engine indexing and archive CDX enumeration are different evidence channels.

The strongest next step is therefore not another generic web search. It is exact URL/prefix enumeration against archive indexes, followed by retrieval of any surviving HTML, images, downloads, or directory-linked pages.

## Open questions

- Are `Scrn1.jpg` and `Scrn2.jpg` present in the Internet Archive under any capture timestamp?
- Was `termisoc.org/wiki/` captured as a MediaWiki site, and can its page history or image metadata be recovered?
- Were `~moose`, `~betty`, `~j`, `~andyk`, `lug.termisoc.org`, or `area51.termisoc.org` captured independently?
- Can archive indexes expose additional filenames that are no longer mentioned by search engines?

## Publication impact

No new historical claim about TermiSoc has been promoted into `source/`. This record exists to document the archive-recovery state and prevent repeated searches from being mistaken for successful asset recovery.

## Sources

- https://forum.sublimetext.com/t/build-system-to-run-in-cmd-exe/6149
- https://www.slideserve.com/matteo/mysql-and-php-tutorial-powerpoint-ppt-presentation
- https://www.researchgate.net/publication/200110955_Small-World_Link_Structures_across_an_Academic_Web_Space_A_Library_and_Information_Science_Approach
- https://doczz.net/doc/183631/small-world-link-structures-across-an-academic-web-space
