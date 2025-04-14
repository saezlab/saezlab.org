import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Badge } from "./ui/badge";
import PublicationCard from "./PublicationCard";

interface Publication {
  title: string;
  authors: string;
  journal: string;
  year: string;
  url: string;
  featured: boolean;
}

interface PublicationsTabsProps {
  publications: Publication[];
}

export default function PublicationsTabs({ publications }: PublicationsTabsProps) {
  const featuredCount = publications.filter((publication) => publication.featured).length;
  const totalCount = publications.length;

  return (
    <Tabs defaultValue="featured" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
      <TabsTrigger value="featured" className="flex items-center gap-2">
          Featured
          <Badge variant="secondary" className="ml-1">
            {featuredCount}
          </Badge>
        </TabsTrigger>
        <TabsTrigger value="all" className="flex items-center gap-2">
          All Publications
          <Badge variant="secondary" className="ml-1">
            {totalCount}
          </Badge>
        </TabsTrigger>
      </TabsList>
      <TabsContent value="all" className="mt-6">
        <div className="space-y-6">
          {publications.map((publication) => (
            <PublicationCard
              key={publication.url}
              title={publication.title}
              authors={publication.authors}
              journal={publication.journal}
              year={publication.year}
              url={publication.url}
              featured={publication.featured}
            />
          ))}
        </div>
      </TabsContent>
      <TabsContent value="featured" className="mt-6">
        <div className="space-y-6">
          {publications
            .filter((publication) => publication.featured)
            .map((publication) => (
              <PublicationCard
                key={publication.url}
                title={publication.title}
                authors={publication.authors}
                journal={publication.journal}
                year={publication.year}
                url={publication.url}
                featured={publication.featured}
              />
            ))}
        </div>
      </TabsContent>
    </Tabs>
  );
} 