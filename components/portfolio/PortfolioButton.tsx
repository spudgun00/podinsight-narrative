'use client';

import { usePortfolio } from '@/hooks/usePortfolio';

export default function PortfolioButton() {
  const { companies, togglePanel, getNewMentionsCount } = usePortfolio();
  const newMentions = getNewMentionsCount();

  return (
    <button
      onClick={togglePanel}
      className="relative flex items-center gap-1.5 px-4 py-2 bg-white border border-gray-200 rounded-md text-sm font-medium hover:border-sage hover:-translate-y-px transition-all shadow-soft"
      aria-label="Toggle portfolio panel"
    >
      {/* Pulse indicator for active mentions */}
      {companies.some(c => c.mentions > 0) && (
        <span className="w-1.5 h-1.5 bg-sage rounded-full animate-pulse" />
      )}
      
      Portfolio
      
      {/* Notification badge */}
      {newMentions > 0 && (
        <span className="absolute -top-1 -right-1 bg-dusty-rose text-white text-[11px] font-semibold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
          {newMentions}
        </span>
      )}
    </button>
  );
}