import { Inter } from 'next/font/google'
import { notFound } from 'next/navigation'
import { SessionProvider } from '@/components/SessionProvider'
import { TranslationProvider } from '@/components/TranslationProvider'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import BondForm from '@/components/BondForm'
import '../globals.css'
import { locales } from '@/middleware'
import { getPageMetadata } from '@/lib/i18n'

// Klientský kód pro ovládání modálních oken
import Script from 'next/script'

const inter = Inter({ subsets: ['latin'] })

// Dynamicky generuje metadata podle aktuálního locale
export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  // Validace lokalizace
  if (!locales.includes(locale)) return notFound()

  return getPageMetadata(locale)
}

export default function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  // Validace lokalizace
  if (!locales.includes(locale)) {
    return notFound()
  }

  return (
    <html lang={locale} className="h-full">
      <body className={inter.className}>
        <SessionProvider>
          <TranslationProvider locale={locale}>
            <div className="flex min-h-screen flex-col">
              <Header />
              <main className="flex-grow min-h-[calc(100vh-140px)]">
                {children}
              </main>
              <Footer />

              {/* Formulář pro přidání dluhopisu */}
              <BondForm />

              {/* Klientský skript pro modální okna */}
              <Script id="modal-handlers" strategy="afterInteractive">
                {`
                  document.addEventListener('click', function(e) {
                    // Najdi nejbližší element s atributem data-bond-modal-trigger
                    let target = e.target;
                    let modalTrigger = null;

                    while (target && target !== document) {
                      if (target.hasAttribute && target.hasAttribute('data-bond-modal-trigger')) {
                        modalTrigger = target;
                        break;
                      }
                      target = target.parentNode;
                    }

                    if (modalTrigger) {
                      e.preventDefault();
                      const modal = document.getElementById('bond-modal');
                      if (modal) {
                        modal.showModal();
                      }
                    }
                  });
                `}
              </Script>
            </div>
          </TranslationProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
