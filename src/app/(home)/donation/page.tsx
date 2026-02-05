import DonationsClient from './donations-client';

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

export default async function DonationsPage() {
  // In a real app, you'd fetch campaigns from your database
  const mockCampaigns: Campaign[] = [
    {
      id: 1,
      title: 'Heritage Temple Restoration',
      description:
        'Restore the ancient Mauryavansham temple in Pataliputra to preserve our architectural heritage for future generations.',
      image: '/placeholder.svg?height=300&width=500&text=Heritage+Temple',
      goal: 500000,
      raised: 342500,
      daysLeft: 45,
      donorCount: 156,
      organizer: 'Heritage Preservation Committee',
      priority: 'Moderate',
      isVerified: true,
      isFeatured: true,
      category: 'Heritage'
    },
    {
      id: 2,
      title: 'Education Scholarship Fund',
      description:
        'Support bright students from economically disadvantaged families in our community to pursue higher education.',
      image: '/placeholder.svg?height=200&width=300&text=Education+Fund',
      goal: 200000,
      raised: 145000,
      daysLeft: 30,
      donorCount: 89,
      organizer: 'Education Committee',
      priority: 'Standard',
      isVerified: true,
      isFeatured: false,
      category: 'Education'
    },
    {
      id: 3,
      title: 'Emergency Medical Fund - Rajesh Family',
      description:
        "Help cover medical expenses for Rajesh Kumar's cancer treatment. Every contribution makes a difference in saving a life.",
      image: '/placeholder.svg?height=200&width=300&text=Medical+Emergency',
      goal: 150000,
      raised: 89000,
      daysLeft: 15,
      donorCount: 67,
      organizer: 'Community Welfare Team',
      priority: 'Urgent',
      isVerified: true,
      isFeatured: false,
      category: 'Medical'
    },
    {
      id: 4,
      title: 'Community Center Construction',
      description:
        'Build a new community center to host cultural events, meetings, and social gatherings for our growing community.',
      image: '/placeholder.svg?height=200&width=300&text=Community+Center',
      goal: 800000,
      raised: 245000,
      daysLeft: 60,
      donorCount: 123,
      organizer: 'Development Committee',
      priority: 'Standard',
      isVerified: true,
      isFeatured: false,
      category: 'Infrastructure'
    }
  ];

  return <DonationsClient initialCampaigns={mockCampaigns} />;
}
