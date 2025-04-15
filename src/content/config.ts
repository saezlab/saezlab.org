import { defineCollection, z } from 'astro:content';
import { pmcLoader } from './loaders/pmc';

const publications_loaded = defineCollection({
  loader: pmcLoader({
    orcid: '0000-0002-8552-8976'
  }),
});

export const collections = {
  publications_loaded,
}; 