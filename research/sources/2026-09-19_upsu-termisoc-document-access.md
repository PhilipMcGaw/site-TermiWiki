---
type: research-record
status: access-failure
subject: "UPSU TermiSoc historical documents — current URL checks"
date: 2026-09-19
source_type: institutional-resource-url-check
confidence: Medium
---
# UPSU TermiSoc historical documents — current URL checks

## Source and retrieval

The following queued UPSU URLs were checked by read-only HTTP retrieval on **19 September 2026**:

- <https://www.upsu.com/resources/Termisoc/Risk-Assessment/>
- <https://www.upsu.com/resources/Termisoc/Society-Development-Plan/>
- <https://www.upsu.com/resources/Termisoc/Code-of-Conduct/>
- <https://www.upsu.com/resources/Termisoc/Model-Constitution/>

Each URL returned **HTTP 200** with an empty response body in the current retrieval environment. No document title, file contents, date, committee, or society details were exposed. The response therefore does not establish that the historical documents are present or absent on the current UPSU site.

A normal in-app browser check of the Risk Assessment URL on 19 September 2026 rendered **“Sorry, there was a problem”** and **“The page was not loaded correctly.”** The reload route did not expose a document or download link.

## Archive-equivalent checks

The two queued document paths were checked against the Internet Archive CDX
endpoint on **19 September 2026**, both as exact URLs and as wildcard path
queries:

- <https://www.upsu.com/resources/Termisoc/Risk-Assessment/>
- <https://www.upsu.com/resources/Termisoc/Society-Development-Plan/>

Both queries returned an empty capture set. Common Crawl was also checked on
19 September 2026 for the two exact paths across the 2020–2026 indexes, and
for the broader `upsu.com/resources/Termisoc/*` prefix across older indexes
back to 2012. No captures were returned. These archive-equivalent checks did
not recover document text, metadata, or a downloadable file.

## Interpretation

The URLs remain useful retrieval leads, but the current HTTP responses are insufficient to treat any of the four documents as recovered evidence. Possible explanations include an empty resource wrapper, client-side rendering, a retired document backend, or a retrieval-specific response difference.

## Unresolved questions

- [x] TODO: Recheck the four URLs through a normal browser session if the UPSU pages render client-side content; the Risk Assessment page still failed to load.
- [ ] TODO: Search current UPSU society pages and document indexes for replacement files or archived copies.
- [x] TODO: Check Internet Archive and Common Crawl captures for the exact resource paths; no captures were returned.
