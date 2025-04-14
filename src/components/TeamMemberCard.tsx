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
import { Calendar, Mail, User, Phone, Link } from "lucide-react"
import { useState } from "react"
import { getInternalLink } from '../lib/utils';
interface TeamMemberProps {
  name: string
  role: string
  image: string
  bio: string
  email?: string
  telephone?: string
  orcid?: string
  research_interests?: string
  professional_career?: Array<{
    period: string
    position: string
  }>
  education?: Array<{
    period: string
    degree: string
  }>
}

export default function TeamMemberCard({
  name,
  role,
  image,
  bio,
  email,
  telephone,
  orcid,
  research_interests,
  professional_career,
  education,
}: TeamMemberProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div className="flex flex-col items-center space-y-4 rounded-lg border p-6 text-center cursor-pointer hover:bg-accent/50 transition-colors">
          <Avatar className="h-24 w-24">
            <AvatarImage 
              src={`${getInternalLink('/team_images')}/${image}`} 
              alt={name}
              className="object-contain object-center"
            />
            <AvatarFallback>
              {name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-2">
            <h3 className="text-xl font-bold">{name}</h3>
            <p className="text-sm text-muted-foreground">{role}</p>
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[1024px] max-h-[85vh] overflow-y-auto p-6">
        <DialogHeader className="flex flex-col sm:flex-row sm:items-start gap-4 mb-6">
          <Avatar className="w-28 h-28 border">
            <AvatarImage 
              src={`${getInternalLink('/team_images')}/${image}`} 
              alt={name}
              className="object-contain object-center"
            />
            <AvatarFallback>
              {name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-2">
            <DialogTitle className="text-2xl">{name}</DialogTitle>
            <DialogDescription className="text-lg font-medium">{role}</DialogDescription>
          </div>
        </DialogHeader>

        <div className="space-y-8">
          {/* Biography Section */}
          <section>
            <h3 className="font-semibold text-xl mb-3">Biography</h3>
            <p className="text-muted-foreground">{bio}</p>
          </section>

          {research_interests && (
            <>
              <Separator />
              <section>
                <h3 className="font-semibold text-xl mb-3">Research Interests</h3>
                <p className="text-muted-foreground">{research_interests}</p>
              </section>
            </>
          )}

          {professional_career && professional_career.length > 0 && (
            <>
              <Separator />
              <section>
                <h3 className="font-semibold text-xl mb-3">Professional Career</h3>
                <div className="space-y-5">
                  {professional_career.map((item, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="flex-shrink-0 mt-1">
                        <Calendar className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-medium">{item.period}</p>
                        <p className="text-muted-foreground">{item.position}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </>
          )}

          {education && education.length > 0 && (
            <>
              <Separator />
              <section>
                <h3 className="font-semibold text-xl mb-3">Education</h3>
                <div className="space-y-5">
                  {education.map((item, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="flex-shrink-0 mt-1">
                        <Calendar className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-medium">{item.period}</p>
                        <p className="text-muted-foreground">{item.degree}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </>
          )}

          {(email || telephone || orcid) && (
            <>
              <Separator />
              <section>
                <h3 className="font-semibold text-xl mb-3">Contact Information</h3>
                <div className="space-y-3">
                  {email && (
                    <div className="flex items-center gap-2">
                      <Mail className="h-5 w-5 text-muted-foreground" />
                      <a href={`mailto:${email}`} className="text-blue-600 hover:underline">
                        {email}
                      </a>
                    </div>
                  )}
                  {telephone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-5 w-5 text-muted-foreground" />
                      <span className="text-muted-foreground">{telephone}</span>
                    </div>
                  )}
                  {orcid && (
                    <div className="flex items-center gap-2">
                      <Link className="h-5 w-5 text-muted-foreground" />
                      <a 
                        href={`https://orcid.org/${orcid}`} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-blue-600 hover:underline"
                      >
                        ORCID: {orcid}
                      </a>
                    </div>
                  )}
                </div>
              </section>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
} 