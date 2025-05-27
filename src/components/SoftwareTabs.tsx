import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { Software } from '@/types/types';
import SoftwareCard from './SoftwareCard';

interface SoftwareTabsProps {
  software: Software[];
}

export default function SoftwareTabs({ software }: SoftwareTabsProps) {
  // Filter software by category
  const featuredSoftware = software.filter(item => item.categories.featured);
  const tools = software.filter(item => item.categories.tool);
  const databases = software.filter(item => item.categories.database);

  return (
    <Tabs defaultValue="featured" className="w-full">
      <TabsList className="grid w-full grid-cols-3 mb-8">
        <TabsTrigger value="featured" className="flex items-center gap-2">
          Featured
          <Badge variant="secondary" className="ml-1">
            {featuredSoftware.length}
          </Badge>
        </TabsTrigger>
        <TabsTrigger value="tools" className="flex items-center gap-2">
          Tools
          <Badge variant="secondary" className="ml-1">
            {tools.length}
          </Badge>
        </TabsTrigger>
        <TabsTrigger value="databases" className="flex items-center gap-2">
          Databases
          <Badge variant="secondary" className="ml-1">
            {databases.length}
          </Badge>
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="featured">
        <div className="grid gap-6 md:grid-cols-2">
          {featuredSoftware.map((item) => (
            <SoftwareCard
              key={item.name}
              name={item.name}
              short_description={item.short_description}
              long_description={item.long_description}
              code_repository={item.code_repository}
              website={item.website}
              publication={item.publication}
              image={item.image}
              categories={item.categories}
            />
          ))}
        </div>
      </TabsContent>
      
      <TabsContent value="tools">
        <div className="grid gap-6 md:grid-cols-2">
          {tools.map((item) => (
            <SoftwareCard
              key={item.name}
              name={item.name}
              short_description={item.short_description}
              long_description={item.long_description}
              code_repository={item.code_repository}
              website={item.website}
              publication={item.publication}
              image={item.image}
              categories={item.categories}
            />
          ))}
        </div>
      </TabsContent>
      
      <TabsContent value="databases">
        <div className="grid gap-6 md:grid-cols-2">
          {databases.map((item) => (
            <SoftwareCard
              key={item.name}
              name={item.name}
              short_description={item.short_description}
              long_description={item.long_description}
              code_repository={item.code_repository}
              website={item.website}
              publication={item.publication}
              image={item.image}
              categories={item.categories}
            />
          ))}
        </div>
      </TabsContent>
    </Tabs>
  );
}