'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { Lock, User, X, Search } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/src/components/ui/toastProvider';
// import { useToast } from "@/src/components/ui/toastProvider";

// 🔸 Book Your Ad (13) Component
const HorizontalAdSlider13: React.FC<{ ads: any[] }> = ({ ads }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (ads.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % ads.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [ads.length]);

  // 🔹 Track ad views
  useEffect(() => {
    if (ads[currentIndex]) {
      fetch(`/api/ad-placements/${ads[currentIndex].id}`, { method: 'POST' });
    }
  }, [currentIndex, ads]);

  // 🔸 If no ads found
  if (ads.length === 0) {
    return (
      <div className="mx-auto relative w-full max-w-[900px] h-[200px] sm:h-[250px] md:h-[300px]">
        <div className="bg-gradient-to-r from-amber-100 via-yellow-50 to-amber-100 border-4 border-amber-300 rounded-2xl shadow-2xl w-full h-full flex items-center justify-center text-center p-4">
          <div>
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-amber-800">Book Your Ad (13)</h3>
            <span className="text-sm font-normal text-amber-700">Please select image size of (900x300 px)</span>
          </div>
        </div>
      </div>
    );
  }

  // 🔸 Render slider
  return (
    <div className="mx-auto relative w-full max-w-[900px]">
      <div className="bg-gradient-to-r from-amber-100 via-yellow-50 to-amber-100 border-4 border-amber-300 rounded-2xl shadow-2xl overflow-hidden">
        <div className="relative p-4 sm:p-8 text-center h-[200px] sm:h-[250px] md:h-[300px]">
          {ads.map((ad, index) => (
            <div
              key={ad.id}
              className={`absolute inset-0  transition-opacity duration-1000 ${
                index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 pointer-events-none z-0'
              }`}
            >
              <a href={ad.adUrl} target="_blank" rel="noopener noreferrer" className="inline-block w-full h-full">
                <img
                  src={ad.bannerImageUrl}
                  alt={`Ad ${index + 1}`}
                  className="mx-auto rounded-xl shadow-lg w-full h-full object-fill"
                />
              </a>
            </div>
          ))}

          {/* 🔸 Dots + Counter */}
          {ads.length > 1 && (
            <>
              <div className="absolute top-6 right-6 bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm z-20">
                {currentIndex + 1} / {ads.length}
              </div>
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2 z-20">
                {ads.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-200 ${
                      index === currentIndex ? 'bg-amber-600 scale-125' : 'bg-amber-400/50 hover:bg-amber-400/75'
                    }`}
                    aria-label={`Go to ad ${index + 1}`}
                    type="button"
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default function CoachingCentersPage({ user }: any) {
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [centers, setCenters] = useState<any[]>([]);
  const [filteredCenters, setFilteredCenters] = useState<any[]>([]);
  const { data: session } = useSession();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const Router = useRouter();

  // 🔹 Search state (single input)
  const [searchTerm, setSearchTerm] = useState('');

  // 🔹 Image Modal
  const [showImageModal, setShowImageModal] = useState(false);
  const [modalImages, setModalImages] = useState<string[]>([]);
  const [modalIndex, setModalIndex] = useState(0);

  // 🔹 Know More Modal
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedCenter, setSelectedCenter] = useState<any>(null);
  // Inside CoachingCentersPage component
  const [showEnquireModal, setShowEnquireModal] = useState(false);
  const [enquireComment, setEnquireComment] = useState('');
  const [enquireTarget, setEnquireTarget] = useState<any>(null);

  const [topCourses, setTopCourses] = useState<string[]>([
    'Spoken English',
    'IELTS / TOEFL Preparation',
    'Digital Marketing',
    'Web Development',
    'Data Science',
    'Graphic Design',
    'Computer Basics',
    'Tally & Accounting',
    'Python Programming',
    'Java Full Stack',
    'Frontend Development',
    'Backend Development',
    'Mobile App Development',
    'UI/UX Design',
    'Content Writing',
    'Public Speaking',
    'Soft Skills Training',
    'NEET / JEE Preparation',
    'UPSC / IAS Coaching',
    'Bank / SSC Coaching'
  ]);

  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [showAllCourses, setShowAllCourses] = useState(false);
  console.log(enquireTarget, 'enq');
  // Update top courses dynamically based on all centers
  useEffect(() => {
    const allCourses = new Set(topCourses);
    centers.forEach(center => {
      center.courses?.forEach((course: string) => allCourses.add(course));
    });
    setTopCourses(Array.from(allCourses));
  }, [centers]);

  // Handle course click to filter centers
  const handleCourseClick = (course: string) => {
    if (selectedCourse === course) {
      // Clicking again resets filter
      setSelectedCourse(null);
      setFilteredCenters(centers);
      return;
    }

    setSelectedCourse(course);
    const filtered = centers.filter(center =>
      center.courses?.some((c: string) => c.toLowerCase() === course.toLowerCase())
    );
    setFilteredCenters(filtered);
  };

  const handleKnowMore = (center: any) => {
    setSelectedCenter(center);
    setShowDetailsModal(true);
  };

  useEffect(() => {
    if (session?.user) setCurrentUser(session.user);
  }, [session]);
  const [adPlacements, setAdPlacements] = useState<any[]>([]);
  const topAds = adPlacements.filter(ad => ad.placementId === 13);

  useEffect(() => {
    fetch('/api/ad-placements/approved')
      .then(res => res.json())
      .then(data => setAdPlacements(data))
      .catch(() => console.error('Failed to load ad placements'));
  }, []);

  // Fetch coaching centers
  useEffect(() => {
    const fetchCenters = async () => {
      try {
        const res = await fetch('/api/coaching-centers/allData');
        const json = await res.json();
        if (json.success) {
          setCenters(json.data);
          setFilteredCenters(json.data);
        }
      } catch (err) {
        console.error('Error fetching centers', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCenters();
  }, []);

  // 🔹 Filter Logic (Single search for all fields)
  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setFilteredCenters(centers);
      return;
    }

    const term = searchTerm.toLowerCase();
    const filtered = centers.filter(center => {
      return (
        center.centerName?.toLowerCase().includes(term) ||
        center.ownerName?.toLowerCase().includes(term) ||
        center.city?.toLowerCase().includes(term) ||
        center.state?.toLowerCase().includes(term) ||
        center.courses?.some((c: string) => c.toLowerCase().includes(term))
      );
    });

    setFilteredCenters(filtered);
  };

  // 🔹 Reset
  const handleReset = () => {
    setSearchTerm('');
    setFilteredCenters(centers);
  };

  // 🔹 Image Modal
  const openImageModal = (images: string[], index: number) => {
    setModalImages(images);
    setModalIndex(index);
    setShowImageModal(true);
  };

  const handleEnquiry = (center: any) => {
    console.log(center, 'center');
    if (!user) {
      setShowLoginModal(true);
      return;
    }
    setEnquireTarget(center);
    setEnquireComment('');
    setShowEnquireModal(true);
  };

  // Separate function for sending enquiry
  const sendEnquiry = async () => {
    if (!user || !enquireTarget) return;

    if (!enquireComment.trim()) {
      addToast({
        title: 'Error',
        description: 'Please write a comment before sending!',
        variant: 'destructive'
      });
      return;
    }

    if (enquireComment.trim().split(/\s+/).length > 100) {
      addToast({
        title: 'Error',
        description: 'Maximum 100 words allowed!',
        variant: 'destructive'
      });
      return;
    }

    try {
      // 1️⃣ Save in DB
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          comment: enquireComment,
          enquireType: 'education',
          senderUserId: user.id,
          receiverUserId: enquireTarget.userId
        })
      });

      let data: any = {};
      const text = await res.text();
      if (text) {
        data = JSON.parse(text);
      }

      if (res.ok) {
        // Send email
        await fetch('/api/send-education-query-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            businessOwnerEmail: enquireTarget.email,
            currentUser: user
          })
        });

        addToast({
          title: 'Success',
          description: 'Enquiry sent successfully!',
          variant: 'success'
        });
        setShowEnquireModal(false);
        setEnquireComment('');
      } else {
        addToast({
          title: 'Error',
          description: data.error || 'Failed to send enquiry',
          variant: 'destructive'
        });
        setShowEnquireModal(false);
        setEnquireComment('');
      }
    } catch (err) {
      console.error(err);
      addToast({
        title: 'Error',
        description: 'Something went wrong.',
        variant: 'destructive'
      });
      setShowEnquireModal(false);
    }
  };

  if (loading) return <p className="p-6 text-gray-500">Loading coaching centers...</p>;

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-4 md:p-6 bg-yellow-50 min-h-screen">
      {/* 🔹 Image Modal */}
      {showImageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <div className="relative w-full max-w-3xl">
            <button
              onClick={() => setShowImageModal(false)}
              className="absolute top-2 right-2 bg-white rounded-full p-2 shadow"
            >
              <X className="h-5 w-5 text-black" />
            </button>
            <img src={modalImages[modalIndex]} alt="modal-img" className="w-full max-h-[80vh] object-contain rounded" />
          </div>
        </div>
      )}

      {/* 🔹 Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-red-700 flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Login Required
              </h3>
              <button onClick={() => setShowLoginModal(false)} className="text-gray-500 hover:text-gray-700">
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="text-gray-600 mb-6">Please login to connect with centers or send enquiries.</p>
            <div className="space-y-3">
              <Button
                onClick={() => Router.push('/sign-in')}
                className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white"
              >
                <User className="h-4 w-4 mr-2" />
                Login
              </Button>
              <Button onClick={() => setShowLoginModal(false)} variant="outline" className="w-full">
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 🔹 Left Sidebar */}
      <div className="w-full lg:w-60">
        <Card className="p-4 shadow-md bg-[#FFF8DE] border border-[#FFF6D5] mb-6 lg:mb-0">
          <h2 className="text-lg font-bold mb-3 text-red-700">Top Courses Offered</h2>
          <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-1 gap-2 text-gray-700 text-sm">
            {(showAllCourses ? topCourses : topCourses.slice(0, 10)).map((course, i) => (
              <li
                key={i}
                onClick={() => handleCourseClick(course)}
                className={`hover:text-blue-600 cursor-pointer ${
                  selectedCourse === course ? 'font-bold text-blue-700' : ''
                }`}
              >
                {course}
              </li>
            ))}
          </ul>
          <p
            onClick={() => setShowAllCourses(prev => !prev)}
            className="mt-3 text-red-700 underline text-sm cursor-pointer text-center"
          >
            {showAllCourses ? 'Show Less' : 'View all Courses'}
          </p>
        </Card>
      </div>

      {/* 🔹 Main Content */}
      <div className="flex-1">
        {/* 🔍 Unified Search Bar */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-6 flex flex-col sm:flex-row items-center gap-3 border">
          <div className="flex items-center w-full gap-2">
            <Search className="text-gray-500" />
            <input
              type="text"
              placeholder="Search by course, category, city or coaching name..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

          <div className="flex gap-2 w-full sm:w-auto justify-end">
            <Button onClick={handleSearch} className="bg-orange-500 hover:bg-orange-600 text-white">
              Search
            </Button>
            <Button
              variant="outline"
              onClick={handleReset}
              className="border-orange-400 text-orange-500 hover:bg-orange-50"
            >
              Reset
            </Button>
          </div>
        </div>

        {/* Banner */}
        {/* 🔹 Book Your Ad (13) */}
        <div className="mb-6 flex justify-center">
          <HorizontalAdSlider13 ads={topAds} />
        </div>

        <h2 className="text-lg sm:text-xl font-bold text-red-700 mb-6">Coaching and Institutes</h2>

        <div className="space-y-6">
          {filteredCenters.length > 0 ? (
            filteredCenters.map((center, i) => {
              const images = center.docUrls || [];
              const logo = center.logoUrl;
              return (
                <Card key={i} className="relative shadow-lg bg-white border border-yellow-200">
                  <CardContent className="p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Image */}
                    <div className="flex justify-center">
                      {/* {images.length > 0 ? ( */}
                      <img
                        src={images[0] || logo}
                        alt={center.centerName}
                        className="w-32 h-32 sm:w-40 sm:h-40 object-cover rounded border cursor-pointer"
                        onClick={() => openImageModal(images, 0)}
                      />
                      {/* ) : (
                        <div className="w-32 h-32 sm:w-40 sm:h-40 flex items-center justify-center border rounded bg-gray-100 text-xs text-gray-500">
                          No Image
                        </div>
                      )} */}
                    </div>

                    {/* Details */}
                    <div className="flex flex-col justify-between">
                      <div>
                        <h3 className="font-semibold text-base sm:text-lg">{center.centerName}</h3>
                        <p className="text-sm text-gray-600">Owner: {center.ownerName}</p>
                        <p className="text-sm text-gray-600">
                          City: {center.city}, {center.state}
                        </p>
                        <div className="mt-2">
                          <p className="text-sm font-medium">Courses:</p>
                          {center.courses?.length > 0 ? (
                            <ul className="list-disc ml-5 text-sm text-gray-700">
                              {center.courses.map((course: string, idx: number) => (
                                <li key={idx}>{course}</li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-sm text-gray-500">No courses added</p>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2 mt-4">
                        <Button
                          onClick={() => handleEnquiry(center)}
                          className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white text-sm px-4 py-2"
                        >
                          Enquire
                        </Button>
                        <Button
                          onClick={() => handleKnowMore(center)}
                          className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white text-sm px-4 py-2"
                        >
                          Know More
                        </Button>
                      </div>
                    </div>

                    {/* About */}
                    <div>
                      {center.about ? (
                        <>
                          <p className="text-sm font-medium">About:</p>
                          <p className="text-sm text-gray-700 line-clamp-4">{center.about}</p>
                        </>
                      ) : (
                        <p className="text-sm text-gray-500 italic">No description available.</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })
          ) : (
            <p className="text-center text-gray-600">No coaching centers found for your search.</p>
          )}
        </div>
      </div>

      {/* 🔹 Know More Modal */}
      {showDetailsModal && selectedCenter && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl w-full relative overflow-y-auto max-h-[90vh]">
            {/* Close Button */}
            <button
              onClick={() => setShowDetailsModal(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Title */}
            <h2 className="text-xl font-bold mb-4 text-red-700 text-center">{selectedCenter.centerName}</h2>

            {/* Main Image (first document or logo) */}
            {selectedCenter.docUrls?.length > 0 ? (
              <img
                src={selectedCenter.docUrls[0]}
                alt={selectedCenter.centerName}
                className="w-40 h-40 object-cover rounded mb-4 mx-auto"
              />
            ) : selectedCenter.logoUrl ? (
              <img
                src={selectedCenter.logoUrl}
                alt={selectedCenter.centerName}
                className="w-40 h-40 object-cover rounded mb-4 mx-auto"
              />
            ) : null}

            {/* Basic Info */}
            <div className="space-y-2 text-gray-700">
              <p>
                <strong>Owner:</strong> {selectedCenter.ownerName}
              </p>
              <p>
                <strong>Email:</strong> {selectedCenter.email || 'N/A'}
              </p>
              <p>
                <strong>Phone:</strong> {selectedCenter.phone}
              </p>
              <p>
                <strong>Address:</strong>{' '}
                {selectedCenter.address
                  ? `${selectedCenter.address}, ${selectedCenter.city}, ${selectedCenter.state} - ${selectedCenter.pincode}`
                  : 'N/A'}
              </p>
              {selectedCenter.category && (
                <p>
                  <strong>Category:</strong> {selectedCenter.category}
                </p>
              )}
            </div>

            {/* About Section */}
            {selectedCenter.about && (
              <div className="mt-4">
                <h3 className="font-semibold mb-1 text-red-700">About:</h3>
                <p className="text-sm text-gray-700 whitespace-pre-line">{selectedCenter.about}</p>
              </div>
            )}

            {/* Offerings */}
            {selectedCenter.offerings?.length > 0 && (
              <div className="mt-4">
                <h3 className="font-semibold mb-2 text-red-700">Services Offered:</h3>
                <ul className="list-disc ml-6 text-gray-700">
                  {selectedCenter.offerings.map((service: string, i: number) => (
                    <li key={i}>{service}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Uploaded Documents */}
            {selectedCenter.docUrls?.length > 0 && (
              <div className="mt-6">
                <h3 className="font-semibold mb-2 text-red-700">Uploaded Documents:</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {selectedCenter.docUrls.map((url: string, i: number) => (
                    <a
                      key={i}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block border rounded-lg overflow-hidden hover:shadow-md transition"
                    >
                      {url.endsWith('.pdf') ? (
                        <div className="flex flex-col items-center justify-center p-4 bg-gray-50">
                          <img src="/pdf-icon.png" alt="PDF" className="w-10 h-10 mb-2" />
                          <p className="text-xs text-gray-600">View PDF</p>
                        </div>
                      ) : (
                        <img src={url} alt={`Document ${i + 1}`} className="w-full h-32 object-cover" />
                      )}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      {showEnquireModal && enquireTarget && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-red-700">Send Enquiry to {enquireTarget.ownerName}</h3>
              <button onClick={() => setShowEnquireModal(false)} className="text-gray-500 hover:text-gray-700">
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="text-gray-600 mb-2">Add a comment (max 400 characters / 100 words)</p>
            <textarea
              value={enquireComment}
              onChange={e => setEnquireComment(e.target.value)}
              maxLength={400}
              rows={5}
              className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
              placeholder="Write your message..."
            />

            <div className="mt-4 flex gap-2 justify-end">
              <Button
                className="bg-orange-500 hover:bg-orange-600 text-white"
                onClick={sendEnquiry} // ✅ Sirf function call
              >
                Send
              </Button>

              <Button variant="outline" onClick={() => setShowEnquireModal(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
