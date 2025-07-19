'use client';

import PortfolioButton from '@/components/portfolio/PortfolioButton';

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 z-30">
      <div className="h-full px-6 flex items-center justify-between">
        {/* Logo and Title */}
        <div className="flex items-center gap-8">
          <h1 className="text-xl font-semibold text-deep-ink">VCPulse</h1>
          
          {/* Subtitle */}
          <span className="text-sm text-gray-600 hidden md:block">
            Narrative Intelligence Dashboard
          </span>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Portfolio Button */}
          <PortfolioButton />
          
          {/* User Avatar (placeholder) */}
          <div className="w-8 h-8 rounded-full bg-sage/20 flex items-center justify-center">
            <span className="text-xs font-medium text-sage">JG</span>
          </div>
        </div>
      </div>
    </header>
  );
}