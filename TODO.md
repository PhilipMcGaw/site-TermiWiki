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
**Status:** ☐ Open — implementation and verification outstanding  
**Type:** Desktop/repository implementation

### Objective

Create a functional, historically appropriate TermiSoc favicon and site-icon set using the existing TermiSoc profile/Twitter artwork already preserved in the repository.

### Confirmed master artwork

The correct historical artwork has been identified at:

`source/Media/branding/termisoc_profile_image.png`

This is the TermiSoc profile/Twitter artwork the user wants to use as the master artwork.

The repository also contains historical references to `media/weare_weblogo.png` in `source/termisoc.md`, but the profile/Twitter artwork above is the selected master for this task. Do not invent a new TermiSoc mark for the favicon work.

### Required work

- [ ] TODO: Pull/update the local desktop repository checkout before processing the binary asset.
- [ ] TODO: Inspect `source/Media/branding/termisoc_profile_image.png` at full resolution.
- [ ] TODO: Confirm that the artwork survives reduction to favicon dimensions without losing its identifying features.
- [ ] TODO: Generate `favicon.ico` containing appropriate legacy sizes, as supported by the chosen tooling.
- [ ] TODO: Generate 16×16 PNG icon.
- [ ] TODO: Generate 32×32 PNG icon.
- [ ] TODO: Generate 180×180 Apple touch icon.
- [ ] TODO: Generate 192×192 PNG icon.
- [ ] TODO: Generate 512×512 PNG icon.
- [ ] TODO: Generate a maskable 512×512 icon if the source artwork and padding make this appropriate.
- [ ] TODO: Add/update `site.webmanifest` as required by the Quartz/site architecture.
- [ ] TODO: Verify the existing Quartz `Plugin.Favicon()` configuration and use the supported Quartz mechanism rather than hand-editing generated `site/` output.
- [ ] TODO: Add the appropriate favicon/web-app declarations through the source/configuration layer used by this repository.
- [ ] TODO: Ensure paths are correct in the generated site.
- [ ] TODO: Test the generated site locally.
- [ ] TODO: Check browser tab/favicon behaviour.
- [ ] TODO: Check Apple touch icon behaviour if practical.
- [ ] TODO: Check manifest/icon paths directly.
- [ ] TODO: Confirm that the favicon implementation is independent of any future redesign of TermiSoc artwork.
- [ ] TODO: Record the implementation and verification result in GitHub Issue #1.
- [ ] TODO: Close Issue #1 only after implementation and local verification are complete.

### Provenance / implementation note

The GitHub connector cannot directly inspect the PNG because it is a binary asset. This task therefore needs a normal desktop/repository checkout for image processing and local verification.

**Evidence confidence:** High for the selected repository path and historical profile/Twitter artwork identity; implementation status remains incomplete.

---

## 2. Retrieve TermiSoc Facebook domain registration certificate

**GitHub Issue:** #2 — Next pass: retrieve TermiSoc Facebook domain registration certificate  
**Status:** ☐ Open  
**Type:** Historical primary-source retrieval

### Objective

Recover the photograph/scan of the `termisoc.org` domain registration certificate that was previously observed in the TermiSoc Facebook group but was not imported into the repository.

### Why this matters

The certificate may provide unusually precise documentary evidence for the early history of `termisoc.org`, including a registration date and potentially registrant/registrar information. It may therefore strengthen or correct the current timeline's early domain-registration evidence.

### Required work

- [ ] TODO: Re-open the relevant TermiSoc Facebook group.
- [ ] TODO: Locate the photograph/scan of the `termisoc.org` registration certificate.
- [ ] TODO: Preserve the original image if Facebook permits retrieval at useful quality.
- [ ] TODO: Record the Facebook group and post provenance.
- [ ] TODO: Record the retrieval/capture date.
- [ ] TODO: Record the post author/account where available.
- [ ] TODO: Record any visible post date, caption, comments, or surrounding context that helps establish provenance.
- [ ] TODO: Preserve the image as research evidence under `research/evidence/` or the appropriate evidence subtree.
- [ ] TODO: Do not treat the Facebook image as established evidence until the actual image has been retrieved and checked.
- [ ] TODO: Transcribe certificate fields exactly as shown.
- [ ] TODO: Determine, where legible:
  - [ ] TODO: precise domain registration date;
  - [ ] TODO: domain name;
  - [ ] TODO: registrant;
  - [ ] TODO: registrar;
  - [ ] TODO: registration/expiry dates;
  - [ ] TODO: nameservers;
  - [ ] TODO: certificate/reference number;
  - [ ] TODO: any other relevant documentary fields.
