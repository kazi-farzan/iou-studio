# Current Errors

## Active (Critical)

* None blocking product usage

---

## Medium

* Repeated Services -> Configure entry needs regression QA across package and custom modes
* Dense custom configurations still need regression QA on smaller screens even after the visual density pass
* Case study records use representative proof surfaces until live project captures are available
* Hero 3D layer needs contrast QA in both themes so motion stays ambient behind the System State content
* Visual polish pass needs cross-device QA to confirm spacing rhythm and CTA grouping stay consistent in light and dark themes

---

## Low

* Main production bundle still exceeds Vite's 500 kB warning threshold after build, and the lazy-loaded `three.module` hero chunk also crosses the warning limit
* Edge-case formatting for nested option summaries under heavy selections
* Long deliverable lists may need tighter truncation rules if more modules or add-ons are added later

---

## Watchlist

* Validate Services -> Pricing handoff keeps module or setup state after repeat navigation
* Keep system-first copy consistent as Product Readiness work adds backend and onboarding states
* Keep case study metrics, configured details, module names, and deliverables aligned with the shared schema
* Ensure every CTA still points to a live step in the build flow
* Maintain summary readability when many modules, options, and deliverable sections are active
* Confirm starting setup labels and package deliverables stay aligned with future schema changes
* Keep deliverable output synchronized across configurator, summary, order review, confirmation, and submission payloads
* Keep hero motion passive on desktop and confirm the static fallback remains clean on smaller or lower-power devices
* Regression check the new shared spacing and button hierarchy in both themes before backend wiring lands
