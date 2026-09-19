# TermiWiki TODO

This file is the repository-level working queue for TermiWiki historical archaeology, preservation, and site-maintenance tasks.

GitHub Issues remain the authoritative place for issue discussion and implementation status where an issue exists. This file is deliberately more portable: it can be read from a local checkout, VS Code, Obsidian, another computer, or by another contributor/agent without requiring GitHub issue access.

## Working conventions

- Preserve source provenance. Record the original URL, retrieval date, and enough context to identify what was actually observed.
- Distinguish **primary evidence**, **secondary interpretation**, and **research leads**.
- Do not silently promote an inaccessible or unverified source to established fact.
- Preserve uncertainty explicitly using the project confidence vocabulary: **High**, **Medium**, **Low**, **Unverified**.
- Preserve historical names and terminology where they are part of the source; use current names where appropriate for present-day identity, with a clear cross-reference.
- Keep the distinction between **TermiSoc**, the later **Computing & Gaming Society**, and the subsequent **Geek Society** explicit.
- New research belongs in `research/`; curated historical knowledge belongs in `source/`.
- Public media referenced by the curated vault belongs in `source/media/`; restricted research-only media belongs in `research/media/`.
- `site/` is generated Quartz output and must not be hand-edited.
- For existing repository files, fetch the current blob SHA before making an update.
- Prefer small, focused commits.
- Do not deploy unless explicitly requested.

---

## 1. Create TermiSoc favicon and site icon set

**GitHub Issue:** #1 — Create TermiSoc favicon and site icon set  
**Status:** ☐ Open — implementation and live asset verification complete; GitHub follow-up outstanding
**Type:** Desktop/repository implementation

### Objective

Create a functional, historically appropriate TermiSoc favicon and site-icon set using the existing TermiSoc profile/Twitter artwork already preserved in the repository.

### Confirmed master artwork

The correct historical artwork has been identified at:

`source/Media/branding/termisoc_profile_image.png`

This is the TermiSoc profile/Twitter artwork the user wants to use as the master artwork.

The repository also contains historical references to `media/weare_weblogo.png` in `source/termisoc.md`, but the profile/Twitter artwork above is the selected master for this task. Do not invent a new TermiSoc mark for the favicon work.

### Required work

- [x] TODO: Pull/update the local desktop repository checkout before processing the binary asset.
- [x] TODO: Inspect `source/Media/branding/termisoc_profile_image.png` at full resolution.
- [x] TODO: Confirm that the artwork survives reduction to favicon dimensions without losing its identifying features.
- [x] TODO: Generate `favicon.ico` containing appropriate legacy sizes, as supported by the chosen tooling.
- [x] TODO: Generate 16×16 PNG icon.
- [x] TODO: Generate 32×32 PNG icon.
- [x] TODO: Generate 180×180 Apple touch icon.
- [x] TODO: Generate 192×192 PNG icon.
- [x] TODO: Generate 512×512 PNG icon.
- [x] TODO: Generate a maskable 512×512 icon if the source artwork and padding make this appropriate.
- [x] TODO: Add/update `site.webmanifest` as required by the Quartz/site architecture.
- [x] TODO: Verify the existing Quartz `Plugin.Favicon()` configuration and use the supported Quartz mechanism rather than hand-editing generated `site/` output.
- [x] TODO: Add the appropriate favicon/web-app declarations through the source/configuration layer used by this repository.
- [x] TODO: Ensure paths are correct in the generated site.
- [x] TODO: Test the generated site locally.
- [x] TODO: Check browser tab/favicon declarations and live asset behaviour.
- [x] TODO: Check Apple touch icon declaration and live asset path; device installation remains untested.
- [x] TODO: Check manifest/icon paths directly.
- [x] TODO: Confirm that the favicon implementation is independent of any future redesign of TermiSoc artwork.
- [ ] TODO: Record the implementation and verification result in GitHub Issue #1.
- [ ] TODO: Close Issue #1 only after implementation and local verification are complete.

### Provenance / implementation note

The GitHub connector cannot directly inspect the PNG because it is a binary asset. This task therefore needs a normal desktop/repository checkout for image processing and local verification.

