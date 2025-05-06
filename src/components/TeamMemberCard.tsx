"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Calendar, Mail, Phone, Link } from "lucide-react"

interface TeamMemberProps {
  name: string
  role: string
  image: string
  bio: string
  email?: string
  telephone?: string
  orcid?: string
  github_url?: string
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
  github_url,
  research_interests,
  professional_career,
  education,
}: TeamMemberProps) {
  return (
    <div className="container mx-auto max-w-[1024px] py-6">
      <div className="flex flex-col sm:flex-row sm:items-start gap-4 mb-6">
        <Avatar className="w-28 h-28 border">
          <AvatarImage 
            src={image} 
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
          <h1 className="text-2xl font-bold">{name}</h1>
          <p className="text-lg font-medium text-muted-foreground">{role}</p>
        </div>
      </div>

      <div className="space-y-8">
        {/* Biography Section */}
        {bio && (
          <section>
            <h2 className="font-semibold text-xl mb-3">
              {role === "Intern / Visitor" ? "About" : "Biography"}
            </h2>
            <p className="text-muted-foreground">{bio}</p>
          </section>
        )}

        {research_interests && (
          <>
            <Separator />
            <section>
              <h2 className="font-semibold text-xl mb-3">Research Interests</h2>
              <p className="text-muted-foreground">{research_interests}</p>
            </section>
          </>
        )}

        {professional_career && professional_career.length > 0 && (
          <>
            <Separator />
            <section>
              <h2 className="font-semibold text-xl mb-3">Professional Career</h2>
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
              <h2 className="font-semibold text-xl mb-3">Education</h2>
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

        {(email || telephone || orcid || github_url) && (
          <>
            <Separator />
            <section>
              <h2 className="font-semibold text-xl mb-3">Contact Information</h2>
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
                {github_url && (
                  <div className="flex items-center gap-2">
                    <Link className="h-5 w-5 text-muted-foreground" />
                    <a 
                      href={github_url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-blue-600 hover:underline"
                    >
                      GitHub Profile
                    </a>
                  </div>
                )}
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  )
} 