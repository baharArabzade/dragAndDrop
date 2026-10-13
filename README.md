# Drag-and-Drop Form Builder

A small form-builder prototype built with Next.js, React, TypeScript, and React DnD. It lets users drag question types from the right sidebar into a form and reorder them.

## Features

- Welcome and thank you pages
- Number, short-answer, long-answer, and grouped questions
- Drag-and-drop question ordering
- Nested questions inside a group
- Persian interface text by default, with English translations included

## Run locally

Install the dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

## Other commands

```bash
npm run build       # Create a production build
npm run start       # Run the production build
npm run type-check  # Check TypeScript types
npm run lint        # Run ESLint
```

## Main structure

- `pages/index.tsx` – form-builder state and drag-and-drop behavior
- `components/` – questions, drop zones, and sidebar items
- `styles/` – SCSS modules
- `translations/` – Persian and English interface text

## Notes

This is a prototype: form data is kept in React state and is not persisted to a backend.
