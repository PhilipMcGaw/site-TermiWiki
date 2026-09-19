---
type: evidence
status: active
subject: "Rich Jeffery and David Pithouse — infrastructure/person deep dive"
date: 2026-09-17
source_type: mixed-public-web-and-user-identification
confidence: "High for the individual TermiSoc roles and the ~moose identity; High for the @mooseblaster identity; Medium for the historical mooseblaster.termisoc.org hostname mapping because the original hostname record has not yet been independently recovered"
---

# Rich Jeffery and David Pithouse — infrastructure/person deep dive

## Scope

Focused archaeology of two people whose identities are connected to distinct TermiSoc technical resources:

- `~moose` — **David Pithouse**.
- `mooseblaster.termisoc.org` — **Rich Jeffery**.

The two mappings must not be conflated.

## David Pithouse

### Direct TermiSoc evidence

A preserved PHP/MySQL tutorial identifies the presenter as `David Pithouse Termisoc Secretary`. The transcript contains several historical TermiSoc infrastructure references, including:

- `http://phpmyadmin.termisoc.org/`;
- `http://www.termisoc.org/~moose/tutorials`;
- `http://www.termisoc.org/~moose/tutorials/scary.txt`;
- `http://www.termisoc.org/~moose/tutorials/mysql1.php`;
- `/home/hons/moose/public_html/tutorials/mysql1.php`;
- `termisoc@termisoc.org`.

The tutorial therefore directly links David Pithouse, the `~moose` namespace, and TermiSoc's PHP/MySQL teaching infrastructure.

Source:
- https://www.slideserve.com/matteo/mysql-and-php-tutorial-powerpoint-ppt-presentation

### University chronology

David Pithouse's current LinkedIn profile records Plymouth University from 2000–2004, studying Computing and Informatics and specialising in query optimisation and data modelling outside relational models. This is retrospective self-reported evidence and should not be treated as contemporaneous documentation.

Source:
- https://uk.linkedin.com/in/davidpithouse

### Interpretation

The combination of the `~moose` namespace, the tutorial material, and the explicit TermiSoc Secretary attribution makes **David Pithouse → `~moose`** a strong identity mapping.

The tutorial also provides unusually good evidence of the practical services exposed by TermiSoc infrastructure: PHP/MySQL hosting, phpMyAdmin, student-facing examples, and a dedicated home directory/public_html structure.

The material does **not** by itself establish that every application or tutorial under the namespace was a formal TermiSoc project; it establishes that David used TermiSoc infrastructure while acting as Secretary and presenting the material in a TermiSoc context.

## Rich Jeffery

### Direct TermiSoc evidence

A LinuxQuestions thread dated 18 May 2004 was posted as `Rich@Termisoc`. The author describes attempting to add users to the `Termsioc (University Of Plymouth CS) servers`, including changing passwords and dealing with a Fedora installation. The signature identifies the author as `Rich Jeffery` and `Termisoc President`.

The thread therefore provides direct evidence that Rich Jeffery was President in May 2004 and was personally involved in administration of TermiSoc servers.

Source:
- https://www.linuxquestions.org/questions/linux-general-1/adduser-and-passwrd-in-fedora-1-92-is-producing-errors-182976/

A preserved presentation, *The Future of Video Gaming*, is attributed on its first slide to `Rich Jeffery President of TermiSoc`. The current Slideserve upload is dated 28 March 2019, so this is corroborating evidence for the attribution rather than reliable evidence of the original presentation date.

Source:
- https://www.slideserve.com/quincy/the-future-of-video-gaming-powerpoint-ppt-presentation

### `mooseblaster` identity

A public X profile is indexed as:

- Name: **Rich Jeffery**
- Handle: **@mooseblaster**
- Location: Bristol, UK
- Joined X: May 2007
- Bio describes software development, sound, bass, gaming and related interests.

Source:
- https://twitter.com/mooseblaster/with_replies

This independently corroborates the modern identity **Rich Jeffery → `mooseblaster`**.

The project maintainer reports that the Facebook profile [chrissey.harrison](https://www.facebook.com/chrissey.harrison) visibly states that its holder is married to [Rich Jeffery](https://www.facebook.com/rich.jeffery), corroborating the relationship to Rich / `mooseblaster`. This is a private research relationship lead only; the profile's current relationship-date detail is deliberately omitted. It is not used to infer a TermiSoc role, publish personal relationship information, or identify the historical Christine Harrison record without further corroboration.

### Historical hostname mapping

The project records the user's identification that **`mooseblaster.termisoc.org` was Rich Jeffery**. This is retained as explicit user-supplied archaeological evidence.

A targeted public-web search performed on 2026-09-17 did not recover an original page, DNS record, mailing-list header, or other independent source explicitly connecting the historical hostname `mooseblaster.termisoc.org` to Rich Jeffery. The hostname mapping should therefore remain marked as a user identification pending independent corroboration.

This is nevertheless a high-value lead because the independently corroborated `@mooseblaster` identity provides a plausible continuity of the distinctive handle across periods, while the historical TermiSoc evidence independently establishes Rich's role and technical involvement.

## Combined infrastructure significance

The two identities provide separate but complementary technical traces:

| Resource | Person | Current evidence status |
|---|---|---|
| `termisoc.org/~moose/` | David Pithouse | Strongly corroborated |
| `phpmyadmin.termisoc.org` | TermiSoc infrastructure; used in Pithouse tutorial | Directly preserved in tutorial |
| `mooseblaster.termisoc.org` | Rich Jeffery | User-identified; independent hostname mapping still required |
| TermiSoc CS servers / Fedora administration | Rich Jeffery | Directly corroborated in May 2004 |

These should remain separate person/resource relationships. In particular, `~moose` must not be used as evidence that `mooseblaster` was David Pithouse, and `mooseblaster` must not be used as evidence that `~moose` was Rich Jeffery.

## Further searches

1. Search Internet Archive/UK Web Archive/Arquivo.pt/Common Crawl for `mooseblaster.termisoc.org` and variants.
2. Search old mailing-list archives for `mooseblaster`, `Rich@Termisoc`, and other Rich Jeffery identifiers.
3. Search historical DNS/delegation data for the hostname.
4. Search Rich Jeffery's `@mooseblaster` identity against old personal websites, forums, IRC archives and software projects.
5. Search the surviving `~moose` paths for additional files, especially directory indexes, images, source code and timestamps.
6. Search the PHP/MySQL tutorial for an original publication/event date and any University of Plymouth teaching or society context.

## Retrieval date

2026-09-17
