# Focus Tasks – Todo List

A polished, local-first todo list built with Next.js App Router. Capture tasks, organize with filters, toggle completion in bulk, and keep progress synced across sessions via `localStorage`.

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Installation

```bash
npm install
npm run dev
```

The app runs at [http://localhost:3000](http://localhost:3000).

### Production Build

```bash
npm run build
npm start
```

## Project Structure

```
app/
  globals.css          // Global styles
  layout.tsx           // Root layout
  page.module.css      // Home page styles
  page.tsx             // Todo list UI
next.config.js
package.json
tsconfig.json
```

## Features

- Quick-add input with keyboard-friendly flow
- Filters for all/active/completed states
- Inline editing with instant validation
- Bulk toggle and clear-completed actions
- Completion progress indicator
- Persistent storage via `localStorage`
- Responsive, glassmorphism-inspired UI
