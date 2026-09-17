---
title: Historical DNS/IP investigation for TermiSoc servers
date: 2026-09-17
status: open investigation
confidence: medium for University of Plymouth network context; low for TermiSoc server attribution
---

# Historical DNS/IP investigation

## Source

This investigation searched for historical DNS, IP-address, WHOIS/RIPE, hostname, and mailing-list evidence connecting `termisoc.org` infrastructure to specific Internet Protocol addresses.

Relevant sources:

- April Fools' Day On The Web, 2006: https://aprilfoolsdayontheweb.com/2006.html
- Devon & Cornwall LUG archive, 19 April 2001: https://www.dcglug.org.uk/archive-Nov00-May01/msg00392.html
- University of Plymouth Wikidata record, including historical RIPE reference: https://www.wikidata.org/wiki/Q1711558
- IPinfo University of Plymouth network data: https://ipinfo.io/AS786/141.163.96.0/20
- bgp.he.net University of Plymouth prefix data: https://bgp.he.net/net/141.163.0.0/18

## Direct evidence

### Three servers

A 2006 April Fools archive lists `termisoc.org` with the joke description “3 Linux servers over to Windows Server 2003”. This is **secondary and humorous material** and must not be treated as evidence that a migration occurred. It is nevertheless consistent with the independent first-hand recollection already recorded from Keith Langmead that TermiSoc operated three Linux servers.

### TermiSoc hostnames and infrastructure

The 19 April 2001 Devon & Cornwall LUG announcement preserves the following TermiSoc infrastructure names:

- `area51.termisoc.org`
- `lug.termisoc.org`
- `lists.termisoc.org`

The message was addressed to `lug-list@area51.termisoc.org` and instructed subscribers to contact `majordomo@lists.termisoc.org`. This establishes multiple named TermiSoc hosts in active use in April 2001, but does not expose their IP addresses.

### University of Plymouth historical address space

A University of Plymouth Wikidata record cites a RIPE database object for the IPv4 prefix `82.70.193.184/29`, i.e. addresses `82.70.193.184` through `82.70.193.191`. The record was retrieved in 2019 and identifies this prefix as a University of Plymouth IPv4 routing prefix.

This is useful as a **candidate historical University of Plymouth address range**, but there is currently no direct evidence connecting any address in this /29 to TermiSoc, `termisoc.org`, `area51`, `lug`, `lists`, or any of the three servers.

The same University of Plymouth record also references the much larger `141.163.0.0/16` range. Current RIPE-derived sources identify portions of `141.163.0.0/16` as University of Plymouth legacy address space, but the currently visible RIPE objects have recent object-creation dates and therefore should not be used as proof of the exact allocation or routing in the early 2000s.

## Interpretation

The search has produced a potentially useful historical network lead: **82.70.193.184/29** is independently recorded as a University of Plymouth IPv4 routing prefix in a source carrying a 2019 RIPE reference.

However, it is **not currently justified to assign any of these eight addresses to a TermiSoc server**. In particular, the existence of a University of Plymouth allocation does not establish that the TermiSoc servers were located in that subnet, nor that the public-facing DNS records for `termisoc.org` used addresses from it.

The current `141.163.*` University of Plymouth address space is useful for understanding later university networking, but should not be projected backwards into the TermiSoc period without historical routing/DNS evidence.

## Corroboration

The 2001 LUG announcement independently confirms that TermiSoc DNS naming was already sufficiently developed to operate separate hosts for LUG and mailing-list services. This makes a historical DNS/IP trail plausible, but the present search did not recover the corresponding A records.

The 2006 April Fools listing is corroborating context only and is explicitly excluded from direct server/IP attribution.

## Open questions

1. What A records did `termisoc.org`, `area51.termisoc.org`, `lug.termisoc.org`, and `lists.termisoc.org` publish in 1999–2006?
2. Did those names point directly to the three physical Linux servers, or were several services colocated behind one address?
3. What hostnames were assigned to the three machines?
4. Was `82.70.193.184/29` actually used by TermiSoc, or was it simply another University of Plymouth allocation?
5. Are there historical RIPE database snapshots, routing tables, mail headers, or archived configuration files that map TermiSoc hostnames to addresses?

## Next investigation

The next useful step is **historical network enumeration**, not another general web search:

- search historical RIPE/WHOIS records for the University of Plymouth allocations;
- enumerate historical reverse DNS/PTR information where available;
- search archived mail headers for `termisoc.org` hosts;
- examine archived pages/configuration references containing literal IP addresses;
- test each known TermiSoc hostname against historical archive captures and passive-DNS datasets where accessible;
- compare any candidate IP with the dates of the known TermiSoc services before attributing it to a server.

## Publication impact

No published TermiWiki claim should currently state that `82.70.193.184/29`, `141.163.0.0/16`, or any individual address belonged to a TermiSoc server. The /29 should be retained as a **network-attribution lead only**.
