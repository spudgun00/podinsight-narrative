'use client';

import { useEffect } from 'react';
import { usePortfolio } from '@/hooks/usePortfolio';

export default function HomePage() {
  const { selectCompany } = usePortfolio();

  // Listen for portfolio company selection events
  useEffect(() => {
    const handleCompanySelected = (event: CustomEvent) => {
      console.log('Company selected:', event.detail.company);
      // Here you would highlight mentions in the dashboard
      // For demo purposes, just log it
    };

    window.addEventListener('portfolio-company-selected', handleCompanySelected as EventListener);
    return () => {
      window.removeEventListener('portfolio-company-selected', handleCompanySelected as EventListener);
    };
  }, []);

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-deep-ink mb-2">
            Welcome to VCPulse
          </h2>
          <p className="text-gray-600">
            Click the Portfolio button in the header to add companies and track real-time intelligence across VC podcasts.
          </p>
        </div>

        {/* Demo content area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Narrative Pulse placeholder */}
          <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 p-6 h-96">
            <h3 className="text-lg font-semibold text-deep-ink mb-4">Narrative Pulse</h3>
            <p className="text-gray-600">
              Topic momentum and market narrative tracking will appear here.
            </p>
          </div>

          {/* Intelligence Brief placeholder */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 h-96">
            <h3 className="text-lg font-semibold text-deep-ink mb-4">Intelligence Brief</h3>
            <p className="text-gray-600">
              AI-synthesized market analysis will appear here.
            </p>
          </div>

          {/* Notable Signals placeholder */}
          <div className="lg:col-span-3 bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-deep-ink mb-4">Notable Signals</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {['Market Narratives', 'Thesis Validation', 'Notable Deals'].map((signal) => (
                <div key={signal} className="p-4 bg-warm-paper rounded-md border border-gray-200">
                  <h4 className="font-medium text-deep-ink mb-2">{signal}</h4>
                  <p className="text-sm text-gray-600">
                    Intelligence signals will appear here when portfolio companies are added.
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}