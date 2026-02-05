import { Button } from '@/src/components/ui/button';
import { ArrowLeft, Plus } from 'lucide-react';
import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/src/lib/auth';
import EducationPage from './educationPage';

export default async function BusinessIndexPage() {
  const session = await getServerSession(authOptions);

  return (
    <>
      <div className="bg-yellow-50 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Link href="/" className="flex items-center  text-gray-600 hover:text-gray-900">
              <ArrowLeft className="w-4 h-4 text-red-700" />
              <span className="text-red-700">Back to Home / </span>
            </Link>
            <h1 className="text-2xl font-bold text-red-700">Education Forum</h1>
          </div>
        </div>
      </div>
      <EducationPage user={session?.user} />
    </>
  );
}
