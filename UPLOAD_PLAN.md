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
- [ ] Nahrát app/auth
- [ ] Nahrát app/dashboard
- [ ] Nahrát app/listings
- [ ] Nahrát app/portfolio
- [ ] Nahrát ostatní soubory v app

### 2. Nahrání adresáře components
- [x] Nahrát základní komponenty (Header, Footer)
- [ ] Nahrát ostatní komponenty
- [ ] Nahrát testy komponent

### 3. Nahrání adresáře lib
- [x] Nahrát lib/auth.ts
- [x] Nahrát základní strukturu lib/supabase
- [x] Nahrát základní strukturu lib/i18n
- [ ] Nahrát ostatní soubory v lib

### 4. Nahrání adresáře public
- [x] Vytvořit základní strukturu public/assets
- [x] Vytvořit základní strukturu public/images
- [x] Vytvořit základní strukturu public/flags
- [ ] Nahrát ostatní soubory v public

### 5. Nahrání ostatních souborů
- [x] Nahrát základní SQL skripty
- [ ] Nahrát další konfigurační soubory
- [ ] Nahrát dokumentaci

### 6. Finalizace
- [ ] Commitnout všechny změny
- [ ] Pushnout změny na GitHub
- [ ] Vytvořit pull request z větve `upload-files` do `main`
- [ ] Zkontrolovat, že všechny soubory byly správně nahrány
- [ ] Sloučit pull request
