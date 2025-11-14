import { Button } from "@/src/components/ui/button";
import BusinessDetailsPage from "./businessPage";
import { ArrowLeft, Plus } from "lucide-react";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/lib/auth";

export default async function BusinessIndexPage() {
  const session = await getServerSession(authOptions);
  const userRole = session?.user?.role;

  // Register Business page path based on user role
  const registerPath =
    userRole === "admin" || userRole === "superAdmin"
      ? "/admin/register-business"
      : "/dashboard/register-business";

  return (
    <>
      <div className="bg-yellow-50 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Left Section */}
          <div className="flex items-center gap-1">
            <Link
              href="/"
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-4 h-4 text-red-700" />
              <span className="text-red-700">Back to Home / </span>
            </Link>
            <h1 className="text-2xl font-bold text-red-700">Business Forum</h1>
          </div>

          {/* Right Section (Register Business Button) — only if logged in */}
          {session?.user && (
            <Link href={registerPath}>
              <Button className="bg-red-700 hover:bg-red-800 text-white flex items-center gap-1">
                <Plus className="w-4 h-4" />
                Register Business
              </Button>
            </Link>
          )}
        </div>
      </div>

      <BusinessDetailsPage user={session?.user} />
    </>
  );
}
