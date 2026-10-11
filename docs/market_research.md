# Weapon Database Market Research

**Research date:** October 11, 2026  
**Scope:** Competitors, current repository baseline, positioning, catalog authority, product priorities, and a proposed 90-day roadmap

## Recommended Position

Weapon Database has competitors. Existing services provide firearms encyclopedias, military indexes, media identification, and authoritative museum records. An attractive interface or interactive rifle alone will not establish authority.

The strongest launch position is **a visual, evidence-backed historical weapons reference connecting weapon types to documented examples, makers, cultures, and sources**. Begin with a bounded collection of historical swords and early firearms. Keep speculative designs in a separate studio gallery. Expand into fictional artifacts after establishing a reliable editorial process.

Authority means users can trace important claims, understand uncertainty, distinguish a weapon type from one surviving object, and cite a permanent page. Build that quality before claiming broad completeness.

This is a strategic hypothesis. The research establishes visible alternatives, not market size, customer demand, traffic, or willingness to pay.

## Evidence And Limits

Research uses competitors’ public pages, institution collection records, official data documentation, and a read-only repository review. The comparison is representative rather than exhaustive; public and account-only features may differ. An unmentioned feature is not a proven absence.

Vendor statements were not independently audited. No market share, revenue, keyword volumes, competitor traffic, or commercial conversion estimates were established. Dates, workload targets, and commercial ideas below are proposals. Source pages were accessed during this research and may change.

## Current Product Baseline

| Area | Observed Current Source | Competitive Implication |
| --- | --- | --- |
| Catalog | Six sample rows: three ARX-27 finishes, Heritage Blade, imagined Atlas Drone, and speculative Future Systems. All are labeled illustrative concepts; Future Systems reuses the drone image. [Samples](../src/shared/catalog/samples.ts) | This is not yet an established catalog of named historical or franchise weapons. Cosmetic variants should not inflate counts of documented models. |
| Discovery | Firearms, Swords, Drones, and Future Tech categories; search across title, subtitle, description, era, and tag. [Catalog](../src/shared/catalog/index.ts), [Search](../src/components/Catalog/useCatalog.ts) | Add aliases, evidence status, and source-aware historical filtering after selecting a real launch corpus. |
| Visual identity | Responsive Expo/Three.js web/PWA, themed interface, draggable original rifle, and cosmetic loadout editor. [README](../README.md) | Retain the presentation advantage, but identify the mesh as an original concept rather than a measured reconstruction. |
| Saved data | Saved weapons/loadouts use localStorage with versioned records, counters, and storage error handling. AsyncStorage adapter exists for future native use. [README](../README.md) | Device-local organization is useful; it is not cloud accounts or cross-device collections. Native screens are not implemented. |
| Routes and services | Landing only; dossiers, journal/history, and information use sections/dialogs. No dedicated record/article routes, connected Firebase, authentication, remote catalog, or analytics. [Routes](../src/shared/routes.ts), [README](../README.md) | Permanent evidence-rich pages and a real corpus are the first reference-product milestone. |

Source review does not establish production behavior. No builds, application runtime, backend checks, or UI verification were performed. The copied `ai/` pack describes intended behavior rather than connected product capability.

## Competitive Landscape

The opportunity column is an interpretation of public evidence, not a claim that competitors lack every recommended feature.

