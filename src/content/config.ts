import { defineCollection, z } from 'astro:content';
import { pmcLoader } from './loaders/pmc';
import { fundingLoader } from './loaders/funding';
import { githubLoader } from './loaders/github';
// @ts-check

const publications_loaded = defineCollection({
  loader: pmcLoader({
    orcid: '0000-0002-8552-8976'
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
    token: import.meta.env.TOKEN_GITHUB
  }),
});

export const collections = {
  publications_loaded,
  funding_loaded,
  teams_loaded,
}; 