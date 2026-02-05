'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Badge } from '@/src/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/src/components/ui/select';
import {
  ArrowLeft,
  Plus,
  Search,
  Filter,
  Trophy,
  CheckCircle,
  Share,
  User,
  Calendar,
  MapPin,
  Award,
  Lock,
  X
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
// import { Dialog, DialogContent, DialogTitle } from "@radix-ui/react-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/src/components/ui/dialog';
import CreateAchievementForm from './createAchievementForm';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
interface Achievement {
  id: number;
  name: string;
  title: string;
  description: string;
  image: string;
  category: 'Healthcare' | 'Sports' | 'Technology' | 'Education' | 'Business' | 'Arts';
  isVerified: boolean;
  isFeatured: boolean;
  isHallOfFame: boolean;
  year: number;
  location: string;
  keyAchievement: string;
  impact: string;
  achievements: string[];
  status: string;
  createdBy: string;
  createdById: string;
  removedBy?: string;
  removedById?: string;
  removedAt?: string;
  createdAt: string;
  updatedAt: string;
  reason?: string;
  updatedBy?: string;
  updatedById?: string;
  images: string[];
  currentImageIndex: number;
}

interface AchievementsClientProps {
  initialAchievements?: Achievement[];
}
interface AdPlacement {
  id: number;
  bannerImageUrl: string;
  link?: string;
  views: number;
  placementId: number;
  adUrl: string;
}

const HorizontalAdSlider: React.FC<{ ads: AdPlacement[] }> = ({ ads }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (ads.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % ads.length);
    }, 10000);

    return () => clearInterval(timer);
  }, [ads.length]);

  useEffect(() => {
    if (ads[currentIndex]) {
      fetch(`/api/ad-placements/${ads[currentIndex].id}`, { method: 'POST' });
    }
  }, [currentIndex, ads]);

  if (ads.length === 0) {
    return (
      <div className="mx-auto relative w-full max-w-[900px] h-[200px] sm:h-[250px] md:h-[300px]">
        <div className="bg-gradient-to-r from-amber-100 via-yellow-50 to-amber-100 border-4 border-amber-300 rounded-2xl shadow-2xl w-full h-full flex items-center justify-center text-center p-4">
          <div>
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-amber-800">Book Your Ad (10)</h3>
            <span className="text-sm font-normal text-amber-700">Please select image size of (900x300 px)</span>
          </div>
        </div>
      </div>
    );
  }

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
export default function AchievementsClient({ initialAchievements }: AchievementsClientProps) {
  const { data: session } = useSession();
  const Router = useRouter();
  const [activeTab, setActiveTab] = useState('hall-of-fame');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [adPlacements, setAdPlacements] = useState<AdPlacement[]>([]);
  const bottomAds = adPlacements.filter(ad => ad.placementId === 10);
  const [currentFeaturedIndex, setCurrentFeaturedIndex] = useState(0);
  const [openForm, setOpenForm] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  console.log(initialAchievements);

  useEffect(() => {
    fetch('/api/ad-placements/approved')
      .then(res => res.json())
      .then((data: AdPlacement[]) => {
        setAdPlacements(data);
      })
      .catch(() => console.error('Failed to load ad placements'));
  }, []);
  const [achievements, setAchievements] = useState<Achievement[]>(initialAchievements || []);
  const featuredAchievements = achievements.filter(achievement => achievement.isFeatured);

  const hallOfFameMembers = achievements.filter(achievement => achievement.isHallOfFame || !achievement.isHallOfFame);
  const recentAchievements = achievements.filter(achievement => achievement.year === 2024);

  const filteredAchievements = achievements.filter(achievement => {
    const matchesSearch =
      achievement.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      achievement.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      achievement.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      filterCategory === 'all' || achievement.category.toLowerCase() === filterCategory.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Healthcare':
        return 'bg-pink-100 text-pink-800';
      case 'Sports':
        return 'bg-yellow-100 text-yellow-800';
      case 'Technology':
        return 'bg-blue-100 text-blue-800';
      case 'Education':
        return 'bg-green-100 text-green-800';
      case 'Business':
        return 'bg-purple-100 text-purple-800';
      case 'Arts':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Healthcare':
        return '🏥';
      case 'Sports':
        return '🏆';
      case 'Technology':
        return '💻';
      case 'Education':
        return '📚';
      case 'Business':
        return '💼';
      case 'Arts':
        return '🎨';
      default:
        return '⭐';
    }
  };
  useEffect(() => {
    if (featuredAchievements.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentFeaturedIndex(prev => (prev + 1) % featuredAchievements.length);
    }, 10000);
    return () => clearInterval(timer);
  }, [featuredAchievements.length]);

  useEffect(() => {
    const interval = setInterval(() => {
      setAchievements(prev =>
        prev.map(ach => {
          if (ach.isFeatured && ach.images && ach.images.length > 1) {
            const currentIndex = ach.currentImageIndex || 0;
            return {
              ...ach,
              currentImageIndex: (currentIndex + 1) % ach.images.length
            };
          }
          return ach;
        })
      );
    }, 3000); // change every 3 seconds
    return () => clearInterval(interval);
  }, []);

  console.log(featuredAchievements);
  return (
    <div className="min-h-screen bg-yellow-50">
      {/* Header */}
      {/* <div className="bg-yellow-50 border-b border-gray-200 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center  text-gray-600 hover:text-red-700"
            >
              <ArrowLeft className="w-4 h-4 text-red-700" />
              <span className="text-red-700">Back to Home / </span>
            </Link>
            <h1 className="text-2xl font-bold text-red-700">
              Community Achievements
            </h1>
          </div>
        </div>
      </div> */}
      <div className="max-w-7xl mx-auto flex items-center justify-between p-4">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center text-gray-600 hover:text-red-700">
            <ArrowLeft className="w-4 h-4 text-red-700" />
            <span className="text-red-700">Back to Home / </span>
          </Link>
          <h1 className="text-2xl font-bold text-red-700">Community Achievements</h1>
        </div>

        {/* ✅ Add button here */}
        {/* <Button
          onClick={() => {
            if (!session?.user) {
              setShowLoginModal(true); // ✅ Open login modal if not logged in
            } else {
              setOpenForm(true); // ✅ Open achievement form modal if logged in
            }
          }}
          className="bg-red-600 hover:bg-red-700 text-white flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add Achievement
        </Button> */}
        <Button
          onClick={() => {
            if (!session?.user) {
              // 🔹 User not logged in → open login modal
              setShowLoginModal(true);
              return;
            }

            // 🔹 User is logged in → navigate based on role
            const role = session?.user?.role;

            if (role === 'admin') {
              Router.push('/admin/create-achievement-general');
            } else if (role === 'superAdmin') {
              Router.push('/admin/create-achievement');
            } else if (role === 'user') {
              Router.push('/dashboard/create-achievement-general');
            } else {
              // Optional fallback (unknown role)
              setShowLoginModal(true);
            }
          }}
          className="bg-red-600 hover:bg-red-700 text-white flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add Achievement
        </Button>
      </div>

      {/* Search and Filter */}
      <div className="bg-yellow-50 border-b border-yellow-200 p-4">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search achievements..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="healthcare">Healthcare</SelectItem>
                <SelectItem value="sports">Sports</SelectItem>
                <SelectItem value="technology">Technology</SelectItem>
                <SelectItem value="education">Education</SelectItem>
                <SelectItem value="business">Business</SelectItem>
                <SelectItem value="arts">Arts</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-yellow-50 border-b border-yellow-200">
        <div className="max-w-7xl mx-auto">
          <div className="flex">
            <button
              onClick={() => setActiveTab('hall-of-fame')}
              className={`px-6 py-4 text-sm font-medium border-b-2 ${
                activeTab === 'hall-of-fame'
                  ? 'border-orange-600 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Hall of Fame
            </button>
            <button
              onClick={() => setActiveTab('by-category')}
              className={`px-6 py-4 text-sm font-medium border-b-2 ${
                activeTab === 'by-category'
                  ? 'border-orange-600 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              By Category
            </button>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto p-6">
        {/* Featured Achievement */}
        {featuredAchievements.length > 0 && activeTab === 'hall-of-fame' && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-red-700 mb-6">Featured Achievements</h2>

            <div className="relative w-full overflow-hidden">
              {/* Slider Container */}
              <div
                className="flex transition-transform duration-700 ease-in-out"
                style={{
                  transform: `translateX(-${currentFeaturedIndex * 100}%)`
                }}
              >
                {featuredAchievements.map(featuredAchievement => (
                  <div
                    key={featuredAchievement.id}
                    className="w-full flex-shrink-0"
                    // style={{ flex: "0 0 100%" }}
                  >
                    <Card className="bg-yellow-50 border-yellow-200 overflow-hidden">
                      <CardContent className="p-0">
                        <div className="flex">
                          {/* Left Side - Image */}
                          <div className="w-1/3 bg-yellow-100 flex items-center justify-center p-6 relative overflow-hidden rounded-lg">
                            {/* Inner image slider */}
                            <div
                              className="flex transition-transform duration-700 ease-in-out"
                              style={{
                                transform: `translateX(-${(featuredAchievement.currentImageIndex || 0) * 100}%)`,
                                width: `${(featuredAchievement.images?.length || 1) * 100}%`
                              }}
                            >
                              {(featuredAchievement.images || [featuredAchievement.image]).map((imgUrl, i) => (
                                <div key={i} className="flex-shrink-0 w-full flex justify-center items-center">
                                  <img
                                    src={imgUrl}
                                    alt={`${featuredAchievement.name}-${i}`}
                                    className="w-48 h-48 object-fill rounded-lg"
                                  />
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Right Side - Content */}
                          <div className="w-2/3 p-6">
                            <div className="flex items-center gap-2 mb-4">
                              <Badge className={getCategoryColor(featuredAchievement.category)}>
                                <span className="mr-1">{getCategoryIcon(featuredAchievement.category)}</span>
                                {featuredAchievement.category}
                              </Badge>
                              {featuredAchievement.isVerified && (
                                <Badge className="bg-blue-100 text-blue-800">
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                  Verified
                                </Badge>
                              )}
                            </div>

                            <h3 className="text-2xl font-bold text-red-700 mb-2">{featuredAchievement.name}</h3>
                            <h4 className="text-lg font-semibold text-red-600 mb-4">{featuredAchievement.title}</h4>

                            <p className="text-gray-600 mb-6 leading-relaxed">{featuredAchievement.description}</p>

                            <div className="mb-6">
                              <h5 className="font-semibold text-red-700 mb-2">Key Achievement:</h5>
                              <p className="text-gray-700">{featuredAchievement.keyAchievement}</p>
                            </div>

                            <div className="mb-6">
                              <p className="text-green-600 font-medium">{featuredAchievement.impact}</p>
                            </div>

                            <div className="flex items-center gap-6 mb-6 text-gray-600">
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                <span>{featuredAchievement.year}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4" />
                                <span>{featuredAchievement.location}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Trophy className="w-4 h-4" />
                                <span>Hall of Fame</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>

              {/* Slider Controls */}
              {featuredAchievements.length > 1 && (
                <>
                  {/* Dots */}
                  <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-2">
                    {featuredAchievements.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentFeaturedIndex(idx)}
                        className={`w-3 h-3 rounded-full transition-all ${
                          idx === currentFeaturedIndex ? 'bg-orange-600 scale-110' : 'bg-orange-300 hover:bg-orange-400'
                        }`}
                      />
                    ))}
                  </div>

                  {/* Arrows */}
                  <button
                    onClick={() =>
                      setCurrentFeaturedIndex(
                        prev => (prev - 1 + featuredAchievements.length) % featuredAchievements.length
                      )
                    }
                    className="absolute left-3 top-1/2 -translate-y-1/2 bg-orange-500/70 text-white rounded-full p-2"
                  >
                    ‹
                  </button>
                  <button
                    onClick={() => setCurrentFeaturedIndex(prev => (prev + 1) % featuredAchievements.length)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-orange-500/70 text-white rounded-full p-2"
                  >
                    ›
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {/* Hall of Fame Members */}
        {activeTab === 'hall-of-fame' && (
          <div>
            <h2 className="text-2xl font-bold text-red-700 mb-6">Hall of Fame Members</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {hallOfFameMembers.map(achievement => (
                <Card key={achievement.id} className="bg-yellow-50 hover:shadow-lg transition-shadow overflow-hidden">
                  <CardContent className="p-0">
                    <div className="relative p-4">
                      <div className="flex justify-center mb-4 relative w-24 h-24 mx-auto overflow-hidden rounded-lg">
                        {achievement.images && achievement.images.length > 0 ? (
                          <div className="relative w-full h-full">
                            <div
                              className="flex transition-transform duration-700 ease-in-out"
                              style={{
                                transform: `translateX(-${achievement.currentImageIndex ?? 0}00%)`
                              }}
                            >
                              {achievement.images.map((imgUrl, imgIndex) => (
                                <img
                                  key={imgIndex}
                                  src={imgUrl}
                                  alt={`${achievement.name} ${imgIndex + 1}`}
                                  className="w-24 h-24 flex-shrink-0 object-cover rounded-lg"
                                />
                              ))}
                            </div>
                          </div>
                        ) : (
                          <img
                            src={achievement.image}
                            alt={achievement.name}
                            className="w-24 h-24 object-cover rounded-lg"
                          />
                        )}
                      </div>

                      <div className="absolute top-4 left-4 flex gap-2">
                        <Badge className={getCategoryColor(achievement.category)}>
                          <span className="mr-1">{getCategoryIcon(achievement.category)}</span>
                          {achievement.category}
                        </Badge>
                      </div>
                    </div>

                    <div className="p-4 pt-0">
                      <h3 className="text-lg font-bold text-red-700 mb-1 text-center">{achievement.name}</h3>
                      <h4 className="text-sm font-semibold text-purple-600 mb-3 text-center">{achievement.title}</h4>

                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">{achievement.description}</p>

                      <div className="mb-4">
                        <p className="text-xs text-gray-500 mb-1">Achievement:</p>
                        <p className="text-sm text-gray-700">{achievement.keyAchievement}</p>
                      </div>

                      <div className="mb-4">
                        <p className="text-sm text-green-600 font-medium">{achievement.impact}</p>
                      </div>

                      <div className="flex justify-between items-center text-xs text-gray-500 mb-4">
                        <span>
                          {achievement.year} • {achievement.location}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* By Category */}
        {activeTab === 'by-category' && (
          <div>
            <h2 className="text-2xl font-bold text-red-700 mb-6">Achievements by Category</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAchievements.map(achievement => (
                <Card key={achievement.id} className="bg-white hover:shadow-lg transition-shadow overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex justify-center mb-4 relative w-24 h-24 mx-auto overflow-hidden rounded-lg">
                      {achievement.images && achievement.images.length > 0 ? (
                        <div className="relative w-full h-full">
                          <div
                            className="flex transition-transform duration-700 ease-in-out"
                            style={{
                              transform: `translateX(-${achievement.currentImageIndex ?? 0}00%)`
                            }}
                          >
                            {achievement.images.map((imgUrl, imgIndex) => (
                              <img
                                key={imgIndex}
                                src={imgUrl}
                                alt={`${achievement.name} ${imgIndex + 1}`}
                                className="w-12 h-12 flex-shrink-0 object-cover rounded-lg"
                              />
                            ))}
                          </div>
                        </div>
                      ) : (
                        <img
                          src={achievement.image}
                          alt={achievement.name}
                          className="w-12 h-12 object-cover rounded-lg"
                        />
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{achievement.description}</p>
                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <span>{achievement.year}</span>
                      <span>{achievement.location}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Nominations Placeholder */}
        {activeTab === 'nominations' && (
          <Card className="p-8 text-center">
            <Award className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-red-700 mb-2">Nominations</h3>
            <p className="text-gray-600 mb-4">Pending nominations and community suggestions will appear here</p>
            <Button className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Submit Nomination
            </Button>
          </Card>
        )}
      </div>
      <div className="mt-8 pb-12 px-4">
        <div className="container mx-auto">
          <HorizontalAdSlider ads={bottomAds} />
        </div>
      </div>

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
            <p className="text-gray-600 mb-6">
              Please login to participate in community discussions and create new topics.
            </p>
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
      {/* Popup Form */}
      <Dialog open={openForm} onOpenChange={setOpenForm}>
        <DialogContent className="max-w-2xl max-h-[90vh] p-6 overflow-y-auto bg-orange-50">
          <DialogHeader>
            <DialogTitle>Add New Achievement</DialogTitle>
          </DialogHeader>

          {/* ✅ Scrollable form area */}
          <div className="mt-4 overflow-y-auto max-h-[70vh] pr-2">
            <CreateAchievementForm onClose={() => setOpenForm(false)} />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
