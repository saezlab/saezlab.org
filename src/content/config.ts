import { defineCollection, z } from 'astro:content';
import { pmcLoader } from './loaders/pmc';
import { fundingLoader } from './loaders/funding';

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

export const collections = {
  publications_loaded,
  funding_loaded,
}; 