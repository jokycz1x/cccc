# Migrace z MongoDB na Supabase

Tento dokument popisuje kompletní migraci aplikace BondFolio z MongoDB na Supabase.

## Provedené změny

1. **Autentizace**
   - Nahrazení MongoDB autentizace Supabase Auth
   - Integrace NextAuth.js se Supabase
   - Aktualizace strategie session a JWT tokenů

2. **Databáze**
   - Vytvoření SQL schématu v Supabase
   - Nastavení Row Level Security (RLS) politik
   - Relační model pro uživatele, dluhopisy a objednávky

3. **Souborové úložiště**
   - Integrace Supabase Storage pro PDF dokumenty
   - Nastavení politiky přístupu pro veřejné i soukromé soubory

4. **Middleware**
   - Přidání Supabase middleware pro správu autentizačních cookies
   - Zachování původního middleware pro lokalizaci

## Struktura databáze

### Tabulky

1. **users** - Uživatelské účty
   - id (UUID, primární klíč)
   - email (TEXT, unikátní)
   - name (TEXT)
   - role (TEXT, default 'user')
   - created_at (TIMESTAMP)
   - updated_at (TIMESTAMP)

2. **bond_listings** - Dluhopisy
   - id (UUID, primární klíč)
   - title (TEXT)
   - description (TEXT)
   - issuer (TEXT)
   - yield (DECIMAL)
   - maturity_date (TIMESTAMP)
   - minimum_investment (INTEGER)
   - partner_id (UUID, reference na users)
   - status (TEXT, default 'active')
   - presentation_url (TEXT)
   - created_at (TIMESTAMP)
   - updated_at (TIMESTAMP)

3. **orders** - Objednávky
   - id (UUID, primární klíč)
   - user_id (UUID, reference na users)
   - bond_id (UUID, reference na bond_listings)
   - amount (INTEGER)
   - status (TEXT, default 'pending')
   - created_at (TIMESTAMP)
   - updated_at (TIMESTAMP)

### Row Level Security (RLS)

Nastavené RLS politiky zajišťují:

- Uživatelé vidí pouze vlastní profil a objednávky
- Partneři vidí své dluhopisy a související objednávky
- Aktivní dluhopisy jsou viditelné pro všechny uživatele
- Admin uživatelé mají plný přístup ke všem tabulkám

## Klíčové soubory

1. **lib/supabase.ts**
   - Klient pro komunikaci se Supabase
   - Funkce pro CRUD operace na dluhopisech a objednávkách
   - Funkce pro ukládání a mazání souborů

2. **lib/auth.ts**
   - NextAuth.js konfigurace pro Supabase
   - Implementace Credentials poskytovatele s Supabase Auth
   - JWT a session callbacky

3. **middleware.ts**
   - Supabase middleware pro správu autentizačních cookies
   - Lokalizační middleware pro směrování
   - Bezpečnostní hlavičky

4. **types/supabase.ts**
   - TypeScript typy pro Supabase tabulky

## Testování

Pro testování nové implementace byly vytvořeny:

1. **tests/api-tests.js** - Node.js testy API endpointů
2. **tests/curl-tests.sh** - Shell skript pro testování API pomocí cURL

## Známé problémy a omezení

1. **BankID poskytovatel** - Není aktuálně implementován v Supabase
2. **PDF parsování** - Nepodporuje ukládání do Supabase Storage z prohlížeče
