# TermiWiki working rules

## Purpose

`site-TermiWiki` is the source and build repository for the historical TermiSoc Wiki, now extended to record the present-day University of Plymouth Computer Society (CompSoc) and related robotics-society material.

The repository is an **Obsidian vault used as the source for a Quartz static site**. Treat the Markdown in `source/` as the authoritative content. `site/` is generated output and MUST NOT be edited by hand.

## Repository structure

- `source/` — canonical Obsidian vault and Markdown content.
- `source/Media/` — referenced images and other media.
- `source/TermiPeople/` — individual people profiles.
- `source/Glossary/` — glossary and terminology pages.
- `source/.obsidian/` — Obsidian configuration; change only when the vault configuration genuinely needs changing.
- `scripts/` — build/deployment scripts, Quartz configuration templates, Apache configuration, and content-maintenance utilities.
- `site/` — generated Quartz static site. Regenerate rather than editing directly.
- `README.md` — repository-level orientation and deployment warning.

## Source-of-truth rules

1. MUST edit content in `source/`, not `site/`.
2. MUST preserve existing historical material unless the task explicitly requests correction, removal, or restructuring.
3. MUST distinguish historical evidence from later recollection, inference, and modern information.
4. MUST NOT silently turn an uncertain historical claim into a fact.
5. When adding factual historical material, preserve or add provenance where practical: source, date, archive URL, document, quotation, or other evidence.
6. MUST keep historical TermiSoc and current CompSoc clearly distinguished. Do not imply that the current society is the same legal or organisational entity unless the evidence establishes that.
7. Treat the existing content as a reconstruction/archives project. Gaps and uncertainty are legitimate information and should be recorded rather than invented away.

## Markdown and front matter

Use Markdown compatible with Obsidian and Quartz.

Normal content pages SHOULD use YAML front matter where appropriate, following the existing pattern, for example:

```yaml
---
title: "Page title"
source: dokuwiki
source_path: "sites:termiwiki:example"
created: 2024-01-01
tags:
  - "termisoc"
---
```

Rules:

- Preserve existing front matter when editing a page unless there is a specific reason to change it.
- Use ISO-style dates (`YYYY-MM-DD`) for dates in front matter.
- Keep `tags` as a YAML list and avoid duplicate tags.
- Do not invent `created` dates. Use the documented source date where known; otherwise leave the existing value alone.
- Use Obsidian wikilinks for local media and content where that is already the repository convention, e.g. `![[Media/example.jpg]]`.
- Use ordinary Markdown links for external websites and archived sources.
- Do not introduce DokuWiki syntax into newly written content unless preserving an explicit historical source fragment.
- If migrating old DokuWiki content, preserve useful provenance and normalise syntax only as far as necessary for Obsidian/Quartz.

## Naming and organisation

- Follow existing filenames and directory conventions before introducing a new convention.
- People belong in `source/TermiPeople/` when they are individual profile pages.
- Glossary entries belong in `source/Glossary/` when they are terminology definitions or established glossary material.
- Media belongs in `source/Media/`.
- Do not create duplicate pages merely because a historical source used a different spelling or filename. Prefer aliases or redirects when appropriate.
- Be conservative about renaming existing pages because filenames can affect incoming links, generated URLs, and historical references.

## Historical accuracy

This is primarily a historical archive. Apply source criticism:

- Separate contemporary evidence from retrospective recollection.
- Record dates and provenance when available.
- Attribute claims to their source when the claim is disputed, uncertain, or based on recollection.
- Do not fabricate people, dates, committee positions, events, technical details, quotations, or organisational relationships.
- If evidence conflicts, retain the conflict and explain it rather than choosing an unsupported answer.
- When using web/archive evidence, prefer primary or contemporary sources where available.
- For current society information, include a checked/retrieved date when useful because committee membership, URLs, events, and contact details can change.

## Links and media

- Check that new internal links point to actual pages.
- Prefer stable local links over copied legacy URLs when the target exists in the vault.
- Preserve external archive links when they are evidence for historical claims.
- Do not remove media merely because it appears old or unused without checking references.
- Do not change media filenames casually; existing Markdown and historical references may depend on them.

## Scripts and build system

The deployment script builds a temporary Quartz tree from `source/`, writes the result to `site/`, and then deploys it. It also uses `rsync --delete` against the production web root.

Therefore:

- MUST inspect the relevant script before changing build/deployment behaviour.
- MUST NOT run or recommend the production deployment merely to test a content change.
- MUST NOT add credentials, private keys, tokens, passwords, or other secrets to the repository.
- Maintenance scripts SHOULD be deterministic, narrowly scoped, and safe to run in report/dry-run mode before writing where practical.
- Existing migration/normalisation scripts deliberately handle legacy DokuWiki material. Extend them rather than creating competing one-off transformations when the operation is general and repeatable.
- If changing a script, preserve its command-line behaviour unless the change explicitly requires an interface change.

