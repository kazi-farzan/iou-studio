# CODEX RULES

* Always give COMPLETE file code
* No partial snippets unless asked
* Keep code production-ready
* Clean Tailwind usage
* No unnecessary complexity

---

## Output Style

1. Brief explanation
2. Full code
3. File placement

---

## Project State

* Setup phase completed
* White screen issue resolved
* Tailwind working
* Theme system completed

* Behavioral shift completed for entry flow
* Mode-based interaction implemented (Packages vs Build Your Own)
* Proto configurator introduced (module selection)
* Summary panel structure introduced

* Moving into:
  - live summary reflection
  - module-based pricing logic
  - module-based timeline logic
  - real system feedback

---

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

---

## Interaction Principle

Every section must answer:
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

---

## Mode System

The UI includes mode-based interaction:

- Packages → starting configurations
- Build Your Own → custom system builder (proto)

Future work must:
- respect this separation
- avoid merging behaviors unintentionally
- keep logic predictable

---

## Summary Principle

The Summary Panel is the primary control surface of the configurator.

It must:
- reflect current state clearly
- show what is selected
- show what changes next
- remain calm and structured

It should NOT feel like:
- a promo sidebar
- a decorative recap card
- a generic sticky widget

---

## Execution Mode

Development is sequential and controlled.

Rules:
- Only implement ONE task at a time
- Do NOT refactor unrelated sections
- Do NOT redesign working components unless required
- Preserve layout and structure
- Assume future tasks build on current structure

Goal:
Evolve into a full configurator without breaking the system

---

## System Direction Block for Future Codex Prompts

SYSTEM DIRECTION (CRITICAL):

This is NOT a marketing website.
This is a system interface.

Design and structure decisions must reflect:
- User is configuring a system, not reading a brochure
- UI should feel like a control panel, not a landing page
- Clarity over persuasion
- Structure over decoration
- Interaction over explanation

Avoid:
- Generic SaaS layouts
- Marketing-heavy sections
- Fluffy copy
- Overly decorative UI

Prioritize:
- Clear hierarchy
- Visible system state (selection, pricing, next step)
- Minimal, calm, premium interface