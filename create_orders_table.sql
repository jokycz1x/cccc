-- Vytvoření tabulky pro objednávky
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  bond_listing_id UUID REFERENCES public.bond_listings(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  birth_date TEXT,
  permanent_address TEXT,
  correspondence_address TEXT,
  bank_account TEXT,
  personal_id TEXT,
  amount NUMERIC NOT NULL,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Přidání RLS politik
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Politika pro čtení - admin může číst všechny objednávky
CREATE POLICY "Admins can read all orders" ON public.orders
  FOR SELECT USING (
    auth.role() = 'service_role' OR
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

-- Politika pro čtení - partneři mohou číst objednávky svých dluhopisů
CREATE POLICY "Partners can read their bond orders" ON public.orders
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.bond_listings
      WHERE bond_listings.id = orders.bond_listing_id
      AND bond_listings.partner_id = auth.uid()
    )
  );

-- Politika pro čtení - uživatelé mohou číst své objednávky
CREATE POLICY "Users can read their own orders" ON public.orders
  FOR SELECT USING (
    auth.uid() = user_id
  );

-- Politika pro vytváření - každý může vytvořit objednávku
CREATE POLICY "Anyone can create orders" ON public.orders
  FOR INSERT WITH CHECK (true);

-- Politika pro aktualizaci - admin může aktualizovat všechny objednávky
CREATE POLICY "Admins can update all orders" ON public.orders
  FOR UPDATE USING (
    auth.role() = 'service_role' OR
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

-- Politika pro aktualizaci - partneři mohou aktualizovat objednávky svých dluhopisů
CREATE POLICY "Partners can update their bond orders" ON public.orders
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.bond_listings
      WHERE bond_listings.id = orders.bond_listing_id
      AND bond_listings.partner_id = auth.uid()
    )
  );

-- Politika pro mazání - admin může mazat všechny objednávky
CREATE POLICY "Admins can delete all orders" ON public.orders
  FOR DELETE USING (
    auth.role() = 'service_role' OR
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

-- Vytvoření indexů pro rychlejší vyhledávání
CREATE INDEX IF NOT EXISTS orders_bond_listing_id_idx ON public.orders(bond_listing_id);
CREATE INDEX IF NOT EXISTS orders_user_id_idx ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS orders_status_idx ON public.orders(status);
CREATE INDEX IF NOT EXISTS orders_created_at_idx ON public.orders(created_at);

-- Vytvoření triggeru pro aktualizaci pole updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at
BEFORE UPDATE ON public.orders
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();