**Implementation note:** `scripts/deploy_termiwiki.sh` now generates the icon set and manifest from the selected master artwork, while `scripts/termiwiki.quartz.config.ts` adds the corresponding document-head declarations. The local build and deployment were re-run on 2026-09-19; the build parsed 299 Markdown files and emitted 766 files. The generated ICO contains 16, 32, 48, and 256-pixel PNG entries. The live page exposes the favicon, PNG, Apple touch, manifest, and theme-colour declarations, and all referenced assets returned HTTP 200 with the expected content types. GitHub Issue #1 has not been updated from this checkout.

**Evidence confidence:** High for the selected repository path, historical profile/Twitter artwork identity, generated assets, local build verification, deployment, and live asset responses; actual Apple device installation remains unverified.

---

## 2. Retrieve TermiSoc Facebook domain registration certificate

**GitHub Issue:** #2 — Next pass: retrieve TermiSoc Facebook domain registration certificate  
**Status:** ☐ Open — Facebook retrieval and transcription are complete; corroboration, timeline cross-reference, and GitHub follow-up remain outstanding
**Type:** Historical primary-source retrieval

### Objective

Recover the photograph/scan of the `termisoc.org` domain registration certificate that was previously observed in the TermiSoc Facebook group but was not imported into the repository.

### Why this matters

The certificate may provide unusually precise documentary evidence for the early history of `termisoc.org`, including a registration date and potentially registrant/registrar information. It may therefore strengthen or correct the current timeline's early domain-registration evidence.

### Required work

- [x] TODO: Re-open the relevant TermiSoc Facebook group.
- [x] TODO: Use an authorised authenticated browser session; if no such session is available, record the access blocker and leave the issue open.
- [x] TODO: Locate the photograph/scan of the `termisoc.org` registration certificate.
- [x] TODO: Preserve the highest Facebook image rendition available (`637 × 820`) as research-only media.
- [x] TODO: Record the Facebook group and post provenance.
- [x] TODO: Record the retrieval/capture date.
- [x] TODO: Record the post author/account where available.
- [x] TODO: Record any visible post date, caption, comments, or surrounding context that helps establish provenance.
- [x] TODO: Preserve the image as research evidence under `research/media/` with a linked research record.
- [x] TODO: Inspect the actual retrieved image before treating its visible fields as evidence.
- [x] TODO: Transcribe certificate fields exactly as shown where legible.
- [x] TODO: Determine, where legible, the invoice and covered dates, domain name, recipient block, registrar, amount, and invoice/reference number.
- [ ] TODO: Determine nameservers (not shown on the recovered invoice).
- [ ] TODO: Determine the tax ID and small machine-readable/reference strings (not confidently legible).
- [x] TODO: Distinguish text read directly from the certificate from interpretation or reconstruction.
- [ ] TODO: Compare the certificate against existing TermiSoc timeline entries and other domain evidence.
- [ ] TODO: Update the historical timeline only if the recovered evidence supports the change.
- [x] TODO: Preserve the recovered source rendition alongside the transcription within the research-only access boundary.
- [x] TODO: Record confidence and any illegible/ambiguous fields.
- [ ] TODO: Add a cross-reference from the relevant TermiSoc timeline/history page.

### Online issue synchronisation and closure

- [ ] TODO: Update GitHub Issue #2 online with the retrieval result, source URL, capture date, provenance, evidence path, transcription, confidence, and unresolved questions.
- [ ] TODO: Keep GitHub Issue #2 open while the original or higher-resolution certificate remains unretrieved, inaccessible, or insufficiently checked.
- [ ] TODO: Close GitHub Issue #2 online only after the evidence record and any supported timeline update have been reviewed and the remaining issue criteria are satisfied.

**Outreach status:** Alex Charrett has already been contacted through the recorded outreach route and is listed as awaiting response. A reply may provide a higher-resolution/original scan or clarification, but the repository does not need to wait for a reply before completing its own evidence review.

### Important provenance rule

The recovered image is research evidence for the fields visibly displayed on the invoice. Alex Charrett's “first registration” wording remains an attributed claim, not an independently verified conclusion.

**Evidence confidence currently:** High for the visible invoice fields and Facebook post provenance; Medium for the “first registration” interpretation; Unverified for original scan resolution and legal interpretation.

---

## 3. Update Ben A’Lee to his new last name

**GitHub Issue:** #3 — Update Ben A’Lee to his new last name  
**Status:** ☑ Complete
**Type:** Person/identity maintenance

