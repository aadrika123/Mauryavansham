import { getServerSession } from 'next-auth';
// import { authOptions } from "@/lib/auth"
import { redirect } from 'next/navigation';
import AdminAdDetail from './admin-ad-detail';
import { authOptions } from '@/src/lib/auth';
import AdmindashboardLayout from '@/src/components/layout/adminDashboardLayout';

export default async function AdminAdDetailPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect('/sign-in');
  }

  return (
    <AdmindashboardLayout user={session.user}>
      <div className="container mx-auto px-4 py-8">
        <AdminAdDetail adId={id} />
      </div>
    </AdmindashboardLayout>
  );
}
