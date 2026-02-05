import { getServerSession } from 'next-auth';
// import { authOptions } from "@/lib/auth"
import { redirect } from 'next/navigation';
import BlogsList from './blogs-list';
import { authOptions } from '@/src/lib/auth';
import DashboardLayout from '@/src/components/layout/dashboardLayout';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default async function BlogsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect('/sign-in');
  }

  return (
    <DashboardLayout user={session.user}>
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <ArrowLeft className="h-4 w-4 text-red-600" />
          <Link href="/dashboard" className="text-red-600 hover:underline">
            Dashboard
          </Link>
          <span>/</span>
          <span>My Blogs</span>
        </div>
      </div>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Blogs</h1>
            <p className="text-gray-600 mt-2">Manage your blog posts and track their approval status</p>
          </div>
        </div>

        <BlogsList userId={session.user.id} />
      </div>
    </DashboardLayout>
  );
}
