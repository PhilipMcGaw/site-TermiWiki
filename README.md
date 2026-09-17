# TermiWiki

**TermiWiki is a digital archaeology and preservation project documenting the history of TermiSoc, the University of Plymouth computing society, and the technical and social community that grew around it.**

The project aims to reconstruct that history from surviving evidence rather than produce a retrospective narrative from memory alone. It brings together contemporary documents, old websites, mailing-list archives, photographs, screenshots, personal recollections, technical artefacts, and other surviving records. Where the evidence is incomplete or uncertain, that uncertainty is recorded rather than silently resolved.

The principal period of interest is the history of TermiSoc from its early years through the 1990s, 2000s, and later transition into the societies that followed it. The project is particularly interested in the people, committees, computers, servers, software, networks, hack weekends, open-source activity, and wider communities connected with TermiSoc. Related organisations and communities, such as the Devon & Cornwall Linux User Group, are recorded where there is evidence of a historical connection.

TermiWiki also records the later University of Plymouth computing-society landscape, including the present-day Computer Society (CompSoc), but **historical TermiSoc and the current society are treated as distinct unless the evidence establishes continuity**. The project is an independent historical archive, not an official University or Students' Union history.

## What the project is trying to preserve

TermiSoc was more than a name on a Students' Union society list. The surviving evidence points to a community built around computing, programming, Unix and Linux, networking, web development, electronics, experimentation, and the people who maintained the infrastructure that made those activities possible.

TermiWiki therefore seeks to preserve both sides of that history:

- **People** — members, officers, organisers, technical staff, and others who can be reliably connected to the society.
- **Organisation** — committees, elections, AGMs, society names, affiliations, and changes over time.
- **Infrastructure** — servers, domains, mailing lists, member home directories, hosting, and other technical systems.
- **Projects and activities** — hack weekends, talks, programming, electronics, open-source work, competitions, and other documented activities.
- **Connections** — relationships with Linux user groups, other university societies, local computing communities, and related projects.
- **Primary evidence** — archived websites, photographs, documents, screenshots, mailing-list messages, contemporary announcements, and surviving technical material.

This is deliberately closer to an archaeological record than a conventional institutional history. A fragmentary page, an old hostname, a mailing-list signature, or a surviving photograph may be significant evidence even when it cannot yet answer every question about the surrounding history.

## Evidence and historical method

The project distinguishes between:

1. **Contemporary evidence** — material produced at the time of the event or activity.
2. **Later recollection** — memories or descriptions produced after the event.
3. **Inference** — a conclusion supported by multiple pieces of evidence but not directly stated by a surviving source.
4. **Unresolved research** — a lead that has not yet been sufficiently corroborated.

Historical claims should retain their provenance. Sources are normally recorded using Markdown footnotes, with archive URLs, dates, document titles, or other information needed to assess the evidence.

Person pages and other reconstructed material may therefore remain explicitly marked **DRAFT** while the research is incomplete. A missing date or uncertain committee role is preferable to an invented certainty.

## Research corpus and collaboration

The repository deliberately separates the **research corpus** from the **published Obsidian vault** so that people using different tools and LLMs can collaborate without making any particular model or conversation the project's source of truth.

- `source/` — the curated Obsidian vault and published historical knowledge base.
- `research/` — the shared archaeological evidence, source records, investigations, leads, and research logs.
- `working/` — optional disposable scratch space for agents; it is not evidence and is not authoritative.
- `AGENTS.md` — repository-wide rules for human and AI contributors.
- `research/AGENTS.md` — rules specific to archaeological research.
- `source/AGENTS.md` — rules specific to the curated Obsidian vault.

Contributors MAY use Codex, ChatGPT, Claude, Gemini, local models, other agents, or no LLM at all. The repository and its Git history provide the shared project memory. Agents are expected to leave concise, reproducible research records rather than relying on private conversation history or unpublished model reasoning.

A discovery should normally enter `research/` first. Once appropriately corroborated, it can be reflected in `source/`. This separation allows one contributor or model to investigate a claim while another challenges it, finds additional evidence, or decides that the published page should remain marked `DRAFT`.

See [`research/README.md`](research/README.md) and the applicable `AGENTS.md` for the working method.

## Repository structure

This repository is an **Obsidian vault published as a Quartz static site**, with a separate research corpus.

- `source/` — the canonical Obsidian vault and curated historical content.
- `source/media/` — all referenced images and other media. New media MUST be placed here.
- `source/TermiPeople/` — individual people profiles.
- `source/Glossary/` — glossary and terminology pages.
- `research/evidence/` — individual documentary evidence records.
- `research/sources/` — source and archive records.
- `research/people/` — person identification and association research.
- `research/organisations/` — organisation and relationship research.
- `research/infrastructure/` — domains, servers, hosting, mailing lists, BBSes, and technical systems.
- `research/events/` — dated events and activities.
- `research/leads/` — unresolved hypotheses and research targets.
- `research/timelines/` — reconstructed chronology supported by evidence.
- `research/decisions/` — documented research and editorial decisions.
- `scripts/` — Quartz configuration, maintenance tools, and deployment configuration.
- `site/` — generated static-site output. It MUST NOT be edited by hand.

The `source/` vault is the source of truth for published content. The `research/` corpus is the source of truth for the current state of the investigation. Quartz provides the published presentation and navigation layer; it does not replace either underlying layer.

## Visual reconstruction

The published site deliberately includes a historical visual treatment inspired by the web of the mid-2000s, including the approximate period around 2006. This is intended to make the archive feel appropriate to the material being documented while remaining usable on modern devices.

The historical appearance is a **reconstruction, not a claim that every visual detail reproduces the original TermiSoc website**. Where original screenshots, stylesheets, or page source can be recovered, they take precedence over stylistic assumptions.

## Development and publication

The site is built from the Obsidian vault using Quartz. Changes to the historical content should normally be made in `source/`, while TermiWiki-specific presentation and build behaviour is maintained under `scripts/`.

The repository also contains generated `site/` output because the current deployment arrangement keeps source and generated material together. Generated files should be regenerated from the source rather than edited directly.

### Structured data

`scripts/termiwiki.jsonld.ts` emits conservative Schema.org JSON-LD for every published page. It derives titles, descriptions, tags, and explicit frontmatter values from the source note; it also records external citations for articles and recognised public-profile links for people pages. Supported page types are `WebSite` for the home page, `Person` for `TermiPeople/`, `Article` for notes, and `CollectionPage` for tag and folder indexes.

For a person’s personal website or profile on an unrecognised service, add a `sameAs` YAML list to that person’s frontmatter. This is intentionally explicit: ordinary citations and links are not automatically asserted to be the subject’s own profile.

### Publishing warning

`scripts/deploy_termiwiki.sh` builds and publishes the site using `rsync --delete` against the production TermiSoc web root. **Do not run the deployment script merely to test a change.** Build and validate locally before publishing.

## Research status

TermiWiki is an ongoing reconstruction. Some periods and individuals are well documented; others currently depend on isolated references, surviving personal websites, archive fragments, or recollection. The absence of evidence is not treated as evidence that an event or person did not exist.

The aim is to make the surviving evidence discoverable, connected, and understandable, while leaving a clear trail back to the sources from which the reconstruction was made.
