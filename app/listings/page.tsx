import Link from 'next/link';
import { BondListing } from '@/models';
import { connectToDatabase } from '@/lib/mongodb';

async function getListings() {
  try {
    const { db } = await connectToDatabase();
    const listings = await db
      .collection('bondlistings')
      .find({ status: 'active' })
      .sort({ createdAt: -1 })
      .limit(20)
      .toArray();
    
    return JSON.parse(JSON.stringify(listings));
  } catch (error) {
    console.error('Error fetching listings:', error);
    return [];
  }
}

export default async function ListingsPage() {
  const listings = await getListings();

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Bond Listings
          </h1>
          <p className="mt-4 text-lg text-gray-500">
            Explore our curated selection of premium bond investment opportunities.
          </p>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {listings.length > 0 ? (
            listings.map((listing: any) => (
              <div key={listing._id} className="card overflow-hidden">
                <div className="bg-gray-200 h-48 flex items-center justify-center">
                  <span className="text-gray-500">Bond Image</span>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{listing.title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">{listing.description}</p>
                  <div className="flex flex-col gap-2 mb-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Issuer:</span>
                      <span className="font-medium">{listing.issuer}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Yield:</span>
                      <span className="font-medium text-primary-600">{listing.yield}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Maturity:</span>
                      <span className="font-medium">
                        {new Date(listing.maturityDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Min. Investment:</span>
                      <span className="font-medium">${listing.minimumInvestment.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <Link
                      href={`/listings/${listing._id}`}
                      className="btn-primary"
                    >
                      View Details
                    </Link>
                    {listing.presentationUrl && (
                      <a
                        href={listing.presentationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-600 hover:text-primary-700"
                      >
                        View Presentation
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500 text-lg">No bond listings available at the moment.</p>
              <p className="mt-2 text-gray-500">Please check back later for new investment opportunities.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
