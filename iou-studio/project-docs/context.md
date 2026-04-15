# PROJECT CONTEXT — IOU Labs

## Overview

IOU Labs is a productized service platform designed as an interactive system.

Users should be able to:
- explore services like a menu
- configure what they need
- see pricing and timelines instantly
- proceed without needing a call

This is NOT a marketing website.
It should feel like a control panel or configurator.

---

## Services

* Web & App Development
* Branding & Identity
* Digital systems (restaurants focus)

---

## Design Direction

* Premium, minimal
* Deep navy / charcoal / gold accents
* Light theme: soft cream with subtle warm tones
* Dark theme: charcoal with soft violet accents
* Glassmorphism + soft shadows
* Smooth animations (GSAP)

---

## Tech Stack

* React (Vite)
* Tailwind CSS
* GSAP (planned/day 2)
* Three.js (planned later)

---

## Goals

* Light/Dark theme toggle
* Premium UI polish
* Custom-generated visuals
* 3D homepage section
* Smooth scroll interactions

---

## Current Progress

* Base React + Vite setup active
* Theme system completed (light/dark with persistence)
* Navbar implemented with theme toggle

* System-first Hero implemented
  - Clear entry into build flow
  - Primary CTA: “Start Building”
  - Secondary CTA: “See How It Works”

* “How It Works” section implemented
  - 3-step structured system explanation
  - Reinforces user journey (select → customize → review)

* Persistent “Start Building” CTA implemented
  - Always accessible system entry point

* Pricing page reframed as system interface
  - Traditional pricing-page tone removed
  - Header and copy shifted toward configuration language

* Mode-based interaction implemented
  - Toggle: Packages vs Build Your Own
  - Packages = starting configurations (not SaaS plans)

* Proto configurator introduced
  - Build Your Own mode now contains selectable service modules
  - Users can select and deselect modules
  - First meaningful configurator interaction is in place

* Summary layer introduced
  - Sticky Summary Panel planned/added as the main control surface for the build flow
  - Next step is making custom selections reflect live inside the summary

* Transition from marketing site → system interface actively implemented

---

## Current Phase

Phase 2 — Proto Configurator

Goal:
Turn the pricing area into a real configuration surface where users can make selections and see the current build state clearly.

Current Focus:
- Summary panel behavior
- Live reflection of user selections
- Preparing pricing + timeline logic without breaking structure