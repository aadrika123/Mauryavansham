import { getServerSession } from "next-auth"
// import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/src/lib/auth"
import CommunityForumPage from "./community"

export default async function CommunityIndex() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return <CommunityForumPage />
  }

  return (
    <CommunityForumPage user={session.user} />
  )
}