## Generated output

`site/` is build output. It may be committed because this repository currently keeps source and generated output together, but:

- Never hand-edit generated HTML, CSS, JavaScript, search indexes, or other Quartz output.
- Regenerate `site/` from `source/` using the established build process when generated output needs updating.
- If a change only affects source content, do not manually patch the generated result.
- Be alert to stale generated output when reviewing commits.

## Quartz configuration

Quartz configuration is maintained in `scripts/termiwiki.quartz.config.ts` and `scripts/termiwiki.quartz.layout.ts` as templates for the build process.

- Keep the site locale as `en-GB` unless there is an explicit reason to change it.
- Preserve the existing Quartz plugin architecture unless a change is required.
- Do not modify the shared Quartz installation in another repository as part of a TermiWiki content change.
- If a Quartz change is required, make the TermiWiki-specific change in the repository template first and document any dependency on the external Quartz checkout.

## Language and house style

All newly authored TermiWiki content, documentation, comments, commit messages, and other human-readable project text MUST use **British English** unless a technical identifier, quotation, historical source, proper name, or external project's established spelling requires otherwise.

Apply the project's established language conventions consistently:

- Use British spelling and vocabulary: `organisation`, `organise`, `licence` (noun), `licence`/`license` according to grammatical role, `centre`, `colour`, `behaviour`, `programme`, and similar forms.
- Use **Oxford commas** in lists where they improve grammatical clarity and apply them consistently.
- Write clearly, concisely, precisely, and directly. Prefer active voice and avoid unnecessary promotional or conversational language.
- Follow the principles of *The Elements of Style*: remove unnecessary words, avoid ambiguity, and use concrete terminology.
- Use consistent capitalisation for project names, technologies, standards, organisations, and document terms. Do not introduce arbitrary title case.
- Preserve established technical terminology rather than replacing it with a supposedly more British alternative when the technical term has a defined meaning.
- Distinguish ordinary prose from quoted or historically preserved material. **Do not silently Britishise quotations, source text, names, URLs, code, or identifiers.**
- Use Unicode characters where they are semantically correct and readable; do not substitute ASCII approximations unnecessarily.
- Follow NIST-style SI conventions for measurements: use the correct SI symbol, and use a **non-breaking space between a numerical value and its unit or symbol** (for example, `10 mm`, `5 V`, `25 °C`).
- Use `°C` for Celsius temperatures and correct Unicode symbols where applicable.
- Use commas as thousands separators in ordinary English prose where needed for readability (for example, `1,000`), while preserving technical/code formats where another convention is required.
- Use `§` when referring to a section of the same document where that notation is appropriate.
- Use RFC 2119-style status words deliberately: `MUST`, `MUST NOT`, `SHOULD`, `SHOULD NOT`, and `MAY` indicate requirements or recommendations and should not be used casually.
- Use precise project-status terminology. Prefer terms such as `designed`, `planned`, `implemented`, `simulated`, `bench-tested`, `validated`, and `production-proven` according to the actual evidence. Do not call something validated or production-proven merely because it has been designed or implemented.
- Do not use American English merely because a tool, framework, template, or generated output does so. Where a third-party product uses American spelling, retain the product's official name while keeping surrounding prose in British English.

When editing existing pages, correct incidental spelling, grammar, typography, capitalisation, and punctuation where this improves consistency, but do not rewrite historical source material merely to impose modern house style. Preserve the distinction between editorial text and historical/source text.

## Editing workflow for AI agents

Before making changes:

1. Inspect the relevant existing files and surrounding conventions.
2. Determine whether the requested change belongs in `source/`, `scripts/`, `README.md`, or generated output.
3. Check existing links, front matter, tags, aliases, and provenance before changing them.
4. Apply the language and house-style rules above to newly authored or materially edited prose.
5. Prefer the smallest coherent change that solves the task.

After making changes:

1. Check Markdown/front matter syntax.
2. Check internal links and media references affected by the change.
3. Check newly authored prose for British English, consistent terminology, Oxford commas, and appropriate SI notation.
4. Run an appropriate local validation/build if available and safe.
5. Do not deploy to production unless deployment is explicitly requested.
6. Summarise what changed, what was validated, and any remaining uncertainty.

## Git workflow

- Default branch is `main`.
- Use focused commits with clear messages.
- Do not rewrite history or force-push unless explicitly requested.
- Avoid unrelated formatting churn.
- When a task calls for a pull request, use a dedicated branch and keep the PR limited to the requested work.
- Before updating an existing GitHub file, obtain its current blob SHA and update from that version to avoid overwriting concurrent changes.

## Important safety rule

The deployment script contains production paths and performs a destructive `rsync --delete`. Treat deployment as a production operation, not as a build/test command. Building and validating the site locally MUST be separated from publishing it.
