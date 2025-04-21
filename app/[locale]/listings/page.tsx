import Link from 'next/link';
import { BondListing } from '@/models';
// import { getBonds } from '@/lib/supabase';
import { translate } from '@/lib/i18n';

async function getListings() {
  try {
    console.log('Načítám seznam dluhopisů z API');

    // Použijeme lokální API endpoint
    const apiUrl = new URL('/api/admin/bonds/list', 'http://localhost:3000');
    apiUrl.searchParams.append('limit', '20');
    apiUrl.searchParams.append('offset', '0');
    apiUrl.searchParams.append('status', 'all'); // Zobrazit všechny nabídky bez ohledu na status

    console.log('Používám URL:', apiUrl.toString());

    const response = await fetch(apiUrl.toString(), {
      cache: 'no-store',
      next: { revalidate: 0 }
    });

    if (!response.ok) {
      throw new Error(`Chyba při načítání dluhopisů: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const listings = data.listings || [];

    if (!listings || listings.length === 0) {
      console.log('Nebyly nalezeny žádné dluhopisy');
      return [];
    }

    console.log(`Načteno ${listings.length} dluhopisů`);
    return listings;
  } catch (error) {
    console.error('Chyba při načítání dluhopisů:', error);
    return [];
  }
}

export default async function ListingsPage({
  params: { locale }
}: {
  params: { locale: string }
}) {
  const listings = await getListings();

  // Překlady stránky
  const pageTitle = translate('listings.title', locale, { defaultValue: 'Bond Listings' });
  const pageSubtitle = translate('listings.subtitle', locale, {
    defaultValue: 'Explore our curated selection of premium bond investment opportunities.'
  });
  const noListingsText = translate('listings.no_listings', locale, {
    defaultValue: 'No bond listings available at the moment.'
  });
  const checkBackText = translate('listings.check_back', locale, {
    defaultValue: 'Please check back later for new investment opportunities.'
  });
  const viewDetailsText = translate('listings.view_details', locale, { defaultValue: 'View Details' });
  const viewPresentationText = translate('listings.view_presentation', locale, { defaultValue: 'View Presentation' });
  const issuerText = translate('listings.issuer', locale, { defaultValue: 'Issuer' });
  const yieldText = translate('listings.yield', locale, { defaultValue: 'Yield' });
  const maturityText = translate('listings.maturity', locale, { defaultValue: 'Maturity' });
  const minInvestmentText = translate('listings.min_investment', locale, { defaultValue: 'Min. Investment' });

  return (
    <main className="min-h-screen bg-white dark:bg-neutral-900">
      {/* Hero header */}
      <section className="relative overflow-hidden gold-bg-section py-16 animated-gold-bg">
        <div className="absolute top-0 right-0 w-64 h-64 gold-circle -mt-20 -mr-20 animate-float-slow"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 gold-circle -mb-10 -ml-10 animate-float"></div>

        <div className="container-custom relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <span className="inline-block px-3 py-1 rounded-full bg-primary-100 text-primary-700 font-medium text-xs mb-3 shadow-gold-soft">
              PRÉMIOVÉ INVESTIČNÍ PŘÍLEŽITOSTI
            </span>
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gradient-primary gold-shimmer">
              {pageTitle}
            </h1>
            <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
              {pageSubtitle}
            </p>

            <div className="w-32 h-1 bg-gradient-gold mx-auto my-6 rounded-full shadow-gold-soft"></div>
          </div>
        </div>

        {/* Wave pattern divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <div className="relative h-12">
            <div className="absolute inset-0 bg-wave-pattern bg-repeat-x opacity-30 gold-shimmer"></div>
          </div>
        </div>
      </section>

      {/* Filter bar */}
      <section className="py-6 bg-white dark:bg-neutral-900 border-b border-primary-100 dark:border-primary-800/30 sticky top-20 z-10 backdrop-blur-lg bg-white/90 dark:bg-neutral-900/90 shadow-gold-soft">
        <div className="container-custom">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium gold-highlight">{translate('listings.filter', locale, { defaultValue: 'Filtrovat:' })}</span>
                <select className="py-2 px-3 bg-white dark:bg-neutral-800 border border-primary-200 dark:border-primary-800/30 rounded-lg text-sm gold-border hover:shadow-gold-soft focus:border-primary-500 focus:ring focus:ring-primary-200 transition-all">
                  <option>{translate('listings.allTypes', locale, { defaultValue: 'Všechny typy' })}</option>
                  <option>Korporátní dluhopisy</option>
                  <option>Státní dluhopisy</option>
                  <option>Municipální dluhopisy</option>
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium gold-highlight">Výnos:</span>
                <select className="py-2 px-3 bg-white dark:bg-neutral-800 border border-primary-200 dark:border-primary-800/30 rounded-lg text-sm gold-border hover:shadow-gold-soft focus:border-primary-500 focus:ring focus:ring-primary-200 transition-all">
                  <option>Všechny výnosy</option>
                  <option>2-4%</option>
                  <option>4-6%</option>
                  <option>6%+</option>
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium gold-highlight">Splatnost:</span>
                <select className="py-2 px-3 bg-white dark:bg-neutral-800 border border-primary-200 dark:border-primary-800/30 rounded-lg text-sm gold-border hover:shadow-gold-soft focus:border-primary-500 focus:ring focus:ring-primary-200 transition-all">
                  <option>Všechny doby splatnosti</option>
                  <option>1-3 roky</option>
                  <option>3-5 let</option>
                  <option>5+ let</option>
                </select>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-primary-400">
                  <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
                </svg>
              </div>
              <input
                type="search"
                placeholder={translate('listings.search', locale, { defaultValue: 'Hledat dluhopisy...' })}
                className="pl-10 py-2 px-4 bg-white dark:bg-neutral-800 border border-primary-200 dark:border-primary-800/30 rounded-lg text-sm w-full md:w-auto gold-border hover:shadow-gold-soft focus:border-primary-500 focus:ring focus:ring-primary-200 transition-all"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Main listings section */}
      <section className="py-12 bg-white dark:bg-neutral-900">
        <div className="container-custom">
          {listings.length > 0 ? (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {listings.map((listing: any) => (
                <div key={listing.id || listing._id} className="card card-3d overflow-hidden shimmer-card shadow-gold-soft luxury-card">
                  <div className="luxury-card-content">
                    <div className="relative h-48 bg-gradient-white-gold dark:from-primary-900/20 dark:to-primary-800/30 flex items-center justify-center overflow-hidden">
                      {listing.status === 'featured' && (
                        <div className="absolute top-4 right-4 bg-gradient-gold text-white text-xs font-bold px-3 py-1 rounded-full z-10 shadow-gold animate-gold-pulse">
                          DOPORUČENO
                        </div>
                      )}
                      <div className="relative z-0 w-full h-full flex items-center justify-center">
                        <div className="absolute w-64 h-64 opacity-20 animate-rotate-slow">
                          <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                            <defs>
                              <linearGradient id="circle-stroke" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#ffc940" />
                                <stop offset="100%" stopColor="#b18b27" />
                              </linearGradient>
                            </defs>
                            <circle cx="50" cy="50" r="45" fill="none" stroke="url(#circle-stroke)" strokeWidth="5" strokeDasharray="10 5" />
                          </svg>
                        </div>
                        <div className="text-5xl font-bold text-gradient-primary gold-shimmer">{listing.yield}%</div>
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="badge-gold-border px-3 py-1 rounded-full text-xs font-medium bg-primary-50 dark:bg-primary-900/20 text-primary-800 dark:text-primary-300">
                        {listing.type || 'Korporátní dluhopis'}
                      </span>
                      <div className="flex items-center text-primary-500">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                          <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                        </svg>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                          <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                        </svg>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                          <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                        </svg>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                          <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                        </svg>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-primary-300">
                          <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                    <h3 className="text-xl font-bold mb-2 hover:text-primary-600 transition-colors gold-shimmer">
                      <Link href={`/${locale}/listings/${listing.id || listing._id}`}>{listing.title}</Link>
                    </h3>
                    <p className="text-neutral-600 dark:text-neutral-400 mb-4 line-clamp-3">{listing.description}</p>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="card-gold-border rounded-lg overflow-hidden">
                        <div className="p-3">
                          <div className="text-xs text-neutral-500 dark:text-neutral-500 mb-1 gold-highlight">{issuerText}</div>
                          <div className="font-medium truncate" title={listing.issuer}>{listing.issuer}</div>
                        </div>
                      </div>
                      <div className="card-gold-border rounded-lg overflow-hidden">
                        <div className="p-3">
                          <div className="text-xs text-neutral-500 dark:text-neutral-500 mb-1 gold-highlight">{yieldText}</div>
                          <div className="font-medium text-gradient-primary">{listing.yield}%</div>
                        </div>
                      </div>
                      <div className="card-gold-border rounded-lg overflow-hidden">
                        <div className="p-3">
                          <div className="text-xs text-neutral-500 dark:text-neutral-500 mb-1 gold-highlight">{maturityText}</div>
                          <div className="font-medium">{new Date(listing.maturityDate).toLocaleDateString(locale)}</div>

                          {/* Progress bar pro vizualizaci doby splatnosti */}
                          <div className="mt-2 w-full h-1.5 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-gold rounded-full" style={{ width: '60%' }}></div>
                          </div>
                        </div>
                      </div>
                      <div className="card-gold-border rounded-lg overflow-hidden">
                        <div className="p-3">
                          <div className="text-xs text-neutral-500 dark:text-neutral-500 mb-1 gold-highlight">{minInvestmentText}</div>
                          <div className="font-medium">{listing.minimumInvestment?.toLocaleString() || "10,000"} Kč</div>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center mt-auto">
                      <Link
                        href={`/${locale}/listings/${listing.id || listing._id}`}
                        className="btn-gold-effect btn-sm flex items-center"
                      >
                        {viewDetailsText}
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 ml-1">
                          <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
                        </svg>
                      </Link>
                      {listing.presentationUrl && (
                        <a
                          href={listing.presentationUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="gold-highlight hover:text-primary-700 text-sm font-medium flex items-center gold-shimmer"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                          </svg>
                          {viewPresentationText}
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-neutral-50 dark:bg-neutral-800 rounded-2xl py-16 px-6 text-center max-w-2xl mx-auto">
              <div className="w-16 h-16 mx-auto mb-6 bg-neutral-200 dark:bg-neutral-700 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-neutral-500">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m6.75 12H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">{noListingsText}</h3>
              <p className="text-neutral-500 dark:text-neutral-400 max-w-md mx-auto">
                {checkBackText}
              </p>
              <div className="mt-8">
                <Link href={`/${locale}`} className="btn-outline">
                  Zpět na hlavní stránku
                </Link>
              </div>
            </div>
          )}

          {listings.length > 0 && (
            <div className="mt-12 flex justify-center">
              <nav className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <a href="#" className="px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 text-neutral-500 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors">
                    <span className="sr-only">Předchozí</span>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                      <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                    </svg>
                  </a>
                  <span className="px-3 py-2 rounded-lg bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 font-medium">1</span>
                  <a href="#" className="px-3 py-2 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors">2</a>
                  <a href="#" className="px-3 py-2 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors">3</a>
                  <span className="px-3 py-2 text-neutral-500 dark:text-neutral-400">...</span>
                  <a href="#" className="px-3 py-2 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors">8</a>
                  <a href="#" className="px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 text-neutral-500 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors">
                    <span className="sr-only">Další</span>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                      <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                    </svg>
                  </a>
                </div>
              </nav>
            </div>
          )}
        </div>
      </section>

      {/* FAQ section */}
      <section className="py-16 bg-neutral-50 dark:bg-neutral-800">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="inline-block px-3 py-1 rounded-full bg-secondary-100 text-secondary-700 font-medium text-xs mb-3">
              INVESTIČNÍ OTÁZKY
            </span>
            <h2 className="text-3xl font-bold mb-4 text-gradient-primary">Časté otázky</h2>
            <p className="text-lg text-neutral-600 dark:text-neutral-400">
              Odpovědi na nejčastější otázky ohledně investování do dluhopisů na naší platformě
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white dark:bg-neutral-900 p-6 rounded-xl shadow-soft">
              <h3 className="text-lg font-bold mb-3">Jak začít investovat?</h3>
              <p className="text-neutral-600 dark:text-neutral-400">
                Pro zahájení investování se jednoduše zaregistrujte, vyberte si dluhopis z našeho portfolia, a následujte pokyny pro dokončení investice. Celý proces je intuitivní a zabere jen několik minut.
              </p>
            </div>

            <div className="bg-white dark:bg-neutral-900 p-6 rounded-xl shadow-soft">
              <h3 className="text-lg font-bold mb-3">Jaký je minimální investiční limit?</h3>
              <p className="text-neutral-600 dark:text-neutral-400">
                Minimální investiční částka se liší podle konkrétního dluhopisu. Typicky začíná na 10 000 Kč, některé prémiové dluhopisy mohou mít vyšší minimum.
              </p>
            </div>

            <div className="bg-white dark:bg-neutral-900 p-6 rounded-xl shadow-soft">
              <h3 className="text-lg font-bold mb-3">Jak jsou výnosy vypláceny?</h3>
              <p className="text-neutral-600 dark:text-neutral-400">
                Výnosy jsou typicky vypláceny formou pravidelných kuponových plateb, většinou jednou ročně nebo pololetně, v závislosti na emisních podmínkách každého dluhopisu.
              </p>
            </div>

            <div className="bg-white dark:bg-neutral-900 p-6 rounded-xl shadow-soft">
              <h3 className="text-lg font-bold mb-3">Jsou dluhopisy bezpečnou investicí?</h3>
              <p className="text-neutral-600 dark:text-neutral-400">
                Dluhopisy jsou obecně považovány za bezpečnější investici než akcie, ale stále nesou určitá rizika. Na naší platformě prověřujeme všechny emitenty a poskytujeme detailní informace k posouzení rizika.
              </p>
            </div>
          </div>

          <div className="text-center mt-10">
            <Link href={`/${locale}/faq`} className="btn-outline inline-flex items-center">
              Zobrazit všechny otázky
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 ml-2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}