- [ ] TODO: Distinguish text read directly from the certificate from interpretation or reconstruction.
- [ ] TODO: Compare the certificate against existing TermiSoc timeline entries and other domain evidence.
- [ ] TODO: Update the historical timeline only if the recovered evidence supports the change.
- [ ] TODO: Preserve the original source image alongside any transcription where licensing/access conditions permit.
- [ ] TODO: Record confidence and any illegible/ambiguous fields.
- [ ] TODO: Add a cross-reference from the relevant TermiSoc timeline/history page.

### Important provenance rule

Until the original image has been retrieved and inspected, the Facebook certificate should remain classified as a **primary-source lead**, not as independently verified evidence.

**Evidence confidence currently:** Unverified lead.

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

- [ ] TODO: Revisit the Reddit community.
- [ ] TODO: Record the canonical/current URL and the supplied historical URL.
- [ ] TODO: Record retrieval date.
- [ ] TODO: Confirm the community title and creation date from the source where possible.
- [ ] TODO: Work through posts systematically rather than only collecting the currently visible examples.
- [ ] TODO: Identify posts that provide evidence for:
  - [ ] TODO: people/members;
  - [ ] TODO: committee roles;
  - [ ] TODO: society events;
  - [ ] TODO: Freshers activity;
  - [ ] TODO: LAN parties;
  - [ ] TODO: IRC activity;
  - [ ] TODO: web tutorials;
  - [ ] TODO: software/projects;
  - [ ] TODO: `termibot`;
  - [ ] TODO: links to other TermiSoc resources;
  - [ ] TODO: dates and chronology;
  - [ ] TODO: relationships to Computing & Gaming Society or later Geek Society activity.
- [ ] TODO: Preserve useful posts with their exact Reddit URL.
- [ ] TODO: Record post author, date, title, and relevant body/context where available.
- [ ] TODO: Preserve screenshots or other media where they are important evidence and permissible.
- [ ] TODO: Store research-only captures under `research/media/`.
- [ ] TODO: Link curated facts back to the evidence record.
- [ ] TODO: Cross-reference any GitHub repositories discovered during the Reddit archaeology.
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

- [ ] TODO: Revisit the URLM page.
- [ ] TODO: Preserve the exact source URL.
- [ ] TODO: Record retrieval date.
- [ ] TODO: Attempt retrieval from the user's other computer/browser if the current environment cannot access it.
- [ ] TODO: Record whether the page is live, partially accessible, redirected, blocked, or unavailable.
- [ ] TODO: Capture any historical:
  - [ ] TODO: domain/registration dates;
  - [ ] TODO: hosting information;
  - [ ] TODO: IP addresses;
  - [ ] TODO: nameservers;
  - [ ] TODO: site title;
  - [ ] TODO: site description;
  - [ ] TODO: historical metadata;
  - [ ] TODO: linked/referenced pages;
  - [ ] TODO: indications of the site's active period.
- [ ] TODO: Preserve screenshots or source captures where useful.
- [ ] TODO: If the original page is unavailable, search for archived copies or other historical web sources that reproduce the information.
- [ ] TODO: Clearly distinguish URLM's own historical data from later third-party reconstruction.
- [ ] TODO: Compare dates/IPs/nameservers against other TermiSoc infrastructure evidence.
- [ ] TODO: Avoid treating a current DNS/hosting result as evidence of historical infrastructure without a dated source.
- [ ] TODO: Add useful evidence to `research/`.
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

- [ ] TODO: Revisit the TermiSoc Steam Community.
- [ ] TODO: Record retrieval date and exact source URLs.
- [ ] TODO: Determine whether historical discussions remain accessible.
- [ ] TODO: If authentication is required, revisit from the user's desktop/Steam environment.
- [ ] TODO: Catalogue useful discussions/posts.
- [ ] TODO: Extract evidence for:
  - [ ] TODO: people/usernames;
  - [ ] TODO: dates;
  - [ ] TODO: committee or organiser identities;
  - [ ] TODO: LAN/gaming activity;
  - [ ] TODO: events;
  - [ ] TODO: competitions;
  - [ ] TODO: projects;
  - [ ] TODO: society announcements;
  - [ ] TODO: links to websites/repositories;
  - [ ] TODO: screenshots/files/media;
  - [ ] TODO: chronology/membership evidence.
- [ ] TODO: Record author/user identity exactly as displayed.
- [ ] TODO: Where a Steam username can be connected to a real person, require corroborating evidence rather than relying on username similarity alone.
- [ ] TODO: Preserve useful screenshots/media in `research/media/` where appropriate.
- [ ] TODO: Preserve exact URLs and discussion titles.
- [ ] TODO: Record publication dates and any relevant quoted context.
- [ ] TODO: Check whether discussions point to other sources already present in the repository.
- [ ] TODO: Deduplicate existing evidence.
- [ ] TODO: Record inaccessible/private/deleted content explicitly.
- [ ] TODO: Add curated person/event/project cross-references only where evidence supports them.

