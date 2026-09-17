---
type: infrastructure
status: observed
subject: "termisoc.org DNS and hosting lead"
date: 2026-09-17
source_type: "DNS lookup and HTTP observation"
retrieved: 2026-09-17
---

# `termisoc.org` DNS and hosting lead

## Source and retrieval

A read-only DNS lookup for `termisoc.org` was performed on 17 September 2026 using the A-record resolver available to the research environment. An HTTPS HEAD request was also attempted on the same date.

## Direct evidence

- The current A record resolved as `termisoc.org -> 217.144.94.204`.
- The returned DNS TTL was 300 seconds.
- The HTTPS request returned `502 Bad Gateway`, so successful web serving was not confirmed by that request.

## Historical web-archive evidence

Wayback captures provided useful infrastructure evidence, although no archived WHOIS snapshot was found for `whois.domaintools.com/termisoc.org`.

- A 3 January 2006 capture of the TermiSoc homepage described `termisoc.org` as the society's official website and linked to TermiSoc webmail, PHPMyAdmin, Mailman lists, a CD library, hosted user sites, and the Flux BBS.[^termisoc-home-2006]
- A 2 January 2006 capture of `userpages.php` was headed "Sites hosted on our servers". Its user list included Benjamin A'Lee at `benalee.co.uk`, alongside Rich Jeffery, Philip McGaw, Gemma Peter, Daniel Cosser, Chris Morris, Martin Rodford, Michael Wood, Edmund Russell, Matt Campbell, Angus Ellis, and others.[^termisoc-hosted-2006]
- A 29 August 2005 capture also linked TermiSoc webmail, PHPMyAdmin, mailing lists, the CD library, user pages, and UPSU Radio as TermiSoc tools or services.[^termisoc-tools-2005]
- The archived WikiHistory page was served by a host identified in its HTML comment as `arthur`; this is a useful machine-name lead, but it does not by itself identify the physical server or IP address.[^termisoc-wiki-2006]

These captures directly establish historical TermiSoc-hosted web services and a hosted relationship with Ben A'Lee's site. They do not establish that the historical server was `217.144.94.204`, nor that the current reverse-IP neighbours share the same historical infrastructure.
## Reverse-IP lookup result

On 17 September 2026, HackerTarget's reverse-IP lookup was checked for the address currently returned by `termisoc.org`, `217.144.94.204`. It listed the following hostnames as sharing or being associated with that IP in its A-record dataset:

- `19mr.net`
- `boxes.nickcharlton.net`
- `delightful.photos`
- `delightful.systems`
- `elep-project.eu`
- `kb.elep-project.eu`
- `lb-01.nullgrid.net`
- `mas.elep-project.eu`
- `mas.nickcharlton.net`
- `mastodon.nickcharlton.net`
- `matrix.elep-project.eu`
- `matrix.nickcharlton.net`
- `nickcharlton.net`
- `nullgrid.com`
- `nullgrid.net`
- `supplycatalogue.com`
- `termisoc.org`
- `wiki.nullgrid.net`
- `www.elep-project.eu`
- `www.termisoc.org`

HackerTarget explains that reverse-IP lookup identifies hostnames with DNS A records associated with an IP and may include multiple virtual hosts on shared hosting. Its data is assembled from crawls and other datasets, so the result is an association lead rather than proof that every hostname was simultaneously served by the same physical machine or operated by the same person.[^hackertarget]
## TermiSoc-related interpretation

Two entries are especially relevant to the TermiSoc archive:

- `nickcharlton.net` and several `*.nickcharlton.net` hosts are associated with Nick Charlton, whose existing TermiWiki profile records TermiSoc roles and cites his personal site as a historical reference.[^nick-local]
- `delightful.photos` is currently a Pixelfed site. The project contributor reports that it contains photographs of Ben A'Lee, a documented TermiSoc member, but that photographic association has not yet been independently checked against the site or an archive capture.[^delightful-current]

