# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
- `pnpm dev` - Start development server (http://localhost:4321)
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build

### Installation
- `pnpm install` - Install dependencies (Node.js 18+ required)

## Architecture

This is an Astro-based academic research group website with React components for interactivity.

### Key Technologies
- **Astro 5.6.1** - Static site generator with partial hydration
- **React 19** - Interactive components (client:load directive)
- **Tailwind CSS v4** - Styling with shadcn/ui components
- **TypeScript** - Full type safety
- **MDX** - Rich content with components

### Content Architecture
Content is managed through multiple sources:
1. **Google Sheets** (ID: `1Mjn0C3gjSr5Wl2ZG41X813LLhL-y47DvLeEUCmagTe8`):
   - `current` sheet - Current team members
   - `alumni` sheet - Former team members
   - `software` sheet - Software tools & databases

2. **Dynamic loaders** in `src/content/loaders/`:
   - `pmc.ts` - Fetches publications from PubMed
   - `funding.ts` - Fetches funding data
   - `github.ts` - Fetches GitHub team data
   - `google-sheets.ts` - Custom loader for Google Sheets content

3. **MDX files** in `src/content/home_page/` for rich homepage content

### Data Formats
- **Professional Career**: `"period | position || period | position"`
- **Education**: `"period | degree || period | degree"`
- **Software Categories**: Comma-separated values (e.g., `"featured, tool"`)

### Page Structure
- **File-based routing** in `src/pages/`
- **Dynamic routes**: `/person/[slug]` for team member profiles
- **Single layout** (`src/layouts/Layout.astro`) handles navigation, dark mode, and SEO

### Component Strategy
- **Astro components** (`.astro`) for static content
- **React components** (`.tsx`) for interactivity (tabs, dialogs, mobile nav)
- **UI components** from shadcn/ui in `src/components/ui/`

### Environment Variables
- `GH_TOKEN` - Required for GitHub API loader (team data)

### Deployment
- Site URL: `https://saezlab.org`
- Static output to `dist/` directory
- GitHub Pages deployment via Actions