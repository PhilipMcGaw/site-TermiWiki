---
title: Historical DNS/IP investigation pass
status: lead-only
confidence: medium for network attribution; low for TermiSoc server attribution
retrieved: 2026-09-17
---

# Historical DNS/IP investigation pass

## Source

Targeted searches were made for historical DNS/IP evidence connecting `termisoc.org` and known historical hosts to University of Plymouth address space, including:

- `termisoc.org`
- `area51.termisoc.org`
- `lists.termisoc.org`
- `lug.termisoc.org`
- `82.70.193.184/29`
- `141.163.0.0/16`

The University of Plymouth Wikidata record cites a RIPE database object for `82.70.193.184/29` and also records `141.163.0.0/16` as IPv4 routing prefixes associated with the University. The Wikidata statement was retrieved in 2019 and links directly to RIPE database references. This is institutional network attribution, not evidence that the range was used by TermiSoc.

Source: https://www.wikidata.org/wiki/Q1711558

The April 2001 Devon & Cornwall LUG mailing-list archive independently preserves the historical TermiSoc hostnames `area51.termisoc.org`, `lug.termisoc.org`, and `lists.termisoc.org`, including `area51.termisoc.org` as the mailing-list host and `lists.termisoc.org` as the Majordomo host.

Source: https://www.dcglug.org.uk/archive-Nov00-May01/msg00392.html

ViewDNS documents that its IP History service contains historical domain-to-IP records and claims decades of coverage, but the accessible interface does not expose the requested TermiSoc result without using its lookup service/API. DNSlytics similarly documents historical hosting/DNS data, but its historical hosting interface is premium and its publicly documented collection does not provide a directly queryable result here.

Sources:
- https://viewdns.info/iphistory/
- https://viewdns.info/api/ip-history/
- https://dnslytics.com/hosting-history/

## Direct evidence

1. `82.70.193.184/29` is recorded as an IPv4 routing prefix associated with the University of Plymouth, with a RIPE reference covering `82.70.193.184`–`82.70.193.191`.
2. `141.163.0.0/16` is also recorded as a University of Plymouth IPv4 routing prefix.
3. No searched source returned a direct mapping between any of those addresses and `termisoc.org` or the historical TermiSoc hostnames.
4. Searches for literal combinations of the TermiSoc hostnames and the candidate IP ranges produced no additional indexed evidence.
5. Searches of indexed historical mail material did not expose a usable `Received:` header containing a TermiSoc server IP.
6. The known 2001 hostnames therefore remain useful DNS archaeology targets, but the actual historical A records remain unresolved.

## Interpretation

The `82.70.193.184/29` range should remain a **network-attribution lead**, not a TermiSoc server identification. It is particularly unsafe to infer that all addresses in the range belonged to TermiSoc merely because the range is associated with the University of Plymouth.

The same caution applies to `141.163.0.0/16`: it establishes University network ownership/attribution but does not identify the society's machines.

The strongest current evidence for the three-server configuration remains the later first-hand recollection by Keith Langmead. The DNS/IP investigation has not yet identified the three server addresses or established which historical hostname mapped to which physical machine.

## Open questions

- Can historical RIPE database versions identify earlier allocations or reassignment details for the University address space?
- Can Internet Archive/CDX or another archive recover DNS-era pages, configuration files, or mail headers containing literal IP addresses?
- Did `area51`, `lists`, `lug`, `mooseblaster`, or the main `termisoc.org` host have distinct A records, or were several services colocated?
- Were the three Linux servers assigned addresses from the University's `141.163.0.0/16`, from another University allocation, or from a separately routed block?
- Can old DNS zone files, LUG documentation, sysadmin discussions, or University network records identify the server names?

## Publication impact

Do **not** publish any of the candidate IP addresses as TermiSoc server addresses. At present they should be retained as infrastructure-research leads only.

## Confidence

- University attribution of `82.70.193.184/29`: **high**, based on the cited RIPE-linked institutional record.
- University attribution of `141.163.0.0/16`: **high**, based on the cited institutional record.
- Use of either range by TermiSoc: **unresolved**.
- Identification of any individual historical TermiSoc server IP: **not established**.