These relationships make the shared-IP result a promising route for infrastructure and media research. They do not establish that Nick Charlton operated the server, that the listed domains were all hosted there at the same time, or that the IP relationship is historical rather than current or dataset-derived.
## Interpretation

The A record establishes that `termisoc.org` currently points to `217.144.94.204` from the resolver used for this lookup. It does not, by itself, establish that the address is dedicated to TermiSoc, identify the hosting provider, prove historical use of the address, or show that the web service is currently healthy. The 502 response may indicate a proxy, upstream, or virtual-host configuration problem.

## Confidence

- **Current DNS resolution: High.** Directly observed during the lookup, but DNS may change.
- **Website hosting on this IP: Medium.** The domain resolves to the address, but the HTTPS request did not successfully retrieve the site.
- **Historical TermiSoc ownership or operation of the IP: Unverified.** No historical hosting or allocation evidence was established.

## ILS location and later terminology

The current University of Plymouth Babbage Building page gives the address as **24 James Street, Plymouth, PL4 6EQ**.[^babbage-current-address] This is the present building address; it does not independently establish the exact historical address of the TermiSoc server cupboard.

Current University pages use **IT Services** for central IT and **Library and Learning Services** for library and learning support. A staff profile also uses the phrase **Technology and Information Services** for an IT service area.[^current-it-services][^current-library-services][^current-technology-services] The available evidence therefore supports a change from the former ILS name or structure, but does not identify a precise renaming date or a one-to-one successor organisation.

**Confidence:** High for the present Babbage address and current public terminology; Medium for the conclusion that ILS was later reorganised or replaced as a named division; Unverified for the historical postal address of the ILS office or server cupboard.
## ILS expansion

The University of Plymouth source confirms that **ILS** stood for **Information and Learning Services**. A 2006 University of Plymouth author manuscript explains that Information Services (Library) was merged with Information Technology and Communications (Computing and Networks) to form the Information and Learning Services division (ILS).[^ils-expansion]

**Confidence: High** for the expansion of the acronym in the University context. This confirms the existing `source/Glossary/ils.md` wording, although it does not independently confirm the reported TermiSoc IP allocation.
## Reported network provision

The contributor reports that University Information and Learning Services (ILS) allocated TermiSoc three IP addresses from an ILS-controlled address block, and that the network backhaul was supplied through JANET.

Existing TermiWiki evidence supports ILS involvement in the surrounding network environment: the 2005 server-failure account refers to ILS staff and the university network, and later pages describe university firewall and VPN constraints. However, no surviving record currently identifies the three addresses, the allocation date, the relevant ILS block, or the exact JANET service arrangement.

**Confidence: Low to Medium.** The claim is a useful first-hand infrastructure lead and fits the surviving evidence, but it remains unattributed and undocumented in the repository. It should not yet be published as a confirmed historical network allocation.

**Next searches:** identify the address block from historical DNS and archived configuration, search old TermiSoc notices and technical pages for IP addresses, and look for University of Plymouth or JANET documentation naming the relevant service or subnet.
## Physical location lead

The contributor reports that the TermiSoc servers were housed in a cupboard in the Babbage building at the University of Plymouth. Existing TermiWiki material corroborates the general location: the TermiSoc cupboard page describes a literal cupboard in the Babbage building, while the 2005 "Great server failure" account describes accessing the cupboard, removing Apple for repair, and electrical problems affecting Banana in the building.[^cupboard-page][^server-failure]

A later post-history page states that the university required the server to be removed from the cupboard in 2014, providing a separate retrospective reference to the same arrangement.[^post-history]

**Confidence: Medium** for the general claim that TermiSoc servers were housed in a Babbage-building cupboard. The exact room, dates of occupancy, and relationship to the current IP address remain unverified.
## Historical IP lookup methods

The most suitable next step is historical DNS or passive-DNS lookup rather than current WHOIS:

