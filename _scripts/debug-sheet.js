#!/usr/bin/env node

// Debug script to check what Google Sheets API returns

const SHEET_ID = '1Mjn0C3gjSr5Wl2ZG41X813LLhL-y47DvLeEUCmagTe8';

async function debugSheet(sheetName, gid) {
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=${sheetName}`;
  
  console.log(`\nFetching ${sheetName} sheet...`);
  console.log(`URL: ${url.replace('tqx=out:json', 'tqx=out:html')}`);
  
  try {
    const response = await fetch(url);
    const text = await response.text();
    
    // Extract JSON from Google's response
    const jsonString = text.slice(47, -2);
    const json = JSON.parse(jsonString);
    
    console.log(`\nColumns found (${json.table.cols.length}):`);
    json.table.cols.forEach((col, index) => {
      console.log(`  Column ${index}: label="${col.label}", type="${col.type}", id="${col.id}"`);
    });
    
    console.log(`\nFirst row of data:`);
    if (json.table.rows.length > 0) {
      const firstRow = json.table.rows[0];
      firstRow.c.forEach((cell, index) => {
        const value = cell ? (cell.v || cell.f || 'null') : 'null';
        console.log(`  Cell ${index}: ${value}`);
      });
    }
    
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
}

// Debug both sheets
(async () => {
  await debugSheet('current', 0);
  await debugSheet('alumni', 1);
})();