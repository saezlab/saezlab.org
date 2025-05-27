#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read software data
const softwareDataPath = path.join(__dirname, '../src/content/software/software.json');
const softwareData = JSON.parse(fs.readFileSync(softwareDataPath, 'utf8'));

// Helper function to escape TSV values
function escapeTSV(value) {
  if (value === null || value === undefined) return '';
  const str = String(value);
  // If contains tab, newline, or quotes, wrap in quotes and escape quotes
  if (str.includes('\t') || str.includes('\n') || str.includes('"')) {
    return '"' + str.replace(/"/g, '""') + '"';
  }
  return str;
}

// Helper function to format categories
function formatCategories(categories) {
  if (!categories) return '';
  const categoryList = [];
  if (categories.featured) categoryList.push('featured');
  if (categories.tool) categoryList.push('tool');
  if (categories.database) categoryList.push('database');
  return categoryList.join(', ');
}

console.log('Converting software data...');

// Headers for software
const headers = [
  'name',
  'short_description',
  'long_description',
  'code_repository',
  'website',
  'publication',
  'image',
  'categories'
];

// Create TSV
const tsvContent = [
  headers.join('\t'),
  ...softwareData.map(item => {
    return headers.map(header => {
      switch(header) {
        case 'categories':
          return escapeTSV(formatCategories(item.categories));
        default:
          return escapeTSV(item[header]);
      }
    }).join('\t');
  })
].join('\n');

// Write TSV file
fs.writeFileSync(path.join(__dirname, 'software.tsv'), tsvContent);
console.log('Created software.tsv');

console.log('\nFormat documentation:');
console.log('- Categories: Comma-separated list (e.g., "featured, tool" or "database, tool")');
console.log(`- Total software items: ${softwareData.length}`);