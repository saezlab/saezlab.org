import { Calendar } from 'lucide-react';

interface NewsCardProps {
  title: string;
  date: string;
  author: string;
  image: string;
  excerpt: string;
  slug: string;
}

export default function NewsCard({
  title,
  date,
  author,
  image,
  excerpt,
  slug,
}: NewsCardProps) {
  return (
    <article className="flex flex-col space-y-4 rounded-lg border p-6">
      <div className="space-y-2">
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <time dateTime={date}>{new Date(date).toLocaleDateString()}</time>
        </div>
        <h2 className="text-2xl font-bold">
          <a href={`/news/${slug}`} className="hover:underline">
            {title}
          </a>
        </h2>
        <p className="text-sm text-muted-foreground">By {author}</p>
      </div>
      {image && (
        <div className="relative aspect-video overflow-hidden rounded-lg">
          <img
            src={image}
            alt={title}
            className="h-full w-full object-cover"
          />
        </div>
      )}
      <p className="flex-1">{excerpt}</p>
      <a
        href={`/news/${slug}`}
        className="inline-flex items-center text-sm font-medium text-primary hover:underline"
      >
        Read more
      </a>
    </article>
  );
} 