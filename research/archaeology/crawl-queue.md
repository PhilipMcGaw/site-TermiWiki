---
type: research-control
status: active
subject: "TermiWiki archaeology crawl queue"
created: 2026-09-17
updated: 2026-09-17
---

# TermiWiki archaeology crawl queue

Persistent queue for repeatable TermiSoc historical archaeology. This file defines **what to investigate**, **where access is expected**, and **how to record access state**. It is not itself evidence.

## Operating principles

- Public web research may be performed directly where technically available.
- Mac/browser targets are intended for later execution from the user's Mac, where ordinary browser access and authorised authenticated sessions may be available.
- Facebook and LinkedIn authenticated access must not be assumed from this chat.
- Do not bypass authentication, CAPTCHAs, anti-bot controls, access restrictions, or platform restrictions.
- Treat `blocked`, `inaccessible`, and `no evidence found` as different outcomes.
- Preserve exact historical URLs even when they no longer work.
- Save genuinely new findings to `research/` before reporting completion.
- Do not repeatedly re-run unchanged targets merely because a previous search was inconclusive.
- Do not store unnecessary private personal information. Personal relationships are not TermiSoc evidence and should not be added merely for context.

## Rate limiting — authenticated social platforms

LinkedIn and Facebook require conservative, stateful access handling.

```yaml
linkedin:
  concurrency: 1
  parallel_requests: false
  daily_budget: conservative
  randomised_delay: true
  persistent_last_checked: true
  stop_on_captcha: true
  stop_on_challenge: true
  stop_on_unusual_traffic: true
  aggressive_retries: false
  bypass_controls: false

facebook:
  concurrency: 1
  parallel_requests: false
  daily_budget: conservative
  randomised_delay: true
  persistent_last_checked: true
  stop_on_captcha: true
  stop_on_challenge: true
  stop_on_unusual_traffic: true
  aggressive_retries: false
  bypass_controls: false
```

If a platform presents an anti-automation or access challenge, stop that platform's queue and record the state. Do not attempt to disguise or circumvent automation.

## LinkedIn access-state schema

For every person checked through LinkedIn, record only research-relevant access information:

```yaml
linkedin:
  url: ""
  public_searchable: unknown
  profile_viewable: unknown
  useful_termisoc_evidence_visible: unknown
  connection_status: "unknown" # not_connected | requested | connected | unknown
  last_checked: null
  recheck: false
  access_result: "queued" # queued | visible | inaccessible | blocked | no_evidence | error
  notes: ""
```

A profile being inaccessible is **not** evidence that it contains no TermiSoc information.

## Queue status vocabulary

Use one of:

- `queued`
- `in_progress`
- `searched`
- `recovered`
- `no_evidence`
- `inaccessible`
- `blocked`
- `needs_manual_review`
- `recheck`
- `superseded`

## Priority

- `P1` — likely to recover primary/contemporaneous evidence or a significant identity/infrastructure bridge.
- `P2` — useful corroboration or likely identity resolution.
- `P3` — exploratory / lower-yield search.

---

# Queue A — historical username space

## Known namespaces

| Priority | Username/host | Current interpretation | Target |
|---|---|---|---|
| P1 | `~j` | unidentified | Recover files and identify owner |
| P1 | `~andyk` | unidentified | Recover ChemFan pages/archive and identify owner |
| P1 | `~harl` | unidentified | Recover surviving personal page and identify owner |
| P2 | `~penfold` | unidentified | Recover Deep Thought/Hitchhiker page and identify owner |
| P2 | `~aande` | unidentified | Re-search historical personal/caving page and identify owner |
| P2 | `~moose` | David Pithouse | Recover additional material |
| P2 | `~betty` | Aaron Trevena | Recover additional material |
| P2 | `mooseblaster.termisoc.org` | Rich Jeffery, user-supplied mapping | Seek original documentary hostname evidence |

## Generic searches

Run exact historical URL-pattern searches for:

```text
"termisoc.org/~"
"www.termisoc.org/~"
"termisoc.org/~" Plymouth
"www.termisoc.org/~" Plymouth
"http://termisoc.org/~"
```

For each newly discovered username:

