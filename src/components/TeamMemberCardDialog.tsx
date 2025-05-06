"use client"

import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useState } from "react"
import TeamMemberCard from "./TeamMemberCard"

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

export default function TeamMemberCardDialog(props: TeamMemberProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div className="flex flex-col items-center space-y-4 rounded-lg border p-6 text-center cursor-pointer hover:bg-accent/50 transition-colors">
          <img 
            src={props.image} 
            alt={props.name}
            className="h-24 w-24 rounded-full object-cover"
          />
          <div className="space-y-2">
            <h3 className="text-xl font-bold">{props.name}</h3>
            <p className="text-sm text-muted-foreground">{props.role}</p>
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[1024px] max-h-[85vh] overflow-y-auto p-6">
        <TeamMemberCard {...props} />
      </DialogContent>
    </Dialog>
  )
} 