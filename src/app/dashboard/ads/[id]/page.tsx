import { getServerSession } from "next-auth";
// import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation";
import { db } from "@/src/drizzle/db";
import { ads, users } from "@/src/drizzle/schema";
import { eq } from "drizzle-orm";
import AdDetail from "./ad-detail";
import { authOptions } from "@/src/lib/auth";
import DashboardLayout from "@/src/components/layout/dashboardLayout";

interface AdPageProps {
  params: { id: string };
}

export default async function AdPage({ params }: AdPageProps) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login");
  }

  const [ad] = await db
    .select({
      id: ads.id,
      title: ads.title,
      bannerImageUrl: ads.bannerImageUrl,
      fromDate: ads.fromDate,
      toDate: ads.toDate,
      status: ads.status,
      createdAt: ads.createdAt,
      updatedAt: ads.updatedAt,
      approvedAt: ads.approvedAt,
      rejectionReason: ads.rejectionReason,
      user: {
        id: users.id,
        name: users.name,
        email: users.email,
      },
    })
    .from(ads)
    .leftJoin(users, eq(ads.userId, users.id))
    .where(eq(ads.id, Number(params.id)));

  if (!ad) {
    redirect("/dashboard/ads");
  }

  // Users can only view their own ads unless they're admin
  // if (ad.user.id !== Number(session.user.id) && session.user.role !== "admin") {
  //   redirect("/dashboard/ads");
  // }

  return (
    <DashboardLayout user={session.user}>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <AdDetail
          ad={ad}
          currentUserId={session.user.id}
          userRole={session.user.role}
        />
      </div>
    </DashboardLayout>
  );
}
