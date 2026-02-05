import { getServerSession } from 'next-auth';
import { authOptions } from '@/src/lib/auth';
import { redirect } from 'next/navigation';
import DashboardLayout from '@/src/components/layout/dashboardLayout';
import AdmindashboardLayout from '@/src/components/layout/adminDashboardLayout';
import MyBusinessesPage from './ViewBusinessPage';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default async function ViewBusinessIndex() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect('/sign-in');
  }
  console.log('session', session);

  return (
    <AdmindashboardLayout user={session.user}>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-1">
          <Link href="/admin/overview" className="flex items-center  text-gray-600 hover:text-gray-900">
            <ArrowLeft className="w-4 h-4 text-red-700" />
            <span className="text-red-700">Dashboard / </span>
          </Link>
          <h1 className=" font-bold text-red-700">Business List</h1>
        </div>

        <MyBusinessesPage />
      </div>
    </AdmindashboardLayout>
  );
}
