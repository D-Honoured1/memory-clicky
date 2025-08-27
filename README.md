# Memory Clicky (Vite + React)

Memory Clicky — a memory/sequence game where you must not click the same card twice in a round. Built with Vite + React (hooks), PokeAPI images (fallback provided), and modular code.

## Features

- 3 stages:
  - **Easy:** 6 cards, no per-click timer.
  - **Medium:** 12 cards, 7s per-click countdown (resets on correct click).
  - **Hard:** 18 cards, 5s per-click countdown + optional auto-shuffle every 6s.
- Scoreboard with `currentScore` and `bestScore` (persisted in `localStorage`).
- Fisher–Yates shuffle on mount and after every click.
- `useFetchImages` hook fetching N images from PokeAPI; fallback `public/seedImages.json`.
- Accessible and responsive grid, keyboard-activatable cards, alt text.
- Theme toggle persisted in `localStorage`.
- Optional confetti when a new `bestScore` is reached (requires `canvas-confetti`).

## Quick start

```bash
# create project dir and scaffold with Vite (see exact commands in deployment section)
npm install
npm run dev
