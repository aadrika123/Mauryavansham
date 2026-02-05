'use client';

import { useState } from 'react';
import { SearchFilters } from '@/src/features/searchProfile/components/searchFilters';
import type { Profile } from '@/src/features/searchProfile/type';
import ProfilesList from '@/src/features/searchProfile/components/profilesList';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

type Props = {
  initialProfiles: Profile[];
};

// ✅ Utility function to calculate age from dob
function calculateAge(dob: string): number {
  const birthDate = new Date(dob);
  const diff = Date.now() - birthDate.getTime();
  const ageDate = new Date(diff);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
}

export default function SearchProfilesClient({ initialProfiles }: Props) {
  console.log('SearchProfilesClient initialProfiles:', initialProfiles);

  const [filters, setFilters] = useState({
    searchName: '',
    ageRange: [18, 60] as [number, number],
    location: '',
    dob: '',
    education: '',
    occupation: '',
    gotra: '',
    height: '',
    verifiedOnly: false,
    withPhotos: false,
    onlineRecently: false
  });

  const [sortBy, setSortBy] = useState('recently-active');
  const [profiles] = useState(initialProfiles);

  console.log('SearchProfilesClient received profiles:', profiles);

  const filteredProfiles = profiles?.filter(profile => {
    // Name search
    if (filters.searchName && !profile.name.toLowerCase().includes(filters.searchName.toLowerCase())) return false;

    // Age range filter (based on DOB)
    if (profile.dob) {
      const age = calculateAge(profile.dob);
      if (age < filters.ageRange[0] || age > filters.ageRange[1]) return false;
    }

    // Location filter
    if (
      filters.location &&
      filters.location !== 'all-cities' &&
      !profile.location.toLowerCase().includes(filters.location.toLowerCase())
    )
      return false;

    // Education filter
    if (
      filters.education &&
      filters.education !== 'all-education' &&
      !profile.education.toLowerCase().includes(filters.education.toLowerCase())
    )
      return false;

    // Occupation filter
    if (
      filters.occupation &&
      filters.occupation !== 'all-occupations' &&
      !profile.occupation.toLowerCase().includes(filters.occupation.toLowerCase())
    )
      return false;

    // Gotra filter
    if (
      filters.gotra &&
      filters.gotra !== 'all-gotras' &&
      !profile.gotra.toLowerCase().includes(filters.gotra.toLowerCase())
    )
      return false;

    // Height filter
    if (filters.height && filters.height !== 'all-heights') {
      const heightStr = profile.height.replace(/['"]/g, '');
      const heightValue = Number.parseFloat(heightStr);

      if (!isNaN(heightValue)) {
        switch (filters.height) {
          case 'below-5-4':
            if (heightValue >= 5.4) return false;
            break;
          case '5-4-to-5-6':
            if (heightValue < 5.4 || heightValue > 5.6) return false;
            break;
          case '5-6-to-5-8':
            if (heightValue < 5.6 || heightValue > 5.8) return false;
            break;
          case '5-8-to-6-0':
            if (heightValue < 5.8 || heightValue > 6.0) return false;
            break;
          case 'above-6-0':
            if (heightValue <= 6.0) return false;
            break;
        }
      }
    }

    // Verified only filter
    if (filters.verifiedOnly && !profile.isVerified) return false;

    // With photos filter
    if (filters.withPhotos && !profile.profileImage) return false;

    // Online recently filter (last 7 days)
    if (filters.onlineRecently) {
      if (profile.lastActive === 'Never') return false;

      try {
        const lastActiveDate = new Date(profile.lastActive);
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        if (lastActiveDate < sevenDaysAgo) return false;
      } catch {
        return false;
      }
    }

    return true;
  });

  const sortedProfiles = filteredProfiles?.sort((a, b) => {
    if (sortBy === 'recently-active') {
      if (a.lastActive === 'Never' && b.lastActive === 'Never') return 0;
      if (a.lastActive === 'Never') return 1;
      if (b.lastActive === 'Never') return -1;

      try {
        return new Date(b.lastActive).getTime() - new Date(a.lastActive).getTime();
      } catch {
        return 0;
      }
    } else if (sortBy === 'newest-first') {
      return new Date(b.createdAt ?? '').getTime() - new Date(a.createdAt ?? '').getTime();
    } else if (sortBy === 'age-low-high') {
      const ageA = calculateAge(a.dob ?? '');
      const ageB = calculateAge(b.dob ?? '');
      return ageA - ageB;
    } else if (sortBy === 'age-high-low') {
      const ageA = calculateAge(a.dob ?? '');
      const ageB = calculateAge(b.dob ?? '');
      return ageB - ageA;
    }

    return 0;
  });

  const updateFilters = (newFilters: any) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };
  console.log('SearchProfilesClient filters:', filters);
  console.log('SearchProfilesClient filters:', sortedProfiles);

  return (
    <div className="min-h-screen bg-orange-50 p-4">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <ArrowLeft className="h-4 w-4 text-red-600" />
          <Link href="/matrimonial" className="text-red-600 hover:underline">
            Matrimonial
          </Link>
          <span>/</span>
          <span>Search profiles</span>
        </div>
      </div>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <SearchFilters filters={filters} onFiltersChange={updateFilters} />
          </div>
          <div className="lg:col-span-3">
            <ProfilesList
              profiles={sortedProfiles}
              totalCount={sortedProfiles?.length}
              sortBy={sortBy}
              onSortChange={setSortBy}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
