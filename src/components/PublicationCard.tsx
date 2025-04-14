import { ExternalLink } from 'lucide-react';

interface PublicationProps {
  title: string;
  authors: string;
  journal: string;
  year: string;
  url: string;
  featured: boolean;
}

export default function PublicationCard({
  title,
  authors,
  journal,
  year,
  url,
  featured,
}: PublicationProps) {
  return (
    <div className="rounded-lg border p-6 my-4">
      <h3 className="text-xl font-bold">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{authors}</p>
      <p className="mt-1 text-sm">
        {journal} {year}
      </p>
      <div className="mt-4">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center text-sm text-primary hover:underline"
        >
          View Publication
          <ExternalLink className="ml-1 h-4 w-4" />
        </a>
      </div>
    </div>
  );
} 