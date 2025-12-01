'use client';

import { ThemeToggle } from './ui/ThemeToggle';

export default function Footer() {
  return (
    <footer className="bg-secondary text-white text-center py-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center gap-4">
          <p className="font-body">© 2025 Khashika. All rights reserved.</p>
          <ThemeToggle />
        </div>
      </div>
    </footer>
  );
}

