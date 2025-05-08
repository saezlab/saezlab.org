"use client"

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import TeamMemberCard from "./TeamMemberCard"
import type { TeamMemberProps } from "@/types/types"

interface TeamMemberCardDialogProps extends TeamMemberProps {
  isOpen?: boolean
  onOpenChange?: (open: boolean) => void
}

export default function TeamMemberCardDialog({
  isOpen,
  onOpenChange,
  ...props
}: TeamMemberCardDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
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
      <DialogContent className="max-w-[1024px] max-h-[85vh] overflow-y-auto">
        <TeamMemberCard {...props} />
      </DialogContent>
    </Dialog>
  )
} 