import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { orcidLoader } from './loaders/orcid';
import { fundingLoader } from './loaders/funding';
import { githubLoader } from './loaders/github';
import { googleSheetsLoader } from './loaders/google-sheets';
// @ts-check

const publications_loaded = defineCollection({
  loader: orcidLoader({
    orcid: '0000-0002-8552-8976',
    preprintPublicationSheet: {
      spreadsheetId: '1Mjn0C3gjSr5Wl2ZG41X813LLhL-y47DvLeEUCmagTe8',
      sheetName: 'Preprint Publication Title Match',
    }
  }),
});

const funding_loaded = defineCollection({
  loader: fundingLoader({
    orcid: '0000-0002-8552-8976'
  }),
});

const teams_loaded = defineCollection({
  loader: githubLoader({
    org: 'saezlab',
    teams: ['core', 'intern-visitor', 'associated'],
    token: import.meta.env.GH_TOKEN
  }),
});

const year = z.number().int().min(1900).max(2200);
const membership = z.object({
  start_year: year.optional(),
  end_year: year.optional(),
}).strict().refine(
  ({ start_year, end_year }) => start_year === undefined || end_year === undefined || end_year >= start_year,
  'Membership end year must not precede start year',
);

const members = defineCollection({
  loader: glob({
    pattern: '*.yaml',
    base: './src/content/members',
    // Keep existing URLs, including accents and punctuation, stable across name edits.
    generateId: ({ entry }) => entry.replace(/\.yaml$/, ''),
  }),
  schema: z.object({
    name: z.string().min(1),
    status: z.enum(['current', 'alumni']),
    role: z.string().min(1),
    group: z.enum(['group-leader', 'administration', 'staff-scientists', 'postdocs', 'phd-students', 'associated-members']).optional(),
    order: z.number().int().nonnegative().default(1000),
    image: z.string().default(''),
    description: z.string().default(''),
    research_interests: z.string().optional(),
    email: z.string().email().optional(),
    telephone: z.string().optional(),
    orcid: z.string().regex(/^\d{4}-\d{4}-\d{4}-\d{3}[\dX]$/).optional(),
    linkedin: z.string().url().optional(),
    membership: membership.optional(),
    professional_career: z.array(z.object({ period: z.string().min(1), position: z.string().min(1) }).strict()).default([]),
    education: z.array(z.object({ period: z.string().min(1), degree: z.string().min(1) }).strict()).default([]),
  }).strict().superRefine((member, ctx) => {
    if (member.status === 'current' && !member.group) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['group'], message: 'Current members need a display group' });
    }
  }),
});
const software = defineCollection({
  loader: googleSheetsLoader({
    spreadsheetId: '1Mjn0C3gjSr5Wl2ZG41X813LLhL-y47DvLeEUCmagTe8',
    sheetName: 'software',
    headers: ['name', 'short_description', 'long_description', 'code_repository', 'website', 'publication', 'image', 'categories'],
  }),
});

const featured_publications = defineCollection({
  loader: googleSheetsLoader({
    spreadsheetId: '1Mjn0C3gjSr5Wl2ZG41X813LLhL-y47DvLeEUCmagTe8',
    sheetName: 'Featured Publications',
    headers: ['featured_pmid', 'featured_title', 'featured_doi'],
  }),
});

export const collections = {
  publications_loaded,
  funding_loaded,
  teams_loaded,
  members,
  software,
  featured_publications,
}; 
