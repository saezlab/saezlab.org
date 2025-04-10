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

Publication data is stored in `src/content/publications/publications.json`. To add or update publications, edit this file.

### News

News articles are written in MDX format and stored in `src/content/news/`. To add a new article, create a new MDX file with the following frontmatter:

```mdx
---
title: "Article Title"
date: "YYYY-MM-DD"
author: "Author Name"
image: "/path/to/image.jpg"
excerpt: "Article excerpt"
---

Article content...
```

### Software

Software tool information is stored in `src/content/software/software.json`. To add or update software tools, edit this file.

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

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
