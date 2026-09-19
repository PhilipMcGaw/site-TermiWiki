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

- [ ] Pull/update the local desktop repository checkout before processing the binary asset.
- [ ] Inspect `source/Media/branding/termisoc_profile_image.png` at full resolution.
- [ ] Confirm that the artwork survives reduction to favicon dimensions without losing its identifying features.
- [ ] Generate `favicon.ico` containing appropriate legacy sizes, as supported by the chosen tooling.
- [ ] Generate 16×16 PNG icon.
- [ ] Generate 32×32 PNG icon.
- [ ] Generate 180×180 Apple touch icon.
- [ ] Generate 192×192 PNG icon.
- [ ] Generate 512×512 PNG icon.
- [ ] Generate a maskable 512×512 icon if the source artwork and padding make this appropriate.
- [ ] Add/update `site.webmanifest` as required by the Quartz/site architecture.
- [ ] Verify the existing Quartz `Plugin.Favicon()` configuration and use the supported Quartz mechanism rather than hand-editing generated `site/` output.
- [ ] Add the appropriate favicon/web-app declarations through the source/configuration layer used by this repository.
- [ ] Ensure paths are correct in the generated site.
- [ ] Test the generated site locally.
- [ ] Check browser tab/favicon behaviour.
- [ ] Check Apple touch icon behaviour if practical.
- [ ] Check manifest/icon paths directly.
- [ ] Confirm that the favicon implementation is independent of any future redesign of TermiSoc artwork.
- [ ] Record the implementation and verification result in GitHub Issue #1.
- [ ] Close Issue #1 only after implementation and local verification are complete.

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

- [ ] Re-open the relevant TermiSoc Facebook group.
- [ ] Locate the photograph/scan of the `termisoc.org` registration certificate.
- [ ] Preserve the original image if Facebook permits retrieval at useful quality.
- [ ] Record the Facebook group and post provenance.
- [ ] Record the retrieval/capture date.
- [ ] Record the post author/account where available.
- [ ] Record any visible post date, caption, comments, or surrounding context that helps establish provenance.
- [ ] Preserve the image as research evidence under `research/evidence/` or the appropriate evidence subtree.
- [ ] Do not treat the Facebook image as established evidence until the actual image has been retrieved and checked.
- [ ] Transcribe certificate fields exactly as shown.
- [ ] Determine, where legible:
  - [ ] precise domain registration date;
  - [ ] domain name;
  - [ ] registrant;
  - [ ] registrar;
  - [ ] registration/expiry dates;
  - [ ] nameservers;
  - [ ] certificate/reference number;
  - [ ] any other relevant documentary fields.
- [ ] Distinguish text read directly from the certificate from interpretation or reconstruction.
- [ ] Compare the certificate against existing TermiSoc timeline entries and other domain evidence.
- [ ] Update the historical timeline only if the recovered evidence supports the change.
- [ ] Preserve the original source image alongside any transcription where licensing/access conditions permit.
- [ ] Record confidence and any illegible/ambiguous fields.
- [ ] Add a cross-reference from the relevant TermiSoc timeline/history page.

### Important provenance rule

Until the original image has been retrieved and inspected, the Facebook certificate should remain classified as a **primary-source lead**, not as independently verified evidence.

**Evidence confidence currently:** Unverified lead.

---

## 3. Update Ben A’Lee to his new last name

**GitHub Issue:** #3 — Update Ben A’Lee to his new last name  
**Status:** ☐ Open  
**Type:** Person/identity maintenance

### Objective

Update the TermiWiki person record and relevant references so that Ben A’Lee is represented by his current surname, **Ben Eskola**, while preserving historical references to the name used in contemporary TermiSoc material.

### Required work

- [ ] Locate the existing Ben A’Lee person record in `source/`.
- [ ] Confirm the current spelling: **Ben Eskola**.
- [ ] Update the current/person-facing name to **Ben Eskola**.
- [ ] Preserve **Ben A’Lee** as a historical/previous name where it is needed to identify contemporary sources.
- [ ] Search the repository for references to:
  - [ ] `Ben A’Lee`;
  - [ ] `Ben A'Lee`;
  - [ ] `Ben Alee`;
  - [ ] other obvious formatting variants.
