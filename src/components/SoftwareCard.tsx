import { Github, BookOpen } from 'lucide-react';

interface SoftwareCardProps {
  name: string;
  description: string;
  category: string;
  language: string;
  github: string;
  documentation: string;
  version: string;
  features: string[];
}

export default function SoftwareCard({
  name,
  description,
  category,
  language,
  github,
  documentation,
  version,
  features,
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
      <div className="mt-4 flex items-center space-x-4">
        <span className="text-sm text-muted-foreground">Language: {language}</span>
        <span className="text-sm text-muted-foreground">Version: {version}</span>
      </div>
      <div className="mt-4">
        <h4 className="text-sm font-medium">Features</h4>
        <ul className="mt-2 list-inside list-disc text-sm">
          {features.map((feature) => (
            <li key={feature}>{feature}</li>
          ))}
        </ul>
      </div>
      <div className="mt-6 flex space-x-4">
        <a
          href={github}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center text-sm text-primary hover:underline"
        >
          <Github className="mr-2 h-4 w-4" />
          GitHub
        </a>
        <a
          href={documentation}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center text-sm text-primary hover:underline"
        >
          <BookOpen className="mr-2 h-4 w-4" />
          Documentation
        </a>
      </div>
    </div>
  );
} 