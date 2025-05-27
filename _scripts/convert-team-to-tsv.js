#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read team data
const teamDataPath = path.join(__dirname, '../src/content/team/team.json');
const teamData = JSON.parse(fs.readFileSync(teamDataPath, 'utf8'));

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

// Helper function to format professional career
// Format: "period | position" separated by " || "
function formatProfessionalCareer(career) {
  if (!career || !Array.isArray(career)) return '';
  return career.map(item => `${item.period} | ${item.position}`).join(' || ');
}

// Helper function to format education
// Format: "period | degree" separated by " || "
function formatEducation(education) {
  if (!education || !Array.isArray(education)) return '';
  return education.map(item => `${item.period} | ${item.degree}`).join(' || ');
}

// Convert current team members
console.log('Converting current team members...');

// Headers for current team
const currentHeaders = [
  'name',
  'role',
  'description',
  'research_interests',
  'professional_career',
  'education',
  'email',
  'telephone',
  'orcid',
  'image'
];

// Create TSV for current team
const currentTSV = [
  currentHeaders.join('\t'),
  ...teamData.current.map(member => {
    return currentHeaders.map(header => {
      switch(header) {
        case 'professional_career':
          return escapeTSV(formatProfessionalCareer(member.professional_career));
        case 'education':
          return escapeTSV(formatEducation(member.education));
        default:
          return escapeTSV(member[header]);
      }
    }).join('\t');
  })
].join('\n');

// Write current team TSV
fs.writeFileSync(path.join(__dirname, 'team_current.tsv'), currentTSV);
console.log('Created team_current.tsv');

// Convert alumni
console.log('Converting alumni...');

// Headers for alumni
const alumniHeaders = [
  'name',
  'position',
  'duration',
  'linkedin'
];

// Create TSV for alumni
const alumniTSV = [
  alumniHeaders.join('\t'),
  ...teamData.alumni.map(member => {
    return alumniHeaders.map(header => escapeTSV(member[header])).join('\t');
  })
].join('\n');

// Write alumni TSV
fs.writeFileSync(path.join(__dirname, 'team_alumni.tsv'), alumniTSV);
console.log('Created team_alumni.tsv');

console.log('\nFormat documentation:');
console.log('- Professional Career: Multiple entries separated by " || ", each entry format: "period | position"');
console.log('- Education: Multiple entries separated by " || ", each entry format: "period | degree"');
console.log('\nExample professional career:');
console.log('"2024-present | Head of Research, EMBL-EBI || 2018-present | Professor at Heidelberg University"');