### Objective

Update the TermiWiki person record and relevant references so that Ben A’Lee is represented by his current surname, **Ben Eskola**, while preserving historical references to the name used in contemporary TermiSoc material.

### Required work

- [x] TODO: Locate the existing Ben A’Lee person record in `source/`.
- [x] TODO: Confirm the current spelling: **Ben Eskola**.
- [x] TODO: Update the current/person-facing name to **Ben Eskola**.
- [x] TODO: Preserve **Ben A’Lee** as a historical/previous name where it is needed to identify contemporary sources.
- [x] TODO: Search the repository for references to:
  - [x] TODO: `Ben A’Lee`;
  - [x] TODO: `Ben A'Lee`;
  - [x] TODO: `Ben Alee`;
  - [x] TODO: other obvious formatting variants.
- [x] TODO: Update references that should point to the current person record.
- [x] TODO: Do not rewrite historical quotations, source titles, filenames, or documentary text merely to modernise the name.
- [x] TODO: Where a source used the historical surname, retain the source's wording and make the identity relationship explicit in the curated record.
- [x] TODO: Check backlinks/cross-references and generated navigation after the change.
- [x] TODO: Record the identity/name change with appropriate provenance if the repository already contains evidence for it.
- [x] TODO: Avoid introducing unsupported biographical claims.

**Current name:** Ben Eskola  
**Historical source name:** Ben A’Lee

---

## 4. Review and archive the TermiSoc Reddit community

**GitHub Issue:** #4 — Review and archive TermiSoc Reddit community  
**Status:** ☐ Open  
**Type:** Historical web/community archaeology

### Source

`https://www.reddit.com/r/a:t5_2uv1z/s/5G9uVf4zZt`

The supplied link redirects to the public **TermiSoc: Plymouth University Computing Society** Reddit community.

### Known lead information

- Community creation date observed: **26 August 2012**.
- Visible historical material includes posts concerning:
  - Freshers’ LAN/LAN Party activity;
  - `termibot` being put on GitHub;
  - planning a web tutorial;
  - TermiSoc IRC discussion;
  - the “Hurrah! A TermiSoc subreddit.” announcement;
  - a post listing subreddits of interest to TermiFolk.
- One useful lead links to the `termisoc/termibot` GitHub repository.

### Required work

- [x] TODO: Revisit the Reddit community.
- [x] TODO: Record the canonical/current URL and the supplied historical URL.
- [x] TODO: Record retrieval date.
- [x] TODO: Confirm the community title and creation date from the source where possible.
- [ ] TODO: Work through posts systematically rather than only collecting the currently visible examples.
- [ ] TODO: Identify posts that provide evidence for:
  - [ ] TODO: people/members;
  - [ ] TODO: committee roles;
  - [x] TODO: society events;
  - [x] TODO: Freshers activity;
  - [x] TODO: LAN parties;
  - [x] TODO: IRC activity;
  - [x] TODO: web tutorials;
  - [x] TODO: software/projects;
  - [x] TODO: `termibot`;
  - [x] TODO: links to other TermiSoc resources;
  - [x] TODO: dates and chronology;
  - [ ] TODO: relationships to Computing & Gaming Society or later Geek Society activity.
- [x] TODO: Preserve useful posts with their exact Reddit URL.
- [x] TODO: Record post author, date, title, and relevant body/context where available.
- [ ] TODO: Preserve screenshots or other media where they are important evidence and permissible.
- [ ] TODO: Store research-only captures under `research/media/`.
- [ ] TODO: Revisit the Freshers' LAN Imgur album `https://imgur.com/a/g13b2` if permitted regional access becomes available; the current UK session reports that the content is unavailable in the region.
- [ ] TODO: Link curated facts back to the evidence record.
- [x] TODO: Cross-reference any GitHub repositories discovered during the Reddit archaeology.
- [ ] TODO: Deduplicate evidence already captured elsewhere in the repository.
- [ ] TODO: Treat Reddit posts as evidence of what was posted by the relevant account/community, not automatically as independent confirmation of every claim contained in a post.
- [ ] TODO: Record deleted, inaccessible, or ambiguous material as such rather than filling gaps from inference.

**Research confidence:** The community/source identity is established; individual historical claims require source-by-source assessment.

---

## 5. Revisit URLM historical record for termisoc.org

