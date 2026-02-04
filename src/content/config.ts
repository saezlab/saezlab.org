import { defineCollection, z } from 'astro:content';
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

const team_current = defineCollection({
  loader: googleSheetsLoader({
    spreadsheetId: '1Mjn0C3gjSr5Wl2ZG41X813LLhL-y47DvLeEUCmagTe8',
    sheetName: 'current',
    headers: ['name', 'role', 'description', 'research_interests', 'professional_career', 'education', 'email', 'telephone', 'orcid', 'image'],
  }),
});

const team_alumni = defineCollection({
  loader: googleSheetsLoader({
    spreadsheetId: '1Mjn0C3gjSr5Wl2ZG41X813LLhL-y47DvLeEUCmagTe8',
    sheetName: 'alumni',
    headers: ['name', 'position', 'duration', 'linkedin'],
  }),
});
const software = defineCollection({
  loader: googleSheetsLoader({
    spreadsheetId: '1Mjn0C3gjSr5Wl2ZG41X813LLhL-y47DvLeEUCmagTe8',
    sheetName: 'software',
    headers: ['name', 'short_description', 'long_description', 'code_repository', 'website', 'publication', 'image', 'categories'],
  }),
});

export const collections = {
  publications_loaded,
  funding_loaded,
  teams_loaded,
  team_current,
  team_alumni,
  software,
}; 
