import { Card, CardContent } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { MapPin } from 'lucide-react';
import Image from 'next/image';

interface CommunityMemberCardProps {
  member: {
    id: number;
    name: string;
    city?: string;
    state?: string;
    photo?: string;
  };
}

export function CommunityMemberCard({ member }: CommunityMemberCardProps) {
  return (
    <Card className="bg-white border-yellow-200 hover:shadow-lg transition-shadow">
      <CardContent className="p-6 text-center">
        <div className="relative mb-4">
          <div className="w-24 h-24 mx-auto rounded-full border-4 border-yellow-400 overflow-hidden">
            <Image
              src={member.photo || '/placeholder.svg?height=96&width=96&text=User'}
              alt={member.name}
              width={96}
              height={96}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        <h3 className="text-lg font-bold text-red-700 mb-1">{member.name}</h3>
        <div className="space-y-2 text-sm text-gray-700 mb-6">
          {(member.city || member.state) && (
            <div className="flex items-center justify-center gap-2">
              <MapPin className="h-4 w-4 text-red-500" />
              <span>{`${member.city || ''}${member.city && member.state ? ', ' : ''}${member.state || ''}`}</span>
            </div>
          )}
          {/* Add more details if available, e.g., occupation */}
        </div>
        <Button variant="outline" className="w-full border-red-500 text-red-600 hover:bg-red-50 bg-transparent">
          View Profile
        </Button>
      </CardContent>
    </Card>
  );
}
