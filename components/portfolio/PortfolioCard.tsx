'use client';

import { useState } from 'react';
import { Trash2, CheckCircle, AlertTriangle } from 'lucide-react';
import { PortfolioCompany } from '@/hooks/usePortfolio';

interface PortfolioCardProps {
  company: PortfolioCompany;
  onSelect: () => void;
  onRemove: () => void;
}

export default function PortfolioCard({ company, onSelect, onRemove }: PortfolioCardProps) {
  const [showDelete, setShowDelete] = useState(false);

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Remove ${company.name} from your portfolio?`)) {
      onRemove();
    }
  };

  const getStatusColor = () => {
    switch (company.status) {
      case 'validated':
        return 'border-l-sage';
      case 'threat':
        return 'border-l-dusty-rose';
      default:
        return '';
    }
  };

  const getStatusLabel = () => {
    switch (company.status) {
      case 'validated':
        return (
          <span className="inline-block mt-1.5 px-2 py-1 bg-sage/10 text-sage rounded text-xs font-medium">
            Thesis validated
          </span>
        );
      case 'threat':
        return (
          <span className="inline-block mt-1.5 px-2 py-1 bg-dusty-rose/10 text-dusty-rose rounded text-xs font-medium">
            Competitive threat
          </span>
        );
      default:
        return null;
    }
  };

  const getMentionIcon = () => {
    if (company.mentions === 0) return null;
    if (company.status === 'validated') {
      return <CheckCircle className="w-4 h-4 text-sage" />;
    }
    if (company.status === 'threat') {
      return <AlertTriangle className="w-4 h-4 text-dusty-rose" />;
    }
    return null;
  };

  return (
    <div
      className={`relative bg-white border border-gray-200 rounded-lg p-4 cursor-pointer transition-all duration-200 hover:border-sage hover:-translate-x-1 hover:shadow-soft ${
        company.status !== 'neutral' ? `border-l-4 ${getStatusColor()}` : ''
      }`}
      onClick={onSelect}
      onMouseEnter={() => setShowDelete(true)}
      onMouseLeave={() => setShowDelete(false)}
    >
      {/* Company Header */}
      <div className="flex justify-between items-start mb-2">
        <span className="text-[15px] font-semibold text-deep-ink">{company.name}</span>
        <div className="flex items-center gap-2">
          {company.mentions > 0 && (
            <span className={`flex items-center gap-1.5 text-sm ${
              company.status === 'validated' ? 'text-sage' : 
              company.status === 'threat' ? 'text-dusty-rose' : 
              'text-gray-600'
            }`}>
              {getMentionIcon()}
              {company.mentions} mention{company.mentions !== 1 ? 's' : ''}
            </span>
          )}
          {showDelete && (
            <button
              onClick={handleRemove}
              className="w-6 h-6 flex items-center justify-center rounded hover:bg-gray-100 transition-colors"
              aria-label={`Remove ${company.name}`}
            >
              <Trash2 className="w-3.5 h-3.5 text-gray-500" />
            </button>
          )}
        </div>
      </div>

      {/* Company Details */}
      <div className="text-sm text-gray-600">
        {company.mentions > 0 ? (
          <>
            {company.sentiment.positive > 0 && `${company.sentiment.positive} positive`}
            {company.sentiment.positive > 0 && company.sentiment.neutral > 0 && ', '}
            {company.sentiment.neutral > 0 && `${company.sentiment.neutral} neutral`}
            {(company.sentiment.positive > 0 || company.sentiment.neutral > 0) && company.sentiment.negative > 0 && ', '}
            {company.sentiment.negative > 0 && `${company.sentiment.negative} negative`}
            {company.context && (
              <div className="mt-1 text-xs text-gray-500">{company.context}</div>
            )}
          </>
        ) : (
          'No mentions this week'
        )}
        {getStatusLabel()}
      </div>

      {/* New indicator */}
      {company.isNew && (
        <div className="absolute -top-1 -right-1 w-2 h-2 bg-amber-glow rounded-full" />
      )}
    </div>
  );
}