**GitHub Issue:** #5 — Revisit URLM historical record for termisoc.org  
**Status:** ☐ Open  
**Type:** Historical web/domain infrastructure archaeology

### Source

`http://urlm.co.uk/www.termisoc.org`

### Objective

Recover and assess historical information about `termisoc.org` from URLM, particularly information that may help establish the domain's operational history.

### Required work

- [x] TODO: Revisit the URLM page.
- [x] TODO: Preserve the exact source URL.
- [x] TODO: Record retrieval date.
- [x] TODO: Attempt retrieval from the user's other computer/browser; not required because the current retrieval succeeded.
- [x] TODO: Record whether the page is live, partially accessible, redirected, blocked, or unavailable.
- [x] TODO: Capture any historical:
  - [x] TODO: domain/registration dates;
  - [x] TODO: hosting information;
  - [x] TODO: IP addresses;
  - [x] TODO: nameservers;
  - [x] TODO: site title;
  - [x] TODO: site description;
  - [x] TODO: historical metadata;
  - [x] TODO: linked/referenced pages;
  - [x] TODO: indications of the site's active period.
- [ ] TODO: Preserve screenshots or source captures where useful.
- [ ] TODO: If the original page is unavailable, search for archived copies or other historical web sources that reproduce the information.
- [x] TODO: Clearly distinguish URLM's own historical data from later third-party reconstruction.
- [x] TODO: Compare dates/IPs/nameservers against other TermiSoc infrastructure evidence.
- [x] TODO: Avoid treating a current DNS/hosting result as evidence of historical infrastructure without a dated source.
- [x] TODO: Add useful evidence to `research/`.
- [ ] TODO: Cross-reference the relevant domain/site timeline entries.

**Research confidence:** Unverified until the historical URLM material is successfully retrieved and assessed.

---

## 6. Review and archive the TermiSoc Steam Community

**GitHub Issue:** #6 — Review and archive TermiSoc Steam Community  
**Status:** ☐ Open  
**Type:** Historical community/platform archaeology

### Source

`https://steamcommunity.com/groups/termisoc/discussions/0/`

### Objective

Investigate the historical TermiSoc Steam Community for evidence of people, events, gaming activity, society chronology, and links to other TermiSoc resources.

### Access note

The user has a Steam account, so this source should be revisited from an authenticated Steam environment if login is required to expose older discussions or media.

### Required work

- [x] TODO: Revisit the TermiSoc Steam Community.
- [x] TODO: Record retrieval date and exact source URLs.
- [x] TODO: Determine whether historical discussions remain accessible; no active topics were visible.
- [x] TODO: If authentication is required, revisit from the user's desktop/Steam environment.
- [x] TODO: Catalogue useful announcements/posts.
- [ ] TODO: Extract evidence for:
  - [x] TODO: people/usernames as displayed;
  - [x] TODO: dates;
  - [ ] TODO: committee or organiser identities;
  - [x] TODO: LAN/gaming activity;
  - [x] TODO: events;
  - [x] TODO: competitions;
  - [ ] TODO: projects;
  - [x] TODO: society announcements;
  - [x] TODO: links to websites/repositories;
  - [ ] TODO: screenshots/files/media;
  - [x] TODO: chronology/membership evidence where directly stated.
- [x] TODO: Record author/user identity exactly as displayed.
- [ ] TODO: Where a Steam username can be connected to a real person, require corroborating evidence rather than relying on username similarity alone.
- [ ] TODO: Preserve useful screenshots/media in `research/media/` where appropriate.
- [x] TODO: Preserve exact URLs and announcement titles.
- [x] TODO: Record publication dates and relevant quoted context.
- [x] TODO: Check whether announcements point to other sources already present in the repository.
- [ ] TODO: Deduplicate existing evidence.
- [ ] TODO: Record inaccessible/private/deleted content explicitly.
- [ ] TODO: Add curated person/event/project cross-references only where evidence supports them.

**Research confidence:** High for the Steam group metadata and directly displayed announcements; Medium for the interpretation of planned events as evidence of wider gaming activity; Unverified for attendance, event completion, and real-person identity bridges. Membership is awaiting approval for a possible later member-only review. See `research/sources/2026-09-19_termisoc-steam-community.md`.

---

## 7. Review and archive siddv.net/projects/termisoc/

