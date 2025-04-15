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
├── components/     # React components
├── content/       # Content files (MDX, JSON)
├── layouts/       # Layout components
├── pages/         # Astro pages
├── styles/        # Global styles
└── lib/          # Utility functions
```

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/saezlab/website.git
   cd website
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Start the development server:
   ```bash
   pnpm dev
   ```

4. Open [http://localhost:4321](http://localhost:4321) in your browser.

## Content Management

### Team Members

Team member information is stored in `src/content/team/team.json`. To add or update team members, edit this file.

### Publications

Publication are automatically downloaded from Pubmed.

### Software

Software tool information is stored in `src/content/software/software.json`. To add or update software tools, edit this file.

### Partners

Partner information is stored in `src/content/partners/partners.json`. To add or update partner information, edit this file.

## Content Schemas

### Team Schema (`src/content/team/team.json`)
```json
{
  "current": [
    {
      "name": "string",
      "role": "string",
      "description": "string",
      "research_interests": "string",
      "professional_career": [
        {
          "period": "string",
          "position": "string"
        }
      ],
      "education": [
        {
          "period": "string",
          "degree": "string",
          "institution": "string"
        }
      ],
      "image": "string"
    }
  ],
  "alumni": [
    {
      "name": "string",
      "role": "string",
      "description": "string",
      "current_position": "string"
    }
  ]
}
```

### Software Schema (`src/content/software/software.json`)
```json
[
  {
    "name": "string",
    "short_description": "string",
    "long_description": "string",
    "code_repository": "string",
    "website": "string",
    "publication": "string",
    "image": "string",
    "categories": {
      "featured": "boolean",
      "tool": "boolean",
      "database": "boolean"
    }
  }
]
```

### Partners Schema (`src/content/partners/partners.json`)
```json
{
  "collaborators": [
    {
      "name": "string",
      "institution": "string"
    }
  ]
}
```

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