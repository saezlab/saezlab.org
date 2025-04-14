"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { Github, BookOpen, ExternalLink } from "lucide-react"
import { useState } from "react"

interface SoftwareCardProps {
  name: string;
  short_description: string;
  long_description: string;
  code_repository: string;
  website: string;
  publication: string;
  image: string;
  categories: {
    featured: boolean;
    tool: boolean;
    database: boolean;
  };
}

export default function SoftwareCard({
  name,
  short_description,
  long_description,
  code_repository,
  website,
  publication,
  image,
  categories,
}: SoftwareCardProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div className="flex flex-row items-center space-x-4 rounded-lg border p-4 cursor-pointer hover:bg-accent/50 transition-colors">
          <Avatar className="h-32 w-32">
            <AvatarImage src={`/saezlab.org-draft/software_images/${image}`} alt={name} />
            <AvatarFallback>
              {name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-2">
            <h3 className="text-xl font-bold">{name}</h3>
            <p className="text-sm text-muted-foreground">{short_description}</p>
            <span className="rounded-full bg-secondary px-3 py-1 text-xs text-secondary-foreground">
              {categories.tool ? 'Tool' : 'Database'}
            </span>
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[1024px] max-h-[85vh] overflow-y-auto p-6">
        <DialogHeader className="flex flex-col sm:flex-row sm:items-start gap-4 mb-6">
          <Avatar className="w-28 h-28 border">
            <AvatarImage src={`/saezlab.org-draft/software_images/${image}`} alt={name} />
            <AvatarFallback>
              {name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-2">
            <DialogTitle className="text-2xl">{name}</DialogTitle>
            <DialogDescription className="text-lg font-medium">
              {categories.tool ? 'Tool' : 'Database'}
            </DialogDescription>
          </div>
        </DialogHeader>

        <div className="space-y-8">
          {/* Description Section */}
          <section>
            <h3 className="font-semibold text-xl mb-3">Description</h3>
            <p className="text-muted-foreground">{long_description}</p>
          </section>

          <Separator />

          {/* Links Section */}
          <section>
            <h3 className="font-semibold text-xl mb-3">Links</h3>
            <div className="space-y-3">
              {code_repository && (
                <div className="flex items-center gap-2">
                  <Github className="h-5 w-5 text-muted-foreground" />
                  <a
                    href={code_repository}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    Code Repository
                  </a>
                </div>
              )}
              {website && (
                <div className="flex items-center gap-2">
                  <ExternalLink className="h-5 w-5 text-muted-foreground" />
                  <a
                    href={website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    Website
                  </a>
                </div>
              )}
              {publication && (
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-muted-foreground" />
                  <a
                    href={publication}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    Publication
                  </a>
                </div>
              )}
            </div>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  )
} 