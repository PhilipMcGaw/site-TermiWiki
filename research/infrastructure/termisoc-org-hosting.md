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
