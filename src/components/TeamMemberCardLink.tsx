import type { TeamMemberProps } from "@/types/types"
import {BASE_PATH} from '../lib/utils';

export default function TeamMemberCardLink(props: TeamMemberProps) {
  const slug = props.name.toLowerCase().replace(/\s+/g, '-')

  return (
        <a href={`${BASE_PATH}/person/${slug}`} className="block">
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
        </a>
  )
} 