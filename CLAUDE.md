# Today. — Student Day Planner

A personal day planner built for university students. Ink Minimal aesthetic with Bauhaus color system.

## Stack
- Next.js 16 (App Router)
- Tailwind CSS v4
- React client-side state (no database — data lives in memory)

## Design System
- **Background**: Warm cream (#faf8f4)
- **Text**: Ink black (#1a1a1a)
- **Blue** (#1D3557): Tasks, progress, today pill, checkboxes
- **Red** (#E63946): Schedule times, urgency/due dates, ADD buttons, active events
- **Yellow** (#F4D35E): Notes accent, mastered vocab
- Dark mode supported via CSS variables + .dark class on html
- No border-radius, no shadows — brutalist structure with warm paper feel

## Design Process
Started with 12 wildly different HTML/CSS mockups (brutalist, glass aurora, retro terminal, zen, Bloomberg, etc.). Narrowed to 5 favorites, created 8 mix-and-match hybrids, grilled each from marketing/production/student perspectives. The critique revealed most were too colorful or scroll-heavy. Landed on "Ink Minimal" (monochrome + warm cream), then merged in the Bauhaus color system from an earlier favorite — color only where it carries meaning. Iterated in Figma to validate layout and color variants before coding.

## Pages / Routes
- `/login` — Mock login screen, stores user name in client state
- `/` — Home: day bar (tab switcher), Next Up banner, Due Soon strip, 2-column tasks+schedule grid, reading+notes grid, vocab summary, quick add with natural language parsing, quote of the day
- `/day/[date]` — Dynamic day view with prev/next navigation, same 2-column layout
- `/new` — Form to add tasks, notes, schedule blocks, readings, or vocab words. Supports `?type=vocab` query param for pre-selection
- `/week` — Week overview with daily summaries, progress bars, schedule previews
- `/study` — Vocabulary builder: list view + flashcard mode with mastery tracking (new/learning/mastered)

## Data Model (client-side state via React Context)

### Task
`{ id, date, title, done, course?, dueDate? }`

### TimeBlock (Schedule)
`{ id, date, time, title, location? }`

### Note
`{ id, date, text }`

### Reading
`{ id, date, title, url, source, course?, status: "TODO" | "DONE" }`

### VocabWord
`{ id, word, definition, example?, course?, mastery: "new" | "learning" | "mastered", dateAdded }`

### Auth (mock)
`{ user: string | null }` — name stored in AuthContext, gates all routes except /login

## Key Features
- **Natural language quick add**: "meeting at 5pm tomorrow" → auto-detects title, time, date, creates correct entry type
- **Day bar tab switching**: Click any day to swap home page content without navigating away
- **Vocabulary flashcards**: Tap-to-flip cards, mastery tracking (new/learning/mastered), spaced repetition (weakest first)
- **Delete on hover**: × button appears on hover for all item types
- **Dark mode toggle**: Smooth CSS variable transition, button in nav
- **Quote of the day**: 31 curated quotes, rotates daily based on day-of-year
- **Mock login gate**: Name entry, shown in nav, logout button

## Key Components
- `AppShell` — conditionally renders Nav + PlannerProvider when authenticated
- `AuthGate` — redirects to /login if not signed in
- `ThemeWrapper` — applies dark/light class to html element
- `Nav` — sticky nav with tri-color logo, route links, theme toggle, user name + logout
- `PlannerContext` — all planner state and actions (tasks, notes, schedule, readings, vocab) + delete functions
- `SettingsContext` — theme and font size preferences
- `AuthContext` — mock user authentication state
- `parseNaturalInput` — NLP parser for quick add (dates, times, day names, months)
- `quotes` — curated quote library with daily rotation

## Style Preferences
- Brutalist-inspired: sharp edges, thick 2px borders, no border-radius
- Monospace labels (uppercase, tracked) for section headers
- Color used only for meaning, not decoration
- Responsive: 2-column grid on desktop, single column on mobile
- Compact layout: entire home page fits on one laptop screen without scrolling
- Hover-reveal delete buttons (group-hover pattern)
