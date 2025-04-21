'use client';

import { createContext, useContext, ReactNode } from 'react';
import { translate as translateFn } from '@/lib/i18n';

// Vytvoření kontextu pro překlady
interface TranslationContextType {
  translate: (key: string, locale?: string, options?: { defaultValue?: string, values?: Record<string, string> }) => string;
  t: (key: string, options?: { defaultValue?: string, values?: Record<string, string> }) => string;
  locale: string;
}

const TranslationContext = createContext<TranslationContextType | null>(null);

// Hook pro použití překladů v komponentách
export function useTranslation() {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
}

// Provider komponenta
interface TranslationProviderProps {
  children: ReactNode;
  locale: string;
}

export function TranslationProvider({ children, locale }: TranslationProviderProps) {
  // Vytvoření funkce pro překlad s aktuální lokalizací
  const translate = (key: string, localeOverride?: string, options?: { defaultValue?: string, values?: Record<string, string> }) => {
    const targetLocale = localeOverride || locale;
    return translateFn(key, targetLocale, options?.values);
  };

  // Vytvoření funkce t pro kompatibilitu s lib/i18n/client.tsx
  const t = (key: string, options?: { defaultValue?: string, values?: Record<string, string> }) => {
    return translateFn(key, locale, options?.values);
  };

  return (
    <TranslationContext.Provider value={{ translate, t, locale }}>
      {children}
    </TranslationContext.Provider>
  );
}
