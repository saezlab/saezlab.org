# Saez Lab Website

A modern, fast, and maintainable website for the Saez Lab built with Astro, React, and Tailwind CSS.

## Features

- 🚀 Built with [Astro](https://astro.build)
- 💅 Styled with [Tailwind CSS](https://tailwindcss.com)
- 🎨 UI components from [shadcn/ui](https://ui.shadcn.com)
- 📱 Fully responsive design
- 📝 Content management with MDX
- 🔍 SEO optimized
- ⚡ Fast performance with static generation

## Project Structure

```
src/
├── components/    # React components
├── content/       # Content files (YAML, MDX, JSON)
├── layouts/       # Layout components
├── pages/         # Astro pages
├── styles/        # Global styles
└── lib/           # Utility functions
```

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/saezlab/saezlab.org.git
   cd saezlab.org
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Set up environment variables:
   ```bash
   # Create .env file
   echo "GH_TOKEN=your_github_personal_access_token" > .env
   ```
   The `GH_TOKEN` is required for fetching GitHub team data. [Create a token here](https://github.com/settings/personal-access-tokens/new). Create a "classic" token, as this token is not for the repo, but to fetch internal data of the organization. When setting the permissions, select the items under the "org" scope.

4. Start the development server:
   ```bash
   pnpm dev
   ```

5. Open [http://localhost:4321](http://localhost:4321) in your browser.

## Content Management

Team profiles live in local YAML files. Software and publication curation still use the
[Google Sheets document](https://docs.google.com/spreadsheets/d/1Mjn0C3gjSr5Wl2ZG41X813LLhL-y47DvLeEUCmagTe8).

### Team Members

Edit one file per person in `src/content/members/`. These files are the source of truth for
current members and alumni. They were initially exported from the `current` and `alumni`
Google Sheets tabs on 2026-09-07 (43 current members and 66 alumni).
The older `src/content/_team/team.json` and `_scripts/team_*.tsv` are historical files,
not active content sources.

```yaml
name: Alex Example
status: current
role: Postdoctoral Fellow
group: postdocs
order: 10
image: alex-example.jpg
description: >-
  Alex develops computational methods for analysing biological data.
research_interests: Single-cell analysis and multi-omics integration.
email: alex@example.org
professional_career:
  - period: "2023–present"
    position: Postdoctoral Fellow, Example Institute
education:
  - period: "2018–2023"
    degree: PhD in Computational Biology
```

- The filename (without `.yaml`) is the stable profile URL: `alex-example.yaml` gives
  `/person/alex-example`. Keep filenames unchanged when editing display names. Existing
  filenames preserve the previous URLs, including accents and punctuation.
- Required fields: `name`, `status` (`current` or `alumni`), and `role`.
- Current members also require `group`: `group-leader`, `administration`, `staff-scientists`,
  `postdocs`, `phd-students`, or `associated-members`. `role` is the displayed title.
- Photos are filenames within `public/team_images/`. Existing photos remain there.
- Optional fields include `description`, `research_interests`, `email`, `telephone`,
  `orcid`, `linkedin`, `professional_career`, `education`, and `membership`.
  Omit unknown fields; career and education are arrays of objects, not delimited strings.
- `order` controls placement within each group (ascending, default 1000, then name).
  Imported values preserve the sheet order. Alumni sort by end year descending, then order.
- To move someone to alumni, set `status: alumni` and add known membership years:

  ```yaml
  membership:
    start_year: 2023
    end_year: 2026
  ```

  Keep their other profile data. Alumni currently appear as summary cards without
  individual profile pages, matching the previous site behaviour.
- Membership years are optional; current start years were not available in the sheet
  and have not been inferred. Alumni years come directly from the exported durations.
- Interns and visitors still come from GitHub.

The schema in `src/content/config.ts` validates member files during development and builds.
Run `pnpm dev` to review `/team` and individual `/person/...` pages, or `pnpm build` to validate
production output. Other site collections still need network access and GitHub credentials.

### Publications

Publications are automatically fetched from PubMed using ORCID.

### Software

Software tools are managed in the **software** sheet. Categories should be comma-separated values (e.g., `"featured, tool"` or `"database, tool"`).

### Home Page Content

The home page content is managed through MDX files in `src/content/home_page/`:

- **`mission.mdx`**: The lab's mission statement displayed on the home page
- **`research.mdx`**: Research areas and focus topics
- **`locations.mdx`**: Lab locations and contact information

These files support full MDX syntax, allowing you to use React components and Markdown together. To edit, simply modify the MDX files directly.

### Navigation

The main navigation menu is configured in `src/config/navigation.ts`. To add, remove, or reorder menu items, edit this file.

## Google Sheets Schemas

### Software Sheet
| Column | Description | Example |
|--------|-------------|---------|
| name | Software name | "BioCypher" |
| short_description | Brief description | "A framework for..." |
| long_description | Detailed description | "Extended description..." |
| code_repository | GitHub/GitLab URL | "https://github.com/..." |
| website | Project website | "https://biocypher.org" |
| publication | Publication URL | "https://doi.org/..." |
| image | Image filename | "biocypher.png" |
| categories | Comma-separated categories | "featured, tool" |

## Building for Production

To build the site for production:

```bash
pnpm build
```

The built site will be in the `dist/` directory.

## Deployment

The site can be deployed to any static hosting service. For example, to deploy to GitHub Pages:

1. Set up GitHub Actions workflow (see `.github/workflows/deploy.yml`)
2. Push to the `main` branch
3. The site will be automatically deployed to GitHub Pages

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request
