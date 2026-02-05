import { getServerSession } from 'next-auth';
import { authOptions } from '@/src/lib/auth';
import { redirect } from 'next/navigation';
import AdmindashboardLayout from '@/src/components/layout/adminDashboardLayout';
import EventModerationPage from './eventPageModeration';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
// import UserManagement from "./userManagementList";

export default async function AdminAdsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect('/sign-in');
  }

  return (
    <AdmindashboardLayout user={session.user}>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <ArrowLeft className="h-4 w-4 text-red-600" />
          <Link href="/admin/overview" className="text-red-600 hover:underline">
            Dashboard
          </Link>
          <span>/</span>
          <span>All Events</span>
        </div>
        <EventModerationPage />
      </div>
    </AdmindashboardLayout>
  );
}
