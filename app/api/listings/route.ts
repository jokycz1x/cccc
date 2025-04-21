import { NextRequest, NextResponse } from 'next/server';
import { createBond, uploadFile, getBonds } from '@/lib/supabase';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// Disable body parsing and caching for file uploads
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

// Detekce Vercel build prostředí (pro správné ošetření)
const isVercelBuild = process.env.VERCEL_ENV && !process.env.NEXT_PUBLIC_VERCEL_URL;

// GET /api/listings - Get all listings
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const status = searchParams.get('status') || 'active';
    const limit = parseInt(searchParams.get('limit') || '10');
    const page = parseInt(searchParams.get('page') || '1');
    const offset = (page - 1) * limit;
    const partner = searchParams.get('partner') === 'true';

    // Získáme session pro kontrolu, zda je uživatel partner
    const session = await getServerSession(authOptions);
    const partnerId = partner && session?.user?.role === 'partner' ? session.user.id : undefined;

    try {
      console.log(`Načítám dluhopisy ze Supabase: status=${status}, limit=${limit}, page=${page}, partner=${partner}, partnerId=${partnerId || 'všichni'}`);
      const listings = await getBonds(limit, offset, partnerId);

      // Transformace dat pro kompatibilitu s původním formátem
      const transformedListings = listings.map(listing => ({
        _id: listing.id,
        title: listing.title,
        description: listing.description,
        issuer: listing.issuer,
        yield: listing.yield,
        maturityDate: listing.maturity_date,
        minimumInvestment: listing.minimum_investment,
        presentationUrl: listing.presentation_url,
        partnerName: listing.partner?.name || 'Neznámý partner',
        partner: listing.partner_id,
        status: listing.status,
        createdAt: listing.created_at,
        updatedAt: listing.updated_at
      }));

      // Odhadneme celkový počet záznamů
      const total = listings.length >= limit ? listings.length + limit : listings.length;

      return NextResponse.json({
        listings: transformedListings,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit),
        },
      });
    } catch (dbError) {
      console.error('Database error:', dbError);
      // Vrátíme prázdná data místo chyby, aby UI mohlo fungovat
      return NextResponse.json({
        listings: [],
        pagination: { total: 0, page: 1, limit: 10, pages: 0 }
      });
    }
  } catch (error) {
    console.error('Error fetching listings:', error);

    // Pokud jsme na Vercel, raději vrátíme prázdná data než chybu
    if (process.env.VERCEL_ENV) {
      return NextResponse.json({
        listings: [],
        pagination: { total: 0, page: 1, limit: 10, pages: 0 }
      });
    }
    return NextResponse.json({ error: 'Failed to fetch listings' }, { status: 500 });
  }
}

// POST /api/listings - Create a new listing
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    // Kontrola autorizace - pouze partneři mohou vytvářet nabídky
    if (!session) {
      console.log('Uživatel není přihlášen');
      return NextResponse.json({ error: 'Unauthorized - not logged in' }, { status: 401 });
    }

    if (session.user.role !== 'partner') {
      console.log('Uživatel není partner:', session.user.role);
      return NextResponse.json({ error: 'Unauthorized - not a partner' }, { status: 403 });
    }

    console.log('Autorizovaný partner:', session.user.email);

    // Použijeme formData místo složitého parseru
    const formData = await req.formData();

    // Získáme všechna pole
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const issuer = formData.get('issuer') as string;
    const yieldValue = formData.get('yield') as string;
    const maturityDate = formData.get('maturityDate') as string;
    const minimumInvestment = formData.get('minimumInvestment') as string;
    const presentation = formData.get('presentation') as File | null;

    // Validate required fields
    if (!title || !description || !issuer || !yieldValue || !maturityDate || !minimumInvestment) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Upload presentation file if provided
    let presentationUrl = null;
    if (presentation) {
      // Přesunuto do hlavního try bloku, chyba při nahrávání bude zachycena níže
      console.log('Uploading presentation file:', presentation.name);
      const result = await uploadFile(presentation, 'presentations');
      presentationUrl = result.url;
      console.log('Presentation uploaded successfully:', presentationUrl);
      // Odstraněn specifický catch pro upload, bude zachycen hlavním catch blokem
    }

    // Fallback partnerId pro vývojové prostředí (pro testování)
    const partnerId = process.env.NODE_ENV === 'development' && !session?.user?.id
      ? "dev_partner_123"
      : session?.user?.id;

    // Příprava dat pro Supabase
    const bondData = {
      title,
      description,
      issuer,
      yield: parseFloat(yieldValue),
      maturity_date: new Date(maturityDate).toISOString(),
      minimum_investment: parseFloat(minimumInvestment),
      presentation_url: presentationUrl,
      partner_id: partnerId,
      status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    console.log('Vytvářím nový dluhopis v Supabase:', bondData);
    const result = await createBond(bondData); // Chyba zde bude zachycena hlavním catch blokem
    console.log('Dluhopis úspěšně vytvořen:', result);

    // Transformace dat pro kompatibilitu s původním formátem
    const transformedListing = {
      _id: result.id,
      title: result.title,
      description: result.description,
      issuer: result.issuer,
      yield: result.yield,
      maturityDate: result.maturity_date,
      minimumInvestment: result.minimum_investment,
      presentationUrl: result.presentation_url,
      partner: result.partner_id,
      status: result.status,
      createdAt: result.created_at,
      updatedAt: result.updated_at,
    };

    return NextResponse.json({
      success: true,
      listing: transformedListing,
    });

  } catch (error) { // Hlavní catch blok pro všechny chyby v POST handleru
    console.error('Detailed error creating listing:', error); // Log the full error server-side

    let userErrorMessage = 'Failed to create listing due to an unexpected server error.';
    let statusCode = 500;

    if (error instanceof Error) {
        // Check for specific error types or messages
        if (error.message.toLowerCase().includes('upload')) {
            userErrorMessage = 'Failed to upload presentation file. Please check the file and try again.';
        } else if (error.message.toLowerCase().includes('database') || error.message.toLowerCase().includes('constraint') || error.message.toLowerCase().includes('supabase') || error.message.toLowerCase().includes('createbond')) {
             userErrorMessage = 'Failed to save listing data to the database. Please check the data or try again later.';
             console.error('Database-related error details:', error); // Log more specific DB error details server-side
        } else if (error.message.toLowerCase().includes('unauthorized')) {
            userErrorMessage = 'Authorization failed.';
            statusCode = 403;
        }
        // Add more specific checks if needed based on common errors

        // For development, include more details in the message
        if (process.env.NODE_ENV === 'development') {
            userErrorMessage += ` (Dev Info: ${error.message})`;
        }
    }

    return NextResponse.json({ error: userErrorMessage }, { status: statusCode });
  }
} // Closing brace for POST function
