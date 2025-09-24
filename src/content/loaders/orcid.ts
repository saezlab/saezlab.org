import type { Loader, LoaderContext } from 'astro/loaders';
import { z } from 'astro:content';

interface OrcidWork {
  'put-code': number;
  'title': {
    'title': {
      value: string;
    };
  };
  'journal-title'?: {
    value: string;
  };
  'publication-date'?: {
    year?: { value: string };
    month?: { value: string };
    day?: { value: string };
  };
  'type': string;
  'external-ids'?: {
    'external-id': Array<{
      'external-id-type': string;
      'external-id-value': string;
      'external-id-url'?: { value: string };
    }>;
  };
  'url'?: {
    value: string;
  };
}

interface OrcidWorksResponse {
  'last-modified-date': { value: number };
  'group': Array<{
    'last-modified-date': { value: number };
    'external-ids': {
      'external-id': Array<{
        'external-id-type': string;
        'external-id-value': string;
      }>;
    };
    'work-summary': OrcidWork[];
  }>;
  'path': string;
}

function parseAuthorsFromXml(xml: string): { authors: string; firstAuthor: string } {
  const contributorMatches = xml.matchAll(/<work:contributor>[\s\S]*?<\/work:contributor>/g);
  const authors: string[] = [];

  for (const match of contributorMatches) {
    const contributorXml = match[0];
    const roleMatch = contributorXml.match(/<work:contributor-role>(.*?)<\/work:contributor-role>/);
    const role = roleMatch?.[1];

    if (role === 'author') {
      const nameMatch = contributorXml.match(/<work:credit-name>(.*?)<\/work:credit-name>/);
      if (nameMatch?.[1]) {
        authors.push(nameMatch[1]);
      }
    }
  }

  return {
    authors: authors.join(', '),
    firstAuthor: authors[0] || ''
  };
}

export function orcidLoader(options: { orcid: string }): Loader {
  return {
    name: 'orcid-loader',
    schema: z.object({
      publications: z.array(z.object({
        title: z.string(),
        authors: z.string(),
        firstAuthor: z.string(),
        date: z.string(),
        year: z.number(),
        journal: z.string(),
        europePmc: z.string().optional(),
        isPreprint: z.boolean(),
        isReview: z.boolean(),
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
      logger.info('ORCID Loader starting');
      const ORCID_ID = options.orcid;
      const BASE_URL = `https://pub.orcid.org/v3.0/${ORCID_ID}/works`;

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

        const data: OrcidWorksResponse = await response.json();
        logger.info(`Found ${data.group.length} work entries from ORCID`);

        const putCodes = data.group.map(group => group['work-summary'][0]['put-code']);
        logger.info(`Fetching detailed information for ${putCodes.length} works in batches of 100`);

        const allPublications = [];
        const batchSize = 100;

        for (let i = 0; i < putCodes.length; i += batchSize) {
          const batch = putCodes.slice(i, i + batchSize);
          const bulkUrl = `https://pub.orcid.org/v3.0/${ORCID_ID}/works/${batch.join(',')}`;

          const bulkResponse = await fetch(bulkUrl, {
            headers: {
              'Accept': 'application/vnd.orcid+xml'
            }
          });

          if (!bulkResponse.ok) {
            logger.warn(`Failed to fetch batch starting at index ${i}: ${bulkResponse.status}`);
            continue;
          }

          const xmlText = await bulkResponse.text();
          logger.info(`Processing batch ${Math.floor(i / batchSize) + 1}`);

          const workMatches = xmlText.matchAll(/<work:work[\s\S]*?<\/work:work>/g);

          for (const workMatch of workMatches) {
            const workXml = workMatch[0];

            const titleMatch = workXml.match(/<common:title>(.*?)<\/common:title>/);
            const title = titleMatch?.[1];

            if (!title) {
              logger.warn('Skipping work entry with missing title');
              continue;
            }

            const journalMatch = workXml.match(/<work:journal-title>(.*?)<\/work:journal-title>/);
            const journal = journalMatch?.[1] || 'Unknown Journal';

            const yearMatch = workXml.match(/<common:year>(.*?)<\/common:year>/);
            const monthMatch = workXml.match(/<common:month>(.*?)<\/common:month>/);
            const dayMatch = workXml.match(/<common:day>(.*?)<\/common:day>/);

            const year = yearMatch?.[1] ? parseInt(yearMatch[1]) : new Date().getFullYear();
            const month = monthMatch?.[1]?.padStart(2, '0') || '01';
            const day = dayMatch?.[1]?.padStart(2, '0') || '01';
            const dateString = `${year}-${month}-${day}`;

            const doiMatch = workXml.match(/<common:external-id-type>doi<\/common:external-id-type>[\s\S]*?<common:external-id-value>(.*?)<\/common:external-id-value>/);
            const pmidMatch = workXml.match(/<common:external-id-type>pmid<\/common:external-id-type>[\s\S]*?<common:external-id-value>(.*?)<\/common:external-id-value>/);
            const pmcMatch = workXml.match(/<common:external-id-type>pmc<\/common:external-id-type>[\s\S]*?<common:external-id-value>(.*?)<\/common:external-id-value>/);

            const doi = doiMatch?.[1];
            const pmid = pmidMatch?.[1];
            const pmcid = pmcMatch?.[1];

            const urlMatch = workXml.match(/<common:url>(.*?)<\/common:url>/);
            const workUrl = urlMatch?.[1];

            const { authors, firstAuthor } = parseAuthorsFromXml(workXml);

            const typeMatch = workXml.match(/<work:type>(.*?)<\/work:type>/);
            const workType = typeMatch?.[1]?.toLowerCase() || '';
            const titleString = title.toLowerCase();
            const isPreprint = workType.includes('preprint') || titleString.includes('biorxiv') || titleString.includes('arxiv');
            const isReview = workType.includes('review') || titleString.includes('review');

            let europePmc: string | undefined;
            if (pmid) {
              europePmc = `http://europepmc.org/abstract/MED/${pmid}`;
            } else if (pmcid) {
              europePmc = `http://europepmc.org/abstract/PMC/${pmcid}`;
            } else if (workUrl?.includes('europepmc.org')) {
              europePmc = workUrl;
            }

            const processedPub = {
              title,
              authors,
              firstAuthor,
              date: dateString,
              year,
              journal,
              europePmc,
              isPreprint,
              isReview,
              pmid,
              doi,
              pmcid,
              isOpenAccess: isPreprint,
              volume: undefined,
              issue: undefined,
              pages: undefined,
            };

            allPublications.push(processedPub);
          }
        }

        logger.info(`Successfully processed ${allPublications.length} publications from ORCID`);

        allPublications.sort((a, b) => {
          if (a.year !== b.year) {
            return b.year - a.year;
          }
          return b.date.localeCompare(a.date);
        });

        store.set({
          id: 'publications_loaded',
          data: {
            publications: allPublications
          },
          body: '',
        });

        logger.info('Finished loading publications from ORCID');
      } catch (error) {
        logger.error(`Error fetching publications from ORCID: ${error}`);
        throw error;
      }
    },
  };
}