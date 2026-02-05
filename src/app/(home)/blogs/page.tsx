import { Button } from '@/src/components/ui/button';
import { ArrowLeft, Plus } from 'lucide-react';
import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/src/lib/auth';
import ViewAllBlogs from './viewAllBlogs';

export default async function BusinessIndexPage() {
  const session = await getServerSession(authOptions);
  // if (!session?.user?.id) {
  //   return <BusinessDetailsPage />;
  // }
  return (
    <>
      <div className="bg-yellow-50 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Link href="/" className="flex items-center  text-gray-600 hover:text-gray-900">
              <ArrowLeft className="w-4 h-4 text-red-700" />
              <span className="text-red-700">Back to Home / </span>
            </Link>
            <h1 className="text-xl font-bold text-red-700">Blog's</h1>
          </div>
        </div>
        <ViewAllBlogs />
      </div>
    </>
  );
}