**GitHub Issue:** #7 — Review and archive `siddv.net/projects/termisoc/`  
**Status:** ☐ Open  
**Type:** Person/project archaeology and primary web-source preservation

### Source

`https://www.siddv.net/projects/termisoc/`

### Known identity lead

The identity behind `siddv` has been independently corroborated as **Siddharth Vadgama**, with University of Plymouth affiliation and a TermiSoc Chairman role. However, this issue concerns the specific project page and its contents. Do not infer the page's contents from other Siddharth-related sources.

### Required work

- [x] TODO: Retrieve the exact page.
- [x] TODO: Record retrieval date.
- [x] TODO: Record the page title.
- [x] TODO: Capture the complete accessible text.
- [x] TODO: Catalogue relevant images and record their source paths; binary preservation remains a follow-up.
- [x] TODO: Capture outbound links.
- [x] TODO: Record visible publication/update dates; no such date is displayed.
- [x] TODO: Record project descriptions and technical details.
- [x] TODO: Record explicit references to TermiSoc, society roles, events, people, projects, or infrastructure.
- [x] TODO: Preserve a source capture under `research/` or the appropriate evidence location.
- [x] TODO: Preserve the exact URL as provenance.
- [x] TODO: Determine whether the page is a current page, archived page, migrated page, or reconstructed copy.
- [x] TODO: Compare the page's claims against existing TermiWiki evidence.
- [x] TODO: Attribute claims specifically to this page.
- [ ] TODO: Do not treat author identity as proof of every statement on the page.
- [ ] TODO: Add cross-references to Siddharth Vadgama's person record where appropriate.
- [ ] TODO: Add project/event references only where supported by the page or corroborating evidence.
- [ ] TODO: Record unavailable images, broken links, or incomplete recovery.
- [ ] TODO: If the page is unavailable, attempt appropriate web archives and preserve the failure state/provenance.
- [ ] TODO: Record confidence for each significant extracted fact.

**Important constraint:** Do not reconstruct the contents of this page from other Siddharth sources if the page itself cannot be recovered.

---

## 8. Retrieve and archive outstanding TermiSoc research sources

**GitHub Issue:** #8 — Retrieve and archive outstanding TermiSoc research sources  
**Status:** ☐ Open  
**Type:** Multi-source historical retrieval queue

### Objective

Systematically retrieve the outstanding historical sources identified during TermiSoc archaeology, preserve their provenance, and incorporate useful evidence into the research corpus without assuming that every source is accessible or relevant.

### General procedure

For every source:

- [ ] TODO: Record exact URL.
- [ ] TODO: Record retrieval date.
- [ ] TODO: Record whether the source is accessible.
- [ ] TODO: Preserve useful original material where practical.
- [ ] TODO: Record title, author, date, platform, and context.
- [ ] TODO: Extract only historically relevant material.
- [ ] TODO: Cross-reference people, organisations, events, projects, domains, and chronology.
- [ ] TODO: Deduplicate against existing `research/` material.
- [ ] TODO: Preserve uncertainty and source limitations.
- [ ] TODO: If inaccessible, record the failure and attempt an appropriate archive or alternate historical copy.
- [ ] TODO: Do not treat the URL's existence alone as evidence of the historical claim it was expected to contain.

### 8.1 SlideServe — “Who Are We?”

**URL:** `https://www.slideserve.com/hedwig/who-are-we-powerpoint-ppt-presentation`

- [x] TODO: Retrieve presentation.
- [x] TODO: Record presentation title.
- [x] TODO: Record presenter/author as displayed by SlideServe.
- [ ] TODO: Record the presentation year; only `Jan 09` was recovered confidently.
- [x] TODO: Capture the visible slide/transcript content relevant to TermiSoc.
- [ ] TODO: Capture images/graphics relevant to TermiSoc if needed and permitted.
- [x] TODO: Extract substantive references to TermiSoc, Plymouth University, people, events, technology, or society structure.
- [x] TODO: Preserve source provenance.

### 8.2 Arduino Forum — South West UK

**URL:** `https://forum.arduino.cc/t/south-west-uk/92569`

- [x] TODO: Retrieve the thread.
- [x] TODO: Record thread title, author(s), dates, and replies.
- [x] TODO: Identify the TermiSoc, Arduino, and mailing-list references.
- [x] TODO: Preserve quoted context where needed to understand the claim.
- [x] TODO: Check whether the thread links to TermiSoc infrastructure or projects.

