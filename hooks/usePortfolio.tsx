'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

export interface PortfolioCompany {
  id: string;
  name: string;
  mentions: number;
  sentiment: {
    positive: number;
    neutral: number;
    negative: number;
  };
  status: 'validated' | 'threat' | 'neutral';
  lastMention?: string;
  context?: string;
  isNew?: boolean;
}

interface PortfolioState {
  companies: PortfolioCompany[];
  isOpen: boolean;
  viewedCompanies: Set<string>;
}

interface PortfolioContextType {
  companies: PortfolioCompany[];
  isOpen: boolean;
  viewedCompanies: Set<string>;
  addCompany: (name: string) => void;
  removeCompany: (id: string) => void;
  togglePanel: () => void;
  openPanel: () => void;
  closePanel: () => void;
  markAsViewed: (id: string) => void;
  selectCompany: (id: string) => void;
  getNewMentionsCount: () => number;
}

const STORAGE_KEY = 'vcpulse_portfolio_state';

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

// Mock data generator for demo purposes
const generateMockData = (name: string): Omit<PortfolioCompany, 'id' | 'name'> => {
  const mentions = Math.floor(Math.random() * 10);
  const positive = Math.floor(Math.random() * mentions);
  const negative = Math.floor(Math.random() * (mentions - positive));
  const neutral = mentions - positive - negative;
  
  let status: 'validated' | 'threat' | 'neutral' = 'neutral';
  if (positive > negative * 2) status = 'validated';
  else if (negative > positive) status = 'threat';
  
  const contexts = [
    'Brad Gerstner validated vertical AI thesis',
    'Competitive landscape heating up',
    'Strong product-market fit discussion',
    'Market consolidation concerns raised',
    'Technical moat questioned by panel',
  ];
  
  return {
    mentions,
    sentiment: { positive, neutral, negative },
    status,
    lastMention: mentions > 0 ? `${Math.floor(Math.random() * 48) + 1} hours ago` : undefined,
    context: mentions > 0 ? contexts[Math.floor(Math.random() * contexts.length)] : undefined,
    isNew: Math.random() > 0.7,
  };
};

export function PortfolioProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<PortfolioState>({
    companies: [],
    isOpen: false,
    viewedCompanies: new Set(),
  });

  // Load state from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setState({
          companies: parsed.companies || [],
          isOpen: false, // Always start closed
          viewedCompanies: new Set(parsed.viewedCompanies || []),
        });
      } catch (e) {
        console.error('Failed to load portfolio state:', e);
      }
    }
  }, []);

  // Save state to localStorage on change
  useEffect(() => {
    const toStore = {
      companies: state.companies,
      viewedCompanies: Array.from(state.viewedCompanies),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toStore));
  }, [state.companies, state.viewedCompanies]);

  const addCompany = useCallback((name: string) => {
    const trimmedName = name.trim();
    if (!trimmedName) return;
    
    setState(prev => {
      // Check for duplicates
      if (prev.companies.some(c => c.name.toLowerCase() === trimmedName.toLowerCase())) {
        return prev;
      }
      
      const newCompany: PortfolioCompany = {
        id: `company-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: trimmedName,
        ...generateMockData(trimmedName),
      };
      
      return {
        ...prev,
        companies: [newCompany, ...prev.companies],
      };
    });
  }, []);

  const removeCompany = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      companies: prev.companies.filter(c => c.id !== id),
      viewedCompanies: new Set(Array.from(prev.viewedCompanies).filter(vid => vid !== id)),
    }));
  }, []);

  const togglePanel = useCallback(() => {
    setState(prev => ({ ...prev, isOpen: !prev.isOpen }));
  }, []);

  const openPanel = useCallback(() => {
    setState(prev => ({ ...prev, isOpen: true }));
  }, []);

  const closePanel = useCallback(() => {
    setState(prev => ({ ...prev, isOpen: false }));
  }, []);

  const markAsViewed = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      viewedCompanies: new Set(prev.viewedCompanies).add(id),
    }));
  }, []);

  const selectCompany = useCallback((id: string) => {
    // Mark as viewed
    markAsViewed(id);
    
    // Dispatch event for dashboard integration
    const company = state.companies.find(c => c.id === id);
    if (company) {
      const event = new CustomEvent('portfolio-company-selected', {
        detail: { company },
      });
      window.dispatchEvent(event);
    }
  }, [state.companies, markAsViewed]);

  const getNewMentionsCount = useCallback(() => {
    return state.companies.filter(c => c.isNew && !state.viewedCompanies.has(c.id)).length;
  }, [state.companies, state.viewedCompanies]);

  const value: PortfolioContextType = {
    ...state,
    addCompany,
    removeCompany,
    togglePanel,
    openPanel,
    closePanel,
    markAsViewed,
    selectCompany,
    getNewMentionsCount,
  };

  return <PortfolioContext.Provider value={value}>{children}</PortfolioContext.Provider>;
}

export function usePortfolio() {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
}