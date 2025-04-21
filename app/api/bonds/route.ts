import { getServerSession } from 'next-auth';
import { NextResponse, NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { authOptions } from '@/lib/auth';
import { csrfProtection } from '@/lib/csrf';

// Konfigurace Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://etceznegcpihgqupaqvt.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Vytvoření Supabase klienta s admin právy pro API operace
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

// Detekce Vercel build prostředí (pro správné ošetření)
const isVercelBuild = process.env.VERCEL_ENV && !process.env.NEXT_PUBLIC_VERCEL_URL;

export async function GET(req: NextRequest) {
  // Během buildu na Vercel nepotřebujeme reálně zpracovávat API volání
  if (isVercelBuild) {
    return NextResponse.json({
      success: true,
      bonds: []
    });
  }

  const session = await getServerSession(authOptions);

  // Pro testovací účely povolíme přístup i bez autentizace
  // V produkčním prostředí by toto mělo být odstraněno
  const userId = session?.user?.id || 'test-user-id';

  try {
    console.log('Fetching bonds for user:', userId);

    // Získání parametrů pro filtrování a řazení
    const url = new URL(req.url);
    const searchTerm = url.searchParams.get('search') || '';
    const sortBy = url.searchParams.get('sortBy') || 'created_at';
    const sortOrder = url.searchParams.get('sortOrder') || 'desc';

    // Načtení dluhopisů pro přihlášeného uživatele ze Supabase
    let query = supabaseAdmin
      .from('bonds')
      .select('*')
      .eq('user_id', userId);

    // Přidání vyhledávání, pokud je zadáno
    if (searchTerm) {
      query = query.ilike('company_name', `%${searchTerm}%`);
    }

    // Přidání řazení
    query = query.order(sortBy, { ascending: sortOrder === 'asc' });

    const { data: bonds, error } = await query;

    if (error) {
      console.error('Supabase Error:', error);
      throw error;
    }

    return NextResponse.json({
      success: true,
      bonds: bonds || []
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to load bonds' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    // Během buildu na Vercel nepotřebujeme reálně zpracovávat API volání
    if (isVercelBuild) {
      return NextResponse.json({
        success: true,
        bondId: 'mock-bond-id'
      });
    }

    console.log("POST /api/bonds - Starting processing");

    // CSRF ochranu dočasně vypneme pro diagnostiku
    // const csrfResult = await csrfProtection(req);
    // if (csrfResult) {
    //   console.error("CSRF protection failed:", csrfResult);
    //   return csrfResult;
    // }
    // console.log("CSRF validation passed");

    const session = await getServerSession(authOptions);
    console.log("Session check:", session ? "Authenticated" : "No session");

    // Pro testovací účely povolíme přístup i bez autentizace
    // V produkčním prostředí by toto mělo být odstraněno
    const userId = session?.user?.id || 'test-user-id';

    console.log("Processing request data");

    let bondData;

    // Kontrola typu obsahu
    const contentType = req.headers.get('content-type');

    if (contentType && contentType.includes('application/json')) {
      // Zpracování JSON dat
      console.log("Processing JSON data");
      const jsonData = await req.json();

      bondData = {
        user_id: userId,
        company_name: jsonData.company_name || 'Unknown Company',
        purchase_date: jsonData.purchase_date || new Date().toISOString().split('T')[0],
        maturity_date: jsonData.maturity_date ||
          new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        invested_amount: parseFloat(jsonData.invested_amount || '0'),
        interest_rate: parseFloat(jsonData.interest_rate || '0'),
        payment_schedule: jsonData.payment_schedule || 'quarterly',
        pdf_url: '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
    } else {
      // Zpracování formulářových dat
      console.log("Processing form data");
      const formData = await req.formData();

      // Log form data keys for debugging
      console.log("Form data keys:", [...formData.keys()]);
      console.log("Form data values:", {
        companyName: formData.get('companyName'),
        purchaseDate: formData.get('purchaseDate'),
        maturityDate: formData.get('maturityDate'),
        investedAmount: formData.get('investedAmount'),
        interestRate: formData.get('interestRate'),
        paymentSchedule: formData.get('paymentSchedule'),
      });

      // Získání PDF souboru z formuláře
      const pdfFile = formData.get('pdfFile') as File | null;
      if (pdfFile) {
        console.log("PDF file found in form data:", pdfFile.name, pdfFile.size);

        // Zpracování PDF souboru přímo zde
        try {
          // Upload PDF to Supabase storage
          console.log("Uploading PDF file to Supabase storage:", pdfFile.name);
          const fileName = `${userId}/${Date.now()}_${pdfFile.name}`;
          console.log("Target file path:", fileName);

          const { data, error } = await supabaseAdmin.storage
            .from('bonds')
            .upload(fileName, pdfFile, {
              cacheControl: '3600',
              upsert: true
            });

          if (error) {
            console.error('PDF upload failed:', error);
          } else {
            // Získání veřejné URL pro PDF
            const { data: urlData } = supabaseAdmin.storage
              .from('bonds')
              .getPublicUrl(fileName);

            // Uložení URL do proměnné, kterou později použijeme v bondData
            formData.set('pdfUrl', urlData.publicUrl);
            console.log("PDF uploaded successfully, URL:", urlData.publicUrl);
          }
        } catch (error) {
          console.error('PDF upload failed:', error);
          // Pokračujeme i když se nepodaří nahrát PDF
        }
      }

      bondData = {
        user_id: userId,
        company_name: formData.get('companyName')?.toString() || 'Unknown Company',
        purchase_date: formData.get('purchaseDate')?.toString() || new Date().toISOString().split('T')[0],
        maturity_date: formData.get('maturityDate')?.toString() ||
          new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        invested_amount: parseFloat(formData.get('investedAmount')?.toString() || '0'),
        interest_rate: parseFloat(formData.get('interestRate')?.toString() || '0'),
        payment_schedule: formData.get('paymentSchedule')?.toString() || 'quarterly',
        pdf_url: formData.get('pdfUrl')?.toString() || '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
    }

    console.log("Bond data prepared:", {
      company_name: bondData.company_name,
      purchase_date: bondData.purchase_date,
      invested_amount: bondData.invested_amount,
      interest_rate: bondData.interest_rate,
      payment_schedule: bondData.payment_schedule,
    });

    // Validate required fields
    if (!bondData.company_name || !bondData.invested_amount) {
      console.error('Missing required fields:', {
        company_name: Boolean(bondData.company_name),
        invested_amount: Boolean(bondData.invested_amount)
      });
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Poznámka: Zpracování PDF souboru je nyní přesunuto do části zpracování formuláře výše
    // Zde už nic nemusíme dělat, protože formData už bylo zpracováno
    console.log("PDF processing already handled or not needed");

    console.log("Inserting bond data into Supabase");
    try {
      // Vložení dluhopisu do Supabase
      console.log("Attempting to insert bond data into Supabase");

      // Přidání user_id do dat dluhopisu
      // Pokud není k dispozici session, použijeme testovací ID
      const testUserId = '6d9ec8a2-eb88-4c0c-9eb7-4ed9ec1b7428';
      const userId = session?.user?.id || testUserId;

      const bondDataWithUser = {
        ...bondData,
        user_id: userId,
        // Přidání maturity_date, pokud není k dispozici
        maturity_date: bondData.maturity_date || '2028-01-01'
      };

      console.log("Complete bond data:", bondDataWithUser);

      try {
        // Nejprve zkontrolujeme, zda tabulka existuje
        console.log('Checking if bonds table exists...');
        const { data: checkData, error: checkError } = await supabaseAdmin
          .from('bonds')
          .select('id')
          .limit(1);

        console.log('Check result:', { data: checkData, error: checkError });

        if (checkError) {
          console.log('Error checking table:', checkError);

          if (checkError.code === '42P01') {
            console.log('Table does not exist');
            return NextResponse.json(
              {
                error: 'Table does not exist',
                message: 'The bonds table does not exist in the database. Please create it first using the SQL script.',
                details: checkError
              },
              { status: 500 }
            );
          } else {
            console.log('Other error checking table:', checkError);
            return NextResponse.json(
              {
                error: 'Database Error',
                message: 'Error checking if bonds table exists.',
                details: checkError
              },
              { status: 500 }
            );
          }
        }

        console.log('Table exists, proceeding with insert...');

        // Pokud tabulka existuje, vložíme data
        const { data, error } = await supabaseAdmin
          .from('bonds')
          .insert([bondDataWithUser])
          .select();

        if (error) {
          console.error('Supabase Error:', error);
          console.error('Detailed Supabase Error:', JSON.stringify(error));
          return NextResponse.json(
            {
              error: 'Database Error',
              message: error.message,
              details: error,
              code: error.code
            },
            { status: 500 }
          );
        }

        // Vrátíme úspěšnou odpověď
        return NextResponse.json({
          success: true,
          bond: data[0]
        });
      } catch (error: any) {
        console.error('Unexpected error during database operation:', error);
        return NextResponse.json(
          {
            error: 'Unexpected Error',
            message: error.message || 'An unexpected error occurred',
            details: error
          },
          { status: 500 }
        );
      }

      console.log("Bond inserted successfully:", data);

      return NextResponse.json({
        success: true,
        bondId: data[0].id,
        bond: data[0]
      });
    } catch (dbError) {
      console.error('Database Error:', dbError);
      return NextResponse.json(
        { error: 'Database operation failed', details: dbError.message },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to save bond', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