- [ ] Update references that should point to the current person record.
- [ ] Do not rewrite historical quotations, source titles, filenames, or documentary text merely to modernise the name.
- [ ] Where a source used the historical surname, retain the source's wording and make the identity relationship explicit in the curated record.
- [ ] Check backlinks/cross-references and generated navigation after the change.
- [ ] Record the identity/name change with appropriate provenance if the repository already contains evidence for it.
- [ ] Avoid introducing unsupported biographical claims.

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

- [ ] Revisit the Reddit community.
- [ ] Record the canonical/current URL and the supplied historical URL.
- [ ] Record retrieval date.
- [ ] Confirm the community title and creation date from the source where possible.
- [ ] Work through posts systematically rather than only collecting the currently visible examples.
- [ ] Identify posts that provide evidence for:
  - [ ] people/members;
  - [ ] committee roles;
  - [ ] society events;
  - [ ] Freshers activity;
  - [ ] LAN parties;
  - [ ] IRC activity;
  - [ ] web tutorials;
  - [ ] software/projects;
  - [ ] `termibot`;
  - [ ] links to other TermiSoc resources;
  - [ ] dates and chronology;
  - [ ] relationships to Computing & Gaming Society or later Geek Society activity.
- [ ] Preserve useful posts with their exact Reddit URL.
- [ ] Record post author, date, title, and relevant body/context where available.
- [ ] Preserve screenshots or other media where they are important evidence and permissible.
- [ ] Store research-only captures under `research/media/`.
- [ ] Link curated facts back to the evidence record.
- [ ] Cross-reference any GitHub repositories discovered during the Reddit archaeology.
- [ ] Deduplicate evidence already captured elsewhere in the repository.
- [ ] Treat Reddit posts as evidence of what was posted by the relevant account/community, not automatically as independent confirmation of every claim contained in a post.
- [ ] Record deleted, inaccessible, or ambiguous material as such rather than filling gaps from inference.

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

- [ ] Revisit the URLM page.
- [ ] Preserve the exact source URL.
- [ ] Record retrieval date.
- [ ] Attempt retrieval from the user's other computer/browser if the current environment cannot access it.
- [ ] Record whether the page is live, partially accessible, redirected, blocked, or unavailable.
- [ ] Capture any historical:
  - [ ] domain/registration dates;
  - [ ] hosting information;
  - [ ] IP addresses;
  - [ ] nameservers;
  - [ ] site title;
  - [ ] site description;
  - [ ] historical metadata;
  - [ ] linked/referenced pages;
  - [ ] indications of the site's active period.
- [ ] Preserve screenshots or source captures where useful.
- [ ] If the original page is unavailable, search for archived copies or other historical web sources that reproduce the information.
- [ ] Clearly distinguish URLM's own historical data from later third-party reconstruction.
- [ ] Compare dates/IPs/nameservers against other TermiSoc infrastructure evidence.
- [ ] Avoid treating a current DNS/hosting result as evidence of historical infrastructure without a dated source.
- [ ] Add useful evidence to `research/`.
- [ ] Cross-reference the relevant domain/site timeline entries.

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

- [ ] Revisit the TermiSoc Steam Community.
- [ ] Record retrieval date and exact source URLs.
- [ ] Determine whether historical discussions remain accessible.
- [ ] If authentication is required, revisit from the user's desktop/Steam environment.
- [ ] Catalogue useful discussions/posts.
- [ ] Extract evidence for:
  - [ ] people/usernames;
  - [ ] dates;
  - [ ] committee or organiser identities;
  - [ ] LAN/gaming activity;
  - [ ] events;
  - [ ] competitions;
  - [ ] projects;
  - [ ] society announcements;
  - [ ] links to websites/repositories;
  - [ ] screenshots/files/media;
  - [ ] chronology/membership evidence.
- [ ] Record author/user identity exactly as displayed.
- [ ] Where a Steam username can be connected to a real person, require corroborating evidence rather than relying on username similarity alone.
- [ ] Preserve useful screenshots/media in `research/media/` where appropriate.
- [ ] Preserve exact URLs and discussion titles.
- [ ] Record publication dates and any relevant quoted context.
- [ ] Check whether discussions point to other sources already present in the repository.
- [ ] Deduplicate existing evidence.
- [ ] Record inaccessible/private/deleted content explicitly.
- [ ] Add curated person/event/project cross-references only where evidence supports them.

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

