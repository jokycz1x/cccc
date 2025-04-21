import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import dynamic from 'next/dynamic';
import PortfolioBonds from "@/components/PortfolioBonds";
import BondForm from "@/components/BondForm";
import EmptyPortfolioGuide from "@/components/EmptyPortfolioGuide";
import PortfolioHeaderButtons from "@/components/PortfolioHeaderButtons";
import { authOptions } from "@/lib/auth";
import { translate } from "@/lib/i18n";
import { createClient } from '@supabase/supabase-js';

// Sekce Doporučené dluhopisy byla odstraněna

const PortfolioAnalytics = dynamic(() => import('@/components/PortfolioAnalytics'), {
  ssr: false,
  loading: () => <div className="p-8 bg-white dark:bg-neutral-800 rounded-xl shadow-lg border border-neutral-200 dark:border-neutral-700 animate-pulse">
    <div className="h-8 bg-neutral-200 dark:bg-neutral-700 rounded-lg w-1/3 mb-6"></div>
    <div className="h-72 bg-neutral-100 dark:bg-neutral-700 rounded-lg mb-6"></div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="h-64 bg-neutral-100 dark:bg-neutral-700 rounded-lg"></div>
      <div className="h-64 bg-neutral-100 dark:bg-neutral-700 rounded-lg"></div>
    </div>
  </div>
});

const PaymentNotifications = dynamic(() => import('@/components/PaymentNotifications'), {
  ssr: false,
  loading: () => <div className="p-6 bg-white dark:bg-neutral-800 rounded-xl shadow-lg border border-neutral-200 dark:border-neutral-700 animate-pulse">
    <div className="h-6 bg-neutral-200 dark:bg-neutral-700 rounded-lg w-1/4 mb-4"></div>
    <div className="h-24 bg-neutral-100 dark:bg-neutral-700 rounded-lg"></div>
  </div>
});

const PortfolioModals = dynamic(() => import('@/components/PortfolioModals'), {
  ssr: false,
});

// Konfigurace Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://etceznegcpihgqupaqvt.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Vytvoření Supabase klienta s admin právy
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

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

