# CODEX RULES

* Always give COMPLETE file code
* No partial snippets unless asked
* Keep code production-ready
* Clean Tailwind usage
* No unnecessary complexity

## Output Style

1. Brief explanation
2. Full code
3. File placement

## Project State

* Setup phase completed
* White screen issue resolved
* Tailwind working
* Theme system completed
* Behavioral shift completed for core entry flow
* Mode-based interaction (Packages vs Build Your Own) implemented
* Moving into proto-configurator development

## Product Direction (CRITICAL)

This project is NOT a traditional agency website.

It is a productized service system where:
- users configure services
- pricing is transparent
- interaction replaces marketing

All UI decisions must prioritize:
- clarity
- structure
- user control
- minimal noise

Avoid:
- generic agency layouts
- marketing-heavy sections
- unnecessary visual clutter

## Interaction Principle (NEW)

Every section added must answer:
“What is the user doing next?”

Not:
“What are we showing?”

Sections should:
- guide action
- reduce uncertainty
- move user toward configuration

Avoid:
- passive informational blocks
- standalone marketing sections

## Mode System (NEW)

The UI now includes mode-based interaction:

- Packages → starting configurations
- Build Your Own → custom system builder (proto)

Future work must:
- respect this mode separation
- avoid merging modes unintentionally
- keep behavior predictable across modes


## Execution Mode (IMPORTANT)

Development is being done in small, sequential tasks.

Rules:
- Only implement ONE task at a time
- Do NOT refactor unrelated sections
- Do NOT redesign existing working components unless explicitly asked
- Preserve layout and structure unless task requires change
- Assume future tasks will build on current structure

Goal:
Avoid breaking the system while gradually evolving into a configurator interface.