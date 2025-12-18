import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { Publication } from "@/types/types";
import { ExternalLink, FileText, Link2 } from 'lucide-react';
import { useState } from 'react';

interface PublicationsTabsLoadedProps {
  publications: Publication[];
  featuredPmids: string[];
  featuredDois?: string[];
}

export default function PublicationsTabsLoaded({ publications, featuredPmids, featuredDois = [] }: PublicationsTabsLoadedProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const publicationsPerPage = 15;

  // Format author list: if more than 10 authors, show first 10 + "et al."
  const formatAuthors = (authors: string): string => {
    if (!authors) return '';
    const authorList = authors.split(',').map(a => a.trim());
    return authorList.length > 10 ? `${authorList.slice(0, 10).join(', ')} et al.` : authors;
  };

  // Filter featured publications
  const featuredPublications = publications.filter(pub =>
    (pub.pmid && featuredPmids.includes(pub.pmid)) ||
    (pub.doi && featuredDois.includes(pub.doi))
  );

  // Filter preprints
  const preprintPublications = publications.filter(pub => pub.isPreprint);

  // Filter non-preprint publications for "All Publications" tab
  const nonPreprintPublications = publications.filter(pub => !pub.isPreprint);

  // Sort publications by date (newest first)
  const sortedPublications = [...nonPreprintPublications].sort((a, b) => {
    return b.date.localeCompare(a.date);
  });

  const sortedFeaturedPublications = [...featuredPublications].sort((a, b) => {
    return b.date.localeCompare(a.date);
  });

  const sortedPreprintPublications = [...preprintPublications].sort((a, b) => {
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
      <TabsList className="grid w-full grid-cols-3 mb-8">
        <TabsTrigger value="featured" className="flex items-center gap-2">
          Featured
          <Badge variant="secondary" className="ml-1">
            {featuredPublications.length}
          </Badge>
        </TabsTrigger>
        <TabsTrigger value="all" className="flex items-center gap-2">
          All Publications
          <Badge variant="secondary" className="ml-1">
            {nonPreprintPublications.length}
          </Badge>
        </TabsTrigger>
        <TabsTrigger value="preprints" className="flex items-center gap-2">
          All Preprints
          <Badge variant="secondary" className="ml-1">
            {preprintPublications.length}
          </Badge>
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="featured">
        {sortedFeaturedPublications.length === 0 ? (
          <div className="text-center text-muted-foreground py-12">
            No featured publications found.
          </div>
        ) : (
          <div className="grid gap-4">
            {sortedFeaturedPublications.map((publication, index) => (
              <Card key={index + 1} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start gap-4">
                    <CardTitle className="text-xl">{publication.title}</CardTitle>
                    <div className="flex flex-wrap gap-2 justify-end">
                      <Badge variant="secondary" className="text-xs">
                        {publication.year}
                      </Badge>
                      {publication.isReview && (
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
                          Review
                        </Badge>
                      )}
                      {publication.isPreprint && (
                        <Badge variant="outline" className="bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400">
                          Preprint
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {formatAuthors(publication.authors)}
                  </div>
                </CardHeader>
                <CardFooter className="pt-0">
                  <div className="flex flex-wrap gap-4 items-center justify-between w-full">
                    <div className="flex flex-wrap gap-4">
                      {publication.doi && (
                        <Button variant="secondary" size="sm" asChild className="border">
                          <a href={`https://doi.org/${publication.doi}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                            <ExternalLink className="h-4 w-4" />
                            <span>View Publication</span>
                          </a>
                        </Button>
                      )}
                      {publication.europePmc && (
                        <Button variant="outline" size="sm" asChild className="border">
                          <a href={publication.europePmc} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                            <Link2 className="h-4 w-4" />
                            <span>EuropePMC</span>
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
                    </div>
                    <div className="text-sm text-muted-foreground italic">
                      {publication.journal !== "Unknown Journal" && (
                        <>
                          {publication.journal}
                          {publication.volume && `, ${publication.volume}`}
                          {publication.issue && `(${publication.issue})`}
                          {publication.pages && `: ${publication.pages}`}
                        </>
                      )}
                    </div>
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
            <div className="grid gap-4">
              {paginatedPublications.map((publication, index) => (
                <Card key={index + 1000} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start gap-4">
                      <CardTitle className="text-xl">{publication.title}</CardTitle>
                      <div className="flex flex-wrap gap-2 justify-end">
                        <Badge variant="secondary" className="text-xs">
                          {publication.year}
                        </Badge>
                        {publication.isReview && (
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
                            Review
                          </Badge>
                        )}
                        {publication.isPreprint && (
                          <Badge variant="outline" className="bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400">
                            Preprint
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {publication.authors}
                    </div>
                  </CardHeader>
                  <CardFooter className="pt-0">
                    <div className="flex flex-wrap gap-4 items-center justify-between w-full">
                      <div className="flex flex-wrap gap-4">
                        {publication.doi && (
                          <Button variant="secondary" size="sm" asChild className="border">
                            <a href={`https://doi.org/${publication.doi}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                              <ExternalLink className="h-4 w-4" />
                              <span>View Publication</span>
                            </a>
                          </Button>
                        )}
                        {publication.europePmc && (
                          <Button variant="outline" size="sm" asChild className="border">
                            <a href={publication.europePmc} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                              <Link2 className="h-4 w-4" />
                              <span>EuropePMC</span>
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
                      </div>
                      <div className="text-sm text-muted-foreground italic">
                        {publication.journal !== "Unknown Journal" && (
                          <>
                            {publication.journal}
                            {publication.volume && `, ${publication.volume}`}
                            {publication.issue && `(${publication.issue})`}
                            {publication.pages && `: ${publication.pages}`}
                          </>
                        )}
                      </div>
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

      <TabsContent value="preprints">
        {sortedPreprintPublications.length === 0 ? (
          <div className="text-center text-muted-foreground py-12">
            No preprints found.
          </div>
        ) : (
          <div className="grid gap-4">
            {sortedPreprintPublications.map((publication, index) => (
              <Card key={index + 10000} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start gap-4">
                    <CardTitle className="text-xl">{publication.title}</CardTitle>
                    <div className="flex flex-wrap gap-2 justify-end">
                      <Badge variant="secondary" className="text-xs">
                        {publication.year}
                      </Badge>
                      {publication.isReview && (
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
                          Review
                        </Badge>
                      )}
                      {publication.isPreprint && (
                        <Badge variant="outline" className="bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400">
                          Preprint
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {formatAuthors(publication.authors)}
                  </div>
                </CardHeader>
                <CardFooter className="pt-0">
                  <div className="flex flex-wrap gap-4 items-center justify-between w-full">
                    <div className="flex flex-wrap gap-4">
                      {publication.doi && (
                        <Button variant="secondary" size="sm" asChild className="border">
                          <a href={`https://doi.org/${publication.doi}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                            <ExternalLink className="h-4 w-4" />
                            <span>View Publication</span>
                          </a>
                        </Button>
                      )}
                      {publication.europePmc && (
                        <Button variant="outline" size="sm" asChild className="border">
                          <a href={publication.europePmc} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                            <Link2 className="h-4 w-4" />
                            <span>EuropePMC</span>
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
                    </div>
                    <div className="text-sm text-muted-foreground italic">
                      {publication.journal !== "Unknown Journal" && (
                        <>
                          {publication.journal}
                          {publication.volume && `, ${publication.volume}`}
                          {publication.issue && `(${publication.issue})`}
                          {publication.pages && `: ${publication.pages}`}
                        </>
                      )}
                    </div>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
} 