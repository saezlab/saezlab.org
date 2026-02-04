import type { Loader, LoaderContext } from 'astro/loaders';
import { z } from 'astro:content';

/**
 * Normalize a string: remove accents/diacritics, convert to lowercase
 */
function normalizeStr(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics (accents)
    .toLowerCase();
}

/**
 * Calculate title similarity based on word overlap
 */
function titleTokens(title: string): string[] {
  return normalizeStr(title)
    .replace(/[^a-z0-9]+/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 2);
}

function titleSimilarity(titleA: string, titleB: string): number {
  const wordsA = new Set(titleTokens(titleA));
  const wordsB = new Set(titleTokens(titleB));
  if (wordsA.size === 0 || wordsB.size === 0) return 0;
  let overlap = 0;
  for (const w of wordsA) if (wordsB.has(w)) overlap++;
  return overlap / Math.min(wordsA.size, wordsB.size);
}

/**
 * Get author match info between preprint and publication
 */
function getAuthorMatchInfo(preprintAuthors: string, publicationAuthors: string): { ratio: number; matched: number; total: number } {
  if (!preprintAuthors || !publicationAuthors) return { ratio: 0, matched: 0, total: 0 };

  const pubAuthorsNorm = normalizeStr(publicationAuthors);
  const preprintAuthorList = preprintAuthors
    .split(',')
    .map(a => a.trim())
    .filter(a => a.length > 0);

  if (preprintAuthorList.length === 0) return { ratio: 0, matched: 0, total: 0 };

  let matchedCount = 0;
  for (const author of preprintAuthorList) {
    const words = normalizeStr(author)
      .split(/[\s\-]+/)
      .filter(w => w.length > 2);
    if (words.some(word => pubAuthorsNorm.includes(word))) matchedCount++;
  }

  return { ratio: matchedCount / preprintAuthorList.length, matched: matchedCount, total: preprintAuthorList.length };
}

/**
 * Simple scoring-based matcher for preprints vs publications
 */
function publicationsScoreSimple(
  preprintAuthors: string,
  publicationAuthors: string,
  preprintTitle: string,
  publicationTitle: string,
  preprintYear?: number | null,
  publicationYear?: number | null
): number {
  const { ratio, total } = getAuthorMatchInfo(preprintAuthors, publicationAuthors);
  const titleSim = titleSimilarity(preprintTitle, publicationTitle);
  const yearsPresent = Boolean(preprintYear && publicationYear);
  const yearDiff = yearsPresent ? Math.abs((publicationYear as number) - (preprintYear as number)) : null;
  let yearScore = 0;
  if (yearsPresent) {
    if (yearDiff! <= 2) yearScore = 1;
    else if (yearDiff === 3) yearScore = 0.5;
  }

  if (total === 0) {
    return 0.75 * titleSim + 0.25 * yearScore;
  }

  return 0.55 * titleSim + 0.35 * ratio + 0.10 * yearScore;
}

function publicationsMatchSimple(
  preprintAuthors: string,
  publicationAuthors: string,
  preprintTitle: string,
  publicationTitle: string,
  preprintYear?: number | null,
  publicationYear?: number | null
): boolean {
  return publicationsScoreSimple(
    preprintAuthors,
    publicationAuthors,
    preprintTitle,
    publicationTitle,
    preprintYear,
    publicationYear
  ) >= 0.7;
}

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

interface PreprintPublicationSheetConfig {
  spreadsheetId: string;
  sheetName: string;
}

function normalizeTitleKey(title: string): string {
  return normalizeStr(title).replace(/[^a-z0-9]+/g, ' ').trim();
}

// Simple CSV parser that handles quoted values
function parseCSVRow(row: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < row.length; i++) {
    const char = row[i];
    const nextChar = row[i + 1];

    if (char === '"' && inQuotes && nextChar === '"') {
      current += '"';
      i++;
    } else if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }

  result.push(current.trim());
  return result.map(field => {
    if (field.startsWith('"') && field.endsWith('"')) {
      return field.slice(1, -1);
    }
    return field;
  });
}

