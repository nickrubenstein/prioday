# Prioday

A prioritized todo list for repetitive chores and habits. Define tasks with a frequency — "every 3 days", "weekly", "monthly" — and the app sorts them by urgency so you always know what needs attention first.

## Features

- **Recurring Schedules** — Set tasks to repeat daily, weekly, monthly, or yearly with custom intervals (e.g., "every 3 days", "every 2 weeks")
- **One-Time Counts** — Limit a task to a set number of completions (e.g., "do this 5 times total")
- **Priority Sorting** — Overdue and due-today tasks float to the top, sorted by next-due date
- **Color-Coded Status** — Overdue tasks show in red, due-today in blue, completed today in green
- **Last Done Tracking** — Human-readable timestamps ("Today", "Yesterday", "3 days ago")
- **Next Due Calculation** — Automatically calculates when each task is due next
- **Local Storage Persistence** — All data saved in your browser, works fully offline
- **Light/Dark Theme** — Toggle between themes from the settings page
- **Smooth Animations** — Optional reorder animations when task priority changes

## Use Cases

- Water plants every 3 days
- Track weekly chores (vacuuming, laundry)
- Schedule monthly bill payments
- Yearly reminders (birthdays, anniversaries, maintenance)
- Build habits with daily tasks (Wordle, Duolingo, chess puzzles)

## How It Works

1. **Add Tasks** — Create a todo with a name, frequency (e.g., "every 2 days", "weekly"), and last completion date
2. **Automatic Sorting** — Tasks are sorted by urgency — overdue and due-today items appear at the top
3. **Mark Complete** — Click the checkmark when you finish a task to update its status
4. **Undo** — Accidentally checked a task? Undo the completion
5. **View History** — See when each task was last done and how long until it's due next

## Architecture

A multi-page app written in vanilla JavaScript, HTML, and CSS — no frameworks, no build step.

```
src/
├── index.html            # Main todo list view (entry point)
├── detail.html           # Task creation/editing form
├── settings.html         # Theme and animation preferences
├── about.html            # In-app documentation
├── css/
│   ├── global.css        # Base styles, form styles, animations
│   ├── icons/            # icomoon icon font
│   └── themes/
│       ├── dark.css      # Dark theme CSS variables
│       └── light.css     # Light theme CSS variables
└── js/
    ├── date.js           # Date utilities (window.__date)
    ├── controllers/
    │   ├── index.js      # Main list page controller
    │   ├── detail.js     # Detail page controller
    │   └── settings.js   # Settings page controller
    └── utilities/
        └── settings.js   # Shared settings helper (window.__settings)
```

### Data Model

Each todo is a plain JavaScript object stored as JSON in `localStorage`:

```json
{
  "id": "<uuid>",
  "text": "Water plants",
  "repeat": true,
  "frequency": "d3",
  "count": 1,
  "lastDone": 1746057600000,
  "lastLastDone": 0,
  "source": "Device"
}
```

The `frequency` field encodes unit + count: `"d3"` = every 3 days, `"w2"` = every 2 weeks, `"m1"` = monthly, `"y1"` = yearly.

### Globals

- **`window.__date`** — Date utility object loaded in the HTML `<head>`. Provides `nextDate()`, `getDate()`, `getDaysAgoString()`, `formatDate()`, and more.
- **`window.__settings`** — Settings helper that manages theme and animation preferences via `localStorage`, with an `applyTheme()` method that swaps the active stylesheet.

### Rendering

Each page instantiates a controller class on `DOMContentLoaded`. Controllers use `<template>` tags and `cloneNode(true)` to render todo items — no virtual DOM, no framework.

## Development

### Running Locally

No build step required. Open `src/index.html` directly in a browser, or use a simple HTTP server:

```bash
npx serve src
```

### Testing

This project uses Playwright for end-to-end testing of date utilities.

**Setup:**
```bash
npm install
npx playwright install
```

**Run tests:**
```bash
npm test
```

## License

MIT — see [LICENSE](LICENSE) for details.

## Author

[Nick Rubenstein](https://github.com/nickrubenstein)