### 8.3 DCGLUG mailing-list archive — msg00526

**URL:** `https://www.dcglug.org.uk/archive-Nov00-May01/msg00526.html`

- [x] TODO: Retrieve message.
- [x] TODO: Record sender, date, subject, and thread context.
- [x] TODO: Preserve relevant quoted context.
- [x] TODO: Identify TermiSoc/person/domain/technology references.
- [x] TODO: Determine whether the date establishes useful pre-/early-TermiSoc chronology or contextual background.
- [ ] TODO: Preserve archive provenance.

### 8.4 Nick Charlton — TermiSoc Python tutorial repository

**URL:** `https://github.com/nickcharlton/termisoc-python-tutorial`

- [x] TODO: Retrieve repository metadata.
- [x] TODO: Record owner.
- [x] TODO: Record repository creation/commit dates where available.
- [x] TODO: Inspect README and relevant files.
- [x] TODO: Identify TermiSoc-specific wording.
- [x] TODO: Record authors/contributors.
- [x] TODO: Record tutorial/event context.
- [x] TODO: Preserve useful source paths and commit provenance.
- [x] TODO: Cross-reference Nick Charlton's person record and TermiSoc tutorial evidence.
- [ ] TODO: Do not infer society membership solely from repository ownership without supporting context.

### 8.5 SlideServe — MySQL and PHP tutorial

**URL:** `https://www.slideserve.com/matteo/mysql-and-php-tutorial-powerpoint-ppt-presentation`

- [ ] TODO: Retrieve presentation.
- [ ] TODO: Record title, presenter, and date.
- [ ] TODO: Capture slide titles and relevant content.
- [ ] TODO: Identify any explicit TermiSoc/tutorial/event references.
- [ ] TODO: Preserve relevant images and provenance.

### 8.6 Mattsi-Jansky — Termibot repository

**URL:** `https://github.com/Mattsi-Jansky/termibot`

- [x] TODO: Retrieve repository metadata.
- [x] TODO: Inspect README and source history.
- [x] TODO: Record owner and contributors.
- [x] TODO: Record creation/commit dates.
- [x] TODO: Identify explicit TermiSoc references.
- [x] TODO: Compare with the Reddit `termibot` lead; continuity remains unverified.
- [x] TODO: Record relevant commits and authorship evidence; full file preservation remains a follow-up.
- [x] TODO: Cross-reference TermiSoc software/project records.

### 8.7 Reddit — LAN party discussion

**URL:** `https://www.reddit.com/r/lanparty/comments/11g0hn/not_amazingly_large_but_the_biggest_lan_weve_ever/`

- [ ] TODO: Retrieve post and comments where accessible.
- [ ] TODO: Record author, date, title, and context.
- [ ] TODO: Determine whether it explicitly identifies a TermiSoc event.
- [ ] TODO: Extract event date/location/organiser information only where stated.
- [ ] TODO: Cross-reference Reddit community archaeology.
- [ ] TODO: Preserve useful screenshots/media if needed.

### 8.8 Steam Community — TermiSoc discussions search

**URL:** `https://steamcommunity.com/groups/termisoc/discussions/search/`

- [x] TODO: Search historical discussions; no active topics were visible.
- [x] TODO: Record useful announcement URLs/titles.
- [x] TODO: Record authors, dates, events, and relevant content from the three visible announcements.
- [x] TODO: Cross-reference Issue #6.
- [ ] TODO: Avoid duplicating material already captured from the main Steam group.

### 8.9 UPSU — TermiSoc Risk Assessment

**URL:** `https://www.upsu.com/resources/Termisoc/Risk-Assessment/`

- [ ] TODO: Retrieve document.
- [ ] TODO: Record title and document metadata.
- [ ] TODO: Record date/version if present.
- [ ] TODO: Preserve society name and committee/organiser information.
- [ ] TODO: Extract events, activities, facilities, or responsibilities described.
- [ ] TODO: Preserve documentary provenance.
- [ ] TODO: Compare against other UPSU TermiSoc records.

### 8.10 UPSU — TermiSoc Society Development Plan

**URL:** `https://www.upsu.com/resources/Termisoc/Society-Development-Plan/`

