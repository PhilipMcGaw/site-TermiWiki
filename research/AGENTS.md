# Research corpus working rules

`research/` is the shared archaeological evidence and investigation corpus for TermiWiki. It is deliberately separate from the published Obsidian vault in `source/` so that multiple humans and LLM agents can investigate, challenge, and corroborate material without prematurely publishing uncertain claims.

## Rules

1. Research discoveries SHOULD be recorded here before being promoted into `source/`.
2. Do not treat a research record as automatically true merely because another agent wrote it.
3. Preserve the distinction between direct evidence, later recollection, inference, and unresolved lead.
4. Every significant claim SHOULD identify its source, date, and stable URL or archive reference where available.
5. Preserve useful historical URLs even when the original page is unavailable.
6. Do not silently upgrade an inference into an established fact.
7. If evidence conflicts, record the conflict rather than selecting an unsupported answer.
8. Research records SHOULD state what the source directly establishes and what remains interpretation.
9. Record unresolved questions and useful next searches so another contributor can continue the investigation.
10. Do not store private model chain-of-thought.
11. Use concise, reproducible research notes rather than conversational transcripts.
12. At the end of every lookup, save the research result before reporting completion, including source and retrieval details, direct evidence, interpretation, unresolved questions, and an explicit `High`, `Medium`, `Low`, or `Unverified` confidence level for each material conclusion.
13. New editorial prose MUST use British English and the project house style.
14. Historical quotations MUST retain their original wording except where an explicit editorial note explains a necessary transcription correction.

## Suggested record structure

Where appropriate, use:

```yaml
---
type: evidence
status: unverified
subject: "Example subject"
date: 2006-02-01
source_type: mailing-list
---
```

Then record:

- **Source** — title, author, publication/archive, URL, and retrieval date where useful.
- **Direct evidence** — what the source actually says or shows.
- **Interpretation** — what it may imply, clearly labelled as such.
- **Corroboration** — related records supporting or contradicting it.
- **Open questions** — what still needs to be established.
- **Publication impact** — whether an existing `source/` page may need updating.

A research record should be useful to a person or different LLM that has never seen the original conversation.

## Directory meanings

- `evidence/` — individual pieces of documentary evidence.
- `sources/` — source/archive records and provenance.
- `people/` — identity and association research.
- `organisations/` — organisation and relationship research.
- `infrastructure/` — technical infrastructure archaeology.
- `events/` — dated events and activities.
- `leads/` — unresolved hypotheses and research targets.
- `timelines/` — chronological reconstructions supported by evidence.
- `decisions/` — documented research/editorial decisions.

## Publication boundary

Do not assume that finding something in `research/` means it belongs in `source/`. Promotion into `source/` requires appropriate evidence and provenance. When uncertainty remains, the published page may remain marked `DRAFT` or explicitly describe the uncertainty.
