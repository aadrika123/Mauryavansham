import { getCurrentUser } from "@/src/lib/auth-utils"
import { redirect } from "next/navigation"
import DashboardClient from "./dashboard-client"

export default async function DashboardPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/sign-in")
  }

  return <DashboardClient user={user} />
}