- [ ] TODO: Retrieve document.
- [ ] TODO: Record title and date/version.
- [ ] TODO: Record named officers/committee members.
- [ ] TODO: Extract aims, activities, membership, events, and development plans.
- [ ] TODO: Preserve exact society terminology.
- [ ] TODO: Compare with timeline/person evidence.

### 8.11 DCGLUG mailing-list archive — msg00076

**URL:** `https://www.dcglug.org.uk/archive-Nov00-May01/msg00076.html`

- [ ] TODO: Retrieve message.
- [ ] TODO: Record sender/date/subject.
- [ ] TODO: Preserve relevant thread context.
- [ ] TODO: Identify TermiSoc-related people, domains, projects, or technical context.
- [ ] TODO: Compare with other DCGLUG messages.

### 8.12 PhilipMcGaw.com — Arduino Pro Micro serial issues

**URL:** `https://philipmcgaw.com/serial-issues-with-the-arduino-pro-micro/`

- [ ] TODO: Retrieve the page.
- [ ] TODO: Record publication/update date.
- [ ] TODO: Determine whether the page contains historical TermiSoc context, personal/project chronology, or technical evidence relevant to the archaeology.
- [ ] TODO: Preserve only the TermiSoc-relevant evidence.
- [ ] TODO: Avoid treating a personal technical article as society evidence unless it explicitly provides that connection.

### 8.13 SlideServe — Introduction to Linux

**URL:** `https://www.slideserve.com/natan/introduction-to-linux-powerpoint-ppt-presentation`

- [ ] TODO: Retrieve presentation.
- [ ] TODO: Record title, presenter, date, and slide structure.
- [ ] TODO: Identify explicit TermiSoc/tutorial/event references.
- [ ] TODO: Preserve relevant source material.

### 8.14 Fortnox GitHub account

**URL:** `https://github.com/Fortnox`

- [ ] TODO: Determine why this account was identified as a TermiSoc research lead.
- [ ] TODO: Inspect historically relevant repositories.
- [ ] TODO: Record repository owners, dates, contributors, and TermiSoc references.
- [ ] TODO: Do not assume organisational or personal identity from the username alone.
- [ ] TODO: Preserve exact repository URLs for useful evidence.

### 8.15 Nick Charlton — “The Digital Peninsula’s First Web Unconference”

**URL:** `https://nickcharlton.net/posts/the-digital-peninsulas-first-web-unconference`

- [ ] TODO: Retrieve article.
- [ ] TODO: Record publication date and author.
- [ ] TODO: Extract references to TermiSoc, Plymouth, society members, events, or related web activity.
- [ ] TODO: Preserve exact wording/context for significant historical claims.
- [ ] TODO: Cross-reference Nick Charlton's person record and event chronology.

### 8.16 UPSU — TermiSoc Code of Conduct

**URL:** `https://www.upsu.com/resources/Termisoc/Code-of-Conduct/`

- [ ] TODO: Retrieve document.
- [ ] TODO: Record date/version if present.
- [ ] TODO: Record named officers/committee members if present.
- [ ] TODO: Extract society structure, membership, conduct, and activity context.
- [ ] TODO: Preserve documentary provenance.
- [ ] TODO: Compare with Risk Assessment and Model Constitution.

### 8.17 UPSU — TermiSoc Model Constitution

**URL:** `https://www.upsu.com/resources/Termisoc/Model-Constitution/`

- [ ] TODO: Retrieve document.
- [ ] TODO: Record title/date/version.
- [ ] TODO: Record named officers/committee members.
- [ ] TODO: Extract formal society aims, structure, membership, and governance information.
- [ ] TODO: Preserve exact terminology.
- [ ] TODO: Cross-reference people and timeline evidence.

### 8.18 WellOrder — Alternative time formats

**URL:** `https://wiki.wellorder.net/wiki/alternative-time-formats/`

- [ ] TODO: Retrieve page.
- [ ] TODO: Determine why it is relevant to the TermiSoc evidence set.
- [ ] TODO: Record any TermiSoc-specific reference, author identity, date, or linked material.
- [ ] TODO: Do not infer relevance from a generic technical page if no explicit TermiSoc connection is present.

### 8.19 TermiSoc — termi repository README

**URL:** `https://github.com/termisoc/termi/blob/master/README`

