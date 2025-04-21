-- Vytvoření tabulky bonds
CREATE TABLE IF NOT EXISTS public.bonds (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  company_name TEXT NOT NULL,
  purchase_date DATE NOT NULL,
  maturity_date DATE NOT NULL,
  invested_amount DECIMAL(15, 2) NOT NULL,
  interest_rate DECIMAL(5, 2) NOT NULL,
  payment_schedule TEXT NOT NULL,
  pdf_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Vytvoření indexů
CREATE INDEX IF NOT EXISTS bonds_user_id_idx ON public.bonds (user_id);
CREATE INDEX IF NOT EXISTS bonds_company_name_idx ON public.bonds (company_name);

-- Nastavení oprávnění
ALTER TABLE public.bonds ENABLE ROW LEVEL SECURITY;

-- Vytvoření RLS politik
CREATE POLICY "Users can view their own bonds" 
  ON public.bonds 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own bonds" 
  ON public.bonds 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own bonds" 
  ON public.bonds 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own bonds" 
  ON public.bonds 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Povolení přístupu pro service role
CREATE POLICY "Service role can access all bonds" 
  ON public.bonds 
  FOR ALL 
  TO service_role 
  USING (true);
