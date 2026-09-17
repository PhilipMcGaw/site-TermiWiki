---
type: source
status: reviewed
subject: "TermiSoc GitHub organisation"
source_type: public-git-hosting
retrieved: 2026-09-17
---
# TermiSoc GitHub organisation

The public [TermiSoc GitHub organisation](https://github.com/termisoc) describes itself as the Plymouth University Computing Society and lists seven public repositories. The organisation page places the account in Plymouth, UK and links to `termisoc.org`.[^organisation]

## Repositories

- [`termi`](https://github.com/termisoc/termi) — created March 2010; a TermiShell/simple extensible Linux shell project. The repository currently contains an empty README according to the public tree, so its Git history may be more informative than the current tip.
- [`Nominations-Site`](https://github.com/termisoc/Nominations-Site) — created February 2011 and marked archived; PHP/CSS/HTML for executive nominations for the 2011–2012 academic year. Its README identifies Nick Charlton as the original designer and describes a database schema, but no database or member data is included in the public tree.[^nominations]
- [`mailman-theme`](https://github.com/termisoc/mailman-theme) — created October 2011; custom Mailman 2.1.11 HTML templates used by TermiSoc. The public tree contains a README and HTML templates, but no media assets were found. The README says the customisation was licensed under MIT.[^mailman]
- [`capturetheflag`](https://github.com/termisoc/capturetheflag) — created December 2011; a Python/Django application for a real-world capture-the-flag game.[^ctf]
- [`termibot`](https://github.com/termisoc/termibot) — created August 2012; Python IRC bot software for `#termisoc`, with plugins, configuration, and a SQL schema.[^termibot]
- [`SkyPi`](https://github.com/termisoc/SkyPi) — created October 2013; a weather-balloon project repository. Its current tree could not be read through the GitHub API during this review, so the repository and history remain preservation candidates rather than assessed evidence.[^skypi]
- [`hubot`](https://github.com/termisoc/hubot) — created September 2016; a CoffeeScript Hubot instance for TermiSoc Slack, with a small custom script set.[^hubot]

## Preservation recommendation

Preserve Git history, branches, tags, release metadata, README files, licences, and issue or pull-request discussions where publicly available. The most historically valuable first targets are `Nominations-Site`, `mailman-theme`, `termibot`, and `capturetheflag`, because their descriptions tie them directly to TermiSoc operations, elections, mailing-list infrastructure, and society activities.

Do not assume GitHub repository creation dates are the dates the projects began. Do not copy repository contents into `source/` without a specific historical purpose; a repository snapshot or research record should remain separate from the curated vault.

No repository was cloned or copied during this review, and no published pages were changed.

[^organisation]: GitHub, [TermiSoc organisation](https://github.com/termisoc), retrieved 17 September 2026.
[^nominations]: GitHub, [TermiSoc Nominations-Site README](https://github.com/termisoc/Nominations-Site#readme), retrieved 17 September 2026.
[^mailman]: GitHub, [TermiSoc mailman-theme README](https://github.com/termisoc/mailman-theme#readme), retrieved 17 September 2026.
[^ctf]: GitHub, [TermiSoc capturetheflag README](https://github.com/termisoc/capturetheflag#readme), retrieved 17 September 2026.
[^termibot]: GitHub, [TermiSoc termibot README](https://github.com/termisoc/termibot#readme), retrieved 17 September 2026.
[^skypi]: GitHub, [TermiSoc SkyPi repository](https://github.com/termisoc/SkyPi), retrieved 17 September 2026.
[^hubot]: GitHub, [TermiSoc hubot README](https://github.com/termisoc/hubot#readme), retrieved 17 September 2026.