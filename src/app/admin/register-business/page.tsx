import { Button } from "@/src/components/ui/button";
import { ArrowLeft, Plus } from "lucide-react";
import Link from "next/link";
// import BusinessRegistrationForm from "./registrationForm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/lib/auth";
import { redirect } from "next/navigation";
import BusinessRegistrationForm from "./BusinessRegistrationForm";
import AdmindashboardLayout from "@/src/components/layout/adminDashboardLayout";
// import BusinessRegistrationForm from "@/src/features/registerBusiness/components/BusinessRegistrationForm";

export default async function BusinessIndexPage() {
  const session = await getServerSession(authOptions);

  // 2. Agar session nahi mila to sign-in page par bhejo
  if (!session?.user?.id) {
    redirect("/sign-in");
  }
  return (
    <>
      <AdmindashboardLayout user={session.user}>
        <div className="">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Link
                href="/"
                className="flex items-center  text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-4 h-4 text-red-700" />
                <span className="text-red-700">Back to Home / </span>
              </Link>
              <h1 className="text-2xl font-bold text-red-700">
                Registration Form
              </h1>
            </div>
          </div>
        </div>
        <BusinessRegistrationForm />
      </ AdmindashboardLayout>
    </>
  );
}
