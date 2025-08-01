import AchievementsClient from "@/src/app/(home)/achievements/achievement-client"

interface Achievement {
  id: number
  name: string
  title: string
  description: string
  image: string
  category: "Healthcare" | "Sports" | "Technology" | "Education" | "Business" | "Arts"
  isVerified: boolean
  isFeatured: boolean
  isHallOfFame: boolean
  year: number
  location: string
  keyAchievement: string
  impact: string
  achievements: string[]
}

export default async function AchievementsPage() {
  // In a real app, you'd fetch achievements from your database
  const mockAchievements: Achievement[] = [
    {
      id: 1,
      name: "Dr. Priya Maurya",
      title: "Pioneering Cancer Research",
      description:
        "Led groundbreaking research in oncology, developing new treatment protocols that have helped thousands of patients worldwide.",
      image: "/placeholder.svg?height=300&width=300&text=Dr.+Priya+Maurya",
      category: "Healthcare",
      isVerified: true,
      isFeatured: true,
      isHallOfFame: true,
      year: 2024,
      location: "AIIMS, New Delhi",
      keyAchievement: "Published 45+ research papers, received National Medical Excellence Award",
      impact: "Improved survival rates by 23% in clinical trials",
      achievements: [
        "National Medical Excellence Award 2024",
        "45+ Published Research Papers",
        "Breakthrough Cancer Treatment Protocol",
        "International Recognition in Oncology",
      ],
    },
    {
      id: 2,
      name: "Arjun Maurya",
      title: "Olympic Bronze Medalist",
      description: "First from our community to win an Olympic medal in wrestling, inspiring countless young athletes.",
      image: "/placeholder.svg?height=300&width=300&text=Arjun+Maurya",
      category: "Sports",
      isVerified: true,
      isFeatured: false,
      isHallOfFame: true,
      year: 2024,
      location: "Paris Olympics",
      keyAchievement: "Olympic Bronze Medal, Asian Games Gold Medal",
      impact: "Established 5 wrestling academies in rural areas",
      achievements: [
        "Olympic Bronze Medal 2024",
        "Asian Games Gold Medal",
        "Commonwealth Games Champion",
        "Established 5 Wrestling Academies",
      ],
    },
    {
      id: 3,
      name: "Kavita Maurya",
      title: "Tech Innovation Leader",
      description:
        "Founded a successful AI startup focused on healthcare solutions, revolutionizing medical diagnostics.",
      image: "/placeholder.svg?height=300&width=300&text=Kavita+Maurya",
      category: "Technology",
      isVerified: true,
      isFeatured: false,
      isHallOfFame: true,
      year: 2024,
      location: "Bangalore",
      keyAchievement: "Forbes 30 Under 30, Raised $10M Series A funding",
      impact: "Healthcare AI deployed in 200+ rural clinics",
      achievements: [
        "Forbes 30 Under 30",
        "$10M Series A Funding",
        "AI Healthcare Innovation",
        "200+ Rural Clinics Deployment",
      ],
    },
    {
      id: 4,
      name: "Prof. Rajesh Maurya",
      title: "Educational Reformer",
      description: "Transformed rural education through innovative teaching methods and technology integration.",
      image: "/placeholder.svg?height=300&width=300&text=Prof.+Rajesh",
      category: "Education",
      isVerified: true,
      isFeatured: false,
      isHallOfFame: false,
      year: 2024,
      location: "Rural Bihar",
      keyAchievement: "Improved literacy rates by 40% in 50+ villages",
      impact: "10,000+ students benefited from innovative programs",
      achievements: [
        "National Teacher Award 2024",
        "40% Literacy Rate Improvement",
        "50+ Villages Transformed",
        "Digital Education Pioneer",
      ],
    },
  ]

  return <AchievementsClient initialAchievements={mockAchievements} />
}