export default async function PortfolioPage({
  params: { locale }
}: {
  params: { locale: string }
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    // Přesměrování na přihlašovací stránku se zachováním lokalizace
    redirect(`/${locale}/auth/login?callbackUrl=/${locale}/portfolio`);
  }

  // Načtení dluhopisů pro vykreslení grafu
  let bonds: Bond[] = [];
  let totalInvestment = 0;
  let averageYield = 0;

  try {
    // Načtení dluhopisů ze Supabase
    const { data, error } = await supabaseAdmin
      .from('bonds')
      .select('*')
      .eq('user_id', session.user.id)
      .order('purchase_date', { ascending: true });

    if (error) {
      console.error('Chyba při načítání dluhopisů:', error);
    } else {
      bonds = data || [];
    }

    // Výpočet celkového objemu investic a průměrného výnosu
    if (bonds.length > 0) {
      totalInvestment = bonds.reduce((sum, bond) => sum + bond.invested_amount, 0);
      averageYield = bonds.reduce((sum, bond) => sum + bond.interest_rate, 0) / bonds.length;
    } else {
      // Pokud nejsou žádné dluhopisy, ponecháme prázdné
      bonds = [];
      totalInvestment = 0;
      averageYield = 0;
    }
  } catch (error) {
    console.error('Failed to fetch bonds for graph:', error);
    // V případě chyby také ponecháme prázdné hodnoty
    bonds = [];
    totalInvestment = 0;
    averageYield = 0;
  }

  // Příprava dat pro graf
  // Převedení dat nákupu a splatnosti na javascript Date objekty
  const processedBonds = bonds.map(bond => {
    const purchaseDate = new Date(bond.purchase_date);
    const maturityDate = new Date(bond.maturity_date);

    return {
      ...bond,
      purchaseDate,
      maturityDate,
      purchaseYear: purchaseDate.getFullYear(),
      maturityYear: maturityDate.getFullYear(),
      // Výpočet aktuální hodnoty investice
      currentValue: bond.invested_amount * (1 + (bond.interest_rate / 100) *
        (Math.min(new Date().getTime(), maturityDate.getTime()) - purchaseDate.getTime()) /
        (365 * 24 * 60 * 60 * 1000))
    };
  });

  // Seřazení dluhopisů podle data pořízení
  processedBonds.sort((a, b) => a.purchaseDate.getTime() - b.purchaseDate.getTime());

  // Výpočet celkové aktuální hodnoty
  const totalCurrentValue = processedBonds.reduce((sum, bond) => sum + bond.currentValue, 0);

  // Průměrná doba do splatnosti (v letech)
  const now = new Date();
  const averageTimeToMaturity = processedBonds.reduce((sum, bond) => {
    const maturityTime = bond.maturityDate.getTime();
    const remainingTime = Math.max(0, maturityTime - now.getTime());
    return sum + (remainingTime / (365 * 24 * 60 * 60 * 1000));
  }, 0) / Math.max(1, processedBonds.length);

  // Nejbližší datum splatnosti
  const futureBonds = processedBonds.filter(bond => bond.maturityDate > now);
  const nextMaturityDate = futureBonds.length > 0
    ? futureBonds.reduce((closest, bond) =>
        bond.maturityDate < closest ? bond.maturityDate : closest,
        futureBonds[0].maturityDate)
    : null;

  // Pomocná funkce pro formátování data
  const formatDate = (date: Date, locale: string) => {
    return date.toLocaleDateString(locale === 'cs' ? 'cs-CZ' : 'en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  // Překlady stránky
  const addBondText = translate('portfolio.addBond', locale, { defaultValue: 'Add Bond' });

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-900">
      {/* Bond Form Component */}
      <BondForm />

      {/* Hero header - Gold Theme */}
      <section className="py-12 md:py-20 bg-gradient-to-b from-neutral-50 via-neutral-100 to-white dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-800 border-b border-neutral-200 dark:border-neutral-700 relative overflow-hidden">
        {/* Dekorativní prvky na pozadí */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-bl from-primary-100/30 to-transparent dark:from-primary-900/10 dark:to-transparent transform -skew-x-12 z-0"></div>
        <div className="absolute bottom-0 left-0 w-1/4 h-1/2 bg-gradient-to-tr from-primary-100/20 to-transparent dark:from-primary-900/5 dark:to-transparent rounded-full blur-3xl z-0"></div>

        <div className="container-custom relative z-10">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
            <div className="max-w-2xl mb-8 md:mb-0">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary-100/50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-sm font-medium mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
                </svg>
                Osobní portfolio
              </div>
              <h1 className="text-3xl md:text-5xl font-bold mb-4 text-neutral-900 dark:text-white font-serif">
                <span className="gold-gradient-text">Moje dluhopisy</span>
              </h1>
              <p className="text-lg text-neutral-600 dark:text-neutral-300 max-w-2xl leading-relaxed">
                Spravujte své dluhopisové portfolio a sledujte výkonnost vašich investic s přehledným dashboardem
              </p>
            </div>

            <PortfolioHeaderButtons />
          </div>
        </div>
      </section>

      {/* Stats Cards - Modern Design */}
      <section className="py-12 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800">
        <div className="container-custom">
          <div className="flex items-center mb-8">
            <div className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-primary-600 dark:text-primary-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-neutral-800 dark:text-white font-serif">Přehled portfolia</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-white to-neutral-50 dark:from-neutral-800 dark:to-neutral-900 rounded-xl p-6 shadow-lg border border-neutral-200 dark:border-neutral-700 hover:shadow-xl transition-all duration-300 group hover:-translate-y-1">
              <div className="flex items-center mb-4">
                <div className="bg-primary-50 dark:bg-primary-900/30 p-3 rounded-lg mr-3 group-hover:bg-primary-100 dark:group-hover:bg-primary-800/30 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-primary-600 dark:text-primary-400">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
                  </svg>
                </div>
                <div>
                  <div className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                    Celková investice
                  </div>
                  <div className="text-2xl font-bold text-neutral-900 dark:text-white">
                    {totalInvestment > 0 ? `${totalInvestment.toLocaleString()} Kč` : "0 Kč"}
                  </div>
                </div>
              </div>
              <div className="flex items-center text-xs text-neutral-500 dark:text-neutral-400 mt-2 pl-12">
                <span className="mr-1">Aktuální hodnota:</span>
                <span className="font-medium text-neutral-700 dark:text-neutral-300">{Math.round(totalCurrentValue || 0).toLocaleString()} Kč</span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-white to-neutral-50 dark:from-neutral-800 dark:to-neutral-900 rounded-xl p-6 shadow-lg border border-neutral-200 dark:border-neutral-700 hover:shadow-xl transition-all duration-300 group hover:-translate-y-1">
              <div className="flex items-center mb-4">
                <div className="bg-green-50 dark:bg-green-900/30 p-3 rounded-lg mr-3 group-hover:bg-green-100 dark:group-hover:bg-green-800/30 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-green-600 dark:text-green-400">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
                  </svg>
                </div>
                <div>
                  <div className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                    Průměrný výnos
                  </div>
                  <div className="text-2xl font-bold text-neutral-900 dark:text-white">
                    {averageYield > 0 ? `${averageYield.toFixed(2)}%` : "0%"}
                  </div>
                </div>
              </div>
              <div className="mt-3 pl-12">
                <div className="h-2.5 w-full bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-green-500 to-green-400 dark:from-green-500 dark:to-green-400 group-hover:from-green-600 group-hover:to-green-500 dark:group-hover:from-green-600 dark:group-hover:to-green-500 transition-colors" style={{ width: `${Math.min(100, averageYield * 5)}%` }}></div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-white to-neutral-50 dark:from-neutral-800 dark:to-neutral-900 rounded-xl p-6 shadow-lg border border-neutral-200 dark:border-neutral-700 hover:shadow-xl transition-all duration-300 group hover:-translate-y-1">
              <div className="flex items-center mb-4">
                <div className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-lg mr-3 group-hover:bg-blue-100 dark:group-hover:bg-blue-800/30 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-blue-600 dark:text-blue-400">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.429 9.75L2.25 12l4.179 2.25m0-4.5l5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25m0 0L21.75 12l-4.179 2.25m0 0l4.179 2.25L12 21.75 2.25 16.5l4.179-2.25m11.142 0l-5.571 3-5.571-3" />
                  </svg>
                </div>
                <div>
                  <div className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                    Počet dluhopisů
                  </div>
                  <div className="text-2xl font-bold text-neutral-900 dark:text-white">
                    {bonds.length || 0}
                  </div>
                </div>
              </div>
              <div className="flex items-center text-xs text-neutral-500 dark:text-neutral-400 mt-2 pl-12">
                <span className="mr-1">{bonds.length > 0 ? 'Různí emitenti:' : 'Žádné dluhopisy'}</span>
                {bonds.length > 0 && (
                  <span className="font-medium text-neutral-700 dark:text-neutral-300">{new Set(bonds.map(b => b.company_name)).size}</span>
                )}
                {bonds.length > 0 && (
                  <span className="ml-2 px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs font-medium">
                    {Math.round(new Set(bonds.map(b => b.company_name)).size / bonds.length * 100)}% diverzifikace
                  </span>
                )}
              </div>
            </div>

            <div className="bg-gradient-to-br from-white to-neutral-50 dark:from-neutral-800 dark:to-neutral-900 rounded-xl p-6 shadow-lg border border-neutral-200 dark:border-neutral-700 hover:shadow-xl transition-all duration-300 group hover:-translate-y-1">
              <div className="flex items-center mb-4">
                <div className="bg-amber-50 dark:bg-amber-900/30 p-3 rounded-lg mr-3 group-hover:bg-amber-100 dark:group-hover:bg-amber-800/30 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-amber-600 dark:text-amber-400">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                  </svg>
                </div>
                <div>
                  <div className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                    Doba do splatnosti
                  </div>
                  <div className="text-2xl font-bold text-neutral-900 dark:text-white">
                    {averageTimeToMaturity > 0 ? `${averageTimeToMaturity.toFixed(1)} let` : "-"}
                  </div>
                </div>
              </div>
              <div className="mt-3 pl-12">
                <div className="h-2.5 w-full bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-amber-500 to-amber-400 dark:from-amber-500 dark:to-amber-400 group-hover:from-amber-600 group-hover:to-amber-500 dark:group-hover:from-amber-600 dark:group-hover:to-amber-500 transition-colors" style={{ width: `${Math.min(100, (averageTimeToMaturity / 10) * 100)}%` }}></div>
                </div>
              </div>
              {nextMaturityDate && (
                <div className="flex items-center text-xs text-neutral-500 dark:text-neutral-400 mt-2 pl-12">
                  <span className="mr-1">Nejbližší splatnost:</span>
                  <span className="font-medium text-neutral-700 dark:text-neutral-300">{formatDate(nextMaturityDate, locale)}</span>
                  <span className="ml-2 px-2 py-0.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded-full text-xs font-medium">
                    {Math.ceil((new Date(nextMaturityDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} dní
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Seznam dluhopisů - Gold Theme */}
      <section className="py-16 bg-white dark:bg-neutral-900 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-full h-40 bg-gradient-to-b from-primary-50/50 to-transparent dark:from-primary-900/5 dark:to-transparent"></div>
        <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-primary-50/50 dark:bg-primary-900/5 blur-3xl"></div>

        <div className="container-custom relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
            <h2 className="text-2xl md:text-3xl font-bold gold-gradient-text font-serif">Moje dluhopisy</h2>

            <div className="flex flex-wrap gap-3">
              <a
                id="import-bonds-button"
                className="gold-button-outline flex items-center px-4 py-2 text-sm cursor-pointer hover:bg-primary-50 dark:hover:bg-primary-900/10 transition-colors"
                href="#import-bonds-modal"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-2 text-primary-600 dark:text-primary-400">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                </svg>
                {translate('import.title', locale, { defaultValue: 'Importovat dluhopisy' })}
              </a>

              <a
                id="share-portfolio-button"
                className="gold-button-outline flex items-center px-4 py-2 text-sm cursor-pointer hover:bg-primary-50 dark:hover:bg-primary-900/10 transition-colors"
                href="#share-portfolio-modal"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-2 text-primary-600 dark:text-primary-400">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
                </svg>
                {translate('share.title', locale, { defaultValue: 'Sdílet portfolio' })}
              </a>

              <a
                id="add-bond-button"
                className="gold-button flex items-center px-4 py-2 text-sm cursor-pointer shadow-gold-soft hover:shadow-gold transition-shadow"
                href="#bond-modal"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                {translate('portfolio.addBond', locale, { defaultValue: 'Přidat dluhopis' })}
              </a>
            </div>
          </div>

          <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 shadow-gold-lg card-gold-border mb-12">
            <PortfolioBonds userId={session.user.id} />
          </div>

          {/* Průvodce přidáním prvního dluhopisu - zobrazí se jen pokud uživatel nemá žádné dluhopisy */}
          {bonds.length === 0 && (
            <EmptyPortfolioGuide addBondText={addBondText} locale={locale} />
          )}
        </div>
      </section>

      {/* Notifikace o nadcházejících platbách */}
      {bonds.length > 0 && (
        <PaymentNotifications bonds={bonds} locale={locale} />
      )}

      {/* Analytika a grafy */}
      {bonds.length > 0 && (
        <PortfolioAnalytics bonds={bonds} locale={locale} />
      )}

      {/* Sekce Doporučené dluhopisy byla odstraněna */}

      {/* Modální okna - klientské komponenty */}
      <PortfolioModals locale={locale} />
    </div>
  );
}
