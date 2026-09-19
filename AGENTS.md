# TermiWiki working rules

## Purpose

`site-TermiWiki` is a digital archaeology and preservation project documenting the history of TermiSoc, the University of Plymouth computing society, and the technical and social communities connected with it. It also records the later University of Plymouth computing-society landscape, including CompSoc, where relevant.

The repository contains a canonical Obsidian vault, a separate research corpus, and generated Quartz output. Treat these as distinct layers. The Obsidian material in `source/` is the curated historical knowledge base. The material in `research/` is the shared evidence and investigation corpus. `site/` is generated output and MUST NOT be edited by hand.

## Repository structure

- `source/` — canonical Obsidian vault and curated historical content.
- `source/media/` — public media referenced by the curated Obsidian vault and generated site.
- `source/TermiPeople/` — individual people profiles.
- `source/Glossary/` — glossary and terminology pages.
- `research/` — shared research corpus, evidence, source records, investigations, leads, and research logs. This is deliberately separate from the Obsidian vault.
- `research/evidence/` — individual documentary evidence records.
- `research/media/` — restricted, research-only media that MUST NOT be embedded in `source/` or generated output.
- `research/sources/` — source and archive records, including provenance and access information.
- `research/people/` — person identification and association research before or alongside publication.
- `research/organisations/` — organisations, societies, groups, and their relationships.
- `research/infrastructure/` — domains, servers, hosting, mailing lists, BBSes, software, and other technical infrastructure.
- `research/events/` — events, AGMs, hack weekends, talks, competitions, and other dated activities.
- `research/leads/` — unresolved hypotheses and investigation targets. A lead is NOT an established fact.
- `research/timelines/` — reconstructed chronology supported by references to evidence records.
- `research/decisions/` — research and editorial decisions, including the rationale for resolving or retaining uncertainty.
- `working/` — optional disposable agent scratch space. It MUST NOT be treated as evidence or authoritative project knowledge.
- `scripts/` — build/deployment scripts, Quartz configuration templates, Apache configuration, and content-maintenance utilities.
- `site/` — generated Quartz static site. Regenerate rather than editing directly.
- `README.md` — repository-level orientation and contribution guidance.

## Source-of-truth rules

1. `source/` is the canonical curated Obsidian knowledge base.
2. `research/` is the shared archaeological evidence and investigation corpus.
3. Research discoveries MUST normally be recorded in `research/` before being promoted into `source/`.
4. Agents MUST NOT place unverified research directly into `source/` merely because it appears plausible.
5. Agents MAY propose or make a corresponding `source/` update when the evidence is sufficiently established, but MUST preserve provenance and uncertainty where appropriate.
6. `site/` is generated output and MUST NOT be hand-edited.
7. `working/` is disposable scratch space and MUST NOT be cited as evidence or treated as project knowledge.
8. MUST preserve existing historical material unless the task explicitly requests correction, removal, or restructuring.
9. MUST distinguish historical evidence from later recollection, inference, and modern information.
10. MUST NOT silently turn an uncertain historical claim into a fact.
11. When adding factual historical material, preserve or add provenance where practical: source, date, archive URL, document, quotation, or other evidence.
12. MUST keep historical TermiSoc and current CompSoc clearly distinguished. Do not imply that the current society is the same legal or organisational entity unless the evidence establishes that.
13. Gaps and uncertainty are legitimate information and should be recorded rather than invented away.

## Multi-agent and multi-LLM collaboration

The repository is deliberately model-agnostic. Contributors MAY use Codex, ChatGPT, Claude, Gemini, local models, other agents, or no LLM at all. The repository, not any particular model or conversation, is the shared project memory.

Agents MUST follow the applicable `AGENTS.md` files when working in a directory. Directory-specific rules refine these root rules; they MUST NOT contradict the source-of-truth rules above.

Agents MUST:

- read the relevant instructions before editing;
- treat existing research records as evidence to inspect, not as unquestionable conclusions;
- preserve provenance and distinguish direct evidence from interpretation;
- record important new discoveries in `research/` so that other contributors and models can continue the investigation;
- avoid putting transient chain-of-thought
- record concise research conclusions, source references, unresolved questions, and useful next actions rather than private reasoning traces;
- use Git history as the audit trail for substantive research changes;
- avoid overwriting another contributor's work and obtain the current file version before updating a shared file;
- prefer small, reviewable commits.
- When a suitable remote and the required authority are available, push focused commits with helpful, specific messages after validating the changes. Do not force-push, rewrite history, or expose credentials. If pushing is unavailable, leave the local commit intact and report that limitation.

No agent is authoritative merely because it produced a statement. Claims require evidence appropriate to the claim.

