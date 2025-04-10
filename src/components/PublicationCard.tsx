import { ExternalLink } from 'lucide-react';

interface PublicationProps {
  title: string;
  authors: string;
  journal: string;
  year: number;
  volume: string;
  pages: string;
  doi: string;
  abstract: string;
  tags: string[];
}

export default function PublicationCard({
  title,
  authors,
  journal,
  year,
  volume,
  pages,
  doi,
  abstract,
  tags,
}: PublicationProps) {
  return (
    <div className="rounded-lg border p-6">
      <h3 className="text-xl font-bold">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{authors}</p>
      <p className="mt-1 text-sm">
        {journal} {year}; {volume}:{pages}
      </p>
      <div className="mt-4">
        <a
          href={`https://doi.org/${doi}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center text-sm text-primary hover:underline"
        >
          DOI: {doi}
          <ExternalLink className="ml-1 h-4 w-4" />
        </a>
      </div>
      <p className="mt-4 text-sm">{abstract}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-secondary px-3 py-1 text-xs text-secondary-foreground"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
} 