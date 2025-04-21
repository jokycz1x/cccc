'use client';

import { useState, useEffect } from 'react';
import LanguageSwitcher from './LanguageSwitcher';
import UserDropdown from './UserDropdown';
import Link from 'next/link';
// import Image from 'next/image'; // Nepoužívá se
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { useTranslation } from './TranslationProvider';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [logoAnimated, setLogoAnimated] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();
  const { locale, translate } = useTranslation();

  // Handle scroll event to add background when scrolled
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Animace loga při načtení - pouze na klientské straně
  useEffect(() => {
    // Nastavíme výchozí hodnotu na true pro server-side rendering
    // a pak ji změníme na klientské straně pro animaci
    if (typeof window !== 'undefined') {
      // Krátké zpoždění pro zajištění, že se animace spustí až po hydrataci
      const timer = setTimeout(() => {
        setLogoAnimated(true);
      }, 100); // Zvýšili jsme zpoždění pro lepší hydrataci
      return () => clearTimeout(timer);
    }
  }, []);

  const navigation = [
    { name: translate('nav.home'), href: `/${locale}` },
    { name: translate('nav.listings'), href: `/${locale}/listings` },
    { name: translate('nav.portfolio'), href: `/${locale}/portfolio` },
    { name: translate('nav.calculator'), href: `/${locale}/calculator` },
    { name: translate('nav.about'), href: `/${locale}/about` },
    { name: translate('nav.contact'), href: `/${locale}/contact` },
  ];

  const isActive = (path: string) => {
    if (path === `/${locale}` && pathname === `/${locale}`) {
      return true;
    }
    return pathname.startsWith(path) && path !== `/${locale}`;
  };

  // Použijeme výchozí hodnotu pro server-side rendering
  const headerClass = `sticky top-0 z-50 transition-all duration-300 ${
    scrolled ? 'bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md shadow-gold-soft border-b border-primary-100 dark:border-primary-900/30' : 'bg-transparent'
  }`;

  return (
    <header className={headerClass
    }>
      <nav className="container-custom" aria-label="Top">
        <div className="flex h-20 items-center justify-between">
          <div className="flex items-center">
<Link href={`/${locale}`} className="group flex items-center select-none" style={{ textDecoration: 'none' }}>
  <span
    className={`flex items-center text-3xl md:text-4xl font-extrabold leading-tight transition-all duration-700 transform
      ${typeof window !== 'undefined' ? (logoAnimated ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8') : 'opacity-100 translate-x-0'}`}
  >
    <span className="text-white mr-1">Bond</span>
    <span className="text-primary-500">Folio</span>
  </span>
</Link>
            <div className="hidden md:ml-10 md:block">
              <div className="flex space-x-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive(item.href)
                        ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300'
                        : 'text-neutral-700 hover:bg-neutral-50 dark:text-neutral-200 dark:hover:bg-neutral-800/50'
                    }`}
                    aria-current={isActive(item.href) ? 'page' : undefined}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="flex items-center space-x-4">
              <LanguageSwitcher />
              <div className="h-6 w-px bg-neutral-200 dark:bg-neutral-700" aria-hidden="true" />

              {session ? (
                <UserDropdown />
              ) : (
                <div className="flex items-center space-x-3">
                  <Link
                    href={`/${locale}/auth/login`}
                    className="btn-ghost btn-sm"
                  >
                    {translate('auth.signin')}
                  </Link>
                  <Link
                    href={`/${locale}/auth/register`}
                    className="btn-gold btn-sm"
                  >
                    {translate('auth.register')}
                  </Link>
                </div>
              )}
            </div>
          </div>
          <div className="md:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-lg p-2 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
              aria-controls="mobile-menu"
              aria-expanded={isMenuOpen}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden animate-fade-in" id="mobile-menu">
          <div className="container-custom pb-3 pt-2">
            <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
              <div className="py-3 space-y-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`block px-4 py-2 rounded-lg text-base font-medium ${
                      isActive(item.href)
                        ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300'
                        : 'text-neutral-700 hover:bg-neutral-50 dark:text-neutral-200 dark:hover:bg-neutral-800/50'
                    }`}
                    aria-current={isActive(item.href) ? 'page' : undefined}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>

              <div className="py-3 space-y-2">
                <LanguageSwitcher mobile />

                {session ? (
                  <div className="space-y-2 pt-2">
                    <div className="flex items-center space-x-2 px-4 py-2">
                      <div className="w-8 h-8 rounded-full bg-primary-200 text-primary-700 dark:bg-primary-700 dark:text-primary-200 flex items-center justify-center text-sm font-bold">
                        {session.user.name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <span className="text-neutral-700 dark:text-neutral-200 font-medium">
                        {session.user.name}
                      </span>
                    </div>

                    {/* Položky pro partnery */}
                    {session.user.role === 'partner' && (
                      <>
                        <Link
                          href={`/${locale}/dashboard`}
                          className="block w-full text-left px-4 py-2 rounded-lg text-base font-medium text-neutral-700 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-800/50"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <div className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-3 text-neutral-500 dark:text-neutral-400">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605" />
                            </svg>
                            Správa nabídek
                          </div>
                        </Link>
                        <Link
                          href={`/${locale}/dashboard/new-listing`}
                          className="block w-full text-left px-4 py-2 rounded-lg text-base font-medium text-neutral-700 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-800/50"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <div className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-3 text-neutral-500 dark:text-neutral-400">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                            </svg>
                            Přidat nabídku
                          </div>
                        </Link>
                      </>
                    )}

                    {/* Položky pro všechny uživatele */}
                    <Link
                      href={`/${locale}/portfolio`}
                      className="block w-full text-left px-4 py-2 rounded-lg text-base font-medium text-neutral-700 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-800/50"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-3 text-neutral-500 dark:text-neutral-400">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3" />
                        </svg>
                        Moje portfolio
                      </div>
                    </Link>

                    <Link
                      href={`/${locale}/profile`}
                      className="block w-full text-left px-4 py-2 rounded-lg text-base font-medium text-neutral-700 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-800/50"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-3 text-neutral-500 dark:text-neutral-400">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                        </svg>
                        Můj profil
                      </div>
                    </Link>

                    <div className="my-2 border-t border-neutral-200 dark:border-neutral-700"></div>

                    <button
                      onClick={() => {
                        signOut({ callbackUrl: `/${locale}` });
                        setIsMenuOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 rounded-lg text-base font-medium text-red-600 dark:text-red-400 hover:bg-neutral-50 dark:hover:bg-neutral-800/50"
                    >
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-3">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                        </svg>
                        {translate('auth.signout')}
                      </div>
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col space-y-2 pt-2">
                    <Link
                      href={`/${locale}/auth/login`}
                      className="block px-4 py-2 rounded-lg text-base font-medium text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {translate('auth.signin')}
                    </Link>
                    <Link
                      href={`/${locale}/auth/register`}
                      className="btn-gold"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {translate('auth.register')}
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
