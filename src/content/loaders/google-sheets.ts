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
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Failed to fetch sheet: ${response.statusText}`);
        }
        
        const csvText = await response.text();
        const rows = csvText.split('\n').filter(row => row.trim());
        
        // Skip header row and process data rows
        for (let i = 1; i < rows.length; i++) {
          const row = parseCSVRow(rows[i]);
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

// Simple CSV parser that handles quoted values
function parseCSVRow(row: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < row.length; i++) {
    const char = row[i];
    const nextChar = row[i + 1];
    
    if (char === '"' && inQuotes && nextChar === '"') {
      // Escaped quote
      current += '"';
      i++; // Skip next quote
    } else if (char === '"') {
      // Toggle quote mode
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      // End of field
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  
  // Don't forget last field
  result.push(current.trim());
  
  // Remove surrounding quotes from fields
  return result.map(field => {
    if (field.startsWith('"') && field.endsWith('"')) {
      return field.slice(1, -1);
    }
    return field;
  });
}