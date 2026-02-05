'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

interface Branch {
  name: string;
  address: string;
  phone: string;
}

interface HealthService {
  id: number;
  centerName: string;
  category: string;
  ownerName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  offerings: string[];
  branches: Branch[];
  logoUrl?: string;
  docUrls?: string[];
  about?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

const MyRegisteredHealthServices = () => {
  const { data: session } = useSession();
  const [services, setServices] = useState<HealthService[]>([]);
  const [selectedService, setSelectedService] = useState<HealthService | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchHealthServices = async () => {
    try {
      if (!session?.user?.id) return;
      const res = await fetch(`/api/health-services?userId=${session.user.id}`);
      const data = await res.json();
      if (data.success) setServices(data.data);
    } catch (err) {
      console.error('Error fetching health services:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealthServices();
  }, [session]);

  if (loading) return <p className="p-6 text-gray-500">Loading your registered centers...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">My Registered Health & Wellness Centers</h1>

      {services.length === 0 ? (
        <p className="text-gray-500">No centers registered yet.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map(center => (
            <div
              key={center.id}
              className="bg-white shadow-md rounded-xl p-4 border hover:shadow-lg transition relative"
            >
              {/* Logo */}
              {center.logoUrl && (
                <img src={center.logoUrl} alt="logo" className="w-20 h-20 object-cover rounded-md mb-3" />
              )}

              {/* Basic Info */}
              <h2 className="text-lg font-bold mb-1">{center.centerName}</h2>
              <p className="text-sm text-gray-600">Category: {center.category || 'N/A'}</p>
              <p className="text-sm text-gray-600">City: {center.city || 'N/A'}</p>
              <p className="text-sm text-gray-600">Owner: {center.ownerName}</p>

              {/* Status Badge */}
              <span
                className={`inline-block mt-2 px-2 py-0.5 text-xs rounded-full ${
                  center.status === 'approved'
                    ? 'bg-green-100 text-green-700'
                    : center.status === 'rejected'
                      ? 'bg-red-100 text-red-700'
                      : 'bg-yellow-100 text-yellow-700'
                }`}
              >
                {center.status ? center.status.toUpperCase() : 'PENDING'}
              </span>

              {/* View Button */}
              <button
                onClick={() => setSelectedService(center)}
                className="mt-3 bg-blue-600 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-700 w-full"
              >
                View Complete Details
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {selectedService && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-[90%] max-w-2xl p-6 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedService(null)}
              className="absolute top-3 right-4 text-gray-600 hover:text-black text-xl"
            >
              ×
            </button>

            {/* Logo */}
            {selectedService.logoUrl && (
              <img
                src={selectedService.logoUrl}
                alt="logo"
                className="w-24 h-24 object-cover rounded-md mb-4 mx-auto"
              />
            )}

            <h2 className="text-2xl font-bold mb-3 text-center">{selectedService.centerName}</h2>

            {/* Basic Info */}
            <div className="space-y-2 text-gray-700">
              <p>
                <strong>Category:</strong> {selectedService.category}
              </p>
              <p>
                <strong>Owner:</strong> {selectedService.ownerName}
              </p>
              <p>
                <strong>Email:</strong> {selectedService.email || 'N/A'}
              </p>
              <p>
                <strong>Phone:</strong> {selectedService.phone}
              </p>
              <p>
                <strong>Address:</strong> {selectedService.address}, {selectedService.city}, {selectedService.state} -{' '}
                {selectedService.pincode}
              </p>
              <p>
                <strong>Registered On:</strong> {new Date(selectedService.createdAt || '').toLocaleDateString()}
              </p>
              <p>
                <strong>About:</strong> {selectedService.about || 'N/A'}
              </p>
            </div>

            {/* Offerings */}
            {selectedService.offerings?.length > 0 ? (
              <div className="mt-4">
                <h3 className="font-semibold mb-2">Services / Offerings:</h3>
                <ul className="list-disc ml-6 text-gray-600">
                  {selectedService.offerings.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="mt-4 text-sm text-gray-500">No offerings added yet.</p>
            )}

            {/* Branches */}
            {selectedService.branches?.length > 0 && (
              <div className="mt-4">
                <h3 className="font-semibold mb-2">Branches:</h3>
                {selectedService.branches.map((b, i) => (
                  <div key={i} className="text-gray-600 mb-1 border-b pb-1">
                    <p>
                      <strong>{b.name}</strong>
                    </p>
                    <p>{b.address}</p>
                    <p className="text-sm text-gray-500">📞 {b.phone}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Uploaded Documents */}
            {selectedService.docUrls && selectedService.docUrls.length > 0 && (
              <div className="mt-4">
                <h3 className="font-semibold mb-2">Uploaded Documents:</h3>
                <div className="grid grid-cols-2 gap-3">
                  {selectedService.docUrls.map((url, i) => (
                    <a
                      key={i}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block border rounded-lg overflow-hidden hover:shadow-md"
                    >
                      {url.endsWith('.pdf') ? (
                        <div className="flex flex-col items-center justify-center p-6">
                          <img src="/pdf-icon.png" alt="PDF" className="w-12 h-12 mb-2" />
                          <p className="text-sm text-gray-600">View PDF</p>
                        </div>
                      ) : (
                        <img src={url} alt={`Document ${i + 1}`} className="w-full h-40 object-cover" />
                      )}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MyRegisteredHealthServices;