1. Add it to this queue.
2. Search the exact URL.
3. Search the username without the domain.
4. Search associated content/title terms.
5. Attempt identity resolution only where evidence supports it.
6. Preserve unresolved aliases as aliases rather than guessing a person.

---

# Queue B — high-value historical assets

## `~j` spreadsheets

P1 — recover original binaries, preferably unchanged:

```text
http://www.termisoc.org/~j/files/example.xls
http://www.termisoc.org/~j/files/SWdata.xls
```

Wayback targets:

```text
https://web.archive.org/web/*/http://www.termisoc.org/~j/files/example.xls
https://web.archive.org/web/*/http://www.termisoc.org/~j/files/SWdata.xls
```

If recovered:

- preserve original bytes;
- calculate SHA-256;
- inspect workbook metadata, sheets, formulas, names, dates and other historical clues;
- create media/research sidecars;
- do not silently edit or re-save the original.

## TermiSoc Wiki images

P1 — recover if archived:

```text
http://termisoc.org/wiki/uploads/d/d3/Scrn1.jpg
http://termisoc.org/wiki/uploads/a/a5/Scrn2.jpg
```

Wayback:

```text
https://web.archive.org/web/*/http://termisoc.org/wiki/uploads/d/d3/Scrn1.jpg
https://web.archive.org/web/*/http://termisoc.org/wiki/uploads/a/a5/Scrn2.jpg
```

Recovered images belong under `media/` with the project's normal sidecar provenance record.

---

# Queue C — historical TermiSoc web space

P1:

```text
http://www.termisoc.org/wiki/
http://termisoc.org/wiki/
https://www.termisoc.org/wiki/
http://www.termisoc.org/~j/
http://www.termisoc.org/~andyk/
http://www.termisoc.org/~harl/
```

Wayback wildcard targets:

```text
https://web.archive.org/web/*/http://www.termisoc.org/wiki/*
https://web.archive.org/web/*/http://www.termisoc.org/~j/*
https://web.archive.org/web/*/http://www.termisoc.org/~andyk/*
https://web.archive.org/web/*/http://www.termisoc.org/~harl/*
https://web.archive.org/web/*/http://www.termisoc.org/~penfold/*
https://web.archive.org/web/*/http://www.termisoc.org/~aande/*
https://web.archive.org/web/*/http://www.termisoc.org/~moose/*
https://web.archive.org/web/*/http://www.termisoc.org/~betty/*
```

Known infrastructure targets:

```text
http://phpmyadmin.termisoc.org/
http://lists.termisoc.org/
http://area51.termisoc.org/
http://lug.termisoc.org/
http://termisoc.org/cgi-bin/mailman/listinfo/chemfan
```

These are infrastructure archaeology targets; hosting does not by itself establish project ownership.

---

# Queue D — D&C LUG / Linux archaeology

P1 — historical archive:

```text
https://www.dcglug.org.uk/archive/
https://www.dcglug.org.uk/archive-Nov00-May01/
```

Search archive content for:

```text
Alex Charrett
Aaron Trevena
TermiSoc
termisoc.org
area51.termisoc.org
lug.termisoc.org
lists.termisoc.org
FOOCHRE
YAXU
slab
state51
```

P1 — Linux Format historical PDFs:

```text
https://linuxformat.com/files/pdfs/LXF001.pdf
https://linuxformat.com/includes/download.php?PDF=LXF10.complete.pdf
```

Search for D&C LUG, TermiSoc, Alex Charrett and related infrastructure.

---

# Queue E — mailing-list / forum archaeology

P1 sources:

- Mail-Archive
- The Register Forums
- LinuxQuestions
- Linux Format / Linux User & Developer archives
- Google Groups / archived Usenet
- Stack Overflow / Server Fault / Super User

Search by **person and alias**, not only `TermiSoc`.

High-priority exact terms:

```text
TermiSoc
termisoc.org
area51.termisoc.org
lug.termisoc.org
lists.termisoc.org
~betty
~moose
~andyk
~j
~harl
~penfold
~aande
mooseblaster
```

---

# Queue F — Facebook authenticated/manual pass

The user is a member of the historical TermiSoc Facebook group. This access must be performed through an authorised browser/session when available.

## Group searches

```text
TermiSoc
termisoc.org
Computing Society
Plymouth Computing
Plymouth University Computing
Plymouth Polytechnic Computing
TermiHouse
Sun Lab
Linux
LAN
Hack
Game
Minecraft
```

