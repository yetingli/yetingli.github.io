# CCS 2026 Publication and JSS Service Update

## Goal

Update the academic homepage so the publication record and professional-service record include the newly confirmed CCS 2026 paper and Journal of Systems & Software reviewing service.

## Scope

- Add *The Journal of Systems & Software (JSS)* to the selected-journals reviewer list on the homepage.
- Add "Repairing ReDoS by Construction: Certified Algebraic Derivation for Semantics-Preserving Regex Transformation" to the 2026 publication lists on both the homepage and the full publications page.
- Link the paper title to `https://ccs2026b.hotcrp.com/paper/619`.
- Preserve the supplied author order. Mark Yecheng Sun and Yeting Li with `\u2020` for equal contribution, and mark Yeting Li with `*` as the sole corresponding author.
- Add a nearby legend: `\u2020 Equal contribution; * Corresponding author`.
- Identify the venue as ACM CCS 2026 (CCF-A), held 15-19 November 2026 at the World Forum in The Hague, The Netherlands.
- Update homepage publication totals from 43 to 44 and first/corresponding-author totals from 21 to 22.
- Add CCS to the homepage and publication-page top-tier venue summaries.
- Update the affected pages' last-updated dates to 21 July 2026.

## Presentation

The new paper will be the first item under 2026 because it is the newest publication supplied for that year. Existing visual and HTML conventions will be retained: Yeting Li remains highlighted with `author-me`, the venue uses the current metadata styling, and no broader redesign is included.

On the homepage, the paper will appear as a selected publication with a concise note about certified, semantics-preserving ReDoS repair. On the full publication page, it will include the complete author list, venue, dates, location, and contribution legend.

## Statistics and Filtering

The full publication list is parsed by `publication-stats.js`. The new `Yeting Li\u2020*` marker must continue to match the corresponding-author rule so the generated totals become 44 publications and 22 first- or corresponding-author publications. The existing lead filter must also include the paper.

## Verification

- Extend the publication statistics test to expect `total: 44` and `lead: 22`.
- Add content assertions for the CCS title/link, complete author order, contribution legend, venue details, and JSS reviewer entry.
- Run the Node test file and HTML/content consistency checks.
- Run `git diff --check` to catch malformed patches or whitespace errors.

## Out of Scope

- Refactoring publication data into a new shared data source.
- Changing the site's layout or visual design.
- Publishing, pushing, or opening a pull request.
