---
type: research-decision
status: recorded
subject: "Evidence deduplication audit — Reddit and recently retrieved sources"
date: 2026-09-19
confidence: High
---

# Evidence deduplication audit — Reddit and recently retrieved sources

## Scope and method

This audit checked the recently retrieved TermiSoc Reddit, SlideServe, Arduino Forum, and DCGLUG records against `source/` and existing `research/` records. Duplicate factual summaries were cross-referenced rather than deleted, because each research record preserves source-specific provenance, retrieval date, and access conditions.

## Findings

### Literal duplication removed

- `research/sources/2026-09-19_termisoc-reddit-community-pass.md` contained two lists of the same directly inspected posts. The redundant list was removed; the detailed post summaries remain in the follow-up browser section.

### Corroborating records retained

- Freshers' LAN: the Reddit post is distinct from the 22-image Facebook-derived page at `source/freshers_lan_2012.md` and `source/termisoc_facebook_media.md`. The sources overlap in subject, but they are not interchangeable: Reddit provides announcement text and logistics, while the curated page records preserved photographs.
- Web tutorial: the Reddit tutorial-planning post is distinct from the SlideServe PHP/MySQL presentation and the preserved `~moose` transcript at `research/evidence/2026-09-17_tilde-mirror-review/moose-tutorial-slideserve.html`. The SlideServe and transcript records overlap heavily and should be treated as corroborating captures of the same presentation, not as separate events.
- IRC: the Reddit IRC post corroborates `source/termichat.md` and `source/connecting_to_irc_with_pidgin.md`, but supplies later community commentary and should remain a separate source record.
- TermiBot: the Reddit link corroborates the GitHub organisation record and `source/termibot.md`; it establishes the subreddit-to-repository link, not deployment or authorship. The records should remain separate.
- Arduino No. 13: the Arduino Forum thread overlaps the external-evidence and chronology material, but is a distinct contemporary third-party reference. The linked February 2012 announcement still requires retrieval before the event can be marked fully corroborated.
- DCGLUG messages: the newly recovered messages overlap infrastructure and person records, but the message records are the source-specific evidence and should not be collapsed into biographical summaries.

## Decision

The Reddit deduplication task is complete for the records checked. No evidence files were deleted, and no new historical claim was promoted into `source/` as part of this audit. Remaining duplication in older research records is intentional provenance repetition unless a future record-specific review identifies a literal duplicate copy that adds no access or source value.

## Unresolved questions

- [ ] TODO: Compare the SlideServe transcript and preserved `~moose` files line by line if a future publication edit needs exact slide-level provenance.
- [ ] TODO: Retrieve the linked Arduino No. 13 announcement before closing the event-corroboration task.

## Confidence

- **High:** The literal duplicate Reddit list was identified and removed; the remaining records have distinct source or provenance value.
- **Medium:** The cross-source mapping is sufficient for current research navigation, but does not constitute a complete repository-wide duplicate-content scan.
