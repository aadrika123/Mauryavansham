import EventsClient from "./events-client"

interface Event {
  id: number
  title: string
  description: string
  image: string
  date: string
  time: string
  location: string
  attendees: number
  maxAttendees: number
  organizer: string
  type: "In-Person" | "Virtual" | "Hybrid"
  category: string
  isFeatured: boolean
}

export default async function EventsPage() {
  // In a real app, you'd fetch events from your database
  const mockEvents: Event[] = [
    {
      id: 1,
      title: "Diwali Celebration 2024",
      description: "Grand community Diwali celebration with cultural programs, traditional food, and fireworks.",
      image: "/placeholder.svg?height=300&width=500&text=Diwali+Celebration",
      date: "2024-11-12",
      time: "18:00",
      location: "Community Center, Delhi",
      attendees: 245,
      maxAttendees: 300,
      organizer: "Delhi Mauryavansh Association",
      type: "In-Person" as const,
      category: "Cultural",
      isFeatured: true,
    },
    {
      id: 2,
      title: "Heritage Preservation Workshop",
      description: "Learn about preserving our cultural heritage and traditional practices for future generations.",
      image: "/placeholder.svg?height=200&width=300&text=Heritage+Workshop",
      date: "2024-11-20",
      time: "14:00",
      location: "Online",
      attendees: 89,
      maxAttendees: 150,
      organizer: "Cultural Heritage Committee",
      type: "Virtual" as const,
      category: "Educational",
      isFeatured: false,
    },
    {
      id: 3,
      title: "Youth Leadership Summit",
      description: "Empowering young leaders in our community with skills and networking opportunities.",
      image: "/placeholder.svg?height=200&width=300&text=Youth+Summit",
      date: "2024-12-05",
      time: "10:00",
      location: "Mumbai Convention Center",
      attendees: 156,
      maxAttendees: 200,
      organizer: "Youth Development Wing",
      type: "Hybrid" as const,
      category: "Leadership",
      isFeatured: false,
    },
    {
      id: 4,
      title: "Traditional Cooking Workshop",
      description: "Learn authentic Maurya cuisine recipes from experienced community chefs.",
      image: "/placeholder.svg?height=200&width=300&text=Cooking+Workshop",
      date: "2024-11-25",
      time: "11:00",
      location: "Community Kitchen, Pune",
      attendees: 34,
      maxAttendees: 50,
      organizer: "Women's Committee",
      type: "In-Person" as const,
      category: "Cultural",
      isFeatured: false,
    },
  ]

  return <EventsClient initialEvents={mockEvents} />
}
