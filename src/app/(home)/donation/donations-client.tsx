'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Badge } from '@/src/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/src/components/ui/select';
import { Progress } from '@/src/components/ui/progress';
import {
  ArrowLeft,
  Plus,
  Search,
  Filter,
  Heart,
  Users,
  Calendar,
  CheckCircle,
  Share,
  Star,
  Sparkles,
  Eye
} from 'lucide-react';
import Link from 'next/link';
import { VerticalAdBanner } from '@/src/components/common/VerticalAdBanner';
import { LeftSideAddBanner } from '@/src/components/common/LeftSideAddBanner';
import Image from 'next/image';
interface Campaign {
  id: number;
  title: string;
  description: string;
  image: string;
  goal: number;
  raised: number;
  daysLeft: number;
  donorCount: number;
  organizer: string;
  priority: 'Urgent' | 'Moderate' | 'Standard';
  isVerified: boolean;
  isFeatured: boolean;
  category: string;
}

interface DonationsClientProps {
  initialCampaigns: Campaign[];
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
    }, 5000);

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
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-amber-800">Book Your Ad (9)</h3>
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
              className={`absolute inset-0 p-4 sm:p-8 transition-opacity duration-1000 ${
                index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 pointer-events-none z-0'
              }`}
            >
              <a href={ad.adUrl} target="_blank" rel="noopener noreferrer" className="inline-block w-full h-full">
                <Image
                  src={ad.bannerImageUrl}
                  alt={`Bottom Ad ${index + 1}`}
                  width={900}
                  height={300}
                  className="mx-auto rounded-xl shadow-lg w-full h-full object-contain"
                  priority={index === 0}
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
export default function DonationsClient({ initialCampaigns }: DonationsClientProps) {
  const [activeTab, setActiveTab] = useState('active');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [campaigns] = useState(initialCampaigns);

  const featuredCampaign = campaigns.find(campaign => campaign.isFeatured);
  const regularCampaigns = campaigns.filter(campaign => !campaign.isFeatured);

  const filteredCampaigns = regularCampaigns.filter(campaign => {
    const matchesSearch =
      campaign.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      campaign.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === 'all' || campaign.category.toLowerCase() === filterType.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  const [adPlacements, setAdPlacements] = useState<AdPlacement[]>([]);
  const bottomAds = adPlacements.filter(ad => ad.placementId === 9);
  useEffect(() => {
    fetch('/api/ad-placements/approved')
      .then(res => res.json())
      .then((data: AdPlacement[]) => {
        // sirf approved ads le lo
        setAdPlacements(data);
      })
      .catch(() => console.error('Failed to load ad placements'));
  }, []);
  // const bottomAd = adPlacements.find((ad) => ad.placementId === 9);
  // // console.log("Ad for DonationsClient:", bottomAd);
  // useEffect(() => {
  //   if (bottomAd)
  //     fetch(`/api/ad-placements/${bottomAd.id}`, { method: "POST" });
  // }, [bottomAd]);
  const formatCurrency = (amount: number) => {
    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(2)} L`;
    }
    return `₹${amount.toLocaleString()}`;
  };

  const getPercentageFunded = (raised: number, goal: number) => {
    return Math.round((raised / goal) * 100);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Urgent':
        return 'bg-red-100 text-red-800';
      case 'Moderate':
        return 'bg-yellow-100 text-yellow-800';
      case 'Standard':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-orange-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center  text-gray-600 hover:text-gray-900">
              <ArrowLeft className="w-4 h-4 text-red-700" />
              <span className="text-red-700">Back to Home / </span>
            </Link>
            <h1 className="text-2xl font-bold text-red-700">Community Donations</h1>
          </div>
          {/* <Button className="bg-gradient-to-r bg-orange-600 hover:bg-orange-700 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Start Campaign
          </Button> */}
        </div>
      </div>
      {/* <div className="absolute top-72 left-16 z-50">
        <LeftSideAddBanner />
    </div> */}
      {/* Search and Filter */}
      <div className="bg-[#FFF7ED] border-b border-yellow-200 p-4">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search campaigns..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Campaigns</SelectItem>
                <SelectItem value="heritage">Heritage</SelectItem>
                <SelectItem value="education">Education</SelectItem>
                <SelectItem value="medical">Medical</SelectItem>
                <SelectItem value="infrastructure">Infrastructure</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-[#FFF7ED] border-b border-yellow-200">
        <div className="max-w-7xl mx-auto">
          <div className="flex">
            <button
              onClick={() => setActiveTab('active')}
              className={`px-6 py-4 text-sm font-medium border-b-2 ${
                activeTab === 'active'
                  ? 'border-orange-600 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Active Campaigns
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              className={`px-6 py-4 text-sm font-medium border-b-2 ${
                activeTab === 'completed'
                  ? 'border-orange-600 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Completed
            </button>
            {/* <button
              onClick={() => setActiveTab("my-donations")}
              className={`px-6 py-4 text-sm font-medium border-b-2 ${
                activeTab === "my-donations"
                  ? "border-orange-600 text-orange-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              My Donations
            </button>
            <button
              onClick={() => setActiveTab("impact")}
              className={`px-6 py-4 text-sm font-medium border-b-2 ${
                activeTab === "impact"
                  ? "border-orange-600 text-orange-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Impact Report
            </button> */}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 ">
        {/* Featured Campaign */}
        {featuredCampaign && activeTab === 'active' && (
          <div className="mb-8">
            <h2 className="text-2xl  font-bold text-red-700 mb-6">Featured Campaign</h2>
            <Card className="bg-yellow-50 border-yellow-200 overflow-hidden">
              <CardContent className="p-0">
                <div className="flex flex-col lg:flex-row">
                  <div className="lg:w-1/3">
                    <img
                      src={featuredCampaign.image || '/placeholder.svg'}
                      alt={featuredCampaign.title}
                      className="w-full h-64 lg:h-full object-cover"
                    />
                  </div>
                  <div className="lg:w-2/3 p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Badge className={getPriorityColor(featuredCampaign.priority)}>{featuredCampaign.priority}</Badge>
                      {featuredCampaign.isVerified && (
                        <Badge className="bg-blue-100 text-blue-800">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                    </div>

                    <h3 className="text-2xl font-bold text-red-700 mb-3">{featuredCampaign.title}</h3>

                    <p className="text-gray-600 mb-6 leading-relaxed">{featuredCampaign.description}</p>

                    <div className="mb-6">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-2xl font-bold text-green-600">
                          {formatCurrency(featuredCampaign.raised)}
                        </span>
                        <span className="text-gray-600">of {formatCurrency(featuredCampaign.goal)}</span>
                      </div>
                      <Progress
                        value={getPercentageFunded(featuredCampaign.raised, featuredCampaign.goal)}
                        className="h-3 mb-2"
                      />
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>{getPercentageFunded(featuredCampaign.raised, featuredCampaign.goal)}% funded</span>
                        <span>{featuredCampaign.daysLeft} days left</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 mb-6 text-gray-600">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        <span>{featuredCampaign.donorCount} donors</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{featuredCampaign.daysLeft} days left</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Heart className="w-4 h-4" />
                        <span>By {featuredCampaign.organizer}</span>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Button className="bg-gradient-to-r bg-orange-600 hover:bg-orange-700 text-white">
                        <Heart className="w-4 h-4 mr-2" />
                        Donate Now
                      </Button>
                      <Button
                        variant="outline"
                        className="border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent"
                      >
                        Learn More
                      </Button>
                      <Button
                        variant="outline"
                        className="border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent"
                      >
                        <Share className="w-4 h-4 mr-2" />
                        Share
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Bottom Ad Banner */}
        <div className="mt-8 pb-12 px-4">
          <div className="container mx-auto">
            <HorizontalAdSlider ads={bottomAds} />
          </div>
        </div>

        {/* All Active Campaigns */}
        <div>
          <h2 className="text-2xl font-bold text-red-700 mb-6">All Active Campaigns</h2>

          {filteredCampaigns.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCampaigns.map(campaign => (
                <Card key={campaign.id} className="bg-yellow-50 hover:shadow-lg transition-shadow overflow-hidden">
                  <CardContent className="p-0">
                    <div className="relative">
                      <img
                        src={campaign.image || '/placeholder.svg'}
                        alt={campaign.title}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute top-3 left-3 flex gap-2">
                        <Badge className={getPriorityColor(campaign.priority)}>{campaign.priority}</Badge>
                        {campaign.isVerified && (
                          <Badge className="bg-blue-100 text-blue-800">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Verified
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-red-700 mb-2 line-clamp-2">{campaign.title}</h3>

                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{campaign.description}</p>

                      <div className="mb-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-xl font-bold text-green-600">{formatCurrency(campaign.raised)}</span>
                          <span className="text-sm text-gray-600">of {formatCurrency(campaign.goal)}</span>
                        </div>
                        <Progress value={getPercentageFunded(campaign.raised, campaign.goal)} className="h-2 mb-2" />
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>{getPercentageFunded(campaign.raised, campaign.goal)}% funded</span>
                          <span>{campaign.daysLeft} days left</span>
                        </div>
                      </div>

                      <div className="flex justify-between items-center mb-4 text-sm text-gray-600">
                        <span>{campaign.donorCount} donors</span>
                        <span>By {campaign.organizer}</span>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          className="flex-1 bg-gradient-to-r bg-orange-600 hover:bg-orange-700  text-white"
                        >
                          <Heart className="w-4 h-4 mr-1" />
                          Donate
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 border-gray-300 text-gray-700 bg-transparent"
                        >
                          Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-8 text-center">
              <div className="space-y-3">
                <Heart className="w-16 h-16 mx-auto text-gray-400" />
                <div>
                  <p className="text-gray-500 font-medium">No campaigns found</p>
                  <p className="text-sm text-gray-400 mt-2">
                    Try adjusting your search criteria or check back later for new campaigns.
                  </p>
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Other Tab Content Placeholders */}
        {activeTab === 'completed' && (
          <Card className="p-8 text-center">
            <CheckCircle className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-red-700 mb-2">Completed Campaigns</h3>
            <p className="text-gray-600">Successfully completed fundraising campaigns will appear here</p>
          </Card>
        )}

        {activeTab === 'my-donations' && (
          <Card className="p-8 text-center">
            <Heart className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-red-700 mb-2">My Donations</h3>
            <p className="text-gray-600">Your donation history and contributions will be displayed here</p>
          </Card>
        )}

        {activeTab === 'impact' && (
          <Card className="p-8 text-center">
            <Users className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-red-700 mb-2">Impact Report</h3>
            <p className="text-gray-600">Community impact statistics and success stories will be shown here</p>
          </Card>
        )}
      </div>
    </div>
  );
}
