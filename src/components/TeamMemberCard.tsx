import { Mail, Globe } from 'lucide-react';

interface TeamMemberProps {
  name: string;
  role: string;
  image: string;
  bio: string;
  email?: string;
  website?: string;
}

export default function TeamMemberCard({
  name,
  role,
  image,
  bio,
  email,
  website,
}: TeamMemberProps) {
  return (
    <div className="flex flex-col items-center space-y-4 rounded-lg border p-6 text-center">
      <div className="relative h-32 w-32 overflow-hidden rounded-full">
        <img
          src={image}
          alt={name}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="space-y-2">
        <h3 className="text-xl font-bold">{name}</h3>
        <p className="text-sm text-muted-foreground">{role}</p>
        <p className="text-sm">{bio}</p>
      </div>
      <div className="flex space-x-4">
        {email && (
          <a
            href={`mailto:${email}`}
            className="text-muted-foreground hover:text-foreground"
          >
            <Mail className="h-5 w-5" />
          </a>
        )}
        {website && (
          <a
            href={website}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground"
          >
            <Globe className="h-5 w-5" />
          </a>
        )}
      </div>
    </div>
  );
} 