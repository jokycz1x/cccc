-- Vytvoření tabulky pro dluhopisy
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

-- Vytvoření tabulky pro doporučené dluhopisy
CREATE TABLE IF NOT EXISTS public.recommended_bonds (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_name TEXT NOT NULL,
    description TEXT,
    interest_rate DECIMAL(5, 2) NOT NULL,
    maturity_date DATE NOT NULL,
    min_investment DECIMAL(15, 2) NOT NULL,
    bond_type TEXT NOT NULL,
    is_featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Vytvoření tabulky pro dvoufaktorovou autentizaci
CREATE TABLE IF NOT EXISTS public.two_factor_auth (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL UNIQUE,
    phone_number TEXT,
    is_enabled BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Nastavení Row Level Security (RLS) pro tabulku bonds
ALTER TABLE public.bonds ENABLE ROW LEVEL SECURITY;

-- Vytvoření policy pro tabulku bonds
CREATE POLICY "Uživatelé mohou číst pouze své dluhopisy" 
    ON public.bonds FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Uživatelé mohou vkládat pouze své dluhopisy" 
    ON public.bonds FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Uživatelé mohou upravovat pouze své dluhopisy" 
    ON public.bonds FOR UPDATE 
    USING (auth.uid() = user_id);

CREATE POLICY "Uživatelé mohou mazat pouze své dluhopisy" 
    ON public.bonds FOR DELETE 
    USING (auth.uid() = user_id);

-- Nastavení Row Level Security (RLS) pro tabulku two_factor_auth
ALTER TABLE public.two_factor_auth ENABLE ROW LEVEL SECURITY;

-- Vytvoření policy pro tabulku two_factor_auth
CREATE POLICY "Uživatelé mohou číst pouze své 2FA nastavení" 
    ON public.two_factor_auth FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Uživatelé mohou vkládat pouze své 2FA nastavení" 
    ON public.two_factor_auth FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Uživatelé mohou upravovat pouze své 2FA nastavení" 
    ON public.two_factor_auth FOR UPDATE 
    USING (auth.uid() = user_id);

-- Vytvoření ukázkových doporučených dluhopisů
INSERT INTO public.recommended_bonds (company_name, description, interest_rate, maturity_date, min_investment, bond_type, is_featured)
VALUES
    ('DEF Innovations', 'High-yield corporate bond with excellent returns', 5.2, '2029-05-15', 5000, 'corporate', true),
    ('Město Praha', 'Municipal bond for infrastructure projects', 4.8, '2030-03-10', 10000, 'municipal', false),
    ('XYZ Enterprises', 'High-yield bond with attractive returns', 6.1, '2027-08-21', 15000, 'high-yield', false);