- [ ] Retrieve the exact page.
- [ ] Record retrieval date.
- [ ] Record the page title.
- [ ] Capture the complete accessible text.
- [ ] Capture relevant images.
- [ ] Capture outbound links.
- [ ] Record visible publication/update dates.
- [ ] Record project descriptions and technical details.
- [ ] Record explicit references to TermiSoc, society roles, events, people, projects, or infrastructure.
- [ ] Preserve a source capture under `research/` or the appropriate evidence location.
- [ ] Preserve the exact URL as provenance.
- [ ] Determine whether the page is a current page, archived page, migrated page, or reconstructed copy.
- [ ] Compare the page's claims against existing TermiWiki evidence.
- [ ] Attribute claims specifically to this page.
- [ ] Do not treat author identity as proof of every statement on the page.
- [ ] Add cross-references to Siddharth Vadgama's person record where appropriate.
- [ ] Add project/event references only where supported by the page or corroborating evidence.
- [ ] Record unavailable images, broken links, or incomplete recovery.
- [ ] If the page is unavailable, attempt appropriate web archives and preserve the failure state/provenance.
- [ ] Record confidence for each significant extracted fact.

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

- [ ] Record exact URL.
- [ ] Record retrieval date.
- [ ] Record whether the source is accessible.
- [ ] Preserve useful original material where practical.
- [ ] Record title, author, date, platform, and context.
- [ ] Extract only historically relevant material.
- [ ] Cross-reference people, organisations, events, projects, domains, and chronology.
- [ ] Deduplicate against existing `research/` material.
- [ ] Preserve uncertainty and source limitations.
- [ ] If inaccessible, record the failure and attempt an appropriate archive or alternate historical copy.
- [ ] Do not treat the URL's existence alone as evidence of the historical claim it was expected to contain.

### 8.1 SlideServe — “Who Are We?”

**URL:** `https://www.slideserve.com/hedwig/who-are-we-powerpoint-ppt-presentation`

- [ ] Retrieve presentation.
- [ ] Record presentation title.
- [ ] Record presenter/author.
- [ ] Record visible date.
- [ ] Capture slide titles.
- [ ] Capture images/graphics relevant to TermiSoc.
- [ ] Extract substantive references to TermiSoc, Plymouth University, people, events, technology, or society structure.
- [ ] Preserve source provenance.

### 8.2 Arduino Forum — South West UK

**URL:** `https://forum.arduino.cc/t/south-west-uk/92569`

- [ ] Retrieve the thread.
- [ ] Record thread title, author(s), dates, and replies.
- [ ] Identify any TermiSoc/person/project references.
- [ ] Preserve quoted context where needed to understand a claim.
- [ ] Check whether the thread links to TermiSoc infrastructure or projects.

### 8.3 DCGLUG mailing-list archive — msg00526

**URL:** `https://www.dcglug.org.uk/archive-Nov00-May01/msg00526.html`

- [ ] Retrieve message.
- [ ] Record sender, date, subject, and thread context.
- [ ] Preserve relevant quoted text.
- [ ] Identify TermiSoc/person/domain/technology references.
- [ ] Determine whether the date establishes useful pre-/early-TermiSoc chronology or contextual background.
- [ ] Preserve archive provenance.

### 8.4 Nick Charlton — TermiSoc Python tutorial repository

**URL:** `https://github.com/nickcharlton/termisoc-python-tutorial`

- [ ] Retrieve repository metadata.
- [ ] Record owner.
- [ ] Record repository creation/commit dates where available.
- [ ] Inspect README and relevant files.
- [ ] Identify TermiSoc-specific wording.
- [ ] Record authors/contributors.
- [ ] Record tutorial/event context.
- [ ] Preserve useful source paths and commit provenance.
- [ ] Cross-reference Nick Charlton's person record and TermiSoc tutorial evidence.
- [ ] Do not infer society membership solely from repository ownership without supporting context.

### 8.5 SlideServe — MySQL and PHP tutorial

**URL:** `https://www.slideserve.com/matteo/mysql-and-php-tutorial-powerpoint-ppt-presentation`

- [ ] Retrieve presentation.
- [ ] Record title, presenter, and date.
- [ ] Capture slide titles and relevant content.
- [ ] Identify any explicit TermiSoc/tutorial/event references.
- [ ] Preserve relevant images and provenance.

### 8.6 Mattsi-Jansky — Termibot repository

**URL:** `https://github.com/Mattsi-Jansky/termibot`

