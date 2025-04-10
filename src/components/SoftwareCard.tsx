import { Github, BookOpen } from 'lucide-react';

interface SoftwareCardProps {
  name: string;
  description: string;
  category: string;
  language: string;
}

export default function SoftwareCard({
  name,
  description,
  category,
  language,
}: SoftwareCardProps) {
  return (
    <div className="rounded-lg border p-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold">{name}</h3>
        <span className="rounded-full bg-secondary px-3 py-1 text-xs text-secondary-foreground">
          {category}
        </span>
      </div>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      <div className="mt-4">
        <span className="text-sm text-muted-foreground">Language: {language}</span>
      </div>
    </div>
  );
} 