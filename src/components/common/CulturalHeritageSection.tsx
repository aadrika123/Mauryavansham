import Link from 'next/link';
import { Button } from '@/src/components/ui/button';
import { Badge } from '@/src/components/ui/badge';
import { Globe } from 'lucide-react';

export function CulturalHeritageSection() {
  return (
    <section className="py-16 bg-[#FFFDEF] px-8">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <Badge className="mb-4 bg-[#8B0000] text-white ">Cultural Heritage</Badge>
            <h2 className="text-3xl font-bold mb-6 text-[#8B0000]">Preserving Our Rich History</h2>
            <p className="text-[#8B4513] mb-6">
              Explore the rich cultural heritage of the Maurya community. Learn about our traditions, historical
              achievements, and the legacy that connects us all.
            </p>
            <Button asChild className="bg-[#8B0000] text-white hover:bg-[#FF5C00]">
              <Link href="/heritage">
                <Globe className="mr-2 h-4 w-4 " />
                Explore Heritage
              </Link>
            </Button>
          </div>
          <div className="bg-gradient-to-br from-orange-100 to-red-100 p-8 rounded-lg">
            <div className="text-center">
              <div className="text-6xl mb-4">🏛️</div>
              <h3 className="text-xl font-semibold mb-2 text-[#8B0000]">Historical Timeline</h3>
              <p className="text-[#8B4513]">Interactive timeline showcasing our community's journey through history</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
