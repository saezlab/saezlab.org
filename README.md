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
├── content/       # Content files (MDX, JSON)
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

Content is managed through Google Sheets, allowing non-technical team members to easily update information without code changes.

**Google Sheets Document**: [https://docs.google.com/spreadsheets/d/1Mjn0C3gjSr5Wl2ZG41X813LLhL-y47DvLeEUCmagTe8](https://docs.google.com/spreadsheets/d/1Mjn0C3gjSr5Wl2ZG41X813LLhL-y47DvLeEUCmagTe8)

### Team Members

Team information is managed in two sheets:
- **current**: Current team members
- **alumni**: Former team members

#### Professional Career & Education Format
- **Professional Career**: Multiple entries separated by `" || "`, each entry format: `"period | position"`
  - Example: `"2024-present | Head of Research, EMBL-EBI || 2018-present | Professor at Heidelberg University"`
- **Education**: Multiple entries separated by `" || "`, each entry format: `"period | degree"`
  - Example: `"2002-2007 | PhD in Process Engineering || 2000-2001 | Exchange student"`

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

### Current Team Members Sheet
| Column | Description | Example |
|--------|-------------|---------|
| name | Full name | "Julio Saez-Rodriguez" |
| role | Position/title | "Group Leader" |
| description | Bio/description | "Brief biography..." |
| research_interests | Research focus areas | "Systems biology..." |
| professional_career | Career history (see format above) | "2024-present \| Head..." |
| education | Education history (see format above) | "2002-2007 \| PhD..." |
| email | Email address | "name@example.com" |
| telephone | Phone number | "+49 123 456789" |
| orcid | ORCID identifier | "0000-0002-8552-8976" |
| image | Image filename | "person-name.jpg" |

### Alumni Sheet
| Column | Description | Example |
|--------|-------------|---------|
| name | Full name | "John Doe" |
| position | Position held | "Postdoc" |
| duration | Time period | "2018-2024" |
| linkedin | LinkedIn profile URL | "https://linkedin.com/in/..." |

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
