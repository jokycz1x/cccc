import { createClient } from '@supabase/supabase-js';
import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

// Konfigurační proměnné
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://etceznegcpihgqupaqvt.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV0Y2V6bmVnY3BpaGdxdXBhcXZ0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MzUyMzAwMCwiZXhwIjoyMDU5MDk5MDAwfQ.gt23zrdsaUE_L280VQqoLsxR5RTQPlF_HtrX2wvZ9Oo';

console.log('Inicializace Supabase admin klienta pro autentizaci');
console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Key (first 10 chars):', supabaseKey.substring(0, 10) + '...');

// Vytvoření klienta s admin právy pro auth operace
const supabaseAdmin = createClient(supabaseUrl, supabaseKey);

// Vždy používáme reálnou autentizaci
const useMockAuth = false; // Tato hodnota je vždy false

// Kontrola dostupnosti a struktury Supabase Auth objektu
console.log('Dostupné auth metody:', Object.keys(supabaseAdmin.auth));
console.log('Existuje auth.admin?', supabaseAdmin.auth.admin ? 'Ano' : 'Ne');

// Vytvoření klienta s uživatelskými právy - pouze pro kontrolu dostupnosti API
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV0Y2V6bmVnY3BpaGdxdXBhcXZ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM1MjMwMDAsImV4cCI6MjA1OTA5OTAwMH0.JI6328zzMt3DdKD_Pa_huPa_WW9iqKfXWgNnqAvUIjg';
const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);

console.log('--- Testování připojení k Supabase ---');