**Research confidence:** Source existence is established; individual claims remain to be assessed.

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

- [ ] TODO: Retrieve the exact page.
- [ ] TODO: Record retrieval date.
- [ ] TODO: Record the page title.
- [ ] TODO: Capture the complete accessible text.
- [ ] TODO: Capture relevant images.
- [ ] TODO: Capture outbound links.
- [ ] TODO: Record visible publication/update dates.
- [ ] TODO: Record project descriptions and technical details.
- [ ] TODO: Record explicit references to TermiSoc, society roles, events, people, projects, or infrastructure.
- [ ] TODO: Preserve a source capture under `research/` or the appropriate evidence location.
- [ ] TODO: Preserve the exact URL as provenance.
- [ ] TODO: Determine whether the page is a current page, archived page, migrated page, or reconstructed copy.
- [ ] TODO: Compare the page's claims against existing TermiWiki evidence.
- [ ] TODO: Attribute claims specifically to this page.
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

- [ ] TODO: Retrieve presentation.
- [ ] TODO: Record presentation title.
- [ ] TODO: Record presenter/author.
- [ ] TODO: Record visible date.
- [ ] TODO: Capture slide titles.
- [ ] TODO: Capture images/graphics relevant to TermiSoc.
- [ ] TODO: Extract substantive references to TermiSoc, Plymouth University, people, events, technology, or society structure.
- [ ] TODO: Preserve source provenance.

### 8.2 Arduino Forum — South West UK

**URL:** `https://forum.arduino.cc/t/south-west-uk/92569`

- [ ] TODO: Retrieve the thread.
- [ ] TODO: Record thread title, author(s), dates, and replies.
- [ ] TODO: Identify any TermiSoc/person/project references.
- [ ] TODO: Preserve quoted context where needed to understand a claim.
- [ ] TODO: Check whether the thread links to TermiSoc infrastructure or projects.

### 8.3 DCGLUG mailing-list archive — msg00526

**URL:** `https://www.dcglug.org.uk/archive-Nov00-May01/msg00526.html`

- [ ] TODO: Retrieve message.
- [ ] TODO: Record sender, date, subject, and thread context.
- [ ] TODO: Preserve relevant quoted text.
- [ ] TODO: Identify TermiSoc/person/domain/technology references.
- [ ] TODO: Determine whether the date establishes useful pre-/early-TermiSoc chronology or contextual background.
- [ ] TODO: Preserve archive provenance.

### 8.4 Nick Charlton — TermiSoc Python tutorial repository

**URL:** `https://github.com/nickcharlton/termisoc-python-tutorial`

- [ ] TODO: Retrieve repository metadata.
- [ ] TODO: Record owner.
- [ ] TODO: Record repository creation/commit dates where available.
- [ ] TODO: Inspect README and relevant files.
- [ ] TODO: Identify TermiSoc-specific wording.
- [ ] TODO: Record authors/contributors.
- [ ] TODO: Record tutorial/event context.
- [ ] TODO: Preserve useful source paths and commit provenance.
- [ ] TODO: Cross-reference Nick Charlton's person record and TermiSoc tutorial evidence.
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

- [ ] TODO: Retrieve repository metadata.
- [ ] TODO: Inspect README and source history.
- [ ] TODO: Record owner and contributors.
- [ ] TODO: Record creation/commit dates.
- [ ] TODO: Identify explicit TermiSoc references.
- [ ] TODO: Compare with the Reddit `termibot` lead.
- [ ] TODO: Preserve relevant commits/files and authorship evidence.
- [ ] TODO: Cross-reference TermiSoc software/project records.

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

- [ ] TODO: Search historical discussions.
- [ ] TODO: Record useful thread URLs/titles.
- [ ] TODO: Record authors, dates, events, and relevant content.
- [ ] TODO: Cross-reference Issue #6.
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

- [ ] TODO: Retrieve repository and README.
- [ ] TODO: Record organisation/repository ownership.
- [ ] TODO: Record creation/commit history where useful.
- [ ] TODO: Extract explicit TermiSoc/project references.
- [ ] TODO: Record contributors/authors.
- [ ] TODO: Preserve source paths and commit provenance.
- [ ] TODO: Cross-reference the TermiSoc software/project record.

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

- [ ] TODO: **#2 — Facebook domain registration certificate**
- [ ] TODO: **#4 — Reddit community**
- [ ] TODO: **#5 — URLM domain history**
- [ ] TODO: **#6 — Steam Community**
- [ ] TODO: **#7 — Siddharth Vadgama TermiSoc project page**
- [ ] TODO: **#8 — Outstanding research-source retrieval queue**
