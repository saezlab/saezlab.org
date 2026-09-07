// Parse software categories from comma-separated string
export function parseSoftwareCategories(categoriesString: string): { featured: boolean; tool: boolean; database: boolean } {
  const categoryList = categoriesString ? categoriesString.split(',').map(c => c.trim()) : [];
  
  return {
    featured: categoryList.includes('featured'),
    tool: categoryList.includes('tool'),
    database: categoryList.includes('database'),
  };
}