'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { useTranslation } from './TranslationProvider';
import PortfolioFilters from './PortfolioFilters';
import NoBondsButtons from './NoBondsButtons';

interface PortfolioBondsProps {
  userId: string;
}

interface Bond {
  id: string;
  user_id: string;
  company_name: string;
  purchase_date: string;
  maturity_date: string;
  invested_amount: number;
  interest_rate: number;
  payment_schedule: string;
  pdf_url?: string;
  created_at: string;
  updated_at: string;
}

export default function PortfolioBonds({ userId }: PortfolioBondsProps) {
  const { locale } = useParams() as { locale: string };
  const { translate } = useTranslation();
  const [bonds, setBonds] = useState<Bond[]>([]);
  const [activeBonds, setActiveBonds] = useState<Bond[]>([]);
  const [expiredBonds, setExpiredBonds] = useState<Bond[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Stav pro filtrování a řazení
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');
  const [filters, setFilters] = useState<Record<string, any>>({});

  // Načítání dluhopisů z API
  const fetchBonds = async () => {
    try {
      setLoading(true);
      // Volání API pro získání dluhopisů pro konkrétního uživatele
      const url = new URL('/api/bonds', window.location.origin);

      // Přidání parametrů pro filtrování a řazení
      if (searchTerm) url.searchParams.append('search', searchTerm);
      url.searchParams.append('sortBy', sortBy);
      url.searchParams.append('sortOrder', sortOrder);

      // Přidání pokročilých filtrů
      if (filters.minRate) url.searchParams.append('minRate', filters.minRate);
      if (filters.maxRate) url.searchParams.append('maxRate', filters.maxRate);
      if (filters.maturityFrom) url.searchParams.append('maturityFrom', filters.maturityFrom);
      if (filters.maturityTo) url.searchParams.append('maturityTo', filters.maturityTo);
      if (filters.issuer) url.searchParams.append('issuer', filters.issuer);
      if (filters.bondType) url.searchParams.append('bondType', filters.bondType);

      const response = await fetch(url.toString());

      if (!response.ok) {
        throw new Error('Nepodařilo se načíst dluhopisy');
      }

      const data = await response.json();

      if (data && Array.isArray(data.bonds)) {
        const allBonds = data.bonds;
        setBonds(allBonds);

        // Rozdělení dluhopisů na aktivní a po splatnosti
        const today = new Date();
        const active: Bond[] = [];
        const expired: Bond[] = [];

        allBonds.forEach((bond: Bond) => {
          const maturityDate = new Date(bond.maturity_date);
          if (maturityDate > today) {
            active.push(bond);
          } else {
            expired.push(bond);
          }
        });

        setActiveBonds(active);
        setExpiredBonds(expired);
      } else {
        // Pokud nejsou žádné dluhopisy, ponecháme prázdné pole
        setBonds([]);
        setActiveBonds([]);
        setExpiredBonds([]);
      }
    } catch (error) {
      console.error('Error fetching bonds:', error);
      setError('Nepodařilo se načíst dluhopisy. Zkuste to prosím později.');
    } finally {
      setLoading(false);
    }
  };

  // Použití useCallback pro fetchBonds, aby se funkce neměnila při každém renderu
  // userId je konstantní, takže ho nepotřebujeme v závislostech
  const memoizedFetchBonds = useCallback(fetchBonds, [
    // userId je předán jako prop a nemění se
    searchTerm,
    sortBy,
    sortOrder,
    filters.minRate,
    filters.maxRate,
    filters.maturityFrom,
    filters.maturityTo,
    filters.issuer,
    filters.bondType
  ]);

  // Načtení dluhopisů při prvním renderu a při změně filtrování/řazení
  useEffect(() => {
    memoizedFetchBonds();
  }, [memoizedFetchBonds]); // Znovu načteme při změně parametrů

  // Funkce pro aktualizaci vyhledávání
  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  // Funkce pro aktualizaci řazení
  const handleSort = (option: string) => {
    // Rozdělení volby na pole a směr
    const [field, order] = option.split('-');
    setSortBy(field);
    setSortOrder(order);
  };

  // Funkce pro aktualizaci filtrů
  const handleFilter = (newFilters: Record<string, any>) => {
    setFilters(newFilters);
  };

  // Funkce pro smazání dluhopisu
  const handleDelete = async (bondId: string) => {
    if (!confirm('Opravdu chcete smazat tento dluhopis?')) {
      return;
    }

    try {
      const response = await fetch(`/api/bonds/${bondId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Nepodařilo se smazat dluhopis');
      }

      // Aktualizace seznamu dluhopisů
      fetchBonds();
    } catch (error) {
      console.error('Error deleting bond:', error);
      setError('Nepodařilo se smazat dluhopis. Zkuste to prosím později.');
    }
  };





  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="inline-flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-500 dark:border-primary-800 dark:border-t-primary-400 rounded-full animate-spin mr-3"></div>
          <span className="text-lg text-primary-700 dark:text-primary-400 font-medium">
            {translate('common.loading', locale, { defaultValue: 'Loading...' })}
          </span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <div className="inline-flex items-center justify-center bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 mr-2">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
          </svg>
          {error}
        </div>
      </div>
    );
  }

  // Funkce pro import CSV
  const handleImportCSV = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const text = e.target?.result as string;
      // Jednoduchý parser CSV (oddělené čárkou, první řádek hlavička)
      const lines = text.split('\n').map(line => line.trim()).filter(Boolean);
      if (lines.length < 2) return;
      const headers = lines[0].split(',').map(h => h.trim());
      const bondsToImport = lines.slice(1).map(line => {
        const values = line.split(',').map(v => v.trim());
        const bond: Record<string, any> = {};
        headers.forEach((h, i) => {
          bond[h] = values[i];
        });
        return bond;
      });

      // Odeslání na API (předpokládáme endpoint /api/bonds/import)
      try {
        const response = await fetch('/api/bonds/import', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ bonds: bondsToImport }),
        });
        if (!response.ok) throw new Error('Import selhal');
        fetchBonds();
        alert('Import úspěšný');
      } catch (err) {
        alert('Chyba při importu');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-8">
      {/* Import CSV a Sdílení portfolia */}
      <div className="flex justify-end gap-4">
        <label className="gold-button-outline px-4 py-2 cursor-pointer">
          Importovat CSV
          <input
            type="file"
            accept=".csv"
            className="hidden"
            onChange={handleImportCSV}
          />
        </label>
        <button
          className="gold-button-outline px-4 py-2"
          onClick={() => {
            const shareUrl = `${window.location.origin}/portfolio/shared/${userId}`;
            navigator.clipboard.writeText(shareUrl);
            alert('Odkaz na sdílení portfolia byl zkopírován do schránky.');
          }}
        >
          Sdílet portfolio
        </button>
      </div>
      {/* Filtry a řazení - zobrazujeme pouze pokud máme dluhopisy */}
      {bonds.length > 0 && (
        <PortfolioFilters
          onSearch={handleSearch}
          onSort={handleSort}
          onFilter={handleFilter}
        />
      )}

      {bonds.length === 0 ? (
        <div className="bg-gradient-to-br from-white to-neutral-50 dark:from-neutral-800 dark:to-neutral-900 rounded-xl py-16 px-6 text-center border border-neutral-200 dark:border-neutral-700 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-100/20 dark:bg-primary-800/10 rounded-full -mt-32 -mr-32 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary-100/20 dark:bg-primary-800/10 rounded-full -mb-32 -ml-32 blur-3xl"></div>

          <div className="relative z-10">
            <div className="w-24 h-24 mx-auto mb-6 bg-primary-50 dark:bg-primary-900/20 rounded-2xl flex items-center justify-center text-primary-600 dark:text-primary-400 shadow-lg rotate-3 transform hover:rotate-0 transition-transform duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m6.75 12H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
            </div>

            <h3 className="text-3xl font-bold mb-4 text-neutral-900 dark:text-white font-serif">Žádné dluhopisy</h3>

            <p className="text-neutral-600 dark:text-neutral-400 max-w-md mx-auto mb-8 text-lg leading-relaxed">
              Přidejte svůj první dluhopis do vaší sbírky
            </p>

            <NoBondsButtons />
          </div>
        </div>
      ) : (
        <>
          {/* Aktivní dluhopisy */}
          {activeBonds.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-6 text-neutral-900 dark:text-white font-serif">Aktivní dluhopisy</h2>
              <div className="space-y-6">
                {activeBonds.map((bond) => (
          <div key={bond.id} className="bg-gradient-to-br from-white to-neutral-50 dark:from-neutral-800 dark:to-neutral-900 rounded-xl shadow-lg border border-neutral-200 dark:border-neutral-700 overflow-hidden transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
            <div className="flex flex-col md:flex-row">
              {/* Left side - Visual indicator */}
              <div className="w-full md:w-1/4 bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/30 p-8 flex flex-col justify-center items-center relative overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-primary-200/30 dark:bg-primary-700/20 rounded-full -mt-10 -mr-10"></div>
                <div className="absolute bottom-0 left-0 w-16 h-16 bg-primary-200/30 dark:bg-primary-700/20 rounded-full -mb-8 -ml-8"></div>

                <div className="text-5xl font-bold text-primary-600 dark:text-primary-400 mb-2">{bond.interest_rate}%</div>
                <div className="text-sm text-primary-700 dark:text-primary-300 font-medium px-3 py-1 rounded-full bg-primary-100 dark:bg-primary-800/40 border border-primary-200 dark:border-primary-700/30">{translate('portfolio.yield', locale, { defaultValue: 'Výnos' })}</div>

                {/* Progress indicator */}
                <div className="w-full mt-8">
                  <div className="flex items-center justify-between mb-2 text-xs font-medium">
                    <span className="text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30 px-2 py-0.5 rounded">{new Date(bond.purchase_date).getFullYear()}</span>
                    <span className="text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30 px-2 py-0.5 rounded">{new Date(bond.maturity_date).getFullYear()}</span>
                  </div>
                  <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-3 overflow-hidden">
                    {(() => {
                      const purchaseDate = new Date(bond.purchase_date).getTime();
                      const maturityDate = new Date(bond.maturity_date).getTime();
                      const currentDate = new Date().getTime();
                      const totalDuration = maturityDate - purchaseDate;
                      const elapsed = currentDate - purchaseDate;
                      const percentage = Math.max(0, Math.min(100, (elapsed / totalDuration) * 100));

                      return (
                        <div
                          className="h-full bg-gradient-to-r from-primary-500 to-primary-400 dark:from-primary-600 dark:to-primary-500"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      );
                    })()}
                  </div>
                  {(() => {
                    const maturityDate = new Date(bond.maturity_date);
                    const today = new Date();
                    const diffTime = Math.abs(maturityDate.getTime() - today.getTime());
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    const diffYears = (diffDays / 365).toFixed(1);

                    return (
                      <div className="flex justify-center mt-2">
                        <span className="text-xs px-2 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full font-medium">
                          {`${diffYears} let do splatnosti`}
                        </span>
                      </div>
                    );
                  })()}
                </div>
              </div>

              {/* Right side - Bond details */}
              <div className="p-8 w-full md:w-3/4">
                <div className="flex justify-between items-start mb-5">
                  <div>
                    <h3 className="text-2xl font-bold text-neutral-900 dark:text-white font-serif">{bond.company_name}</h3>
                    <p className="text-neutral-500 dark:text-neutral-400 text-xs mt-1 opacity-60">
                      ID: {bond.id.substring(0, 8)}...
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      className="p-2 text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors border border-primary-100 dark:border-primary-800/30"
                      onClick={() => {
                        // Otevření formuláře pro úpravu dluhopisu
                        if (typeof window.editBond === 'function') {
                          console.log('PortfolioBonds: Kliknutí na tlačítko pro úpravu dluhopisu s ID:', bond.id);
                          window.editBond(bond.id);
                        } else {
                          console.error('PortfolioBonds: Funkce window.editBond není dostupná');
                        }
                      }}
                      title="Upravit dluhopis"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                      </svg>
                    </button>
                    {bond.pdf_url && (
                      <a
                        href={bond.pdf_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors border border-blue-100 dark:border-blue-800/30"
                        title="Stáhnout PDF"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                        </svg>
                      </a>
                    )}
                    <button
                      className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors border border-red-100 dark:border-red-800/30"
                      onClick={() => handleDelete(bond.id)}
                      title="Smazat dluhopis"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-8">
                  <div className="bg-primary-50/50 dark:bg-primary-900/10 p-4 rounded-lg border border-primary-100 dark:border-primary-800/30">
                    <div className="text-xs text-primary-600 dark:text-primary-400 font-medium mb-1">{translate('portfolio.purchased', locale, { defaultValue: 'Purchased' })}</div>
                    <div className="font-medium">{new Date(bond.purchase_date).toLocaleDateString()}</div>
                  </div>
                  <div className="bg-primary-50/50 dark:bg-primary-900/10 p-4 rounded-lg border border-primary-100 dark:border-primary-800/30">
                    <div className="text-xs text-primary-600 dark:text-primary-400 font-medium mb-1">{translate('portfolio.maturity', locale, { defaultValue: 'Maturity' })}</div>
                    <div className="font-medium">{new Date(bond.maturity_date).toLocaleDateString()}</div>
                  </div>
                  <div className="bg-primary-50/50 dark:bg-primary-900/10 p-4 rounded-lg border border-primary-100 dark:border-primary-800/30">
                    <div className="text-xs text-primary-600 dark:text-primary-400 font-medium mb-1">{translate('portfolio.investment', locale, { defaultValue: 'Investment' })}</div>
                    <div className="font-medium">{bond.invested_amount.toLocaleString()} Kč</div>
                  </div>
                  <div className="bg-primary-50/50 dark:bg-primary-900/10 p-4 rounded-lg border border-primary-100 dark:border-primary-800/30">
                    <div className="text-xs text-primary-600 dark:text-primary-400 font-medium mb-1">Frekvence plateb</div>
                    <div className="font-medium bg-yellow-100 dark:bg-yellow-900 p-1 rounded text-center">
                      {bond.payment_schedule?.toLowerCase() === 'monthly' ? 'Měsíčně' :
                       bond.payment_schedule?.toLowerCase() === 'quarterly' ? 'Čtvrtletně' :
                       bond.payment_schedule?.toLowerCase() === 'semi-annual' ? 'Pololetně' :
                       bond.payment_schedule?.toLowerCase() === 'annual' || bond.payment_schedule?.toLowerCase() === 'annually' ? 'Ročně' :
                       bond.payment_schedule?.toLowerCase() === 'at maturity' ? 'Při splatnosti' :
                       bond.payment_schedule}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 mt-6">
                  <button
                    className="gold-button flex items-center px-4 py-2 group"
                    onClick={() => {
                      if (typeof window.viewBondDetails === 'function') {
                        window.viewBondDetails(bond.id);
                      }
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z" />
                    </svg>
                    Zobrazit detaily
                  </button>

                </div>
              </div>
            </div>
          </div>
        ))}
              </div>
            </div>
          )}

          {/* Dluhopisy po splatnosti */}
          {expiredBonds.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-6 text-neutral-900 dark:text-white font-serif">Dluhopisy po splatnosti</h2>
              <div className="space-y-6">
                {expiredBonds.map((bond) => (
                  <div key={bond.id} className="bg-gradient-to-br from-white to-neutral-50 dark:from-neutral-800 dark:to-neutral-900 rounded-xl shadow-lg border border-neutral-200 dark:border-neutral-700 overflow-hidden transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl opacity-75">
                    <div className="flex flex-col md:flex-row">
                      {/* Left side - Visual indicator */}
                      <div className="w-full md:w-1/4 bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/30 p-8 flex flex-col justify-center items-center relative overflow-hidden">
                        {/* Decorative elements */}
                        <div className="absolute top-0 right-0 w-20 h-20 bg-red-200/30 dark:bg-red-700/20 rounded-full -mt-10 -mr-10"></div>
                        <div className="absolute bottom-0 left-0 w-16 h-16 bg-red-200/30 dark:bg-red-700/20 rounded-full -mb-8 -ml-8"></div>

                        <div className="text-5xl font-bold text-red-600 dark:text-red-400 mb-2">{bond.interest_rate}%</div>
                        <div className="text-sm text-red-700 dark:text-red-300 font-medium px-3 py-1 rounded-full bg-red-100 dark:bg-red-800/40 border border-red-200 dark:border-red-700/30">Výnos</div>

                        <div className="w-full mt-8 text-center">
                          <span className="text-sm px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-full font-medium">
                            Po splatnosti
                          </span>
                        </div>
                      </div>

                      {/* Right side - Bond details */}
                      <div className="p-8 w-full md:w-3/4">
                        <div className="flex justify-between items-start mb-5">
                          <div>
                            <h3 className="text-2xl font-bold text-neutral-900 dark:text-white font-serif">{bond.company_name}</h3>
                            <p className="text-neutral-500 dark:text-neutral-400 text-xs mt-1 opacity-60">
                              ID: {bond.id.substring(0, 8)}...
                            </p>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              className="p-2 text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors border border-primary-100 dark:border-primary-800/30"
                              onClick={() => {
                                // Otevření formuláře pro úpravu dluhopisu
                                if (typeof window.editBond === 'function') {
                                  console.log('PortfolioBonds: Kliknutí na tlačítko pro úpravu dluhopisu po splatnosti s ID:', bond.id);
                                  window.editBond(bond.id);
                                } else {
                                  console.error('PortfolioBonds: Funkce window.editBond není dostupná');
                                }
                              }}
                              title="Upravit dluhopis"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                              </svg>
                            </button>
                            {bond.pdf_url && (
                              <a
                                href={bond.pdf_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors border border-blue-100 dark:border-blue-800/30"
                                title="Stáhnout PDF"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                                </svg>
                              </a>
                            )}
                            <button
                              className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors border border-red-100 dark:border-red-800/30"
                              onClick={() => handleDelete(bond.id)}
                              title="Smazat dluhopis"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                              </svg>
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-8">
                          <div className="bg-red-50/50 dark:bg-red-900/10 p-4 rounded-lg border border-red-100 dark:border-red-800/30">
                            <div className="text-xs text-red-600 dark:text-red-400 font-medium mb-1">Datum nákupu</div>
                            <div className="font-medium">{new Date(bond.purchase_date).toLocaleDateString()}</div>
                          </div>
                          <div className="bg-red-50/50 dark:bg-red-900/10 p-4 rounded-lg border border-red-100 dark:border-red-800/30">
                            <div className="text-xs text-red-600 dark:text-red-400 font-medium mb-1">Datum splatnosti</div>
                            <div className="font-medium">{new Date(bond.maturity_date).toLocaleDateString()}</div>
                          </div>
                          <div className="bg-red-50/50 dark:bg-red-900/10 p-4 rounded-lg border border-red-100 dark:border-red-800/30">
                            <div className="text-xs text-red-600 dark:text-red-400 font-medium mb-1">Investovaná částka</div>
                            <div className="font-medium">{bond.invested_amount.toLocaleString()} Kč</div>
                          </div>
                          <div className="bg-red-50/50 dark:bg-red-900/10 p-4 rounded-lg border border-red-100 dark:border-red-800/30">
                            <div className="text-xs text-red-600 dark:text-red-400 font-medium mb-1">Frekvence plateb</div>
                            <div className="font-medium bg-red-200 dark:bg-red-800 p-1 rounded text-center">
                              {bond.payment_schedule?.toLowerCase() === 'monthly' ? 'Měsíčně' :
                               bond.payment_schedule?.toLowerCase() === 'quarterly' ? 'Čtvrtletně' :
                               bond.payment_schedule?.toLowerCase() === 'semi-annual' ? 'Pololetně' :
                               bond.payment_schedule?.toLowerCase() === 'annual' || bond.payment_schedule?.toLowerCase() === 'annually' ? 'Ročně' :
                               bond.payment_schedule?.toLowerCase() === 'at maturity' ? 'Při splatnosti' :
                               bond.payment_schedule}
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-4 mt-6">
                          <button
                            className="gold-button flex items-center px-4 py-2 group"
                            onClick={() => {
                              if (typeof window.viewBondDetails === 'function') {
                                window.viewBondDetails(bond.id);
                              }
                            }}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z" />
                            </svg>
                            Zobrazit detaily
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
