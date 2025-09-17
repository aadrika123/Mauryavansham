"use server";

import { db } from "@/src/drizzle/db";
import { transformDatabaseProfilesToProfiles } from "../utils/transformProfile";
import { DatabaseProfile } from "../type";
import { eq } from "drizzle-orm";
import { profiles, blogs, ads } from "@/src/drizzle/schema";

export async function getAllProfiles(userId: number) {
  try {
    // ✅ Sare profiles (user ke sabhi)
    const allProfiles: DatabaseProfile[] = await db.query.profiles.findMany({
      // where: (fields, { eq }) => eq(fields.userId, String(userId)),
      orderBy: (fields, { desc }) => [desc(fields.createdAt)],
    });

    // ✅ Blogs
    const userBlogs = await db.query.blogs.findMany({
      where: (fields, { eq }) => eq(fields.authorId, String(userId)),
      orderBy: (fields, { desc }) => [desc(fields.createdAt)],
    });

    // ✅ Ads
    const userAds = await db.query.ads.findMany({
      where: (fields, { eq }) => eq(fields.userId, String(userId)),
      orderBy: (fields, { desc }) => [desc(fields.createdAt)],
    });

    // ✅ Transform profiles (UI ke liye)
    const transformedProfiles = transformDatabaseProfilesToProfiles(allProfiles);

    // ✅ Sirf active + non-deleted profiles UI me bhejne ke liye
    const activeProfilesOnly = transformedProfiles.filter(
      (p) => p.isActive && !p.isDeleted
    );

    // ✅ Profile stats (sahi logic – sabhi profiles count hote rahenge)
    const profilesStats = {
      total: allProfiles.length,
      active: allProfiles.filter((p) => p.isActive && !p.isDeleted).length,
      pending: allProfiles.filter((p) => !p.isActive && !p.isDeleted).length,
      rejected: allProfiles.filter((p) => p.isDeleted).length,
      relationWise: allProfiles.reduce(
        (acc: Record<string, number>, p) => {
          const relation = p.profileRelation || "other";
          acc[relation] = (acc[relation] || 0) + 1;
          return acc;
        },
        {}
      ),
    };

    // ✅ Blog stats
    const blogStats = {
      total: userBlogs.length,
      pending: userBlogs.filter((b) => b.status === "pending").length,
      approved: userBlogs.filter((b) => b.status === "approved").length,
      rejected: userBlogs.filter((b) => b.status === "rejected").length,
    };

    // ✅ Ads stats
    const adsStats = {
      total: userAds.length,
      pending: userAds.filter((a) => a.status === "pending").length,
      approved: userAds.filter((a) => a.status === "approved").length,
      rejected: userAds.filter((a) => a.status === "rejected").length,
    };

    return {
      success: true,
      data: {
        profiles: activeProfilesOnly, // 👈 sirf active+nonDeleted
        blogs: userBlogs,
        ads: userAds,
        stats: {
          profiles: profilesStats, // 👈 sabhi stats including deleted/pending
          blogs: blogStats,
          ads: adsStats,
        },
      },
      timestamp: Date.now(),
    };
  } catch (error) {
    console.error("Error fetching profiles/blogs/ads:", error);
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "An unexpected error occurred.",
      timestamp: Date.now(),
      data: {
        profiles: [],
        blogs: [],
        ads: [],
        stats: {
          profiles: {
            total: 0,
            active: 0,
            pending: 0,
            rejected: 0,
            relationWise: {},
          },
          blogs: { total: 0, pending: 0, approved: 0, rejected: 0 },
          ads: { total: 0, pending: 0, approved: 0, rejected: 0 },
        },
      },
    };
  }
}
