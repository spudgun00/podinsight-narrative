'use client';

import { useEffect, useRef } from 'react';
import { X, Upload, Link2 } from 'lucide-react';
import { usePortfolio } from '@/hooks/usePortfolio';
import PortfolioCard from './PortfolioCard';

export default function PortfolioPanel() {
  const {
    companies,
    isOpen,
    closePanel,
    addCompany,
    removeCompany,
    selectCompany,
    getNewMentionsCount,
  } = usePortfolio();

  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Handle ESC key to close panel
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        closePanel();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      // Focus input when panel opens
      setTimeout(() => inputRef.current?.focus(), 300);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, closePanel]);

  // Handle backdrop click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      closePanel();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const input = inputRef.current;
    if (input && input.value.trim()) {
      addCompany(input.value);
      input.value = '';
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-deep-ink/10 backdrop-blur-sm transition-opacity duration-300 z-40 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={handleBackdropClick}
        aria-hidden={!isOpen}
      />

      {/* Panel */}
      <div
        ref={panelRef}
        className={`fixed right-0 top-0 h-screen w-[420px] bg-white shadow-panel transform transition-transform duration-300 ease-out z-50 flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        } max-w-[80vw] md:max-w-[420px]`}
        aria-hidden={!isOpen}
      >
        {/* Header */}
        <div className="px-6 py-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-deep-ink">Your Portfolio Intelligence</h2>
          <button
            onClick={closePanel}
            className="w-8 h-8 flex items-center justify-center rounded-md bg-warm-paper hover:bg-sage/10 transition-colors"
            aria-label="Close portfolio panel"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {/* Quick Add */}
          <div className="mb-8">
            <h3 className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-3">
              Quick Add
            </h3>
            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                placeholder="Company name..."
                className="flex-1 px-3.5 py-2.5 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-sage/20 focus:border-sage transition-all"
              />
              <button
                type="submit"
                className="px-4 py-2.5 bg-sage text-white rounded-md text-sm font-medium hover:bg-sage-dark transition-colors"
              >
                + Add
              </button>
            </form>
          </div>

          {/* Import Section */}
          <div className="mb-8 p-5 bg-warm-paper rounded-lg border border-gray-200">
            <p className="text-sm text-gray-600 mb-3">Or import your portfolio:</p>
            <div className="flex gap-3">
              <button className="flex-1 px-4 py-2.5 bg-white border border-gray-200 rounded-md text-sm font-medium hover:border-sage hover:bg-sage/5 transition-all flex items-center justify-center gap-2">
                <Upload className="w-4 h-4" />
                Upload CSV
              </button>
              <button className="flex-1 px-4 py-2.5 bg-white border border-gray-200 rounded-md text-sm font-medium hover:border-sage hover:bg-sage/5 transition-all flex items-center justify-center gap-2">
                <Link2 className="w-4 h-4" />
                Connect CRM
              </button>
            </div>
          </div>

          {/* Portfolio List */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-semibold text-deep-ink">Your Companies</h3>
              <span className="text-sm text-gray-600">({companies.length})</span>
            </div>

            {companies.length === 0 ? (
              <div className="text-center py-12 px-6">
                <h4 className="text-base font-semibold text-deep-ink mb-2">
                  Track Your Portfolio
                </h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Add companies to receive real-time intelligence about mentions, validations, and competitive threats across VC podcasts.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {companies.map((company) => (
                  <PortfolioCard
                    key={company.id}
                    company={company}
                    onSelect={() => selectCompany(company.id)}
                    onRemove={() => removeCompany(company.id)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-warm-paper">
          <p className="text-xs text-gray-600 text-center">
            Import formats: CSV, Affinity, Airtable, PitchBook
          </p>
        </div>
      </div>
    </>
  );
}