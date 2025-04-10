import { useState } from 'react';
import { Menu } from 'lucide-react';

export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2"
      >
        <Menu className="h-6 w-6" />
        <span className="font-bold">Menu</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 top-16 z-50 grid h-[calc(100vh-4rem)] grid-flow-row auto-rows-max overflow-auto p-6 pb-32 shadow-md animate-in slide-in-from-bottom-80 md:hidden">
          <div className="relative z-20 grid gap-6 rounded-md bg-popover p-4 text-popover-foreground shadow-md">
            <nav className="grid grid-flow-row auto-rows-max text-sm">
              <a
                href="/research"
                className="flex w-full items-center rounded-md p-2 text-sm font-medium hover:underline"
              >
                Research
              </a>
              <a
                href="/publications"
                className="flex w-full items-center rounded-md p-2 text-sm font-medium hover:underline"
              >
                Publications
              </a>
              <a
                href="/team"
                className="flex w-full items-center rounded-md p-2 text-sm font-medium hover:underline"
              >
                Team
              </a>
              <a
                href="/software"
                className="flex w-full items-center rounded-md p-2 text-sm font-medium hover:underline"
              >
                Software
              </a>
              <a
                href="/news"
                className="flex w-full items-center rounded-md p-2 text-sm font-medium hover:underline"
              >
                News
              </a>
              <a
                href="/contact"
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