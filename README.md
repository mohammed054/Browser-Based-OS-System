# Browser-Based OS System

A browser-native portfolio operating system built with React and Vite.

This project started as a childhood concept and was rebuilt into a more senior-level product experience: better visual systems, shared app state, persistent tools, and portfolio content that stays honest instead of inventing fake employers or placeholder history.

## What is inside

- Desktop shell with draggable, resizable windows
- Start menu, taskbar, notifications, and lock/login flow
- Persistent `Notes` app with search, pinning, duplication, and autosave
- Persistent `File Explorer` with folders, files, rename, copy, paste, delete, and preview
- Terminal commands that can open apps and control appearance
- Settings for theme, accent, wallpaper, and session controls
- Portfolio windows for `About`, `Projects`, `Skills`, `Contact`, and `Resume`
- Internal browser-style navigator for local portfolio routes

## Why this rebuild matters

The goal was not just to make the app prettier.

The rebuild focused on:

- real app behavior instead of static mock screens
- one shared system API so windows can work together
- a coherent design language across the shell
- truthful portfolio content over fabricated resume filler

## Tech

- React 19
- Vite
- Custom window manager
- Local storage persistence
- Custom CSS design system

## Run locally

```bash
npm install
npm run dev
```

Production build:

```bash
npm run build
```

Lint:

```bash
npm run lint
```

## Core apps

- `Notes`: personal workspace with persistent documents
- `File Explorer`: local project workspace with folder/file operations
- `Terminal`: command surface for system actions and portfolio inspection
- `Settings`: appearance and workflow controls
- `Chrome`: internal navigator for portfolio routes and quick links

## Project structure

```text
src/
  components/      app windows and desktop shell
  config/          profile config
  data/            portfolio data and system content
  managers/        windowing and desktop state managers
  utils/           assets, keyboard, sound, persistence helpers
```

## Status

This version is the product-grade rebuild pass. It keeps the original spirit, but the system now behaves more like a real operating environment and less like a static novelty demo.