async function fetchPreprintTitleMatches(
  config: PreprintPublicationSheetConfig | undefined,
  logger: LoaderContext['logger']
): Promise<Set<string>> {
  if (!config) return new Set();

  const url = `https://docs.google.com/spreadsheets/d/${config.spreadsheetId}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(config.sheetName)}`;
  logger.info(`Fetching preprint title matches from sheet: ${config.sheetName}`);

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch sheet "${config.sheetName}": ${response.statusText}`);
  }

  const csvText = await response.text();
  const rows = csvText.split('\n').filter(row => row.trim());
  if (rows.length <= 1) return new Set();

  const normalizeHeader = (h: string) =>
    h.replace(/^\uFEFF/, '').toLowerCase().replace(/\s+/g, ' ').trim();
  const header = parseCSVRow(rows[0]).map(normalizeHeader);
  const findHeaderIndex = (includesAll: string[]) =>
    header.findIndex(h => includesAll.every(token => h.includes(token)));

  const preprintTitleIdx = findHeaderIndex(['preprint', 'title']);
  const publishedTitleIdx = findHeaderIndex(['published', 'title']);

  if (preprintTitleIdx === -1 || publishedTitleIdx === -1) {
    throw new Error(
      `Sheet "${config.sheetName}" is missing required columns. Found headers: ${header.join(' | ')}`
    );
  }

  const hideTitles = new Set<string>();
  for (let i = 1; i < rows.length; i++) {
    const row = parseCSVRow(rows[i]);
    const preprintTitle = (row[preprintTitleIdx] || '').trim();
    const publishedTitle = (row[publishedTitleIdx] || '').trim();
    if (!preprintTitle || !publishedTitle) continue;
    hideTitles.add(normalizeTitleKey(preprintTitle));
  }

  return hideTitles;
}

export function orcidLoader(options: { orcid: string; preprintPublicationSheet?: PreprintPublicationSheetConfig }): Loader {
  return {
    name: 'orcid-loader',
    schema: z.object({
      publications: z.array(z.object({
        title: z.string(),
        authors: z.string(),
        firstAuthor: z.string(),
        date: z.string(),
        year: z.number().optional(),
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
        publishedVersion: z.object({
          doi: z.string().optional(),
          pmid: z.string().optional(),
          title: z.string(),
          journal: z.string(),
          year: z.number().optional(),
        }).optional(),
      }))
    }),
    load: async ({ store, logger }: LoaderContext) => {
      logger.info('ORCID Loader starting');
      const ORCID_ID = options.orcid;
      const BASE_URL = `https://pub.orcid.org/v3.0/${ORCID_ID}/works`;

      try {
        const hidePreprintTitles = await fetchPreprintTitleMatches(options.preprintPublicationSheet, logger);
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
            let journal = journalMatch?.[1] || 'Unknown Journal';

            const yearMatch = workXml.match(/<common:year>(.*?)<\/common:year>/);
            const monthMatch = workXml.match(/<common:month>(.*?)<\/common:month>/);
            const dayMatch = workXml.match(/<common:day>(.*?)<\/common:day>/);

            // Fallback: try to extract year from citation if structured date is missing
            let year = yearMatch?.[1] ? parseInt(yearMatch[1]) : null;

            if (!year) {
              const citationMatch = workXml.match(/<work:citation-value>(.*?)<\/work:citation-value>/s);
              if (citationMatch?.[1]) {
                const citation = citationMatch[1];
                // Try to extract 4-digit year from citation (look for years like 2012, 1999, etc.)
                const citationYearMatch = citation.match(/\b(19|20)\d{2}\b/);
                if (citationYearMatch?.[0]) {
                  year = parseInt(citationYearMatch[0]);
                  logger.info(`Extracted year ${year} from citation for: ${title}`);

                  // Also try to extract journal from citation if not found
                  if (journal === 'Unknown Journal') {
                    // Look for text within <i>...</i> or &lt;i&gt;...&lt;/i&gt;
                    const journalFromCitationMatch = citation.match(/(?:<i>|&lt;i&gt;)(.*?)(?:<\/i>|&lt;\/i&gt;)/);
                    if (journalFromCitationMatch?.[1]) {
                      journal = journalFromCitationMatch[1];
                    }
                  }
                }
              }
            }

            // If no year found, log warning but continue
            if (!year) {
              logger.warn(`No year found for publication: "${title}"`);
            }

            const month = monthMatch?.[1]?.padStart(2, '0') || '01';
            const day = dayMatch?.[1]?.padStart(2, '0') || '01';
            const dateString = year ? `${year}-${month}-${day}` : '';

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

        // Sanity checks
        if (allPublications.length < 10) {
          throw new Error(`ORCID loader returned only ${allPublications.length} publications - expected at least 10`);
        }

        const publicationsWithoutTitle = allPublications.filter(p => !p.title || p.title.trim() === '');
        if (publicationsWithoutTitle.length > 0) {
          throw new Error(`${publicationsWithoutTitle.length} publications missing title - data quality issue`);
        }

        allPublications.sort((a, b) => {
          // Publications without year go to the end
          if (!a.year && !b.year) {
            return b.date.localeCompare(a.date);
          }
          if (!a.year) return 1;
          if (!b.year) return -1;

          // Both years are defined at this point
          const yearDiff = b.year - a.year;
          if (yearDiff !== 0) {
            return yearDiff;
          }
          return b.date.localeCompare(a.date);
        });

        // Match preprints to their published versions at build time
        logger.info(`Matching preprints to published versions (skipping ${hidePreprintTitles.size} preprints listed in sheet)...`);
        const nonPreprints = allPublications.filter(p => !p.isPreprint);
        let matchCount = 0;

        for (const pub of allPublications) {
          if (!pub.isPreprint) continue;
          if (hidePreprintTitles.has(normalizeTitleKey(pub.title))) {
            continue;
          }

          const preprintYear = pub.year || new Date(pub.date).getFullYear();

          for (const candidate of nonPreprints) {
            const candidateYear = candidate.year || new Date(candidate.date).getFullYear();

            // Check if authors and title match using simple scoring
            if (!publicationsMatchSimple(pub.authors, candidate.authors, pub.title, candidate.title, preprintYear, candidateYear)) {
              continue;
            }

            // Found a match!
            (pub as any).publishedVersion = {
              doi: candidate.doi,
              pmid: candidate.pmid,
              title: candidate.title,
              journal: candidate.journal,
              year: candidate.year,
            };
            matchCount++;
            logger.info(`Matched: "${pub.title.substring(0, 50)}..." -> "${candidate.title.substring(0, 50)}..."`);
            break;
          }
        }

        logger.info(`Matched ${matchCount} preprints to published versions`);

        const filteredPublications = allPublications.filter(pub => {
          if (!pub.isPreprint) return true;
          const hasPublished = Boolean((pub as any).publishedVersion);
          const inSheet = hidePreprintTitles.has(normalizeTitleKey(pub.title));
          return !hasPublished && !inSheet;
        });

        store.set({
          id: 'publications_loaded',
          data: {
            publications: filteredPublications
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
