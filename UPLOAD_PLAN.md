# Plán nahrání projektu BondFolio na GitHub

## Aktuální stav
- [x] Vytvořena nová větev `upload-files` na GitHub
- [x] Nahrány základní konfigurační soubory (README.md, package.json, next.config.js, tsconfig.json)
- [x] Vytvořena základní adresářová struktura (app, components, lib, public)
- [x] Zkopírovány některé klíčové soubory (app/page.tsx, app/layout.tsx, app/globals.css, components/Header.tsx, components/Footer.tsx)

## Plán dalších kroků

### 1. Nahrání adresáře app
- [x] Nahrát základní strukturu app/api
- [x] Nahrát základní strukturu app/[locale]
- [x] Nahrát app/auth
- [x] Nahrát app/dashboard
- [x] Nahrát app/listings
- [x] Nahrát app/portfolio
- [x] Nahrát ostatní soubory v app

### 2. Nahrání adresáře components
- [x] Nahrát základní komponenty (Header, Footer)
- [x] Nahrát další klíčové komponenty (BondForm, OrderForm, PortfolioBonds, SessionProvider, TranslationProvider)
- [x] Nahrát testy komponent (BondForm.test.tsx, Footer.test.tsx, Header.test.tsx)

### 3. Nahrání adresáře lib
- [x] Nahrát lib/auth.ts
- [x] Nahrát základní strukturu lib/supabase
- [x] Nahrát základní strukturu lib/i18n
- [x] Nahrát další klíčové soubory (mongodb.ts, email.ts, utils.ts)
- [x] Nahrát testy lib (auth.test.ts, i18n.test.ts, supabase.test.ts)

### 4. Nahrání adresáře public
- [x] Vytvořit základní strukturu public/assets
- [x] Vytvořit základní strukturu public/images
- [x] Vytvořit základní strukturu public/flags
- [x] Nahrát další soubory v public (flags/de.svg, flags/us.svg, assets/logo/bf-full-logo.svg, images/bond-illustration.svg)

### 5. Nahrání ostatních souborů
- [x] Nahrát základní SQL skripty
- [x] Nahrát další SQL skripty (supabase-schema.sql, create_orders_function.sql)
- [x] Nahrát konfigurační soubory (tailwind.config.js, postcss.config.js, middleware.ts)
- [x] Nahrát dokumentaci (docs/pdf-upload-solution.md, docs/supabase-migrace.md)

### 6. Finalizace
- [ ] Commitnout všechny změny
- [ ] Pushnout změny na GitHub
- [ ] Vytvořit pull request z větve `upload-files` do `main`
- [ ] Zkontrolovat, že všechny soubory byly správně nahrány
- [ ] Sloučit pull request
