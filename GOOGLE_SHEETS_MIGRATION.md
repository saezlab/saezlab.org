# Google Sheets Migration - Next Steps

## What We've Done

1. **Created conversion script** (`scripts/convert-team-to-tsv.js`)
   - Converts team.json to TSV format
   - Creates two files: `team_current.tsv` and `team_alumni.tsv`
   - Professional career format: `"period | position || period | position"`
   - Education format: `"period | degree || period | degree"`

2. **Installed and configured astro-sheet-loader**
   - Added to package.json
   - Configured in `src/content/config.ts`
   - Points to sheet ID: `1Mjn0C3gjSr5Wl2ZG41X813LLhL-y47DvLeEUCmagTe8`

3. **Updated code to use Google Sheets**
   - Modified `team.astro` to use sheet collections
   - Modified `person/[slug].astro` for dynamic routes
   - Created `team-utils.ts` to parse career/education strings

## Next Steps for You

1. **Import data into Google Sheets**
   - Open your Google Sheet
   - Create two sheets: one for current team, one for alumni
   - Import `scripts/team_current.tsv` into the first sheet
   - Import `scripts/team_alumni.tsv` into the second sheet
   - Ensure headers match exactly (case-sensitive)

2. **Verify sheet settings**
   - Make sure the Google Sheet is publicly viewable
   - First sheet (gid=0) should contain current team members
   - Second sheet (gid=1) should contain alumni

3. **Test the site**
   - Run `pnpm dev` to test locally
   - Check that team page loads correctly
   - Verify individual team member pages work

4. **Clean up**
   - Once verified, remove `src/content/team/team.json`
   - Delete the conversion script if no longer needed

## Important Notes

- Team members can now update their info directly in Google Sheets
- Changes will be reflected on the next build
- Professional career and education use delimiter format (see above)
- Keep sensitive data handling in mind if adding new fields