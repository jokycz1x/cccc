import { NextRequest, NextResponse } from 'next/server';
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';

// Podporované lokalizace v aplikaci
export const locales = ['cs', 'en', 'de', 'sk', 'fr'];
export const defaultLocale = 'cs';

// Middleware se spustí pro všechny požadavky
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Vytvoř základní odpověď s bezpečnostními hlavičkami
  const response = NextResponse.next();
  
  // Vytvoření Supabase klienta s cookies pro správu autentizace
  const supabase = createMiddlewareClient({ req: request, res: response });
  
  // Obnovení session, pokud existuje - zajistí aktuální stav přihlášení
  await supabase.auth.getSession();
  
  // Přidání bezpečnostních hlaviček pro všechny požadavky
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  
  // Content-Security-Policy - přísnější nastavení pro produkci
  if (process.env.NODE_ENV === 'production') {
    response.headers.set(
      'Content-Security-Policy',
      "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://*.supabase.co https://*.vercel.app; connect-src 'self' https://*.supabase.co https://*.vercel.app;"
    );
  }
  
  // Vynechání cest, které nepotřebují lokalizaci
  if (
    pathname.startsWith('/_next') || 
    pathname.startsWith('/api') || 
    pathname.startsWith('/static') ||
    pathname.includes('.') // Pro statické soubory jako favicon.ico, SVG, atd.
  ) {
    return response;
  }

  // DŮLEŽITÉ: Nikdy nepřesměrovávat root path (/), protože to způsobuje smyčku
  // Root path je obsluhován klientským JavaScriptem, který provede přesměrování
  if (pathname === '/') {
    return response;
  }

  // Kontrola, zda URL již obsahuje lokalizaci
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) return response;

  // Pro ostatní cesty použij výchozí lokalizaci
  const locale = defaultLocale;
  
  // Pro slash na konci cesty
  const path = pathname;
  
  // Přesměrovat na lokalizovanou verzi
  return NextResponse.redirect(new URL(`/${locale}${path}`, request.url));
}

// Nakonfiguruj, které cesty by měly být zpracovány middlewarem
export const config = {
  matcher: [
    // Vynechej statické assety a API cesty
    '/((?!api|_next/static|_next/image|.*\\.png$|.*\\.jpg$|.*\\.svg$|.*\\.ico$).*)',
  ],
};
