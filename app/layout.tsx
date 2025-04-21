import './globals.css';
import { Inter, Playfair_Display } from 'next/font/google';
import { defaultLocale } from '@/middleware';

const inter = Inter({ subsets: ['latin'] });
const playfair = Playfair_Display({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-playfair',
});

export const metadata = {
  title: 'BondFolio',
  description: 'Vaše portfolio dluhopisů',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang={defaultLocale} className={`${playfair.variable}`}>
      <head>
        {/* Favicon */}
        <link rel="icon" href="/assets/logo/bf-favicon-gold.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/assets/logo/bf-favicon-gold.svg" />
        <link rel="mask-icon" href="/assets/logo/bf-favicon-gold.svg" color="#0f172a" />
        {/* Fallback favicon for browsers that don't support SVG */}
        <link rel="alternate icon" href="/favicon.ico" />
        
        {/* Preload gold logo */}
        <link rel="preload" href="/assets/logo/animated-header-logo-gold.svg" as="image" />
        
        {/* Font for logo */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
        
        {/* Page transitions and animations */}
        <style>{`
          .page-transition-enter {
            opacity: 0;
            transform: translateY(5px);
          }
          .page-transition-enter-active {
            opacity: 1;
            transform: translateY(0);
            transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out;
          }
          .page-transition-exit {
            opacity: 1;
            transform: translateY(0);
          }
          .page-transition-exit-active {
            opacity: 0;
            transform: translateY(5px);
            transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out;
          }
        `}</style>
      </head>
      <body className={`${inter.className} animated-gold-bg`}>
        <div className="page-transition-enter-active">
          {children}
        </div>
      </body>
    </html>
  );
}