- SecurityTrails documents historical A, AAAA, MX, NS, SOA, and TXT record history by hostname. An account or API access may be required.[^securitytrails-history]
- DomainTools Domain History can combine historical registration, DNS, web, screenshot, and certificate changes, subject to its data coverage and access level.[^domaintools-history]
- Wayback captures can preserve old pages, links, hostnames, and service descriptions even when DNS history is unavailable. They cannot normally prove the IP address used by a page unless the archived content exposes it.
- Certificate Transparency searches can reveal historical hostnames and certificates, but certificate records are not equivalent to DNS or server-hosting records.
- BGP and ASN history can help identify changes in the network announcing an IP range, but does not by itself prove that a particular domain used an address.

For `termisoc.org`, the useful queries are historical A and AAAA records, nameserver history, MX history, and searches for the historical hosts visible in the 2005–2006 Wayback captures. Any result should be recorded with its first-seen, last-seen, source, and retrieval date.
## Targeted web search: TermiSoc, ILS, and JANET

Targeted web searches were performed on 17 September 2026 for:

- `"TermiSoc" JANET`
- `"termisoc" ILS`
- `"termisoc.org" JANET`
- `"University of Plymouth" JANET ILS networking`
- `"Information and Learning Services" JANET Plymouth`

No direct indexed result was found that links TermiSoc to a specific ILS IP allocation or to a named JANET backhaul service. The searches did produce contextual results: University of Plymouth material identifies ILS as providing university IT services, and current University network guidance refers to the JANET Acceptable Use Policy.[^plymouth-ils-context][^plymouth-janet-context]

The result is therefore a **negative search finding**, not evidence that the reported arrangement did not exist. The strongest evidence remains the contributor's infrastructure recollection, existing TermiSoc server material, and any future archived configuration or institutional records.
## 2005–2006 named server inventory

The `2006_notice_to_members.md` page provides a dated, changing inventory of TermiSoc machines:

- **Apple** — suffered catastrophic hard-drive failure on 28 May 2005 and was described as dead; the TermiSoc Wiki was reinstalled following Apple's demise.[^notice-2006]
- **Arthur** — the replacement server announced in June 2005; later described as a projects, backup, mail, and DNS server, though it was repeatedly rebuilt or unavailable.[^notice-2006]
- **Ford** — was backing up to Arthur in August 2005, indicating an active backup relationship at that point.[^notice-2006]
- **Zaphod** — installed by 3 May 2006 and described in the status section as handling web, mail, and databases.[^notice-2006]
- **Trillian** — explicitly listed in the status section as the DNS server, and described as working fine in November 2006.[^notice-2006]
- **Joplin** — a temporary Sun backup machine used while Arthur was unavailable in November 2006; the notice describes it as the Sun box on top of Ben and Dan's fridge.[^notice-2006]

This confirms Trillian as an additional named server, but the page records a sequence of changing roles and temporary replacements rather than a single fixed four-server configuration. The strongest interpretation is that Apple, Arthur, Ford, Zaphod, Trillian, and Joplin belonged to the wider 2005–2006 TermiSoc infrastructure at different points or in changing roles.

**Confidence: High** for the names and stated roles as reported by the notice; Medium for the exact periods of overlap, because the page combines updates and repeated historical material.
## Open questions

- Is `217.144.94.204` a shared or dedicated address?
- What reverse DNS, ASN, and hosting-provider records are associated with it?
- Does the site respond over HTTP, or only for a particular Host header or path?
- Do Wayback captures, old DNS records, certificates, or server archives link this address to TermiSoc historically?

## Related records

- [[../sources/2000-2005_termisoc_email_domain_footprints.md|Public email and mailing-list footprints for termisoc.org]]
- [[../sources/2004-2009_termisoc_archived_web_pages.md|TermiSoc archived web pages]]

