# Mood Tracker (React)

A simple, modern Mood Tracker that lets users log their mood daily and visualize trends over time. Built with React and localStorage as the MVP data store, themed with the Ocean Professional palette.

## Features

- Ocean Professional theme (primary #2563EB, secondary/success #F59E0B, error #EF4444, text #111827, background #f9fafb, surface #ffffff)
- Theme toggle with persistence (light/dark)
- Log mood entries with mood 1–5, date, tags, and optional note
- Summary metrics (average mood 7/30 days, best streak, total entries)
- SVG-based line and bar charts (no external chart libraries)
- Recent entries list with delete action
- Keyboard-accessible controls, aria labels, visible focus states
- Responsive layout (single-column mobile, multi-column on larger screens)

## Data Model

MoodEntry:
- id: string
- dateISO: string (YYYY-MM-DD)
- mood: number (1-5)
- tags: string[]
- note: string

## Getting Started

Install dependencies and start the development server:

```bash
npm install
npm start
```

Open http://localhost:3000 in your browser.

Run tests:

```bash
npm test
```

Build for production:

```bash
npm run build
```

## Environment Variables

MVP uses localStorage. For a future API integration, you can optionally set:

- REACT_APP_API_BASE: Base URL of the API (not required now)

See src/hooks/useLocalMoods.js for a TODO on switching to API in the future.

## Accessibility and Browser Support

- Keyboard accessible: all interactive controls are reachable via keyboard with visible focus rings.
- ARIA attributes used for better screen reader support.
- Works on the last two versions of modern evergreen browsers (Chrome, Firefox, Safari, Edge).

## Project Structure

- src/components
  - NavBar.jsx: title + theme toggle
  - MoodForm.jsx: add mood entries
  - MoodSummary.jsx: summary cards
  - MoodChart.jsx: SVG charts
  - MoodList.jsx: recent entries with delete
- src/hooks
  - useLocalMoods.js: localStorage state and selectors
- src/utils
  - theme.js, colors.js: theming utilities
- src/index.css, src/App.css: base styles and components
