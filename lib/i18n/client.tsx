'use client';

import { useContext, createContext } from 'react';

// Vytvoření kontextu pro překlady
interface TranslationContextType {
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
  children: React.ReactNode;
  locale: string;
  translations: Record<string, string>;
}

export function TranslationProvider({ children, locale, translations }: TranslationProviderProps) {
  // Funkce pro překlad
  const t = (key: string, options?: { defaultValue?: string, values?: Record<string, string> }) => {
    // Pokud klíč existuje v překladech, použijeme ho
    if (translations && key in translations) {
      let translation = translations[key];
      
      // Nahrazení proměnných v překladu
      if (options?.values) {
        Object.entries(options.values).forEach(([varKey, varValue]) => {
          translation = translation.replace(`{${varKey}}`, varValue || '');
        });
      }
      
      return translation;
    }
    
    // Pokud klíč neexistuje, vrátíme výchozí hodnotu nebo klíč
    return options?.defaultValue || key;
  };

  return (
    <TranslationContext.Provider value={{ t, locale }}>
      {children}
    </TranslationContext.Provider>
  );
}
