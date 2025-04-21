import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';

// Konfigurační proměnné
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://etceznegcpihgqupaqvt.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV0Y2V6bmVnY3BpaGdxdXBhcXZ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM1MjMwMDAsImV4cCI6MjA1OTA5OTAwMH0.JI6328zzMt3DdKD_Pa_huPa_WW9iqKfXWgNnqAvUIjg';

console.log('Initializing Supabase client with URL:', supabaseUrl);
console.log('Using Anon Key (first 10 chars):', supabaseAnonKey.substring(0, 10) + '...');

// Použijeme cachování klienta
let supabaseClientInstance: ReturnType<typeof createClient<Database>> | null = null;

// Zkontrolujeme prostředí
const isVercelBuild = process.env.VERCEL_ENV && !process.env.NEXT_PUBLIC_VERCEL_URL;
const isVercelProduction = process.env.VERCEL_ENV === 'production';
const isDevelopment = process.env.NODE_ENV === 'development';

// Vytvoření klienta pouze jednou
export const supabase = (() => {
  // Pokud již máme instanci, vrátíme ji
  if (supabaseClientInstance) {
    return supabaseClientInstance;
  }

  // Nikdy nepoužíváme mock klienta, vždy používáme reálný Supabase
  if (isVercelBuild) {
    console.log('Vytváříme reálného Supabase klienta i při buildu');
  }

  try {
    // Vytvoříme reálného klienta
    supabaseClientInstance = createClient<Database>(supabaseUrl, supabaseAnonKey);
    console.log('Supabase client created successfully');
    return supabaseClientInstance;
  } catch (err) {
    console.error('Chyba při vytváření Supabase klienta:', err);
    throw new Error('Nelze vytvořit Supabase klienta');
  }
})();

// Vytvoření Supabase Admin klienta pro serverovou stranu
let supabaseAdminInstance: ReturnType<typeof createClient<Database>> | null = null;

