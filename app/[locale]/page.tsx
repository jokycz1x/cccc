import Link from 'next/link'
import Image from 'next/image'
import { translate } from '@/lib/i18n'

export default function Home({
  params: { locale }
}: {
  params: { locale: string }
}) {
  // Používáme přímou funkci translate místo useTranslation hooku, protože jsme v server komponentě

  // Překlady pro tuto stránku
  const t = {
    hero: {
      title: translate('home.hero.title', locale, { defaultValue: 'Bond Portfolio Marketplace' }),
      description: translate('home.hero.description', locale, {
        defaultValue: 'Discover premium bond investment opportunities from trusted investment partners.'
      }),
      viewListings: translate('home.hero.viewListings', locale, { defaultValue: 'View Listings' }),
      register: translate('home.hero.register', locale, { defaultValue: 'Register Now' }),
    },
    featured: {
      title: translate('home.featured.title', locale, { defaultValue: 'Featured Bond Listings' }),
      viewAll: translate('home.featured.viewAll', locale, { defaultValue: 'View All Listings' }),
      bond: translate('home.featured.bond', locale, { defaultValue: 'Corporate Bond' }),
      description: translate('home.featured.bondDescription', locale, {
        defaultValue: 'High-yield corporate bond with 5.5% annual return. Maturity in 2028.'
      }),
      viewDetails: translate('home.featured.viewDetails', locale, { defaultValue: 'View Details' }),
      yield: translate('home.featured.yield', locale, { defaultValue: 'APY' }),
    },
    howItWorks: {
      title: translate('home.howItWorks.title', locale, { defaultValue: 'How It Works' }),
      step1: {
        title: translate('home.howItWorks.step1.title', locale, { defaultValue: 'Browse Listings' }),
        description: translate('home.howItWorks.step1.description', locale, {
          defaultValue: 'Explore our curated selection of premium bond investment opportunities.'
        }),
      },
      step2: {
        title: translate('home.howItWorks.step2.title', locale, { defaultValue: 'Select Your Investment' }),
        description: translate('home.howItWorks.step2.description', locale, {
          defaultValue: 'Choose the bond that matches your investment goals and risk tolerance.'
        }),
      },
      step3: {
        title: translate('home.howItWorks.step3.title', locale, { defaultValue: 'Complete Your Purchase' }),
        description: translate('home.howItWorks.step3.description', locale, {
          defaultValue: 'Fill out the order form and connect with the investment partner.'
        }),
      },
    },
    newsletter: {
      title: translate('home.newsletter.title', locale, { defaultValue: 'Stay Updated' }),
      description: translate('home.newsletter.description', locale, {
        defaultValue: 'Subscribe to our newsletter to receive the latest bond investment opportunities and market insights.'
      }),
      placeholder: translate('home.newsletter.placeholder', locale, { defaultValue: 'Your email address' }),
      button: translate('home.newsletter.button', locale, { defaultValue: 'Subscribe' }),
    },
    trusted: {
      title: translate('home.trusted.title', locale, { defaultValue: 'Trusted by Investors Worldwide' }),
      investors: translate('home.trusted.investors', locale, { defaultValue: 'Active Investors' }),
      bonds: translate('home.trusted.bonds', locale, { defaultValue: 'Bonds Available' }),
      volume: translate('home.trusted.volume', locale, { defaultValue: 'Trading Volume' }),
    },
    testimonials: {
      title: translate('home.testimonials.title', locale, { defaultValue: 'What Our Investors Say' }),
      description: translate('home.testimonials.description', locale, {
        defaultValue: 'Discover why thousands of investors trust BondFolio for their investment needs.'
      }),
    },
    performance: {
      title: translate('home.performance.title', locale, { defaultValue: 'Historical Performance' }),
      description: translate('home.performance.description', locale, {
        defaultValue: 'Our bonds consistently outperform market averages with reliable returns.'
      }),
    }
  };

  // Feature bond data
  const featuredBonds = [
    {
      id: 1,
      title: `${t.featured.bond} 1`,
      description: t.featured.description,
      yield: '5,5%',
      imageUrl: '/images/feature-bond-1.svg',
      featured: true,
      rating: 4.9
    },
    {
      id: 2,
      title: 'Státní dluhopis',
      description: 'Bezpečný státní dluhopis s ročním výnosem 4,75%. Splatnost v roce 2026.',
      yield: '4,75%',
      imageUrl: '/images/feature-bond-2.svg',
      featured: false,
      rating: 4.7
    },
    {
      id: 3,
      title: 'Diverzifikované portfolio',
      description: 'Vyvážené portfolio prémiových dluhopisů s kombinovaným výnosem 6,25%.',
      yield: '6,25%',
      imageUrl: '/images/feature-bond-3.svg',
      featured: true,
      rating: 4.8
    }
  ];

  // Testimonial data
  const testimonials = [
    {
      id: 1,
      name: 'Jan Novák',
      title: 'Individuální investor',
      image: 'https://randomuser.me/api/portraits/men/32.jpg',
      quote: 'BondFolio kompletně změnilo moji investiční strategii. Platforma je intuitivní a nabízené dluhopisy přinášejí stabilní výnosy, které jsem jinde nenašel.'
    },
    {
      id: 2,
      name: 'Eva Marková',
      title: 'Finanční poradkyně',
      image: 'https://randomuser.me/api/portraits/women/44.jpg',
      quote: 'Doporučuji BondFolio všem svým klientům, kteří hledají stabilní příjem z investic. Výběr a kvalita nabízených dluhopisů jsou na českém trhu bezkonkurenční.'
    },
    {
      id: 3,
      name: 'Tomáš Svoboda',
      title: 'Portfolio manažer',
      image: 'https://randomuser.me/api/portraits/men/67.jpg',
      quote: 'BondFolio nabízí rozmanité investiční možnosti s transparentními informacemi. Ideální platforma jak pro začátečníky, tak pro zkušené investory s vysokými nároky.'
    },
    {
      id: 4,
      name: 'Petra Dvořáková',
      title: 'Začínající investorka',
      image: 'https://randomuser.me/api/portraits/women/65.jpg',
      quote: 'Díky vzdělávacím materiálům BondFolio jsem se rychle zorientovala ve světě dluhopisů. Oceňuji osobní přístup, jasné informace a profesionální podporu.'
    },
    {
      id: 5,
      name: 'Martin Král',
      title: 'Podnikatel',
      image: 'https://randomuser.me/api/portraits/men/45.jpg',
      quote: 'Jako podnikatel hledám stabilní a bezpečné zhodnocení svých prostředků. BondFolio mi umožnilo diverzifikovat portfolio a získat cenné kontakty v investiční komunitě.'
    }
  ];

  return (
    <main className="flex min-h-screen flex-col items-center">
      {/* Hero Section */}
      <section className="hero-section w-full animated-gold-bg">
        <div className="absolute inset-0 bg-hero-pattern bg-no-repeat bg-right-top z-0 opacity-50"></div>
        <div className="absolute top-20 left-10 w-32 h-32 blob blob-primary animate-float-slow"></div>
        <div className="absolute bottom-40 right-10 w-24 h-24 blob blob-secondary animate-float"></div>

        <div className="container-custom relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <span className="inline-block px-4 py-2 rounded-full bg-primary-100 text-primary-700 font-medium text-sm mb-6">
                {translate('home.hero.tagline', locale, { defaultValue: 'Safe Bond Investments' })}
              </span>
              <h1 className="mb-6 flex flex-col items-start">
                <div className="flex items-center text-5xl md:text-6xl font-extrabold">
                  <span className="text-white mr-0">Bond</span>
                  <span className="text-primary-500">Folio</span>
                </div>
                <div className="h-1.5 w-40 bg-gradient-to-r from-primary-500 to-primary-500 mt-3 rounded-full"></div>
              </h1>
              <p className="text-2xl text-neutral-700 dark:text-neutral-300 mb-8 max-w-xl font-semibold">
                {translate('home.hero.intro', locale, { defaultValue: 'Invest safely and with confidence. BondFolio connects verified partners, strong community and advanced security. Your investments are protected, transparent and supported by education. Join the platform where trust, security and community form the foundation of your investment success.' })}
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href={`/${locale}/auth/register`} className="btn-gold-effect btn-lg">
                  {t.hero.register}
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </Link>
                <Link href={`/${locale}/listings`} className="btn-outline btn-lg">
                  {t.hero.viewListings}
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 mt-12">
                <div className="text-center p-4 bg-white dark:bg-neutral-800 rounded-xl shadow-gold-soft luxury-card">
                  <div className="luxury-card-content">
                    <p className="text-3xl font-bold text-gradient-primary">5000+</p>
                    <p className="text-neutral-500">{t.trusted.investors}</p>
                  </div>
                </div>
                <div className="text-center p-4 bg-white dark:bg-neutral-800 rounded-xl shadow-gold-soft luxury-card">
                  <div className="luxury-card-content">
                    <p className="text-3xl font-bold text-gradient-primary">250+</p>
                    <p className="text-neutral-500">{t.trusted.bonds}</p>
                  </div>
                </div>
                <div className="text-center p-4 bg-white dark:bg-neutral-800 rounded-xl shadow-gold-soft luxury-card">
                  <div className="luxury-card-content">
                    <p className="text-3xl font-bold text-gradient-primary">$100M+</p>
                    <p className="text-neutral-500">{t.trusted.volume}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="hidden lg:flex justify-center">
              <div className="relative animate-float-slow">
                <div className="absolute -left-6 -top-6 w-32 h-32 bg-primary-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse-slow"></div>
                <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-primary-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse-slow"></div>
                <Image
                  src="/images/bond-illustration-3d.svg"
                  alt="Bond Investment Illustration"
                  width={600}
                  height={400}
                  className="rounded-2xl shadow-raised z-10 relative card-3d"
                  priority
                />
              </div>
            </div>
          </div>
        </div>

        {/* Wave pattern divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <div className="relative h-16">
            <Image
              src="/images/wave-pattern.svg"
              alt="Wave pattern"
              fill
              style={{ objectFit: 'cover' }}
            />
          </div>
        </div>
      </section>

      {/* Proč BondFolio Section */}
      <section className="section w-full bg-neutral-50 dark:bg-neutral-800 relative overflow-hidden">
        <div className="container-custom relative z-10 py-16">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="inline-block px-3 py-1 rounded-full bg-primary-100 text-primary-700 font-medium text-xs mb-3">
              PROČ BONDFOLIO?
            </span>
            <h2 className="mb-4 text-gradient-primary text-3xl md:text-4xl font-bold">Proč si vybrat BondFolio?</h2>
            <p className="text-lg text-neutral-600 dark:text-neutral-400">
              Naše platforma staví na důvěře, bezpečnosti a transparentnosti. Zde jsou hlavní důvody, proč investoři volí právě nás:
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center bg-white dark:bg-neutral-900 rounded-2xl shadow-soft p-8">
              <div className="w-16 h-16 mb-4 flex items-center justify-center bg-primary-100 dark:bg-primary-900/30 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8 text-primary-600">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0-2.21 1.79-4 4-4s4 1.79 4 4-1.79 4-4 4-4-1.79-4-4zm0 0c0-2.21-1.79-4-4-4s-4 1.79-4 4 1.79 4 4 4 4-1.79 4-4zm0 0v8" />
                </svg>
              </div>
              <h3 className="font-bold text-lg mb-2">Maximální bezpečnost</h3>
              <p className="text-neutral-600 dark:text-neutral-400 text-center">
                Všechny investice jsou chráněny moderními bezpečnostními standardy a pečlivě prověřovány našimi experty.
              </p>
            </div>
            <div className="flex flex-col items-center bg-white dark:bg-neutral-900 rounded-2xl shadow-soft p-8">
              <div className="w-16 h-16 mb-4 flex items-center justify-center bg-primary-100 dark:bg-primary-900/30 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8 text-primary-600">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a5 5 0 00-10 0v2a2 2 0 00-2 2v7a2 2 0 002 2h10a2 2 0 002-2v-7a2 2 0 00-2-2z" />
                </svg>
              </div>
              <h3 className="font-bold text-lg mb-2">Transparentnost a férovost</h3>
              <p className="text-neutral-600 dark:text-neutral-400 text-center">
                Žádné skryté poplatky, jasné podmínky a otevřená komunikace. Vše je vždy přehledné a srozumitelné.
              </p>
            </div>
            <div className="flex flex-col items-center bg-white dark:bg-neutral-900 rounded-2xl shadow-soft p-8">
              <div className="w-16 h-16 mb-4 flex items-center justify-center bg-primary-100 dark:bg-primary-900/30 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8 text-primary-600">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c1.657 0 3 1.343 3 3 0 1.657-1.343 3-3 3s-3-1.343-3-3c0-1.657 1.343-3 3-3zm0 0V4m0 7v9" />
                </svg>
              </div>
              <h3 className="font-bold text-lg mb-2">Komunita a podpora</h3>
              <p className="text-neutral-600 dark:text-neutral-400 text-center">
                Silná komunita investorů, vzdělávací materiály a osobní podpora – vždy se máte na koho obrátit.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Listings Section */}
      <section className="section w-full bg-white dark:bg-neutral-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-mesh opacity-40"></div>
        <div className="absolute left-0 bottom-0 w-64 h-64 blob blob-primary opacity-20"></div>
        <div className="absolute right-0 top-20 w-48 h-48 blob blob-secondary opacity-20"></div>

        <div className="container-custom relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="inline-block px-3 py-1 rounded-full bg-primary-100 text-primary-700 font-medium text-xs mb-3">
              NEJLEPŠÍ PŘÍLEŽITOSTI
            </span>
            <h2 className="mb-4 text-gradient-primary">{t.featured.title}</h2>
            <p className="text-lg text-neutral-600 dark:text-neutral-400">
              Prozkoumejte náš pečlivě vybraný výběr vysoce výkonných dluhopisů s konkurenceschopnými výnosy a různými profily rizika.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredBonds.map((bond) => (
              <div key={bond.id} className="card card-3d animate-slide-up">
                <div className="bg-gradient-to-br from-white to-neutral-50 dark:from-neutral-800 dark:to-neutral-900 w-full h-56 flex items-center justify-center overflow-hidden relative"> {/* Ponecháno neutrální pozadí karty */}
                  <Image
                    src={bond.imageUrl}
                    alt={bond.title}
                    width={400}
                    height={250}
                    className="w-full h-auto object-cover"
                  />
                  {bond.featured && (
                    <div className="absolute top-4 right-4 bg-primary-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                      DOPORUČENO
                    </div>
                  )}
                </div>
                <div className="card-body">
                  <div className="flex justify-between items-center mb-2">
                    <span className="badge badge-primary">Prémiový dluhopis</span>
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#facc15" className="w-4 h-4 mr-1">
                        <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.006Z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm text-neutral-600">{bond.rating}</span>
                    </div>
                  </div>
                  <h3 className="card-title">{bond.title}</h3>
                  <p className="card-subtitle text-neutral-600 dark:text-neutral-400">
                    {bond.description}
                  </p>
                  <div className="flex justify-between items-center mt-6">
                    <div className="bg-gradient-to-r from-primary-50 to-primary-50 dark:from-primary-900/20 dark:to-primary-900/20 rounded-full px-4 py-2"> {/* Změněno na primary */}
                      <span className="text-xl font-bold text-gradient-primary">{bond.yield} {t.featured.yield}</span>
                    </div>
                    <Link href={`/${locale}/listings/${bond.id}`} className="btn-primary btn-sm">
                      {t.featured.viewDetails}
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link href={`/${locale}/listings`} className="btn-outline">
              <span className="mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </span>
              {t.featured.viewAll}
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="section w-full bg-neutral-50 dark:bg-neutral-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-30"></div>
        <div className="absolute top-20 right-10 w-40 h-40 blob blob-primary opacity-20 animate-float-slow"></div>
        <div className="absolute bottom-20 left-10 w-48 h-48 blob blob-secondary opacity-20 animate-float"></div>

        <div className="container-custom relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block px-3 py-1 rounded-full bg-primary-100 text-primary-700 font-medium text-xs mb-3">
              JEDNODUCHÉ & PŘÍMOČARÉ
            </span>
            <h2 className="mb-4 text-gradient-primary">{t.howItWorks.title}</h2>
            <p className="text-lg text-neutral-600 dark:text-neutral-400">
              Začít s BondFolio je snadné. Postupujte podle těchto jednoduchých kroků a zahajte svou investiční cestu.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {/* Card 1 */}
            <div className="flex flex-col items-center text-center p-8 bg-white dark:bg-neutral-900 rounded-2xl shadow-soft card-3d">
              <div className="w-20 h-20 mb-6 relative">
                <div className="absolute inset-0 bg-amber-50 dark:bg-amber-900/20 rounded-full -m-2"></div>
                <Image
                  src="/images/icon-browse-gold.svg"
                  alt="Browse Listings Icon"
                  width={80}
                  height={80}
                  className="relative z-10 animate-float-slow"
                />
              </div>
              <div className="relative mb-6">
                <div className="absolute -top-10 -left-10 text-8xl font-bold text-amber-200 dark:text-amber-900 opacity-40">1</div>
                <h3 className="text-xl font-bold relative z-10">{t.howItWorks.step1.title}</h3>
              </div>
              <p className="text-neutral-600 dark:text-neutral-400">
                {t.howItWorks.step1.description}
              </p>
              <div className="mt-6 w-full border-t border-neutral-100 dark:border-neutral-700 pt-4">
                <div className="flex flex-wrap gap-2">
                  <Link href={`/${locale}/listings`} className="btn-outline btn-sm">
                    Procházet nabídky
                  </Link>
                  <Link href={`/${locale}/calculator`} className="btn-outline btn-sm">
                    {translate('calculator.shortTitle', locale, { defaultValue: 'Kalkulačka výnosů' })}
                  </Link>
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="flex flex-col items-center text-center p-8 bg-white dark:bg-neutral-900 rounded-2xl shadow-soft card-3d md:translate-y-4">
              <div className="w-20 h-20 mb-6 relative">
                <div className="absolute inset-0 bg-amber-50 dark:bg-amber-900/20 rounded-full -m-2"></div>
                <Image
                  src="/images/icon-select-gold.svg"
                  alt="Select Investment Icon"
                  width={80}
                  height={80}
                  className="relative z-10 animate-float"
                />
              </div>
              <div className="relative mb-6">
                <div className="absolute -top-10 -left-10 text-8xl font-bold text-amber-200 dark:text-amber-900 opacity-40">2</div>
                <h3 className="text-xl font-bold relative z-10">{t.howItWorks.step2.title}</h3>
              </div>
              <p className="text-neutral-600 dark:text-neutral-400">
                {t.howItWorks.step2.description}
              </p>
              <div className="mt-6 w-full border-t border-neutral-100 dark:border-neutral-700 pt-4">
                <Link href={`/${locale}/listings`} className="btn-outline btn-sm border-secondary-500 text-secondary-600 hover:bg-secondary-50 hover:text-secondary-700 dark:border-secondary-700 dark:text-secondary-400 dark:hover:bg-secondary-900/30 dark:hover:text-secondary-300">
                  Prozkoumat možnosti
                </Link>
              </div>
            </div>

            {/* Card 3 */}
            <div className="flex flex-col items-center text-center p-8 bg-white dark:bg-neutral-900 rounded-2xl shadow-soft card-3d">
              <div className="w-20 h-20 mb-6 relative">
                <div className="absolute inset-0 bg-amber-50 dark:bg-amber-900/20 rounded-full -m-2"></div>
                <Image
                  src="/images/icon-purchase-gold.svg"
                  alt="Complete Purchase Icon"
                  width={80}
                  height={80}
                  className="relative z-10 animate-float-fast"
                />
              </div>
              <div className="relative mb-6">
                <div className="absolute -top-10 -left-10 text-8xl font-bold text-amber-200 dark:text-amber-900 opacity-40">3</div>
                <h3 className="text-xl font-bold relative z-10">{t.howItWorks.step3.title}</h3>
              </div>
              <p className="text-neutral-600 dark:text-neutral-400">
                {t.howItWorks.step3.description}
              </p>
              <div className="mt-6 w-full border-t border-neutral-100 dark:border-neutral-700 pt-4">
                <Link href={`/${locale}/auth/register`} className="btn-outline btn-sm">
                  Vytvořit účet
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Performance Section */}
      <section className="section w-full bg-white dark:bg-neutral-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-mesh opacity-30"></div>

        <div className="container-custom relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <div className="glass rounded-2xl shadow-raised overflow-hidden">
                <Image
                  src="/images/chart-illustration.svg"
                  alt="Bond Performance Chart"
                  width={600}
                  height={400}
                  className="w-full h-auto"
                />
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <span className="inline-block px-3 py-1 rounded-full bg-primary-100 text-primary-700 font-medium text-xs mb-3"> {/* Změněno na primary */}
                INVESTICE ZALOŽENÉ NA DATECH
              </span>
              <h2 className="mb-6 text-gradient-primary">{t.performance.title}</h2>
              <p className="text-lg text-neutral-600 dark:text-neutral-400 mb-8">
                {t.performance.description}
              </p>

              <div className="space-y-4">
                <div className="bg-neutral-50 dark:bg-neutral-800 p-4 rounded-xl">
                  <div className="flex items-center">
                    <div className="w-12 h-12 flex items-center justify-center bg-primary-100 dark:bg-primary-900/30 rounded-full mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-primary-600">
                        <path d="M18.375 2.25c-1.035 0-1.875.84-1.875 1.875v15.75c0 1.035.84 1.875 1.875 1.875h.75c1.035 0 1.875-.84 1.875-1.875V4.125c0-1.036-.84-1.875-1.875-1.875h-.75ZM9.75 8.625c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-.75a1.875 1.875 0 0 1-1.875-1.875V8.625ZM3 13.125c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v6.75c0 1.035-.84 1.875-1.875 1.875h-.75A1.875 1.875 0 0 1 3 19.875v-6.75Z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold">Konzistentní výkonnost</h3>
                      <p className="text-neutral-600 dark:text-neutral-400">5letý průměrný výnos 5,2% překonávající tržní indexy</p>
                    </div>
                  </div>
                </div>

                <div className="bg-neutral-50 dark:bg-neutral-800 p-4 rounded-xl">
                  <div className="flex items-center">
                    <div className="w-12 h-12 flex items-center justify-center bg-secondary-100 dark:bg-secondary-900/30 rounded-full mr-4"> {/* Ponecháno secondary (modrá) */}
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-secondary-600"> {/* Ponecháno secondary (modrá) */}
                        <path fillRule="evenodd" d="M12.516 2.17a.75.75 0 0 0-1.032 0 11.209 11.209 0 0 1-7.877 3.08.75.75 0 0 0-.722.515A12.74 12.74 0 0 0 2.25 9.75c0 5.942 4.064 10.933 9.563 12.348a.75.75 0 0 0 .374 0c5.499-1.415 9.563-6.406 9.563-12.348 0-1.39-.223-2.73-.635-3.985a.75.75 0 0 0-.722-.516l-.143.001c-2.996 0-5.717-1.17-7.734-3.08Zm3.094 8.016a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold">Řízení rizik</h3>
                      <p className="text-neutral-600 dark:text-neutral-400">Nižší volatilita s pečlivě prověřenými investičními možnostmi</p>
                    </div>
                  </div>
                </div>

                <div className="bg-neutral-50 dark:bg-neutral-800 p-4 rounded-xl">
                  <div className="flex items-center">
                    <div className="w-12 h-12 flex items-center justify-center bg-primary-100 dark:bg-primary-900/30 rounded-full mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-primary-600">
                        <path fillRule="evenodd" d="M2.25 13.5a8.25 8.25 0 0 1 8.25-8.25.75.75 0 0 1 .75.75v6.75H18a.75.75 0 0 1 .75.75 8.25 8.25 0 0 1-16.5 0Z" clipRule="evenodd" />
                        <path fillRule="evenodd" d="M12.75 3a.75.75 0 0 1 .75-.75 8.25 8.25 0 0 1 8.25 8.25.75.75 0 0 1-.75.75h-7.5a.75.75 0 0 1-.75-.75V3Z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold">Diverzifikace</h3>
                      <p className="text-neutral-600 dark:text-neutral-400">Přístup k různým typům dluhopisů napříč odvětvími a regiony</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="section w-full bg-neutral-50 dark:bg-neutral-800 relative overflow-hidden py-16">
        <div className="absolute inset-0 opacity-70">
          <Image
            src="/images/testimonial-bg.svg"
            alt="Pozadí recenzí"
            fill
            style={{ objectFit: 'cover' }}
          />
        </div>

        <div className="container-custom relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block px-4 py-1 rounded-full bg-gradient-gold text-white font-medium text-xs mb-3 shadow-gold-soft animate-gold-pulse">
              REFERENCE KLIENTŮ
            </span>
            <h2 className="mb-4 text-gradient-primary text-3xl md:text-4xl font-bold">{t.testimonials.title}</h2>
            <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
              {t.testimonials.description}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="card card-3d h-full shimmer-card shadow-gold-soft luxury-card transform transition-all duration-300 hover:-translate-y-2">
                <div className="luxury-card-content">
                  <div className="card-body flex flex-col h-full p-8">
                    <div className="mb-6">
                      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="url(#gold-gradient)" opacity="0.5">
                        <defs>
                          <linearGradient id="gold-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#ffc940" />
                            <stop offset="100%" stopColor="#b18b27" />
                          </linearGradient>
                        </defs>
                        <path d="M9.983 3v7.391c0 5.704-3.731 9.57-8.983 10.609l-.995-2.151c2.432-.917 3.995-3.638 3.995-5.849h-4v-10h9.983zm14.017 0v7.391c0 5.704-3.748 9.571-9 10.609l-.996-2.151c2.433-.917 3.996-3.638 3.996-5.849h-3.983v-10h9.983z"/>
                      </svg>
                    </div>
                    <p className="text-neutral-700 dark:text-neutral-300 mb-6 flex-grow text-lg leading-relaxed">
                      „{testimonial.quote}“
                    </p>
                    <div className="flex items-center pt-4 border-t border-primary-100 dark:border-primary-800/30">
                      <div className="w-14 h-14 rounded-full overflow-hidden mr-4 border-2 border-primary-100 dark:border-primary-800/50 shadow-gold-soft">
                        <Image
                          src={testimonial.image}
                          alt={testimonial.name}
                          width={56}
                          height={56}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="font-bold text-lg gold-gradient-text">{testimonial.name}</h4>
                        <p className="text-sm text-neutral-500">{testimonial.title}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Awards and Recognition Section */}
      <section className="section w-full bg-neutral-50 dark:bg-neutral-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-20"></div>

        <div className="container-custom relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block px-3 py-1 rounded-full bg-primary-100 text-primary-700 font-medium text-xs mb-3"> {/* Změněno na primary */}
              OCENĚNÁ PLATFORMA
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gradient-primary">Uznání a ocenění</h2>
            <p className="text-lg text-neutral-600 dark:text-neutral-400">
              BondFolio získalo řadu ocenění za své inovativní řešení a kvalitní služby v oblasti investic do dluhopisů.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-white dark:bg-neutral-700 rounded-full p-4 shadow-gold-soft mb-6 relative overflow-hidden group gold-shimmer">
                <div className="absolute inset-0 bg-gradient-gold opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center animate-gold-pulse">
                  <span className="text-white font-bold text-xl">2024</span>
                </div>
                <svg className="w-full h-full text-primary-600 dark:text-primary-300 group-hover:text-white relative z-10" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path fillRule="evenodd" d="M5.166 2.621v.858c-1.035.148-2.059.33-3.071.543a.75.75 0 0 0-.584.859 6.753 6.753 0 0 0 6.138 5.6 6.73 6.73 0 0 0 2.743 1.346A6.707 6.707 0 0 1 9.279 15H8.54c-1.036 0-1.875.84-1.875 1.875V19.5h-.75a2.25 2.25 0 0 0-2.25 2.25c0 .414.336.75.75.75h15a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-2.25-2.25h-.75v-2.625c0-1.036-.84-1.875-1.875-1.875h-.739a6.706 6.706 0 0 1-1.112-3.173 6.73 6.73 0 0 0 2.743-1.347 6.753 6.753 0 0 0 6.139-5.6.75.75 0 0 0-.585-.858 47.077 47.077 0 0 0-3.07-.543V2.62a.75.75 0 0 0-.658-.744 49.22 49.22 0 0 0-6.093-.377c-2.063 0-4.096.128-6.093.377a.75.75 0 0 0-.657.744Zm0 2.629c0 1.196.312 2.32.857 3.294A5.266 5.266 0 0 1 3.16 5.337a45.6 45.6 0 0 1 2.006-.343v.256Zm13.5 0v-.256c.674.1 1.343.214 2.006.343a5.265 5.265 0 0 1-2.863 3.207 6.72 6.72 0 0 0 .857-3.294Z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-lg font-bold mb-2 text-center text-gradient-primary">Finanční inovace roku</h3>
              <p className="text-neutral-600 dark:text-neutral-400 text-center text-sm">FinTech Awards</p>
              <p className="text-neutral-500 dark:text-neutral-400 text-center text-xs mt-1">Za unikátní technologické řešení a digitalizaci investic do dluhopisů.</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-white dark:bg-neutral-700 rounded-full p-4 shadow-soft mb-6 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-primary-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"> {/* Změněno na primary */}
                  <span className="text-white font-bold text-xl">2023</span>
                </div>
                <svg className="w-full h-full text-primary-600 dark:text-primary-300 group-hover:text-white relative z-10" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold mb-2 text-center">Nejoblíbenější investiční platforma</h3>
              <p className="text-neutral-600 dark:text-neutral-400 text-center text-sm">Investiční asociace ČR</p>
              <p className="text-neutral-500 dark:text-neutral-400 text-center text-xs mt-1">Na základě hlasování investorů a pozitivní zpětné vazby uživatelů.</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-white dark:bg-neutral-700 rounded-full p-4 shadow-soft mb-6 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-primary-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"> {/* Změněno na primary */}
                  <span className="text-white font-bold text-xl">2023</span>
                </div>
                <svg className="w-full h-full text-primary-600 dark:text-primary-300 group-hover:text-white relative z-10" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 0 1 .67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 1 1-.671-1.34l.041-.022ZM12 9a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-lg font-bold mb-2 text-center">Nejbezpečnější finanční platforma</h3>
              <p className="text-neutral-600 dark:text-neutral-400 text-center text-sm">CyberSec Awards</p>
              <p className="text-neutral-500 dark:text-neutral-400 text-center text-xs mt-1">Za implementaci pokročilých bezpečnostních standardů a ochranu dat klientů.</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-white dark:bg-neutral-700 rounded-full p-4 shadow-soft mb-6 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-primary-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"> {/* Změněno na primary */}
                  <span className="text-white font-bold text-xl">2022</span>
                </div>
                <svg className="w-full h-full text-primary-600 dark:text-primary-300 group-hover:text-white relative z-10" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-lg font-bold mb-2 text-center">Investiční služba roku</h3>
              <p className="text-neutral-600 dark:text-neutral-400 text-center text-sm">Finance Awards Europe</p>
              <p className="text-neutral-500 dark:text-neutral-400 text-center text-xs mt-1">Za komplexní služby a podporu investorů v oblasti dluhopisů.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section w-full bg-white dark:bg-neutral-900 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-12 bg-gradient-to-r from-primary-500/10 to-primary-500/10"></div> {/* Změněno na primary */}
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-mesh opacity-20 rounded-full -mb-40 -mr-40"></div> {/* Gradient mesh zůstává (obsahuje primary) */}

        <div className="container-custom relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="relative">
              <div className="absolute -left-8 -top-8 w-72 h-72 bg-primary-100 dark:bg-primary-900/20 rounded-full opacity-30 animate-pulse-slow"></div>
              <div className="relative bg-white dark:bg-neutral-800 rounded-2xl p-6 shadow-raised card-3d">
                <div className="absolute -right-6 -bottom-6 w-48 h-48 bg-primary-100 dark:bg-primary-900/20 rounded-full opacity-30 animate-pulse-slow"></div> {/* Změněno na primary */}
                <div className="relative animate-float">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary-500 to-primary-500 flex items-center justify-center text-white text-xl font-bold mr-4">B</div> {/* Změněno na primary */}
                      <div>
                        <h3 className="font-bold text-lg">BondFolio Premium</h3>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">Exkluzivní nabídky, žádné poplatky</p>
                      </div>
                    </div>
                    <div className="bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-300 font-bold px-3 py-1 rounded-full text-sm">
                      NOVÉ
                    </div>
                  </div>

                  <div className="mb-8">
                    <div className="text-4xl font-bold mb-2 text-gradient-primary">0 Kč <span className="text-lg font-normal text-neutral-500">/ měsíc</span></div>
                    <p className="text-neutral-500 dark:text-neutral-400">Při objemu investic nad 100 000 Kč</p>
                  </div>

                  <div className="space-y-4 mb-8">
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-success-500 mr-3">
                        <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" />
                      </svg>
                      <span>Přístup k prémiové nabídce bondů</span>
                    </div>
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-success-500 mr-3">
                        <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" />
                      </svg>
                      <span>Žádné transakční poplatky</span>
                    </div>
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-success-500 mr-3">
                        <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" />
                      </svg>
                      <span>Prioritní přístup k novým emisím</span>
                    </div>
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-success-500 mr-3">
                        <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" />
                      </svg>
                      <span>Osobní investiční konzultace</span>
                    </div>
                  </div>

                  <Link href={`/${locale}/auth/register`} className="btn-primary w-full flex items-center justify-center">
                    Začít investovat
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 ml-2">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </Link>
                </div>
              </div>
            </div>

            <div>
              <span className="inline-block px-3 py-1 rounded-full bg-primary-100 text-primary-700 font-medium text-xs mb-3">
                EXKLUZIVNÍ NABÍDKA
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gradient-primary">Investujte jako profesionál už dnes</h2>
              <p className="text-lg text-neutral-700 dark:text-neutral-300 mb-8 leading-relaxed">
                Připojte se k tisícům investorů, kteří využívají naši platformu pro svoje investice do dluhopisů. Získejte přístup k exkluzivním nabídkám a staňte se součástí BondFolio komunity.
              </p>

              <div className="space-y-6 mb-8">
                <div className="flex items-start">
                  <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center text-primary-600 dark:text-primary-400 mt-1 mr-4 flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                      <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 0 0-5.25 5.25v3a3 3 0 0 0-3 3v6.75a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3v-6.75a3 3 0 0 0-3-3v-3c0-2.9-2.35-5.25-5.25-5.25Zm3.75 8.25v-3a3.75 3.75 0 1 0-7.5 0v3h7.5Z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2">Ověřené a bezpečné investice</h3>
                    <p className="text-neutral-600 dark:text-neutral-400">
                      Všechny nabídky jsou pečlivě prověřeny našimi finančními experty. Investujete pouze do ověřených a důvěryhodných bondů.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center text-primary-600 dark:text-primary-400 mt-1 mr-4 flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                      <path d="M4.5 3.75a3 3 0 0 0-3 3v.75h21v-.75a3 3 0 0 0-3-3h-15Z" />
                      <path fillRule="evenodd" d="M22.5 9.75h-21v7.5a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3v-7.5Zm-18 3.75a.75.75 0 0 1 .75-.75h6a.75.75 0 0 1 0 1.5h-6a.75.75 0 0 1-.75-.75Zm.75 2.25a.75.75 0 0 0 0 1.5h3a.75.75 0 0 0 0-1.5h-3Z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2">Transparentní podmínky</h3>
                    <p className="text-neutral-600 dark:text-neutral-400">
                      Všechny poplatky a podmínky jsou jasně uvedené. Bez skrytých nákladů, bez nečekaných překvapení.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center text-primary-600 dark:text-primary-400 mt-1 mr-4 flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                      <path d="M10.464 8.746c.227-.18.497-.311.786-.394v2.795a2.252 2.252 0 0 1-.786-.393c-.394-.313-.546-.681-.546-1.004 0-.323.152-.691.546-1.004ZM12.75 15.662v-2.824c.347.085.664.228.921.421.427.32.579.686.579.991 0 .305-.152.671-.579.991a2.534 2.534 0 0 1-.921.42Z" />
                      <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 6a.75.75 0 0 0-1.5 0v.816a3.836 3.836 0 0 0-1.72.756c-.712.566-1.112 1.35-1.112 2.178 0 .829.4 1.612 1.113 2.178.502.4 1.102.647 1.719.756v2.978a2.536 2.536 0 0 1-.921-.421l-.879-.66a.75.75 0 0 0-.9 1.2l.879.66c.533.4 1.169.645 1.821.75V18a.75.75 0 0 0 1.5 0v-.81a3.833 3.833 0 0 0 1.72-.756c.712-.566 1.112-1.35 1.112-2.178 0-.829-.4-1.612-1.113-2.178a3.833 3.833 0 0 0-1.719-.756V8.334c.345.085.664.228.921.421l.879.66a.75.75 0 1 0 .9-1.2l-.879-.66a2.536 2.536 0 0 0-1.821-.75V6Z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2">Konkurenční výnosy</h3>
                    <p className="text-neutral-600 dark:text-neutral-400">
                      Nabízíme atraktivní investiční příležitosti s výnosy nad průměrem trhu, při zachování rozumné míry rizika.
                    </p>
                  </div>
                </div>
              </div>

              <Link href={`/${locale}/listings`} className="btn-outline btn-lg inline-flex items-center">
                Prozkoumat aktuální nabídky
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 ml-2">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="section w-full bg-gradient-gold-vertical text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="absolute top-0 left-0 w-64 h-64 rounded-full bg-white opacity-10 blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-white opacity-10 blur-3xl"></div>

        <div className="container-custom relative z-10">
          <div className="glass rounded-2xl p-10 md:p-16 max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <span className="inline-block px-3 py-1 rounded-full bg-white/20 text-white font-medium text-xs mb-3">
                STAY INFORMED
              </span>
              <h2 className="text-white mb-4">{t.newsletter.title}</h2>
              <p className="text-white/80 text-lg max-w-2xl mx-auto">
                {t.newsletter.description}
              </p>
            </div>

            <form className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
              <input
                type="email"
                placeholder={t.newsletter.placeholder}
                className="input-field flex-grow bg-white/10 border-white/20 text-white placeholder-white/60 focus:bg-white/20"
                required
              />
              <button type="submit" className="btn-lg bg-white text-gradient-primary hover:bg-white/90 font-bold whitespace-nowrap shadow-gold gold-shimmer">
                <span className="mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary-600">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </span>
                {t.newsletter.button}
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  )
}
