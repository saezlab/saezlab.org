import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, FileText, Link2, BookOpen, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { useState } from 'react';

interface Publication {
  title: string;
  authors: string;
  journal: string;
  volume?: string;
  issue?: string;
  pages?: string;
  date: string;
  isOpenAccess?: boolean;
  isPreprint?: boolean;
  link?: string;
  doi?: string;
  pmid?: string;
  pmcid?: string;
}

interface PublicationsTabsLoadedProps {
  publications: Publication[];
  featuredPmids: string[];
}

export default function PublicationsTabsLoaded({ publications, featuredPmids }: PublicationsTabsLoadedProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const publicationsPerPage = 10;

  // Filter featured publications
  const featuredPublications = publications.filter(pub => 
    pub.pmid && featuredPmids.includes(pub.pmid)
  );

  // Sort publications by date (newest first)
  const sortedPublications = [...publications].sort((a, b) => {
    return b.date.localeCompare(a.date);
  });

  const sortedFeaturedPublications = [...featuredPublications].sort((a, b) => {
    return b.date.localeCompare(a.date);
  });

  // Calculate pagination
  const totalPages = Math.ceil(sortedPublications.length / publicationsPerPage);
  const startIndex = (currentPage - 1) * publicationsPerPage;
  const endIndex = startIndex + publicationsPerPage;
  const paginatedPublications = sortedPublications.slice(startIndex, endIndex);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  return (
    <Tabs defaultValue="featured" className="w-full">
      <TabsList className="grid w-full grid-cols-2 mb-8">
        <TabsTrigger value="featured" className="flex items-center gap-2">
          Featured
          <Badge variant="secondary" className="ml-1">
            {featuredPublications.length}
          </Badge>
        </TabsTrigger>
        <TabsTrigger value="all" className="flex items-center gap-2">
          All Publications
          <Badge variant="secondary" className="ml-1">
            {publications.length}
          </Badge>
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="featured">
        {sortedFeaturedPublications.length === 0 ? (
          <div className="text-center text-muted-foreground py-12">
            No featured publications found.
          </div>
        ) : (
          <div className="grid gap-6">
            {sortedFeaturedPublications.map((publication) => (
              <Card key={publication.pmid} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-xl">{publication.title}</CardTitle>
                  <div className="flex flex-wrap gap-2 items-center text-sm text-muted-foreground">
                    <span>{publication.authors}</span>
                    <span>•</span>
                    <span className="italic">
                      {publication.journal}
                      {publication.volume && `, ${publication.volume}`}
                      {publication.issue && `(${publication.issue})`}
                      {publication.pages && `: ${publication.pages}`}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-3 mb-6">
                    {publication.isOpenAccess && (
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
                        Open Access
                      </Badge>
                    )}
                    {publication.isPreprint && (
                      <Badge variant="outline" className="bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400">
                        Preprint
                      </Badge>
                    )}
                    <Badge variant="outline" className="bg-muted flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {publication.date}
                    </Badge>
                  </div>
                </CardContent>
                <CardFooter className="pt-0">
                  <div className="flex flex-wrap gap-4">
                    {publication.link && (
                      <Button variant="secondary" size="sm" asChild className="border">
                        <a href={publication.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                          <ExternalLink className="h-4 w-4" />
                          <span>View Publication</span>
                        </a>
                      </Button>
                    )}
                    {publication.doi && (
                      <Button variant="outline" size="sm" asChild className="border">
                        <a href={`https://doi.org/${publication.doi}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                          <Link2 className="h-4 w-4" />
                          <span>DOI</span>
                        </a>
                      </Button>
                    )}
                    {publication.pmid && (
                      <Button variant="outline" size="sm" asChild className="border">
                        <a href={`https://pubmed.ncbi.nlm.nih.gov/${publication.pmid}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          <span>PubMed</span>
                        </a>
                      </Button>
                    )}
                    {publication.pmcid && (
                      <Button variant="outline" size="sm" asChild className="border">
                        <a href={`https://www.ncbi.nlm.nih.gov/pmc/articles/${publication.pmcid}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                          <BookOpen className="h-4 w-4" />
                          <span>PMC</span>
                        </a>
                      </Button>
                    )}
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </TabsContent>
      
      <TabsContent value="all">
        {publications.length === 0 ? (
          <div className="text-center text-muted-foreground py-12">
            No publications found. Please check the PMC loader configuration.
          </div>
        ) : (
          <>
            <div className="grid gap-6">
              {paginatedPublications.map((publication) => (
                <Card key={publication.pmid} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-xl">{publication.title}</CardTitle>
                    <div className="flex flex-wrap gap-2 items-center text-sm text-muted-foreground">
                      <span>{publication.authors}</span>
                      <span>•</span>
                      <span className="italic">
                        {publication.journal}
                        {publication.volume && `, ${publication.volume}`}
                        {publication.issue && `(${publication.issue})`}
                        {publication.pages && `: ${publication.pages}`}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-3 mb-6">
                      {publication.isOpenAccess && (
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
                          Open Access
                        </Badge>
                      )}
                      {publication.isPreprint && (
                        <Badge variant="outline" className="bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400">
                          Preprint
                        </Badge>
                      )}
                      <Badge variant="outline" className="bg-muted flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {publication.date}
                      </Badge>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-0">
                    <div className="flex flex-wrap gap-4">
                      {publication.link && (
                        <Button variant="secondary" size="sm" asChild className="border">
                          <a href={publication.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                            <ExternalLink className="h-4 w-4" />
                            <span>View Publication</span>
                          </a>
                        </Button>
                      )}
                      {publication.doi && (
                        <Button variant="outline" size="sm" asChild className="border">
                          <a href={`https://doi.org/${publication.doi}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                            <Link2 className="h-4 w-4" />
                            <span>DOI</span>
                          </a>
                        </Button>
                      )}
                      {publication.pmid && (
                        <Button variant="outline" size="sm" asChild className="border">
                          <a href={`https://pubmed.ncbi.nlm.nih.gov/${publication.pmid}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            <span>PubMed</span>
                          </a>
                        </Button>
                      )}
                      {publication.pmcid && (
                        <Button variant="outline" size="sm" asChild className="border">
                          <a href={`https://www.ncbi.nlm.nih.gov/pmc/articles/${publication.pmcid}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                            <BookOpen className="h-4 w-4" />
                            <span>PMC</span>
                          </a>
                        </Button>
                      )}
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
            {totalPages > 1 && (
              <div className="flex items-center justify-center mt-8">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => handlePageChange(currentPage - 1)}
                        className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>

                    {/* Always show first page */}
                    <PaginationItem>
                      <PaginationLink
                        onClick={() => handlePageChange(1)}
                        isActive={currentPage === 1}
                      >
                        1
                      </PaginationLink>
                    </PaginationItem>

                    {/* Show ellipsis if current page is far from start */}
                    {currentPage > 3 && (
                      <PaginationItem>
                        <PaginationEllipsis />
                      </PaginationItem>
                    )}

                    {/* Show pages around current page */}
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter(page => {
                        if (page === 1 || page === totalPages) return false;
                        return Math.abs(page - currentPage) <= 1;
                      })
                      .map((page) => (
                        <PaginationItem key={page}>
                          <PaginationLink
                            onClick={() => handlePageChange(page)}
                            isActive={currentPage === page}
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      ))}

                    {/* Show ellipsis if current page is far from end */}
                    {currentPage < totalPages - 2 && (
                      <PaginationItem>
                        <PaginationEllipsis />
                      </PaginationItem>
                    )}

                    {/* Always show last page if there's more than one page */}
                    {totalPages > 1 && (
                      <PaginationItem>
                        <PaginationLink
                          onClick={() => handlePageChange(totalPages)}
                          isActive={currentPage === totalPages}
                        >
                          {totalPages}
                        </PaginationLink>
                      </PaginationItem>
                    )}

                    <PaginationItem>
                      <PaginationNext
                        onClick={() => handlePageChange(currentPage + 1)}
                        className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </>
        )}
      </TabsContent>
    </Tabs>
  );
} 