
import { Button } from "@/src/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/lib/auth";
import HealthAndWellnessPage from "./healthDetailsPage";

export default async function HealthWellnessIndex() {
  const session = await getServerSession(authOptions);

  return (
    <>
      {/* Top Header */}
      <div className="bg-green-50 p-4 border-b border-green-100">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Link
              href="/"
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-4 h-4 text-green-700" />
              <span className="text-green-700 ml-1">Back to Home / </span>
            </Link>
            <h1 className="text-2xl font-bold text-green-700">
              Health & Wellness Directory
            </h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <HealthAndWellnessPage user={session?.user} />
    </>
  );
}
