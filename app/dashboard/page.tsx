'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [listings, setListings] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('listings');

  useEffect(() => {
    // Redirect if not logged in or not a partner
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    } else if (status === 'authenticated' && session.user.role !== 'partner') {
      router.push('/');
    }
  }, [status, session, router]);

  useEffect(() => {
    if (status === 'authenticated' && session.user.role === 'partner') {
      // Fetch listings
      const fetchListings = async () => {
        try {
          const response = await fetch('/api/listings?partner=true');
          if (!response.ok) {
            throw new Error('Failed to fetch listings');
          }
          const data = await response.json();
          setListings(data.listings || []);
        } catch (error) {
          console.error('Error fetching listings:', error);
          setError('Failed to load listings');
        }
      };

      // Fetch orders
      const fetchOrders = async () => {
        try {
          const response = await fetch('/api/orders');
          if (!response.ok) {
            throw new Error('Failed to fetch orders');
          }
          const data = await response.json();
          setOrders(data.orders || []);
        } catch (error) {
          console.error('Error fetching orders:', error);
          setError('Failed to load orders');
        } finally {
          setLoading(false);
        }
      };

      fetchListings();
      fetchOrders();
    }
  }, [status, session]);

  if (status === 'loading' || (status === 'authenticated' && loading)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Loading...</h1>
          <p className="mt-2 text-gray-500">Please wait while we load your dashboard.</p>
        </div>
      </div>
    );
  }

  if (status === 'authenticated' && session.user.role === 'partner') {
    return (
      <div className="bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="border-b border-gray-200 pb-5 sm:flex sm:items-center sm:justify-between">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Partner Dashboard
            </h1>
            <div className="mt-3 sm:mt-0 sm:ml-4">
              <Link href="/dashboard/new-listing" className="btn-primary">
                Create New Listing
              </Link>
            </div>
          </div>

          {error && (
            <div className="mt-6 bg-red-50 p-4 rounded-md">
              <div className="text-sm text-red-700">{error}</div>
            </div>
          )}

          <div className="mt-6">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab('listings')}
                  className={`${
                    activeTab === 'listings'
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  My Listings
                </button>
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`${
                    activeTab === 'orders'
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  Orders
                </button>
              </nav>
            </div>

            {activeTab === 'listings' && (
              <div className="mt-6">
                {listings.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-300">
                      <thead>
                        <tr>
                          <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
                            Title
                          </th>
                          <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                            Issuer
                          </th>
                          <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                            Yield
                          </th>
                          <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                            Maturity
                          </th>
                          <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                            Status
                          </th>
                          <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                            <span className="sr-only">Actions</span>
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {listings.map((listing: any) => (
                          <tr key={listing._id}>
                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                              {listing.title}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {listing.issuer}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {listing.yield}%
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {new Date(listing.maturityDate).toLocaleDateString()}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm">
                              <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                                listing.status === 'active' 
                                  ? 'bg-green-100 text-green-800' 
                                  : listing.status === 'sold' 
                                  ? 'bg-gray-100 text-gray-800'
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {listing.status.charAt(0).toUpperCase() + listing.status.slice(1)}
                              </span>
                            </td>
                            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                              <Link href={`/listings/${listing._id}`} className="text-primary-600 hover:text-primary-900 mr-4">
                                View
                              </Link>
                              <Link href={`/dashboard/edit-listing/${listing._id}`} className="text-primary-600 hover:text-primary-900">
                                Edit
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">You don't have any listings yet.</p>
                    <p className="mt-2 text-gray-500">Create your first bond listing to get started.</p>
                    <div className="mt-6">
                      <Link href="/dashboard/new-listing" className="btn-primary">
                        Create New Listing
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="mt-6">
                {orders.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-300">
                      <thead>
                        <tr>
                          <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
                            Bond
                          </th>
                          <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                            Customer
                          </th>
                          <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                            Amount
                          </th>
                          <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                            Date
                          </th>
                          <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                            Status
                          </th>
                          <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                            <span className="sr-only">Actions</span>
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {orders.map((order: any) => (
                          <tr key={order._id}>
                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                              {order.bondListing?.title || 'Unknown Bond'}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {order.name}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              ${order.amount.toLocaleString()}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm">
                              <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                                order.status === 'completed' 
                                  ? 'bg-green-100 text-green-800' 
                                  : order.status === 'cancelled' 
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                              </span>
                            </td>
                            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                              <Link href={`/dashboard/orders/${order._id}`} className="text-primary-600 hover:text-primary-900">
                                View Details
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">You don't have any orders yet.</p>
                    <p className="mt-2 text-gray-500">Orders will appear here when customers express interest in your bonds.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return null;
}
