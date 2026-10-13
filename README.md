

https://github.com/user-attachments/assets/5ad5041e-a123-494e-907d-5254fd8ae34f

# Drag-and-Drop Form Builder

A form builder built with Next.js, React, TypeScript, and React DnD. Users drag blocks from the sidebar onto a canvas, reorder them, and group questions together.

## Features

- Welcome and thank you pages
- Short answer, long answer, multiple choice, number, and email questions
- Question groups with nested sub-questions
- Drag-and-drop reordering, including moving questions into and out of groups
- A placeholder that shows where a new block will land while dragging
- English interface text, with Persian translations included

## Tech stack

- Next.js 12 (Pages Router) and React 17
- TypeScript in strict mode
- React DnD with the HTML5 backend
- immutability-helper for nested state updates
- SCSS modules

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

## How it works

The questions live in a single `useReducer` state. Every drag interaction is dispatched as a typed drag action, such as adding a preview, moving a question, or moving it to the end of a group, and `reducers/questionsReducer.ts` turns it into the next state. The reducer is a pure function, so all the ordering and nesting rules live in one place, separate from the components.

A group question can only contain normal questions, and a group cannot be dropped inside another group.

## Project structure

- `pages/index.tsx` – page layout and form builder state
- `reducers/questionsReducer.ts` – drag-and-drop and ordering logic
- `components/` – sidebar items, questions, and drop zones
- `constants/` – block types, drop zones, icons, and drag actions
- `types/` – question, page, and drag action types
- `translations/` – English and Persian interface text
- `styles/` – global styles and SCSS modules

## Notes

Form data is kept in React state and is not saved to a backend.
