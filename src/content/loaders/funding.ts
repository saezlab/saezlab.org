import type { Loader, LoaderContext } from 'astro/loaders';
import { z } from 'astro:content';

export function fundingLoader(options: { orcid: string }): Loader {
  return {
    name: 'funding-loader',
    schema: z.object({
      grants: z.array(z.object({
        duration: z.string(),
        name: z.string(),
        agency: z.string(),
        startYear: z.string(),
        url: z.string().optional(),
      }))
    }),
    load: async ({ store, logger }: LoaderContext) => {
      logger.info('Funding Loader starting');
      const ORCID_ID = options.orcid;
      const BASE_URL = `https://pub.orcid.org/v3.0/${ORCID_ID}/fundings`;
      
      try {
        const response = await fetch(BASE_URL, {
          headers: {
            'Accept': 'application/vnd.orcid+json',
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        logger.info(`Processing ${data['group'].length} funding entries`);
        
        const grants = data['group'].map((group: any) => {
          const funding = group['funding-summary'][0];
          const startYear = funding?.['start-date']?.year?.value;
          const endYear = funding?.['end-date']?.year?.value;
          
          if (!startYear) {
            logger.warn(`Skipping funding entry with missing start date`);
            return null;
          }

          // Try to get URL from external-ids if main URL is not available
          const mainUrl = funding?.url?.value;
          const grantNumberUrl = funding?.['external-ids']?.['external-id']?.find(
            (id: any) => id['external-id-type'] === 'grant_number'
          )?.['external-id-url']?.value;

          return {
            duration: endYear 
              ? `${startYear}-${endYear}`
              : `${startYear}-present`,
            name: funding?.title?.title?.value || 'Untitled Grant',
            agency: funding?.organization?.name || 'Unknown Agency',
            startYear: startYear,
            url: mainUrl || grantNumberUrl
          };
        }).filter(Boolean).sort((a: any, b: any) => b.startYear.localeCompare(a.startYear));

        logger.info(`Successfully processed ${grants.length} grants`);

        store.set({
          id: 'funding_loaded',
          data: {
            grants
          },
          body: '',
        });

        logger.info('Finished loading funding data from ORCID');
      } catch (error) {
        logger.error(`Error fetching funding data: ${error}`);
        throw error;
      }
    },
  };
} 