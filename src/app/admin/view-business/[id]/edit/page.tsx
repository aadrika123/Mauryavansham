import { getServerSession } from 'next-auth';
import { authOptions } from '@/src/lib/auth';
import { redirect } from 'next/navigation';
import DashboardLayout from '@/src/components/layout/dashboardLayout';
import AdmindashboardLayout from '@/src/components/layout/adminDashboardLayout';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import EditBusinessPageById from './EditBusinessPageById';

interface EditBusinessPageProps {
  params: {
    id: string;
  };
}
export default async function EditBusinessIndex({ params }: EditBusinessPageProps) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect('/sign-in');
  }
  console.log('session', session);
  console.log('params', params?.id);
  return (
    <AdmindashboardLayout user={session.user}>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-1">
          <Link href="/admin/view-business" className="flex items-center  text-gray-600 hover:text-gray-900">
            <ArrowLeft className="w-4 h-4 text-red-700" />
            <span className="text-red-700">Back to business list / </span>
          </Link>
          <h1 className="text-2xl font-bold text-red-700">Business Details</h1>
        </div>

        <EditBusinessPageById id={params.id} />
      </div>
    </AdmindashboardLayout>
  );
}