## Research records

A research record SHOULD make it possible for another human or model to continue the work without access to the original conversation. Where practical, record:

- what was investigated;
- the relevant person, organisation, event, or infrastructure;
- the source and stable URL or archive reference;
- source date and retrieval date where useful;
- what the source directly establishes;
- what is inferred rather than directly stated;
- confidence or corroboration status where useful;
- unresolved questions and useful next searches;
- links to related research records and published pages.

Do not record hidden model reasoning. Record the evidence, conclusions, uncertainty, and reproducible research trail.

At the end of every research lookup, save a concise record in the appropriate `research/` directory before reporting completion. The record MUST include the source and retrieval details, what the source directly establishes, interpretation, unresolved questions, and an explicit confidence level for each material conclusion. Use `High`, `Medium`, `Low`, or `Unverified`; confidence MUST reflect the quality and corroboration of the evidence, not the agent's subjective certainty.

## Action tracking

When recording future work, follow-up research, unresolved mapping, or other actionable items, use the TODO Tree markers configured in `termiwiki.code-workspace`: `TODO`, `ROADMAP`, `FIXME`, `BUG`, `HACK`, `XXX`, or `NOTE`, as appropriate. Prefer Markdown task checkboxes, for example `- [ ] TODO: verify this source` and `- [x] TODO: verify this source` when complete. Keep actionable items in the appropriate research or project-tracking page, rather than embedding them in historical source text. Do not use an unconfigured synonym such as `ACTION` when a TODO Tree marker is suitable.

## Task tracking and GitHub Issues

The repository uses both `TODO.md` and GitHub Issues for project task tracking.

- `TODO.md` is the portable repository-level working queue. It MUST remain useful when working offline, from another computer, or without GitHub access.
- GitHub Issues are used for discussion, task history, and coordination. Where a TODO item has a corresponding issue, the issue number and status SHOULD be kept aligned with `TODO.md`.
- Before starting substantial work, check `TODO.md`. If GitHub is available, consult the corresponding GitHub Issue for discussion, history, and additional context.
- When completing work covered by a GitHub Issue, update the repository TODO item and the issue as appropriate. If GitHub is unavailable, the local TODO state remains sufficient to continue the work and can be synchronised later.
- Do not close a GitHub Issue merely because research has started. Close it only when its stated completion criteria have been satisfied and, where applicable, the result has been verified.
- When creating a new research task, prefer adding it to `TODO.md` and create a GitHub Issue when discussion, tracking, or collaboration would benefit from one.
- Do not duplicate the full contents of GitHub Issues in `AGENTS.md`; use issue numbers and `TODO.md` as the task-level references.

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
- Use Obsidian wikilinks for local media and content where that is already the repository convention, e.g. `![[media/example.jpg]]`.
- Public media referenced by `source/` MUST be stored under `source/media/`.
- Research-only media MUST be stored under `research/media/`, with a research record identifying its provenance, access boundary, and checksum where practical. It MUST NOT be embedded in `source/` or generated output.
- Private correspondence, private-group captures, and personal material may be retained in `research/media/` only with the project maintainer's explicit approval. Keep it out of `source/`, minimise unnecessary personal data, and record a concise evidence summary rather than treating a screenshot as publication-ready text.
- Use ordinary Markdown links for external websites and archived sources.
- Use **Markdown footnotes for references and citations**. Keep source URLs inside the footnotes rather than using inline reference URLs in the prose. Footnotes SHOULD identify the source, date, and document or page title sufficiently for historical source criticism.
- Ordinary internal navigation links and local media links MAY use Obsidian wikilinks; these are not source citations.
- Do not introduce DokuWiki syntax into newly written content unless preserving an explicit historical source fragment.
- If migrating old DokuWiki content, preserve useful provenance and normalise syntax only as far as necessary for Obsidian/Quartz.

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
- New public local-media references MUST use the `source/media/` location and its corresponding Obsidian path, e.g. `![[media/example.jpg]]`. Research-only material is referenced from research records and is not published.

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
2. Determine whether the requested change belongs in `source/`, `research/`, `scripts/`, `README.md`, or generated output.
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
- For requested repository changes, commit and push the validated focused work by default. Treat this as the normal hand-off unless the user explicitly requests a local-only change or push is unavailable. Do not include unrelated work, force-push, rewrite history, or expose credentials; report any push limitation clearly.
- Before updating an existing GitHub file, obtain its current blob SHA and update from that version to avoid overwriting concurrent changes.

## Important safety rule

The deployment script contains production paths and performs a destructive `rsync --delete`. Treat deployment as a production operation, not as a build/test command. Building and validating the site locally MUST be separated from publishing it.