- [ ] Retrieve repository metadata.
- [ ] Inspect README and source history.
- [ ] Record owner and contributors.
- [ ] Record creation/commit dates.
- [ ] Identify explicit TermiSoc references.
- [ ] Compare with the Reddit `termibot` lead.
- [ ] Preserve relevant commits/files and authorship evidence.
- [ ] Cross-reference TermiSoc software/project records.

### 8.7 Reddit — LAN party discussion

**URL:** `https://www.reddit.com/r/lanparty/comments/11g0hn/not_amazingly_large_but_the_biggest_lan_weve_ever/`

- [ ] Retrieve post and comments where accessible.
- [ ] Record author, date, title, and context.
- [ ] Determine whether it explicitly identifies a TermiSoc event.
- [ ] Extract event date/location/organiser information only where stated.
- [ ] Cross-reference Reddit community archaeology.
- [ ] Preserve useful screenshots/media if needed.

### 8.8 Steam Community — TermiSoc discussions search

**URL:** `https://steamcommunity.com/groups/termisoc/discussions/search/`

- [ ] Search historical discussions.
- [ ] Record useful thread URLs/titles.
- [ ] Record authors, dates, events, and relevant content.
- [ ] Cross-reference Issue #6.
- [ ] Avoid duplicating material already captured from the main Steam group.

### 8.9 UPSU — TermiSoc Risk Assessment

**URL:** `https://www.upsu.com/resources/Termisoc/Risk-Assessment/`

- [ ] Retrieve document.
- [ ] Record title and document metadata.
- [ ] Record date/version if present.
- [ ] Preserve society name and committee/organiser information.
- [ ] Extract events, activities, facilities, or responsibilities described.
- [ ] Preserve documentary provenance.
- [ ] Compare against other UPSU TermiSoc records.

### 8.10 UPSU — TermiSoc Society Development Plan

**URL:** `https://www.upsu.com/resources/Termisoc/Society-Development-Plan/`

- [ ] Retrieve document.
- [ ] Record title and date/version.
- [ ] Record named officers/committee members.
- [ ] Extract aims, activities, membership, events, and development plans.
- [ ] Preserve exact society terminology.
- [ ] Compare with timeline/person evidence.

### 8.11 DCGLUG mailing-list archive — msg00076

**URL:** `https://www.dcglug.org.uk/archive-Nov00-May01/msg00076.html`

- [ ] Retrieve message.
- [ ] Record sender/date/subject.
- [ ] Preserve relevant thread context.
- [ ] Identify TermiSoc-related people, domains, projects, or technical context.
- [ ] Compare with other DCGLUG messages.

### 8.12 PhilipMcGaw.com — Arduino Pro Micro serial issues

**URL:** `https://philipmcgaw.com/serial-issues-with-the-arduino-pro-micro/`

- [ ] Retrieve the page.
- [ ] Record publication/update date.
- [ ] Determine whether the page contains historical TermiSoc context, personal/project chronology, or technical evidence relevant to the archaeology.
- [ ] Preserve only the TermiSoc-relevant evidence.
- [ ] Avoid treating a personal technical article as society evidence unless it explicitly provides that connection.

### 8.13 SlideServe — Introduction to Linux

**URL:** `https://www.slideserve.com/natan/introduction-to-linux-powerpoint-ppt-presentation`

- [ ] Retrieve presentation.
- [ ] Record title, presenter, date, and slide structure.
- [ ] Identify explicit TermiSoc/tutorial/event references.
- [ ] Preserve relevant source material.

### 8.14 Fortnox GitHub account

**URL:** `https://github.com/Fortnox`

- [ ] Determine why this account was identified as a TermiSoc research lead.
- [ ] Inspect historically relevant repositories.
- [ ] Record repository owners, dates, contributors, and TermiSoc references.
- [ ] Do not assume organisational or personal identity from the username alone.
- [ ] Preserve exact repository URLs for useful evidence.

### 8.15 Nick Charlton — “The Digital Peninsula’s First Web Unconference”

**URL:** `https://nickcharlton.net/posts/the-digital-peninsulas-first-web-unconference`

- [ ] Retrieve article.
- [ ] Record publication date and author.
- [ ] Extract references to TermiSoc, Plymouth, society members, events, or related web activity.
- [ ] Preserve exact wording/context for significant historical claims.
- [ ] Cross-reference Nick Charlton's person record and event chronology.

### 8.16 UPSU — TermiSoc Code of Conduct

**URL:** `https://www.upsu.com/resources/Termisoc/Code-of-Conduct/`

