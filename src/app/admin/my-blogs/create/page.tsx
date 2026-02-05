import { getServerSession } from 'next-auth';
// import { authOptions } from "@/lib/auth"
import { redirect } from 'next/navigation';
import CreateBlogForm from './create-blog-form';
import { authOptions } from '@/src/lib/auth';
import AdmindashboardLayout from '@/src/components/layout/adminDashboardLayout';

export default async function CreateBlogPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect('/sign-in');
  }

  return (
    <AdmindashboardLayout user={session.user}>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Create New Blog</h1>
          <p className="text-gray-600 mt-2">Write and publish your blog post</p>
        </div>

        <CreateBlogForm />
      </div>
    </AdmindashboardLayout>
  );
}