// Testování Supabase API
(async () => {
  try {
    // 1. Testujeme přístup k Supabase URL
    console.log(`Testování přístupu k URL: ${supabaseUrl}`);
    try {
      const response = await fetch(`${supabaseUrl}/auth/v1/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log(`URL test: Status ${response.status}`);
    } catch (urlError: any) {
      console.error(`Chyba přístupu k URL: ${urlError?.message || 'Neznámá chyba'}`);
    }

    // 2. Testujeme Auth API s anonymním klíčem
    console.log('Testování Auth API s anonKey...');
    try {
      const authResponse = await supabaseClient.auth.getSession();
      console.log('Auth API test (anon):', authResponse.error ? 'Chyba' : 'OK');
    } catch (authError: any) {
      console.error('Chyba Auth API (anon):', authError?.message || 'Neznámá chyba');
    }

    // 3. Testujeme Auth API s service rolí
    console.log('Testování Auth API se service rolí...');
    try {
      const authResponse = await supabaseAdmin.auth.getSession();
      console.log('Auth API test (service):', authResponse.error ? 'Chyba' : 'OK');
    } catch (authError: any) {
      console.error('Chyba Auth API (service):', authError?.message || 'Neznámá chyba');
    }

    // 4. Testujeme Database API
    console.log('Testování Database API...');
    try {
      const { error } = await supabaseAdmin
        .from('users')
        .select('count')
        .limit(1);
      console.log('Database API test:', error ? `Chyba: ${error.message}` : 'OK');
    } catch (dbError: any) {
      console.error('Chyba Database API:', dbError?.message || 'Neznámá chyba');
    }

    console.log('--- Konec testování ---');
  } catch (e) {
    console.error('Chyba při testování Supabase API:', e);
  }
})();

// Uživatelské funkce pro práci s autentizací
export async function getUserByEmail(email: string) {
  const { data, error } = await supabaseAdmin
    .from('users')
    .select('*')
    .eq('email', email.toLowerCase())
    .single();

  if (error) {
    console.error('Error fetching user:', error);
    return null;
  }

  return data;
}

export async function createUser(userData: {
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
  role?: string;
  partnerCode?: string;
}) {
  console.log('createUser: Vytváření uživatele', userData.email);

  // Pro testování použijeme mock data
  if (useMockAuth) {
    console.log('Používám mock registraci pro:', userData.email);

    // Kontrola, zda uživatel již existuje v mock datech
    if (userData.email === 'test@example.com' || userData.email === 'partner@example.com') {
      console.log('Uživatel již existuje v mock datech:', userData.email);
      throw new Error('Email již existuje');
    }

    // Vrátíme mock uživatele
    return {
      id: 'mock-user-' + Math.floor(Math.random() * 1000),
      email: userData.email.toLowerCase(),
      name: userData.name,
      role: userData.role || 'user',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  }

  try {
    // Kontrola, zda uživatel již existuje - pomocí databáze
    console.log('Kontrola v databázi, zda email již existuje...');
    try {
      const { data: existingDbUser, error: dbCheckError } = await supabaseAdmin
        .from('users')
        .select('id')
        .eq('email', userData.email.toLowerCase())
        .maybeSingle();

      if (dbCheckError) {
        console.log('Chyba při kontrole v databázi:', dbCheckError.message);
      } else if (existingDbUser) {
        console.log('Uživatel již existuje v databázi:', userData.email);
        throw new Error('Email již existuje');
      }
    } catch (dbErr) {
      console.error('Chyba při kontrole v databázi:', dbErr);
      // Pokračujeme dál i přes chybu
    }

    // 1. Vytvoření auth uživatele
    console.log('Vytváření uživatele v Auth API...');

    // DŮLEŽITÉ: Zkontrolujme, zda existuje adminCreateUser funkce
    if (!supabaseAdmin.auth.admin || !supabaseAdmin.auth.admin.createUser) {
      console.log('Admin API není dostupné, použijeme alternativní postup');

      // Alternativní postup pomocí standardního signUp
      const { data: signUpData, error: signUpError } = await supabaseAdmin.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            name: userData.name,
            role: userData.role || 'user',
            partnerCode: userData.partnerCode,
          }
        }
      });

      if (signUpError) {
        console.error('Chyba při vytváření uživatele pomocí signUp:', signUpError);
        throw new Error(signUpError.message);
      }

      if (!signUpData?.user?.id) {
        console.error('Prázdná odpověď nebo chybějící ID uživatele po signUp');
        throw new Error('Nepodařilo se vytvořit uživatele: Chybějící ID');
      }

      // 2. Vytvoření záznamu v users tabulce
      console.log('Vytváření záznamu v databázi, ID:', signUpData.user.id);

      // Použijeme standardní Supabase API pro vložení uživatele
      let userData_db = {
        id: signUpData.user.id,
        email: userData.email.toLowerCase(),
        name: userData.name,
        role: userData.role || 'user',
      };

      // Pokusíme se přidat partner_code, pokud existuje
      if (userData.partnerCode) {
        try {
          const { data: dbUserData, error: dbError } = await supabaseAdmin
            .from('users')
            .insert({
              ...userData_db,
              partner_code: userData.partnerCode,
            })
            .select()
            .single();

          if (!dbError) {
            return dbUserData;
          }

          // Pokud selhal insert s partner_code, zkusíme bez něj
          if (dbError.message.includes('partner_code')) {
            console.log('Sloupec partner_code neexistuje, vkládáme bez něj');
          } else {
            throw dbError;
          }
        } catch (err: any) {
          if (err?.message && !err.message.includes('partner_code')) {
            throw err;
          }
          // Pokračujeme bez partner_code
        }
      }

      // Pokud jsme se dostali sem, zkusíme vložit bez partner_code
      const { data: dbUserData, error: dbError } = await supabaseAdmin
        .from('users')
        .insert(userData_db)
        .select()
        .single();

      // Vytvoříme záznam v two_factor_auth tabulce
      if (!dbError) {
        const { error: twoFactorError } = await supabaseAdmin
          .from('two_factor_auth')
          .insert({
            user_id: signUpData.user.id,
            phone_number: userData.phoneNumber,
            enabled: false
          });

        if (twoFactorError) {
          console.error('Chyba při vytváření záznamu 2FA:', twoFactorError);
        }
      }

      if (dbError) {
        console.error('Chyba při vytváření záznamu v databázi:', dbError);
        throw new Error(`Nepodařilo se vytvořit záznam v databázi: ${dbError.message}`);
      }

      return dbUserData;
    }

    // Původní postup s admin API
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: userData.email,
      password: userData.password,
      email_confirm: true,
      user_metadata: {
        name: userData.name,
        role: userData.role || 'user',
        partnerCode: userData.partnerCode,
      },
    });

    if (authError) {
      console.error('Chyba při vytváření auth uživatele:', authError);
      throw new Error(authError.message);
    }

    if (!authData?.user?.id) {
      console.error('Prázdná odpověď nebo chybějící ID uživatele');
      throw new Error('Nepodařilo se vytvořit uživatele: Chybějící ID');
    }

    // 2. Vytvoření záznamu v users tabulce
    console.log('Vytváření záznamu v databázi, ID:', authData.user.id);

    // Použijeme standardní Supabase API pro vložení uživatele
    let userData_db = {
      id: authData.user.id,
      email: userData.email.toLowerCase(),
      name: userData.name,
      role: userData.role || 'user',
    };

    // Pokusíme se přidat partner_code, pokud existuje
    let data;
    let error;

    if (userData.partnerCode) {
      try {
        const result = await supabaseAdmin
          .from('users')
          .insert({
            ...userData_db,
            partner_code: userData.partnerCode,
          })
          .select()
          .single();

        data = result.data;
        error = result.error;

        if (!error) {
          // Úspěšný insert s partner_code
          console.log('Uživatel vytvořen s partner_code');
        } else if (error.message.includes('partner_code')) {
          // Pokud selhal insert s partner_code, zkusíme bez něj
          console.log('Sloupec partner_code neexistuje, vkládáme bez něj');
          const fallbackResult = await supabaseAdmin
            .from('users')
            .insert(userData_db)
            .select()
            .single();

          data = fallbackResult.data;
          error = fallbackResult.error;
        }
      } catch (err) {
        // Pokračujeme bez partner_code v případě chyby
        console.error('Chyba při vkládání uživatele s partner_code:', err);
        const fallbackResult = await supabaseAdmin
          .from('users')
          .insert(userData_db)
          .select()
          .single();

        data = fallbackResult.data;
        error = fallbackResult.error;
      }
    } else {
      // Bez partner_code
      const result = await supabaseAdmin
        .from('users')
        .insert(userData_db)
        .select()
        .single();

      data = result.data;
      error = result.error;
    }

    // Vytvoříme záznam v two_factor_auth tabulce
    if (!error) {
      const { error: twoFactorError } = await supabaseAdmin
        .from('two_factor_auth')
        .insert({
          user_id: authData.user.id,
          phone_number: userData.phoneNumber,
          enabled: false
        });

      if (twoFactorError) {
        console.error('Chyba při vytváření záznamu 2FA:', twoFactorError);
      }
    }

    if (error) {
      console.error('Chyba při vytváření záznamu uživatele:', error);
      try {
        if (supabaseAdmin.auth.admin && supabaseAdmin.auth.admin.deleteUser) {
          await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
        }
      } catch (deleteError) {
        console.error('Nepodařilo se vyčistit auth uživatele:', deleteError);
      }
      throw new Error(`Nepodařilo se vytvořit záznam uživatele: ${error.message}`);
    }

    console.log('Uživatel úspěšně vytvořen');
    return data;
  } catch (error) {
    console.error('Výjimka v createUser:', error);
    throw error; // Propagujeme chybu dál
  }
}

// NextAuth konfigurace pro Supabase
export const authOptions: NextAuthOptions = {
  debug: true,
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        console.log('=== NextAuth authorize() ===');
        console.log('Credentials:', credentials);

        if (!credentials?.email || !credentials?.password) {
          console.log('Chybějící přihlašovací údaje');
          throw new Error('Chybějící přihlašovací údaje');
        }

        try {
          // Mockování je zakázáno, vždy používáme reálnou autentizaci
          if (useMockAuth) {
            // Tato větev se nikdy neprovede, protože useMockAuth je vždy false
            console.error('Mock autentizace je zakázána');
            throw new Error('Mock autentizace je zakázána');
          }

          // Autentizace přes Supabase Auth
          console.log('=== Pokus o přihlášení ===');
          console.log('Email:', credentials.email);
          console.log('Používám reálnou autentizaci s Supabase');
          console.log('Volám supabaseAdmin.auth.signInWithPassword...');
          try {
            const { data, error } = await supabaseAdmin.auth.signInWithPassword({
              email: credentials.email,
              password: credentials.password,
            });
            console.log('Výsledek přihlášení:', error ? `Chyba: ${error.message}` : 'OK');
            if (data && data.user) {
              console.log('Přihlášení úspěšné, user ID:', data.user.id);
            }

            // Pokud je chyba, vrátíme null
            if (error) {
              console.error('Chyba při přihlášení:', error.message);
              return null;
            }

            // Pokud není uživatel, vrátíme null
            if (!data.user) {
              console.error('Uživatel nebyl nalezen');
              return null;
            }

            // Získáme informace o 2FA
            const { data: twoFactorData, error: twoFactorError } = await supabaseAdmin
              .from('two_factor_auth')
              .select('enabled, phone_number, recovery_codes')
              .eq('user_id', data.user.id)
              .single();

            if (twoFactorError && twoFactorError.code !== 'PGRST116') {
              console.error('Chyba při získávání 2FA dat:', twoFactorError);
            }

            // Vrátíme uživatele
            return {
              id: data.user.id,
              email: data.user.email,
              name: data.user.user_metadata?.name || data.user.email,
              role: data.user.user_metadata?.role || 'investor',
              two_factor_enabled: twoFactorData?.enabled || false,
              phone_number: twoFactorData?.phone_number || undefined,
              recovery_codes: twoFactorData?.recovery_codes || undefined,
            };
          } catch (error) {
            console.error('Neočekávaná chyba při přihlášení:', error);
            return null;
          }

          // Kód byl přesunut do try/catch bloku výše
        } catch (error) {
          console.error('Chyba autentizace:', error);
          throw error;
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 dnů
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.two_factor_enabled = user.two_factor_enabled;
        token.phone_number = user.phone_number;
        token.recovery_codes = user.recovery_codes;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.two_factor_enabled = token.two_factor_enabled as boolean;
        session.user.phone_number = token.phone_number as string | undefined;
        session.user.recovery_codes = token.recovery_codes as string[] | undefined;
      }
      return session;
    },
  },
  pages: {
    signIn: '/cs/auth/login',
    signOut: '/cs/auth/signout',
    error: '/cs/auth/error',
    newUser: '/cs/auth/register',
  },
  // debug: process.env.NODE_ENV === 'development', // Duplicitní, již definováno výše
  secret: process.env.NEXTAUTH_SECRET || 'your_nextauth_secret_key',
};
