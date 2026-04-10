import type { Loader } from 'astro/loaders';
import { z } from 'astro:content';

interface GoogleSheetsConfig {
  spreadsheetId: string;
  sheetName: string;
  headers: string[];
}

export function googleSheetsLoader(config: GoogleSheetsConfig): Loader {
  return {
    name: 'google-sheets-loader',
    load: async ({ store, logger }) => {
      const { spreadsheetId, sheetName, headers } = config;
      
      // Construct the URL for Google Sheets export as CSV
      const url = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/gviz/tq?tqx=out:csv&sheet=${sheetName}`;
      
      logger.info(`Fetching data from sheet: ${sheetName}`);
      
      try {
        // Clear stale entries on reloads in dev/hot-reload.
        store.clear();

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Failed to fetch sheet: ${response.statusText}`);
        }
        
        const csvText = await response.text();
        const rows = parseCSV(csvText).filter(row => row.some(cell => cell.trim() !== ''));

        // Sanity check: ensure we got data
        if (rows.length <= 1) {
          throw new Error(`Google Sheets loader for "${sheetName}" returned no data rows - expected at least 1`);
        }

        // Skip header row and process data rows
        for (let i = 1; i < rows.length; i++) {
          const row = rows[i];
          if (row.length === 0) continue;
          
          // Create object from row data
          const data: Record<string, string> = {};
          headers.forEach((header, index) => {
            data[header] = row[index] || '';
          });
          
          const id = `row_${i}`;
          store.set({ id, data });
        }
        
        logger.info(`Loaded ${rows.length - 1} entries from ${sheetName}`);
      } catch (error) {
        logger.error(`Error loading sheet ${sheetName}: ${error}`);
        throw error;
      }
    },
    schema: async () => {
      // Create a Zod schema based on headers
      const schemaObject: Record<string, any> = {};
      config.headers.forEach(header => {
        schemaObject[header] = z.string().optional();
      });
      return z.object(schemaObject);
    }
  };
}

// CSV parser that handles quoted values, escaped quotes, and embedded newlines.
function parseCSV(csvText: string): string[][] {
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentField = '';
  let inQuotes = false;

  for (let i = 0; i < csvText.length; i++) {
    const char = csvText[i];
    const nextChar = csvText[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        currentField += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === ',' && !inQuotes) {
      currentRow.push(currentField.trim());
      currentField = '';
      continue;
    }

    if ((char === '\n' || char === '\r') && !inQuotes) {
      if (char === '\r' && nextChar === '\n') {
        i++;
      }

      currentRow.push(currentField.trim());
      currentField = '';
      rows.push(currentRow);
      currentRow = [];
      continue;
    }

    currentField += char;
  }

  if (currentField.length > 0 || currentRow.length > 0) {
    currentRow.push(currentField.trim());
    rows.push(currentRow);
  }

  return rows;
}