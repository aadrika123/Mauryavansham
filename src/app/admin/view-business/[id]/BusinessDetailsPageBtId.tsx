"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Loader from "@/src/components/ui/loader";

interface Partner {
  name: string;
}

interface Category {
  main: string;
  sub: string;
}

interface Address {
  office?: string;
  location?: string;
}

interface Photos {
  product?: string[];
  office?: string[];
}
interface Business {
  id: string;
  userId: string;
  organizationName: string;
  organizationType: string;
  businessCategory: string;
  businessDescription?: string;
  premiumCategory?: string;
  isActive: boolean;
  paymentStatus: boolean;
  createdAt: string;
  dateOfestablishment?: string;
  cin?: string;
  gst?: string;
  udyam?: string;
  partners?: Partner[];
  categories?: Category[];
  registeredAddress?: Address;
  branchOffices?: Address[];
  photos?: Photos;
}

export default function BusinessDetailsPage() {
  const { id  } = useParams() as unknown as any;
  const [business, setBusiness] = useState({} as Business);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchBusiness = async () => {
      try {
        const res = await fetch(`/api/businesses/${id}`);
        const data = await res.json();
        setBusiness(data.data);
      } catch (err) {
        console.error("Error fetching business:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBusiness();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center ">
        {/* <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-600 font-medium">Loading business details...</p>
        </div> */}
        <Loader />
      </div>
    );
  }

  if (!business) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-red-600 text-lg font-medium">Business not found</p>
        </div>
      </div>
    );
  }
  console.log(business, "business");

  return (
    <div className="min-h-screen bg-yellow-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {business.organizationName}
              </h1>
              <div className="flex flex-wrap gap-4 mb-4">
                <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
                  business.premiumCategory === 'Platinum' ? 'bg-purple-100 text-purple-800' :
                  business.premiumCategory === 'Gold' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  ⭐ {business.premiumCategory}
                </span>
                <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
                  business.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {business.isActive ? '✅ Active' : '❌ Inactive'}
                </span>
                <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
                  business.paymentStatus ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
                }`}>
                  {business.paymentStatus ? '💳 Paid' : '⏳ Payment Pending'}
                </span>
              </div>
              <p className="text-gray-600">
                {/* <strong>Business ID:</strong> {business.id} | 
                <strong> User ID:</strong> {business.userId} |  */}
                <strong> Registered On:</strong> {new Date(business.createdAt).toLocaleDateString('en-IN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Organization Information */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 border-b pb-2">
              📋 Organization Information
            </h2>
            <div className="space-y-4">
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-500">Organization Type</label>
                <p className="text-lg text-gray-900">{business.organizationType}</p>
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-500">Business Category</label>
                <p className="text-lg text-gray-900">{business.businessCategory}</p>
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-500">Date of Establishment</label>
                <p className="text-lg text-gray-900">
                  {business.dateOfestablishment 
                    ? new Date(business.dateOfestablishment).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })
                    : 'Not specified'
                  }
                </p>
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-500">Business Description</label>
                <p className="text-gray-900 leading-relaxed">{business.businessDescription}</p>
              </div>
            </div>
          </div>

          {/* Legal Information */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 border-b pb-2">
              📄 Legal Information
            </h2>
            <div className="space-y-4">
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-500">CIN Number</label>
                <p className="text-lg text-gray-900 font-mono">
                  {business.cin || 'Not provided'}
                </p>
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-500">GST Number</label>
                <p className="text-lg text-gray-900 font-mono">
                  {business.gst || 'Not provided'}
                </p>
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-500">Udyam Registration</label>
                <p className="text-lg text-gray-900 font-mono">
                  {business.udyam || 'Not provided'}
                </p>
              </div>
            </div>
          </div>

          {/* Partners */}
          {business.partners && business.partners.length > 0 && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6 border-b pb-2">
                👥 Partners ({business.partners.length})
              </h2>
              <div className="space-y-3">
                {business.partners.map((partner, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-semibold">{partner.name.charAt(0).toUpperCase()}</span>
                    </div>
                    <span className="text-gray-900 font-medium">{partner.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Categories */}
          {business.categories && business.categories.length > 0 && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6 border-b pb-2">
                🏷️ Business Categories
              </h2>
              <div className="space-y-3">
                {business.categories.map((category, index) => (
                  <div key={index} className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <span className="text-blue-800 font-semibold">{category.main}</span>
                      <span className="text-blue-600">→</span>
                      <span className="text-blue-700">{category.sub}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Address Information */}
        <div className="bg-white rounded-xl shadow-lg p-6 mt-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 border-b pb-2">
            📍 Address Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Registered Office</h3>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-900">{business.registeredAddress?.office || 'Not provided'}</p>
                {business.registeredAddress?.location && (
                  <p className="text-gray-600 mt-2">{business.registeredAddress.location}</p>
                )}
              </div>
            </div>

            {business.branchOffices && business.branchOffices.length > 0 && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">
                  Branch Offices ({business.branchOffices.length})
                </h3>
                <div className="space-y-3">
                  {business.branchOffices.map((branch, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-gray-900">{branch.office}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Photos Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mt-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 border-b pb-2">
            📸 Business Photos
          </h2>

          {business.photos?.product && business.photos.product.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xl font-medium text-gray-900 mb-4">
                🏭 Product Photos ({business.photos.product.length})
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {business.photos.product.map((url, index) => (
                  <div key={`product-${index}`} className="group relative">
                    <img
                      src={url}
                      alt={`Product ${index + 1}`}
                      className="w-full h-48 object-cover rounded-lg border border-gray-200 shadow-sm group-hover:shadow-lg transition-shadow duration-200"
                    //   onError={(e) => {
                    //     e.target.src = '/placeholder-image.jpg';
                    //     e.target.alt = 'Image unavailable';
                    //   }}
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity duration-200 rounded-lg flex items-center justify-center">
                      <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity">
                        🔍 View
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {business.photos?.office && business.photos.office.length > 0 && (
            <div>
              <h3 className="text-xl font-medium text-gray-900 mb-4">
                🏢 Office Photos ({business.photos.office.length})
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {business.photos.office.map((url, index) => (
                  <div key={`office-${index}`} className="group relative">
                    <img
                      src={url}
                      alt={`Office ${index + 1}`}
                      className="w-full h-48 object-cover rounded-lg border border-gray-200 shadow-sm group-hover:shadow-lg transition-shadow duration-200"
                    //   onError={(e) => {
                    //     e.target.src = '/placeholder-image.jpg';
                    //     e.target.alt = 'Image unavailable';
                    //   }}
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity duration-200 rounded-lg flex items-center justify-center">
                      <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity">
                        🔍 View
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {(!business.photos?.product?.length && !business.photos?.office?.length) && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📷</div>
              <p className="text-gray-500 text-lg">No photos uploaded yet</p>
            </div>
          )}
        </div>

        {/* Summary Footer */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg p-6 mt-8 text-white">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold mb-2">Business Summary</h3>
              <p className="text-blue-100">
                {business.organizationType} • {business.businessCategory} • 
                {business.partners?.length || 0} Partner(s) • 
                Established {business.dateOfestablishment ? new Date(business.dateOfestablishment).getFullYear() : 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
