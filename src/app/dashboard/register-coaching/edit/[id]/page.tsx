// import React, { useEffect } from "react";
// import { getServerSession } from "next-auth";
// import { redirect } from "next/navigation";
// import { authOptions } from "@/src/lib/auth";
// import CoachingExperienceCenterRegistration from "../../CoachingExperienceCenterRegistration";
// import AdmindashboardLayout from "@/src/components/layout/adminDashboardLayout";
// import { ArrowLeft } from "lucide-react";
// import Link from "next/link";

// export default async function EditPage({ params }: { params: { id: string } }) {
//   const session = await getServerSession(authOptions);

//   if (!session?.user?.id) {
//     redirect("/sign-in");
//   }

//   const id = params.id; // get dynamic route param
//   console.log("Editing coaching center with ID:", id);
//   const res = await fetch(`/api/coaching-centers/${id}`, {
//     cache: "no-store",
//   });

//   useEffect(() => {
//       const fetchBlogs = async () => {
//         try {
//           // setLoading(true); // API start
//           const res = await fetch(`/api/coaching-centers/${id}`); 
//           const data = await res.json();
//           // setBlogs(data.blogs || []);
//         } catch (error) {
//           console.error("Error fetching blogs:", error);
//         } finally {
//           // setLoading(false); // API end
//         }
//       };
//       fetchBlogs();
//     }, []);

//   const data = await res.json();

//   if (!data.success) {
//     return <p className="text-red-500 p-6">Data not found</p>;
//   }

//   return (
//     <AdmindashboardLayout user={session.user}>
//       <div className="container mx-auto px-4 py-4">
//         <div className="flex items-center gap-2 text-sm text-gray-600">
//           <ArrowLeft className="h-4 w-4 text-red-600" />
//           <Link href="/admin/overview" className="text-red-600 hover:underline">
//             Dashboard
//           </Link>
//           <span>/</span>
//           <span>Coaching Registration</span>
//         </div>
//       </div>

//       <CoachingExperienceCenterRegistration initialData={data.data} />
//     </AdmindashboardLayout>
//   );
// }
import React from 'react'

function page() {
  return (
    <div>
      
    </div>
  )
}

export default page
