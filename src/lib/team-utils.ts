// Helper functions to parse team data from Google Sheets format

export interface CareerItem {
  period: string;
  position: string;
}

export interface EducationItem {
  period: string;
  degree: string;
}

// Parse professional career string format: "period | position || period | position"
export function parseProfessionalCareer(careerString: string): CareerItem[] {
  if (!careerString || careerString.trim() === '') return [];
  
  return careerString.split(' || ').map(item => {
    const [period, position] = item.split(' | ').map(s => s.trim());
    return { period, position };
  });
}

// Parse education string format: "period | degree || period | degree"
export function parseEducation(educationString: string): EducationItem[] {
  if (!educationString || educationString.trim() === '') return [];
  
  return educationString.split(' || ').map(item => {
    const [period, degree] = item.split(' | ').map(s => s.trim());
    return { period, degree };
  });
}

// Transform sheet data to match the existing team member structure
export function transformTeamMember(sheetData: any) {
  return {
    ...sheetData,
    professional_career: parseProfessionalCareer(sheetData.professional_career || ''),
    education: parseEducation(sheetData.education || ''),
  };
}

// Parse software categories from comma-separated string
export function parseSoftwareCategories(categoriesString: string): { featured: boolean; tool: boolean; database: boolean } {
  const categoryList = categoriesString ? categoriesString.split(',').map(c => c.trim()) : [];
  
  return {
    featured: categoryList.includes('featured'),
    tool: categoryList.includes('tool'),
    database: categoryList.includes('database'),
  };
}