[^hackertarget]: HackerTarget, [Reverse IP Lookup](https://hackertarget.com/reverse-ip-lookup/), retrieved 17 September 2026. The page describes the results as hostnames with DNS A records associated with an IP and notes that multiple virtual hosts may share one IP; it also documents the source datasets used by the service.

[^nick-local]: [[../../source/TermiPeople/nick_charlton.md|Nick Charlton]], existing TermiWiki profile; the page records TermiSoc roles and links to https://nickcharlton.net/.
[^delightful-current]: [delightful.photos](https://delightful.photos/), retrieved 17 September 2026. The current site identifies itself as Pixelfed; the claim that it contains Ben A'Lee photographs remains a contributor-supplied lead pending direct image or archive verification.

[^termisoc-home-2006]: Internet Archive, [TermiSoc homepage capture, 3 January 2006](https://web.archive.org/web/20060103104507/http://www.termisoc.org/), retrieved 17 September 2026.
[^termisoc-hosted-2006]: Internet Archive, [TermiSoc hosted sites capture, 2 January 2006](https://web.archive.org/web/20060102131127/http://www.termisoc.org/userpages.php), retrieved 17 September 2026.
[^termisoc-tools-2005]: Internet Archive, [TermiSoc service page capture, 29 August 2005](https://web.archive.org/web/20050829192844/http://list.termisoc.org/), retrieved 17 September 2026.
[^termisoc-wiki-2006]: Internet Archive, [TermiSoc WikiHistory main page capture, 15 January 2006](https://web.archive.org/web/20060115234034/http://wiki.termisoc.org/index.php/Main_Page), retrieved 17 September 2026.

[^securitytrails-history]: SecurityTrails, [DNS history by record type](https://docs.securitytrails.com/reference/dns-history-by-record-type-old-1), retrieved 17 September 2026.
[^domaintools-history]: DomainTools, [Domain History](https://docs.domaintools.com/api/lookups/domain-history/), retrieved 17 September 2026.

[^cupboard-page]: [[../../source/termisoc_cupboard.md|TermiSoc cupboard]], existing TermiWiki source page, retrieved 17 September 2026.
[^server-failure]: [[../../source/great_server_failure.md|Great server failure]], existing TermiWiki source page describing the 27 May–early June 2005 server incidents and access to the cupboard in the Babbage building, retrieved 17 September 2026.
[^post-history]: [[../../source/posthistory.md|Post-History]], existing TermiWiki source page describing removal of the server from the cupboard in 2014, retrieved 17 September 2026.

[^plymouth-ils-context]: University of Plymouth, [Institutional audit report](https://dera.ioe.ac.uk/id/eprint/9734/1/RG283UniversityPlymouth.pdf), retrieved 17 September 2026. The report describes Information and Learning Services as providing library and information-technology services to the university.
[^plymouth-janet-context]: University of Plymouth, [eduroam Wi-Fi](https://www.plymouth.ac.uk/about-us/university-structure/service-areas/it-services/eduroam-wifi), retrieved 17 September 2026. The page references the JANET Acceptable Use Policy in the university network context.

[^ils-expansion]: Graham Titley, University of Plymouth, [Electronic Signatures for Copyright in the UK: a solution to the 'holy grail' of document delivery](https://pure.plymouth.ac.uk/ws/portalfiles/portal/42038539/ILDS%2035.1%20Titley.rev%2030.10.06_2017Edit%20for%20Pearl.pdf), revised author manuscript dated 2006, retrieved 17 September 2026, page 3.

[^babbage-current-address]: University of Plymouth, [Babbage Building](https://www.plymouth.ac.uk/facilities/babbage-building), retrieved 17 September 2026.
[^current-it-services]: University of Plymouth, [IT services](https://www.plymouth.ac.uk/about-us/university-structure/service-areas/it-services), retrieved 17 September 2026.
[^current-library-services]: University of Plymouth, [Library and Learning Services](https://www.plymouth.ac.uk/services/library-services), retrieved 17 September 2026.
[^current-technology-services]: University of Plymouth, [Adrian Jane staff profile](https://www.plymouth.ac.uk/staff/adrian-jane), retrieved 17 September 2026. The profile identifies his service area as Technology and Information Services.

[^notice-2006]: [[../../source/2006_notice_to_members.md|2006 Notice to Members]], existing TermiWiki source page containing updates dated 2005–2006, retrieved 17 September 2026.
