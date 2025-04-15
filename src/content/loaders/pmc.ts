import type { Loader, LoaderContext } from 'astro/loaders';
import { z } from 'astro:content';

interface PMCPublication {
  id: string;
  title: string;
  authorString: string;
  firstPublicationDate: string;
  journalTitle: string;
  source: string;
  pubType?: string;
  pmid?: string;
  doi?: string;
  pmcid?: string;
  isOpenAccess?: string;
  journalVolume?: string;
  issue?: string;
  pageInfo?: string;
}

interface PMCApiResponse {
  resultList: {
    result: PMCPublication[];
  };
  nextCursorMark: string;
  hitCount: number;
  request: {
    pageSize: number;
    cursorMark: string;
  };
}

export function pmcLoader(options: { orcid: string }): Loader {
  return {
    name: 'pmc-loader',
    schema: z.object({
      publications: z.array(z.object({
        title: z.string(),
        authors: z.string(),
        firstAuthor: z.string(),
        date: z.string(),
        journal: z.string(),
        link: z.string().url(),
        isPreprint: z.boolean(),
        pmid: z.string().optional(),
        doi: z.string().optional(),
        pmcid: z.string().optional(),
        isOpenAccess: z.boolean(),
        volume: z.string().optional(),
        issue: z.string().optional(),
        pages: z.string().optional(),
      }))
    }),
    load: async ({ store, logger }: LoaderContext) => {
      logger.info('PMC Loader starting');
      const ORCID_ID = options.orcid;
      const BASE_URL = 'https://www.ebi.ac.uk/europepmc/webservices/rest/search';
      let nextCursorMark = '*';
      let isLast = false;
      const allPublications = [];

      logger.info(`Fetching publications for ORCID: ${ORCID_ID}`);

      while (!isLast) {
        const url = `${BASE_URL}?query=(AUTHORID:"${ORCID_ID}" sort_date=y)&format=JSON&pageSize=150&cursorMark=${nextCursorMark}`;
        
        logger.debug(`Fetching URL: ${url}`);
        
        try {
          const response = await fetch(url);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          
          const data: PMCApiResponse = await response.json();
          logger.debug('PMC API Response received');
          
          nextCursorMark = data.nextCursorMark;
          
          isLast = data.hitCount <= data.request.pageSize || 
                   !data.nextCursorMark || 
                   nextCursorMark === data.request.cursorMark || 
                   data.resultList.result.length === 0;

          for (const pub of data.resultList.result) {

            const processedPub = {
              title: pub.title || '',
              authors: pub.authorString || '',
              firstAuthor: pub.authorString ? pub.authorString.split(',')[0].trim() : '',
              date: pub.firstPublicationDate || '',
              journal: pub.journalTitle || 'Unknown Journal',
              link: pub.source && pub.id 
                ? `http://europepmc.org/abstract/${pub.source}/${pub.id}`
                : pub.doi 
                  ? `https://doi.org/${pub.doi}`
                  : '',
              isPreprint: pub.pubType?.toLowerCase().includes('preprint') || false,
              pmid: pub.pmid,
              doi: pub.doi,
              pmcid: pub.pmcid,
              isOpenAccess: pub.isOpenAccess === 'Y' || pub.pubType?.toLowerCase().includes('preprint'),
              volume: pub.journalVolume,
              issue: pub.issue,
              pages: pub.pageInfo,
            };
            allPublications.push(processedPub);
          }

          logger.info(`Processed ${data.resultList.result.length} publications`);
        } catch (error) {
          logger.error(`Error fetching publications: ${error}`);
          break;
        }
      }

      logger.info(`Total publications processed: ${allPublications.length}`);

      store.set({
        id: 'publications_loaded',
        data: {
          publications: allPublications
        },
        body: '',
      });

      logger.info('Finished loading publications from PMC');
    },
  };
} 