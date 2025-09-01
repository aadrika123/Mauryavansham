import { getServerSession } from "next-auth"
// import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import CreateAdForm from "./create-ad-form"
import { authOptions } from "@/src/lib/auth"
import DashboardLayout from "@/src/components/layout/dashboardLayout"

export default async function CreateAdPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect("/sign-in")
  }

  return (
    <DashboardLayout user={session.user}>
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Apply for Banner Advertisement</h1>
        <p className="text-gray-600 mt-2">Submit your banner ad for approval</p>
      </div>

      <CreateAdForm />
    </div>
    </DashboardLayout>
  )
}