## People to search

```text
Ben A'Lee
Aaron Trevena
Alex Charrett
Rich Jeffery
David Pithouse
Ross Bearman
Nick Charlton
Joe Earlam
Siddharth Vadgama
Edward Knapp
Jacob Gathercole
Elly Kensington
Matt Farrell
Jamie Woods
Chris Hunt
Luke Davies
Georgie Aggett
Alex McLean
Marc Flamank
Keith Langmead
```

Prioritise old posts, photographs, event announcements, committee discussions, website/server references, screenshots and posts/comments containing historical usernames or URLs.

Facebook results are leads unless their content independently establishes the historical claim.

---

# Queue G — LinkedIn authenticated/manual pass

LinkedIn is an **identity and chronology source first**, not automatically primary TermiSoc evidence.

## Priority people

### Early period

```text
Aaron Trevena
Alex Charrett
Rich Jeffery
David Pithouse
Ben A'Lee
Alex McLean
Dominic Norton
Jason Hill
Ryan Carson
Ed McCaughan
```

### 2007–2012

```text
Ross Bearman
Nick Charlton
Christopher Jenkins
David Ward
Joshua von Eicken
Matthew Peter Weikert
György S.
Michael Wade
Chris Tandy
Elliot Straughan-Horwood
```

### 2012 onwards

```text
Joe Earlam
Siddharth Vadgama
Edward Knapp
Jacob Gathercole
Elly Kensington
Matt Farrell
Jamie Woods
Leigh Brooks
Florian Brett
Connor Baxter
Richard Gibson
Daryl Ladd
Harriet Eldred
Ant Robinson
Harry Billington
Simon Cotts
Christopher Pratt
```

### 2011 technical/social leads

```text
Chris Hunt
Luke Davies
Georgie Aggett
```

For each profile, record the access-state schema above. If connected later, mark `connection_status: connected` and `recheck: true` so a future pass revisits the profile rather than assuming the previous result was complete.

Do not infer membership merely because two people are connected or appear in the same social network.

---

# Queue H — committee/role searches

Search public and authenticated sources for exact combinations:

```text
"TermiSoc" "Treasurer"
"TermiSoc" "Secretary"
"TermiSoc" "Chairman"
"TermiSoc" "President"
"TermiSoc" "Technical Officer"
"TermiSoc" "Tech Officer"
"TermiSoc" "Safety Officer"
"Computing Society" Plymouth Chairman
"Computing Society" Plymouth Treasurer
"Computing Society" Plymouth Secretary
```

Use results to identify missing committee members and resolve date ranges. Do not rank people or infer roles without evidence.

---

# Queue I — current unresolved identity leads

P1:

- `~j` — identify owner from spreadsheet content and surrounding references.
- `~andyk` — identify ChemFan maintainer.
- `~harl` — identify owner from surviving historical material.

P2:

- `~penfold` — identify owner of Deep Thought/Hitchhiker material.
- `~aande` — re-search and identify owner.
- Alex McLean — seek bridge between Plymouth identity, FOOCHRE/YAXU, D&C LUG and TermiSoc; do not merge with the modern Greater Plymouth Alex McLean without evidence.
- Keith Langmead — evidence plateau; revisit only when a genuinely new source/lead appears.

---

# Crawl result record

Every completed target should leave a concise record containing:

```yaml
target: ""
access_class: public # public | mac_authenticated | facebook_authenticated | linkedin_authenticated
status: searched
first_checked: 2026-09-17
last_checked: 2026-09-17
next_recheck: null
source_urls: []
archive_urls: []
access_result: visible
new_evidence: false
confidence: Unverified
notes: ""
```

The queue itself should not become a dumping ground for extracted evidence. Material findings belong in the appropriate `research/people/`, `sources/`, `infrastructure/`, `events/`, `evidence/`, or `leads/` record.

## Completion rule

A crawl pass is complete only after:

1. targets were attempted according to their access class;
2. access failures/challenges were recorded;
3. genuinely new findings were saved to the research corpus;
4. unchanged or already-known evidence was not duplicated merely to show that a target was visited;
5. unresolved leads and useful next searches were recorded where appropriate.