| Service | Relationship | Observed Strength | Opportunity |
| --- | --- | --- | --- |
| [Modern Firearms](https://modernfirearms.net/en/) | Direct modern-firearms reference competitor | Organized firearm classes, English/Russian editions, historical descriptions, and named authorship. [Author page](https://modernfirearms.net/en/about-the-author/) connects the work to Maxim Popenker’s publications. | Match accountable expertise; differentiate through traceable fields and broader historical visual discovery. |
| [Military Factory](https://www.militaryfactory.com/smallarms/index.php) | Direct military-discovery competitor | Browsing by country, maker, type, decade, conflict, and existing comparison tools. | Filters and comparison are not unique. Improve variant identity, uncertainty, evidence, and explanatory dossiers. |
| [Forgotten Weapons Vault](https://www.forgottenweapons.com/lorem-ipsum/) | Editorial competitor and research lead | Historical photographs/material and reports on unusual firearms; [library](https://www.forgottenweapons.com/forgotten-weapons-library/) organizes reviewed books. | Offer structured paths into specialist research. Collaborate or cite rather than reproducing archives wholesale. |
| [IMFDB](https://www.imfdb.org/wiki/Main_Page) and its [Browser](https://browser.imfdb.org/) | Direct competitor if media appearances are added | Documents firearms in movies, television, games, and anime; Browser already searches firearms, media, actors, and characters. | [Inclusion rules](https://www.imfdb.org/wiki/IMFDB:Rules,_Standards_and_Principles) center media appearances and exclude books/manga as media-page subjects. Historical melee reference and literary artifacts provide distinct scope opportunities. |
| [Wikipedia weapon lists](https://en.wikipedia.org/wiki/Lists_of_weapons) and [Wikidata](https://www.wikidata.org/wiki/Help:Data_access) | Broad substitutes and identifier infrastructure | Extensive lists plus structured identifiers/data access. | Add reviewed evidence, guided learning, and editorial accountability. Imported claims still need verification. |
| [Zelda Wiki](https://zeldawiki.wiki/wiki/Weapon) and [Wookieepedia](https://starwars.fandom.com/wiki/Weapon) | Adjacent fictional-weapon competitors | Franchise terminology, appearances, references, and continuity context. | Later cross-franchise discovery should preserve continuity/edition differences. Fictional coverage is not currently implemented here. |
| [Royal Armouries](https://royalarmouries.org/collection) | Source authority and discovery substitute | Searchable objects, archives, and library; filters and sharable results. Its [guide](https://royalarmouries.org/collection/collection-online-guide) notes variable record detail and unavailable result downloads. | Provide approachable cross-collection education and citation exports while preserving source identifiers and attribution. |
| [The Met Arms and Armor](https://www.metmuseum.org/departments/arms-and-armor) | Source authority and discovery substitute | Curatorial interpretation, object records, references, provenance, and imagery. [Open Access](https://www.metmuseum.org/hubs/open-access) includes eligible images, data, API, and CSV access. | The opening is useful interpretation and connected discovery, not exclusive access to public museum data. |

Museums document held objects and provide institutional expertise. Weapon Database should help people navigate those sources without implying equivalent curatorial authority at launch.

## Audience Jobs To Validate

| Audience | Job | Product Promise |
| --- | --- | --- |
| History enthusiasts/students | Understand a name and find dependable evidence | Concise explanations, uncertain dates shown honestly, documented examples, and citations |
| Teachers/educational creators | Assemble a visual lesson | Curated collections, timelines, credited imagery, and printable references |
| Artists/writers | Research appearance and cultural context | Clear terminology, materials, object imagery, and contextual reading |
| Museum visitors/researchers | Find related examples across institutions | Aliases, collection identifiers, linked sources, and comparable descriptive fields |
| Fiction readers, later | Identify an artifact across works/adaptations | Separate appearance records, continuity/version boundaries, and spoiler controls |

Interview these groups separately. Interest in a 3D configurator does not establish demand for a historical research subscription.

## Build Authority Through The Catalog

### P0: Separate Entities And Evidence

Use distinct records for:

- Weapon types
- Manufactured models and variants
- Individual surviving museum objects
- Original studio concepts
- Named fictional artifacts and appearances, later

Link these entities. A museum sword’s weight belongs to that object, not every sword of its type. A finish is not automatically a different historic model.

Maintain aliases, original-language names, maker/designer relationships, culture/place, date ranges, classification, materials, and external identifiers. Modern flags should not substitute for historical geography or attribution.

Attach sources to important claims: URL, title, author/institution, publication/catalog date where available, page/location, retrieval date, and review notes. Preserve disagreements instead of selecting whichever number looks cleaner.

Use explicit evidence states such as Documented, Attributed, Disputed, Unknown, and Studio Concept. A completeness score describes missing fields; it does not prove accuracy.

### P0: Normalize Without Erasing Meaning

Store original measurements alongside normalized values and units. Distinguish overall length, blade length, surviving fragment, and other components. Preserve approximate dates and ranges.

[The Met’s Claymore record](https://www.metmuseum.org/art/collection/search/27515), for example, distinguishes a Scottish hilt and German blade and explains another usage of “claymore.” One country, one date, and one generic name would lose meaning.

Publish methodology, reviewer credits, review dates, and correction history. Contributors should propose changes for review. AI can organize drafts or suggest reconciliation; unsupported provenance and specifications must not become accepted facts.

### P0: Make Images And Pages Citable

Record image source, creator/institution, rights basis, and caption. The Met’s eligible public-domain images and basic collection data are available under CC0; this does not establish permission for every photograph or third-party page. Verify each asset and preserve source context. [Open Access policy](https://www.metmuseum.org/hubs/open-access)

Give substantive records and articles permanent URLs, readable titles, aliases, and meaningful internal links. Favor complete pages over thin placeholders.

Keep existing concepts and the interactive rifle in a studio showcase. Distinguish imagined designs, educational reconstructions, and measured historic models. Visual resemblance alone does not prove design influence.

## Improvements That Matter Most

1. **Reviewed historical records and permanent pages:** The prerequisite for a reference people cite and revisit.
2. **Evidence-aware search:** Aliases, historical terminology, classification, dates, culture/place, institution, and evidence filters.
3. **Educational comparison:** Dates, materials, dimensions, terminology, and provenance with missing/disputed values visible.
4. **Learning paths:** Sourced collections such as “Understanding Sword Names” and “Reading Museum Object Records.”
5. **Optional synchronized research:** Account-backed collections, notes, and correction tracking after repeat-use demand emerges.
6. **Reviewed ingestion:** Permitted institutional data enters a review queue rather than publishing everything automatically.

The Met’s current [API documentation](https://metmuseum.github.io/) announces paginated `v1.1` search and retirement of the older search endpoint. Follow current documentation, retain external IDs, and do not assume one search response contains the complete collection. Public API documentation is an integration opportunity, not proof of a connection in this repository.

## Search And Distribution

Start with descriptive terminology and historical-object queries that the launch corpus can answer well. Keyword demand is unmeasured; validate with interviews and Search Console once real pages are published.

Create permanent dossiers, curated topic pages, and internally linked timelines. Provide enough original explanation to help readers interpret sources. Do not publish every possible filter combination as a separate near-identical landing page.

Use authorship, reviewer credit, citations, and substantive corrections to demonstrate editorial responsibility. Google’s [people-first content guidance](https://developers.google.com/search/docs/fundamentals/creating-helpful-content) favors useful original value; following it does not guarantee rankings.

Share useful educational references with historians, educators, artists, and collection specialists. Build relationships before claiming partnerships. A carefully researched terminology resource can earn relevant citations more credibly than a large unreviewed import.

## Proposed 90-Day Roadmap

Targets reflect workload planning, not predicted commercial performance.

| Period | Priority | Reviewable Outcome |
| --- | --- | --- |
| Days 1–14 | P0: Audience and source scope | Interview 10–15 prospective users; choose a bounded historical collection; inventory sources/images; define inclusion/schema; create 10 exemplary records. |
| Days 15–30 | P0: Real reference foundation | Permanent pages, aliases, citations, evidence states, image credits, and review history; approximately 25 complete records; concepts separated. |
| Days 31–60 | P1: Useful depth | Expand toward 50 reviewed records; historical filters and descriptive comparison; three substantial learning dossiers. |
| Days 61–90 | P1: Reviewed pilot | Recruit knowledgeable reviewers; enable correction proposals and optional saved collections; observe the interview cohort; document errors and repeat-use demand. |

Reduce record volume before citation quality. Postpone broad fictional coverage, paid APIs, native screens, and a larger configurator until users demonstrate demand.

## Six-Month Moat

The defensible asset is a maintained network of reviewed claims, aliases, object/type relationships, original interpretation, and correction history.

Develop depth in a few coherent collections, represent different cultures accurately where sources allow, and resolve naming ambiguities. Use credited reviewers and versioned research collections. Preserve source identifiers and attribution in permitted exports.

If expanding into fiction, keep artifacts, media appearances, continuity, and editions distinct. This creates cross-domain discovery without flattening historical evidence into speculative lore.

## Monetization Experiments

Keep core facts, citations, and public browsing free.

| Experiment | Value | Validation |
| --- | --- | --- |
| Research workspace | Private annotations, saved collections, citation exports, and presentation layouts | Test real recurring tasks and a small paid pilot before pricing a subscription. |
| Educational dossiers/packs | Reviewed themed lessons and rights-cleared imagery | Ask teachers/creators to use samples; measure purchase and repeat demand. |
| Voluntary membership | Support continuing editorial work | Offer transparent work reports and assess sustainable contributions. |
| Disclosed sponsorship/affiliates | Relevant books or educational services | Keep payment separate from evidence status and editorial conclusions. |
| Permitted data services, later | Reviewed structured exports | Confirm redistribution rights, actual demand, support burden, and update costs. |

No willingness-to-pay or price validation was conducted. Avoid building billing solely because premium feature ideas sound plausible.

## Measures And Open Questions

Track useful research rather than only page views: successful searches, substantive record reads, source visits, saved collections, repeat cohorts, and accepted corrections. Instrument analytics before interpreting behavior.

Catalog measures should include citation coverage, image-rights documentation, sampled factual errors, duplicate entities, broken sources, review turnaround, and editorial cost per accepted record. A proposed launch gate is that every published record has cited core claims and documented imagery.

Use small task studies: can at least 8 of 10 recruited users find a documented example and its source within three minutes? Treat this as a pilot target, not a forecast. Track independent educational citations over six months and exclude self-created links.

Open questions: historical object research versus model summaries, which collection generates repeat use, whether 3D improves understanding, and which organization tools justify payment. Establish a trustworthy small collection before expanding the claim of authority.