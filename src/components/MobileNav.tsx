import { useState } from 'react';
import { Menu } from 'lucide-react';
import { navigationItems } from '../config/navigation';
import { getInternalLink } from '../lib/utils';

export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex items-center justify-between w-full px-4">
      <a href={navigationItems[0].href} className="flex items-center space-x-2">
        <img src={getInternalLink('/favicon.ico')} alt="SaezLab Logo" className="h-8 w-8 grayscale" />
        <span className="font-bold">SaezLab</span>
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
              {navigationItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="flex w-full items-center rounded-md p-2 text-sm font-medium hover:underline"
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </div>
        </div>
      )}
    </div>
  );
} 