// Konfigurace pro admin klienta
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Vytvoření admin klienta pouze jednou
export const supabaseAdmin = (() => {
  // Pokud již máme instanci, vrátíme ji
  if (supabaseAdminInstance) {
    return supabaseAdminInstance;
  }

  try {
    // Vytvoříme reálného admin klienta
    console.log('Inicializace Supabase admin klienta pro autentizaci');
    console.log('Supabase URL:', supabaseUrl);
    console.log('Supabase Key (first 10 chars):', supabaseServiceKey.substring(0, 10) + '...');

    supabaseAdminInstance = createClient<Database>(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    // Testujeme dostupnost auth metod
    const authMethods = Object.keys(supabaseAdminInstance.auth);
    console.log('Dostupné auth metody:', authMethods);
    console.log('Existuje auth.admin?', supabaseAdminInstance.auth.admin ? 'Ano' : 'Ne');

    // Testujeme připojení k Supabase
    console.log('--- Testování připojení k Supabase ---');
    testSupabaseConnection();

    return supabaseAdminInstance;
  } catch (err) {
    console.error('Chyba při vytváření Supabase admin klienta:', err);
    throw new Error('Nelze vytvořit Supabase admin klienta');
  }
})();

// Funkce pro testování připojení k Supabase
async function testSupabaseConnection() {
  try {
    console.log('Testování přístupu k URL:', supabaseUrl);
    const urlTest = await fetch(supabaseUrl);
    console.log('URL test: Status', urlTest.status);

    console.log('Testování Auth API s anonKey...');
    const authTest = await fetch(`${supabaseUrl}/auth/v1/`, {
      headers: {
        'apikey': supabaseAnonKey,
      }
    });
    console.log('Auth API test (anon):', authTest.ok ? 'OK' : 'Failed');

    console.log('Testování Auth API se service rolí...');
    const authAdminTest = await fetch(`${supabaseUrl}/auth/v1/admin/users`, {
      headers: {
        'apikey': supabaseServiceKey,
        'Authorization': `Bearer ${supabaseServiceKey}`,
      }
    });
    console.log('Auth API test (service):', authAdminTest.ok ? 'OK' : 'Failed');

    console.log('Testování Database API...');
    const dbTest = await fetch(`${supabaseUrl}/rest/v1/`, {
      headers: {
        'apikey': supabaseServiceKey,
        'Authorization': `Bearer ${supabaseServiceKey}`,
      }
    });
    console.log('Database API test:', dbTest.ok ? 'OK' : 'Failed');

    console.log('--- Konec testování ---');
  } catch (error) {
    console.error('Chyba při testování připojení:', error);
  }
}

// Optimalizovaná funkce pro upload souboru
export const uploadFile = async (file: File, path: string) => {
  console.log(`Uploading file ${file.name} to path ${path}`);

  // Pokud jsme v development módu bez klíče, uložíme soubor lokálně
  if (isDevelopment && !supabaseAnonKey) {
    try {
      // Vytvoříme lokální kopii souboru v public složce
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const publicPath = `/uploads/presentations/${fileName}`;
      const filePath = `public${publicPath}`;

      // Uložíme soubor do public složky (v prohlížeči to nelze, ale na serveru ano)
      if (typeof window === 'undefined') {
        const fs = require('fs');
        const { promises: fsPromises } = fs;
        const buffer = Buffer.from(await file.arrayBuffer());
        await fsPromises.writeFile(filePath, buffer);
      }

      return {
        path: filePath,
        url: publicPath,
      };
    } catch (error) {
      console.error('Chyba při ukládání souboru lokálně:', error);
      // Fallback na image
      return {
        path: 'mock-path',
        url: '/images/bond-illustration.svg',
      };
    }
  }

  // Generujeme unikátní název souboru
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
  const filePath = `${path}/${fileName}`;

  // Nahrajeme soubor
  console.log(`Uploading to Supabase storage: bucket=bonds, path=${filePath}`);

  // Zkusíme použít admin klienta
  try {
    console.log('Používám admin klienta pro upload souboru');

    // Použijeme bucket podle cesty (presentations nebo bonds)
    const bucketName = path === 'presentations' ? 'presentations' : 'bonds';
    console.log(`Používám bucket: ${bucketName}`);

    // Nejprve zkontrolujeme, zda bucket existuje, a pokud ne, vytvoříme ho
    try {
      const { data: buckets } = await supabaseAdmin.storage.listBuckets();
      const bucketExists = buckets.some(b => b.name === bucketName);

      if (!bucketExists) {
        console.log(`Bucket ${bucketName} neexistuje, vytvářím...`);
        const { error: createBucketError } = await supabaseAdmin.storage.createBucket(bucketName, {
          public: true
        });

        if (createBucketError) {
          console.error(`Chyba při vytváření bucketu ${bucketName}:`, createBucketError);
        } else {
          console.log(`Bucket ${bucketName} úspěšně vytvořen`);
        }
      }
    } catch (bucketError) {
      console.error('Chyba při kontrole/vytváření bucketu:', bucketError);
    }

    const { data: adminData, error: adminError } = await supabaseAdmin.storage
      .from(bucketName)
      .upload(filePath, file);

    if (adminError) {
      console.error(`Chyba při uploadu souboru do bucketu ${bucketName} (admin):`, adminError);
      throw adminError;
    }

    console.log(`Upload úspěšný do bucketu ${bucketName} (admin)`);

    // Získáme veřejnou URL
    const { data: publicUrlData } = supabaseAdmin.storage
      .from(bucketName)
      .getPublicUrl(filePath);

    return {
      path: filePath,
      url: publicUrlData.publicUrl,
    };
  } catch (adminUploadError) {
    console.error('Chyba při použití admin klienta pro upload:', adminUploadError);

    // Fallback na běžného klienta
    console.log('Zkusím použít běžného klienta pro upload');

    // Použijeme bucket podle cesty (presentations nebo bonds)
    const bucketName = path === 'presentations' ? 'presentations' : 'bonds';

    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(filePath, file);

    if (error) {
      console.error(`Chyba při uploadu souboru do bucketu ${bucketName} (běžný):`, error);
      throw new Error(error.message);
    }

    console.log(`Upload úspěšný do bucketu ${bucketName} (běžný)`);

    // Získáme veřejnou URL
    const { data: publicUrlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(filePath);

    return {
      path: filePath,
      url: publicUrlData.publicUrl,
    };
  }
};

// Funkce pro smazání souboru
export const deleteFile = async (path: string) => {
  // Pokud jsme v development módu bez klíče, vracíme true
  if (isDevelopment && !supabaseAnonKey) {
    return true;
  }

  // Určíme bucket podle cesty
  const bucketName = path.startsWith('presentations/') ? 'presentations' : 'bonds';
  console.log(`Mazání souboru z bucketu ${bucketName}: ${path}`);

  // Odstraníme prefix bucketu z cesty, pokud existuje
  const cleanPath = path.replace(/^(presentations|bonds)\//, '');

  const { error } = await supabase.storage.from(bucketName).remove([cleanPath]);

  if (error) {
    console.error(`Chyba při mazání souboru z bucketu ${bucketName}:`, error);
    throw new Error(error.message);
  }

  console.log(`Soubor úspěšně smazán z bucketu ${bucketName}: ${cleanPath}`);
  return true;
};

// Funkce pro práci s uživateli
export const getUser = async (id: string) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Chyba při načítání uživatele:', error);
    return null;
  }

  return data;
};

// Funkce pro práci s dluhopisy
export const getBonds = async (limit = 10, offset = 0, partnerId?: string) => {
  console.log(`Načítám dluhopisy ze Supabase: limit=${limit}, offset=${offset}, partnerId=${partnerId || 'všichni'}`);

  try {
    // Zkusíme nejprve načíst z tabulky bond_listings_new
    let query = supabase
      .from('bond_listings_new')
      .select(`
        *,
        partner:users(id, name)
      `)
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    // Pokud je zadán partnerId, filtrujeme podle něj
    if (partnerId) {
      query = query.eq('partner_id', partnerId);
    }

    let { data, error } = await query.range(offset, offset + limit - 1);

    if (error) {
      console.error('Chyba při načítání z bond_listings:', error);

      // Zkusíme načíst z tabulky bond_listings (původní tabulka)
      const { data: oldData, error: oldError } = await supabase
        .from('bond_listings')
        .select(`
          *,
          partner:users(id, name)
        `)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (oldError) {
        console.error('Chyba při načítání z původní tabulky bond_listings:', oldError);
        return [];
      }

      data = oldData;
    }

    console.log(`Načteno ${data?.length || 0} dluhopisů:`, data);

    // Pokud nemáme žádná data, zkusíme načíst všechny záznamy bez filtru
    if (!data || data.length === 0) {
      console.log('Zkusím načíst všechny záznamy bez filtru');

      const { data: allData, error: allError } = await supabase
        .from('bond_listings')
        .select(`
          *,
          partner:users(id, name)
        `)
        .order('created_at', { ascending: false })
        .range(0, 100);

      if (allError) {
        console.error('Chyba při načítání všech záznamů:', allError);
      } else {
        console.log(`Načteno ${allData?.length || 0} záznamů bez filtru:`, allData);
        data = allData;
      }
    }

    return data || [];
  } catch (e) {
    console.error('Neočekávaná chyba při načítání dluhopisů:', e);
    return [];
  }
};

export const getBond = async (id: string) => {
  console.log(`Načítám detail dluhopisu ze Supabase: id=${id}`);

  try {
    // Zkusíme nejprve načíst z tabulky bond_listings_new
    let { data, error } = await supabase
      .from('bond_listings_new')
      .select(`
        *,
        partner:users(id, name)
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('Chyba při načítání dluhopisu z bond_listings:', error);

      // Zkusíme načíst z tabulky bond_listings (původní tabulka)
      try {
        const { data: oldData, error: oldError } = await supabase
          .from('bond_listings')
          .select(`
            *,
            partner:users(id, name)
          `)
          .eq('id', id)
          .single();

        if (oldError) {
          console.error('Chyba při načítání dluhopisu z původní tabulky bond_listings:', oldError);
          return null;
        }

        data = oldData;
      } catch (oldErr) {
        console.error('Chyba při načítání dluhopisu z původní tabulky bond_listings:', oldErr);
        return null;
      }
    }

    console.log('Načtený dluhopis:', data);

    // Pokud data existují, ale chybí některá nová pole, přidáme výchozí hodnoty
    if (data) {
      // Přidáme výchozí hodnoty pro nová pole, pokud neexistují
      if (!data.bond_type) data.bond_type = 'Korporátní';
      if (!data.payment_frequency) data.payment_frequency = 'Ročně';
      if (!data.nominal_value) data.nominal_value = 10000;
      if (!data.bond_form) data.bond_form = 'Na jméno';
      if (!data.bond_appearance) data.bond_appearance = 'Listinná';
      if (!data.collateral) data.collateral = 'Nemovitosti';

      console.log('Dluhopis s výchozími hodnotami:', data);
    }

    return data;
  } catch (e) {
    console.error('Neočekávaná chyba při načítání dluhopisu:', e);
    return null;
  }
};

export const createBond = async (bondData: any) => {
  console.log('Vytvářím dluhopis pomocí admin klienta');

  // Použijeme admin klienta, který má oprávnění obejít RLS politiky
  try {
    const { data, error } = await supabaseAdmin
      .from('bond_listings')
      .insert(bondData)
      .select()
      .single();

    if (error) {
      console.error('Chyba při vytváření dluhopisu (admin):', error);
      throw new Error(error.message);
    }

    console.log('Dluhopis úspěšně vytvořen (admin):', data);
    return data;
  } catch (adminError) {
    console.error('Chyba při použití admin klienta:', adminError);

    // Fallback na běžného klienta
    console.log('Zkusím použít běžného klienta');
    const { data, error } = await supabase
      .from('bond_listings')
      .insert(bondData)
      .select()
      .single();

    if (error) {
      console.error('Chyba při vytváření dluhopisu (běžný):', error);
      throw new Error(error.message);
    }

    console.log('Dluhopis úspěšně vytvořen (běžný):', data);
    return data;
  }
};

export const updateBond = async (id: string, bondData: any) => {
  console.log('Aktualizuji dluhopis pomocí admin klienta');

  // Použijeme admin klienta, který má oprávnění obejít RLS politiky
  try {
    const { data, error } = await supabaseAdmin
      .from('bond_listings')
      .update(bondData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Chyba při aktualizaci dluhopisu (admin):', error);
      throw new Error(error.message);
    }

    console.log('Dluhopis úspěšně aktualizován (admin):', data);
    return data;
  } catch (adminError) {
    console.error('Chyba při použití admin klienta:', adminError);

    // Fallback na běžného klienta
    console.log('Zkusím použít běžného klienta');
    const { data, error } = await supabase
      .from('bond_listings')
      .update(bondData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Chyba při aktualizaci dluhopisu (běžný):', error);
      throw new Error(error.message);
    }

    console.log('Dluhopis úspěšně aktualizován (běžný):', data);
    return data;
  }
};

// Funkce pro práci s objednávkami
export const createOrder = async (orderData: any) => {
  const { data, error } = await supabase
    .from('orders')
    .insert(orderData)
    .select()
    .single();

  if (error) {
    console.error('Chyba při vytváření objednávky:', error);
    throw new Error(error.message);
  }

  return data;
};

export const getUserOrders = async (userId: string) => {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      bond:bond_listings(id, title, yield, issuer, maturity_date)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Chyba při načítání objednávek uživatele:', error);
    return [];
  }

  return data;
};
