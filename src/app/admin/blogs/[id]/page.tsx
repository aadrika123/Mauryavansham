import { getServerSession } from 'next-auth';
// import { authOptions } from "@/lib/auth"
import { redirect } from 'next/navigation';
import AdminBlogDetail from './admin-blog-detail';
import { authOptions } from '@/src/lib/auth';
import AdmindashboardLayout from '@/src/components/layout/adminDashboardLayout';

export default async function AdminBlogDetailPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getServerSession(authOptions);
  const { id } = await params;

  if (!session?.user?.id) {
    redirect('/sign-in');
  }

  return (
    <AdmindashboardLayout user={session.user}>
      <div className="container mx-auto px-4 py-8">
        <AdminBlogDetail blogId={params.id} />
      </div>
    </AdmindashboardLayout>
  );
}
