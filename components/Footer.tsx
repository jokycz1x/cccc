'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslation } from './TranslationProvider';

export default function Footer() {
  const pathname = usePathname();
  const { locale, translate } = useTranslation();

  // Extract locale from pathname
  const getLocalePath = (path: string) => {
    // If path is already absolute with locale, return as is
    if (path.startsWith('/')) {
      return path;
    }
    return `/${locale}/${path}`;
  };

  return (
    <footer className="bg-neutral-900 dark:bg-neutral-950 text-white pt-16 pb-8 border-t-4 border-primary-500 relative overflow-hidden animated-gold-bg">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-8">
          {/* Brand & Description */}
          <div className="md:col-span-4 space-y-4">
            <Link href={getLocalePath('/')} className="inline-block">
              <h2 className="text-2xl font-display font-bold text-gradient-primary gold-shimmer">BondFolio</h2>
            </Link>
            <p className="text-neutral-400 dark:text-neutral-500 leading-relaxed">
              Vaše důvěryhodná platforma pro prémiové dluhopisové investice. Objevte pečlivě vybrané investiční příležitosti od ověřených finančních partnerů.
            </p>

            {/* Social Links */}
            <div className="flex space-x-4 pt-2">
              <a href="#" className="bg-gradient-gold h-10 w-10 rounded-full flex items-center justify-center transition-all duration-300 hover:shadow-gold gold-shimmer">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-white">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path>
                </svg>
              </a>
              <a href="#" className="bg-gradient-gold h-10 w-10 rounded-full flex items-center justify-center transition-all duration-300 hover:shadow-gold gold-shimmer">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-white">
                  <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"></path>
                </svg>
              </a>
              <a href="#" className="bg-gradient-gold h-10 w-10 rounded-full flex items-center justify-center transition-all duration-300 hover:shadow-gold gold-shimmer">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-white">
                  <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z"></path>
                </svg>
              </a>
              <a href="#" className="bg-gradient-gold h-10 w-10 rounded-full flex items-center justify-center transition-all duration-300 hover:shadow-gold gold-shimmer">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-white">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"></path>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-2">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-400 mb-4">
              Rychlé odkazy
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href={getLocalePath('/')} className="text-neutral-300 hover:text-white transition-colors">
                  Úvodní strana
                </Link>
              </li>
              <li>
                <Link href={getLocalePath('listings')} className="text-neutral-300 hover:text-white transition-colors">
                  Nabídky
                </Link>
              </li>
              <li>
                <Link href={getLocalePath('portfolio')} className="text-neutral-300 hover:text-white transition-colors">
                  Portfolio
                </Link>
              </li>
              <li>
                <Link href={getLocalePath('about')} className="text-neutral-300 hover:text-white transition-colors">
                  O nás
                </Link>
              </li>
              <li>
                <Link href={getLocalePath('contact')} className="text-neutral-300 hover:text-white transition-colors">
                  Kontakt
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="md:col-span-2">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-400 mb-4">
              Zdroje
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href={getLocalePath('faq')} className="text-neutral-300 hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>

              <li>
                <Link href={getLocalePath('support')} className="text-neutral-300 hover:text-white transition-colors">
                  Centrum podpory
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="md:col-span-2">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-400 mb-4">
              Právní informace
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href={getLocalePath('privacy')} className="text-neutral-300 hover:text-white transition-colors">
                  Zásady ochrany osobních údajů
                </Link>
              </li>
              <li>
                <Link href={getLocalePath('terms')} className="text-neutral-300 hover:text-white transition-colors">
                  Podmínky používání
                </Link>
              </li>
              <li>
                <Link href={getLocalePath('cookies')} className="text-neutral-300 hover:text-white transition-colors">
                  Zásady používání cookies
                </Link>
              </li>
              <li>
                <Link href={getLocalePath('disclaimer')} className="text-neutral-300 hover:text-white transition-colors">
                  Právní upozornění
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="md:col-span-2">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-400 mb-4">
              Newsletter
            </h3>
            <p className="text-neutral-400 dark:text-neutral-500 text-sm mb-4">
              Přihlaste se k odběru našeho newsletteru pro nejnovější investiční příležitosti a přehled trhu.
            </p>
            <form className="space-y-2">
              <input
                type="email"
                name="email-address"
                id="footer-email"
                autoComplete="email"
                required
                className="w-full min-w-0 appearance-none rounded-lg border border-neutral-700 bg-neutral-800 px-4 py-2 text-sm text-neutral-300 placeholder-neutral-500 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                placeholder="Zadejte svůj e-mail"
              />
              <button
                type="submit"
                className="w-full flex items-center justify-center rounded-lg btn-gold-effect"
              >
                Odebírat
              </button>
            </form>
          </div>
        </div>

        {/* Divider */}
        <div className="gold-line pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-neutral-500 dark:text-neutral-600 mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} BondFolio. Všechna práva vyhrazena. Complete Construct, s.r.o., IČO: 19769881
            </p>

            <div className="flex space-x-6">
              <a href="#" className="text-neutral-500 hover:text-neutral-300 text-sm">
                Mapa stránek
              </a>
              <a href="#" className="text-neutral-500 hover:text-neutral-300 text-sm">
                Přístupnost
              </a>
              <a href="#" className="text-neutral-500 hover:text-neutral-300 text-sm">
                Partneři
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}