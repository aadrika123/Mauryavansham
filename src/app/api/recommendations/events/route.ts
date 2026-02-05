import { type NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { db } from '@/src/drizzle/db';
import { events, users } from '@/src/drizzle/schema';
import { eq, and, gte } from 'drizzle-orm';
import { authOptions } from '@/src/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = Number.parseInt(session.user.id);

    // Get user info for matching
    const currentUser = await db.select().from(users).where(eq(users.id, userId)).limit(1);

    // Get upcoming approved events
    const today = new Date().toISOString().split('T')[0];
    const upcomingEvents = await db
      .select({
        id: events.id,
        title: events.title,
        description: events.description,
        date: events.date,
        location: events.location,
        attendees: events.attendees,
        category: events.category,
        type: events.type
      })
      .from(events)
      .where(and(eq(events.status, 'approved'), gte(events.date, today)))
      .limit(10);

    // Calculate match scores
    const recommendedEvents = upcomingEvents.map(event => {
      let matchScore = 65; // Base score

      // Same city/state = +15 points
      if (currentUser[0]?.city && event.location.toLowerCase().includes(currentUser[0].city.toLowerCase())) {
        matchScore += 15;
      } else if (currentUser[0]?.state && event.location.toLowerCase().includes(currentUser[0].state.toLowerCase())) {
        matchScore += 10;
      }

      // Popular event (>50 attendees) = +10 points
      if (event.attendees && event.attendees > 50) {
        matchScore += 10;
      }

      // Category/type bonus = +10 points
      if (event.category || event.type) {
        matchScore += 10;
      }

      matchScore = Math.min(matchScore, 100);

      // Determine reason
      let reason = 'Popular in your community';
      if (event.category) {
        reason = `Based on your interest in ${event.category}`;
      }
      if (currentUser[0]?.city && event.location.toLowerCase().includes(currentUser[0].city.toLowerCase())) {
        reason = `Event in your city: ${currentUser[0].city}`;
      }

      return {
        id: event.id,
        title: event.title,
        date: new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        location: event.location,
        attendees: event.attendees || 0,
        matchScore,
        reason,
        category: event.category || event.type || 'Community'
      };
    });

    // Sort by match score
    recommendedEvents.sort((a, b) => b.matchScore - a.matchScore);

    return NextResponse.json(recommendedEvents.slice(0, 6));
  } catch (error) {
    console.error('Error fetching event recommendations:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