- [x] TODO: Retrieve repository and README.
- [x] TODO: Record organisation/repository ownership.
- [x] TODO: Record creation/commit history where useful.
- [x] TODO: Extract explicit TermiSoc/project references.
- [x] TODO: Record contributors/authors.
- [x] TODO: Preserve source paths and commit provenance.
- [x] TODO: Cross-reference the TermiSoc software/project record.

### 8.20 DCGLUG mailing-list archive — msg00248

**URL:** `https://www.dcglug.org.uk/archive-Nov00-May01/msg00248.html`

- [ ] TODO: Retrieve message.
- [ ] TODO: Record sender/date/subject/thread.
- [ ] TODO: Extract relevant people, domain, technical, or community references.
- [ ] TODO: Compare with other archived messages.

### 8.21 DCGLUG mailing-list archive — msg00079

**URL:** `https://www.dcglug.org.uk/archive-Nov00-May01/msg00079.html`

- [ ] TODO: Retrieve message.
- [ ] TODO: Record sender/date/subject/thread.
- [ ] TODO: Extract relevant people, domain, technical, or community references.
- [ ] TODO: Compare with other archived messages.

### 8.22 Lonney GitHub account

**URL:** `https://github.com/Lonney`

- [ ] TODO: Determine why the account is a TermiSoc research lead.
- [ ] TODO: Inspect historically relevant repositories.
- [ ] TODO: Record repository dates, authorship, and explicit TermiSoc references.
- [ ] TODO: Do not infer real-world identity from username alone.
- [ ] TODO: Preserve useful repository provenance.

### 8.23 Netsplit — Plymouth IRC channel history

**URL:** `https://netsplit.de/channels/?chat=plymouth`

- [ ] TODO: Retrieve channel information/history.
- [ ] TODO: Determine what historical Plymouth IRC evidence is available.
- [ ] TODO: Record channel names, dates, networks, and relevant historical metadata.
- [ ] TODO: Identify explicit TermiSoc/Termi-related references if present.
- [ ] TODO: Cross-reference TermiSoc IRC evidence already present in the repository.
- [ ] TODO: Preserve the distinction between general Plymouth IRC activity and evidence specifically attributable to TermiSoc.

### Queue completion criteria

Issue #8 should remain open until each source has been classified as one of:

- **Retrieved and useful** — evidence preserved and incorporated/cross-referenced.
- **Retrieved but not relevant** — source examined and reason recorded.
- **Inaccessible** — retrieval failed after reasonable attempts; failure and attempted routes recorded.
- **Archived copy retrieved** — original unavailable but an archived copy was preserved with provenance.
- **Duplicate** — source duplicates existing evidence; provenance still recorded where necessary.

---

## Cross-cutting follow-up checks

These are useful after completing the individual items.

- [ ] TODO: Search the repository for newly discovered person names and usernames before creating duplicate person records.
- [ ] TODO: Search existing evidence before adding duplicate source captures.
- [ ] TODO: Update the historical timeline only from evidence that has an explicit provenance trail.
- [ ] TODO: Check whether newly recovered sources change the confidence level of existing timeline entries.
- [ ] TODO: Preserve contradictions rather than silently choosing one source.
- [ ] TODO: Maintain explicit separation between contemporary source wording and modern editorial interpretation.
- [ ] TODO: Ensure research-only media is not embedded into curated/public `source/` pages.
- [ ] TODO: Regenerate Quartz output only after source/configuration changes are complete.
- [ ] TODO: Review generated output for broken links after substantial archaeology updates.
- [ ] TODO: Keep GitHub issues and this TODO file aligned when task scope/status changes.

## Current priority grouping

### Desktop / local-checkout work

- [ ] TODO: **#1 — Favicon/site icon implementation**
- [x] TODO: **#3 — Ben Eskola name update**

### Research / browser-access work

- [ ] TODO: **#2 — Facebook domain registration certificate** (image recovered; review and corroboration outstanding)
- [ ] TODO: **#4 — Reddit community**
- [ ] TODO: **#5 — URLM domain history**
- [ ] TODO: **#6 — Steam Community** (initial authenticated review recorded; identity and archive follow-up outstanding)
- [ ] TODO: **#7 — Siddharth Vadgama TermiSoc project page**
- [ ] TODO: **#8 — Outstanding research-source retrieval queue**