- [ ] Retrieve document.
- [ ] Record date/version if present.
- [ ] Record named officers/committee members if present.
- [ ] Extract society structure, membership, conduct, and activity context.
- [ ] Preserve documentary provenance.
- [ ] Compare with Risk Assessment and Model Constitution.

### 8.17 UPSU — TermiSoc Model Constitution

**URL:** `https://www.upsu.com/resources/Termisoc/Model-Constitution/`

- [ ] Retrieve document.
- [ ] Record title/date/version.
- [ ] Record named officers/committee members.
- [ ] Extract formal society aims, structure, membership, and governance information.
- [ ] Preserve exact terminology.
- [ ] Cross-reference people and timeline evidence.

### 8.18 WellOrder — Alternative time formats

**URL:** `https://wiki.wellorder.net/wiki/alternative-time-formats/`

- [ ] Retrieve page.
- [ ] Determine why it is relevant to the TermiSoc evidence set.
- [ ] Record any TermiSoc-specific reference, author identity, date, or linked material.
- [ ] Do not infer relevance from a generic technical page if no explicit TermiSoc connection is present.

### 8.19 TermiSoc — termi repository README

**URL:** `https://github.com/termisoc/termi/blob/master/README`

- [ ] Retrieve repository and README.
- [ ] Record organisation/repository ownership.
- [ ] Record creation/commit history where useful.
- [ ] Extract explicit TermiSoc/project references.
- [ ] Record contributors/authors.
- [ ] Preserve source paths and commit provenance.
- [ ] Cross-reference the TermiSoc software/project record.

### 8.20 DCGLUG mailing-list archive — msg00248

**URL:** `https://www.dcglug.org.uk/archive-Nov00-May01/msg00248.html`

- [ ] Retrieve message.
- [ ] Record sender/date/subject/thread.
- [ ] Extract relevant people, domain, technical, or community references.
- [ ] Compare with other archived messages.

### 8.21 DCGLUG mailing-list archive — msg00079

**URL:** `https://www.dcglug.org.uk/archive-Nov00-May01/msg00079.html`

- [ ] Retrieve message.
- [ ] Record sender/date/subject/thread.
- [ ] Extract relevant people, domain, technical, or community references.
- [ ] Compare with other archived messages.

### 8.22 Lonney GitHub account

**URL:** `https://github.com/Lonney`

- [ ] Determine why the account is a TermiSoc research lead.
- [ ] Inspect historically relevant repositories.
- [ ] Record repository dates, authorship, and explicit TermiSoc references.
- [ ] Do not infer real-world identity from username alone.
- [ ] Preserve useful repository provenance.

### 8.23 Netsplit — Plymouth IRC channel history

**URL:** `https://netsplit.de/channels/?chat=plymouth`

- [ ] Retrieve channel information/history.
- [ ] Determine what historical Plymouth IRC evidence is available.
- [ ] Record channel names, dates, networks, and relevant historical metadata.
- [ ] Identify explicit TermiSoc/Termi-related references if present.
- [ ] Cross-reference TermiSoc IRC evidence already present in the repository.
- [ ] Preserve the distinction between general Plymouth IRC activity and evidence specifically attributable to TermiSoc.

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

- [ ] Search the repository for newly discovered person names and usernames before creating duplicate person records.
- [ ] Search existing evidence before adding duplicate source captures.
- [ ] Update the historical timeline only from evidence that has an explicit provenance trail.
- [ ] Check whether newly recovered sources change the confidence level of existing timeline entries.
- [ ] Preserve contradictions rather than silently choosing one source.
- [ ] Maintain explicit separation between contemporary source wording and modern editorial interpretation.
- [ ] Ensure research-only media is not embedded into curated/public `source/` pages.
- [ ] Regenerate Quartz output only after source/configuration changes are complete.
- [ ] Review generated output for broken links after substantial archaeology updates.
- [ ] Keep GitHub issues and this TODO file aligned when task scope/status changes.

## Current priority grouping

### Desktop / local-checkout work

- [ ] **#1 — Favicon/site icon implementation**
- [ ] **#3 — Ben Eskola name update**

### Research / browser-access work

- [ ] **#2 — Facebook domain registration certificate**
- [ ] **#4 — Reddit community**
- [ ] **#5 — URLM domain history**
- [ ] **#6 — Steam Community**
- [ ] **#7 — Siddharth Vadgama TermiSoc project page**
- [ ] **#8 — Outstanding research-source retrieval queue**
