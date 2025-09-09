// import { getServerSession } from "next-auth";
// import { authOptions } from "@/src/lib/auth";
// import { redirect } from "next/navigation";
// import AdmindashboardLayout from "@/src/components/layout/adminDashboardLayout";
// import AdRatePage from "./adRatesPage";

// export default async function AdminAdsPage() {
//   const session = await getServerSession(authOptions);

//   if (!session?.user?.id) {
//     redirect("/sign-in");
//   }

//   return (
//     <AdmindashboardLayout user={session.user}>
//       <div className="container mx-auto px-4 py-8">
       
//         <AdRatePage />
//       </div>
//     </AdmindashboardLayout>
//   );
// }
