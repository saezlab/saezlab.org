import { useState } from 'react';
import { Menu } from 'lucide-react';
import { getInternalLink } from '../lib/utils';

export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex items-center justify-between w-full px-4">
      <a href={getInternalLink('/')} className="font-bold">
        SaezLab
      </a>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2"
      >
        <Menu className="h-6 w-6" />
        <span className="font-bold">Menu</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 top-16 z-50 grid h-[calc(100vh-4rem)] grid-flow-row auto-rows-max overflow-auto p-6 pb-32 shadow-md animate-in slide-in-from-bottom-80">
          <div className="relative z-20 grid gap-6 rounded-md bg-popover p-4 text-popover-foreground shadow-md">
            <nav className="grid grid-flow-row auto-rows-max text-sm">
              <a
                href={getInternalLink('/')}
                className="flex w-full items-center rounded-md p-2 text-sm font-medium hover:underline"
              >
                Home
              </a>
              <a
                href={getInternalLink('/publications')}
                className="flex w-full items-center rounded-md p-2 text-sm font-medium hover:underline"
              >
                Publications
              </a>
              <a
                href={getInternalLink('/team')}
                className="flex w-full items-center rounded-md p-2 text-sm font-medium hover:underline"
              >
                Team
              </a>
              <a
                href={getInternalLink('/software')}
                className="flex w-full items-center rounded-md p-2 text-sm font-medium hover:underline"
              >
                Software
              </a>
              <a
                href={getInternalLink('/partners')}
                className="flex w-full items-center rounded-md p-2 text-sm font-medium hover:underline"
              >
                Partners & Funding
              </a>
              <a
                href={getInternalLink('/jobs')}
                className="flex w-full items-center rounded-md p-2 text-sm font-medium hover:underline"
              >
                Jobs
              </a>
              <a
                href={getInternalLink('/contact')}
                className="flex w-full items-center rounded-md p-2 text-sm font-medium hover:underline"
              >
                Contact
              </a>
            </nav>
          </div>
        </div>
      )}
    </div>
  );
} 