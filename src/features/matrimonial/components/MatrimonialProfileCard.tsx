import { Card, CardContent } from "@/src/components/ui/card"
import { Button } from "@/src/components/ui/button"
import { MapPin, Briefcase, GraduationCap, Users } from "lucide-react"
import Image from "next/image"

interface MatrimonialProfileCardProps {
  profile: {
    id: number
    name: string
    age: number
    gotra: string
    location: string
    profession: string
    education: string
    familyType: string
    image: string
  }
}

export function MatrimonialProfileCard({ profile }: MatrimonialProfileCardProps) {
  return (
    <Card className="bg-yellow-50 border-yellow-200 hover:shadow-lg transition-shadow">
      <CardContent className="p-6 text-center">
        <div className="relative mb-4">
          <div className="w-24 h-24 mx-auto rounded-full border-4 border-yellow-400 overflow-hidden">
            <Image
              src={profile.image || "/placeholder.svg?height=96&width=96&text=Profile"}
              alt={profile.name}
              width={96}
              height={96}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        <h3 className="text-lg font-bold text-red-700 mb-1">{profile.name}</h3>
        <p className="text-sm text-red-600 mb-4">
          {profile.age} years • {profile.gotra}
        </p>
        <div className="space-y-2 text-sm text-gray-700 mb-6">
          <div className="flex items-center justify-center gap-2">
            <MapPin className="h-4 w-4 text-red-500" />
            <span>{profile.location}</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <Briefcase className="h-4 w-4 text-red-500" />
            <span>{profile.profession}</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <GraduationCap className="h-4 w-4 text-red-500" />
            <span>{profile.education}</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <Users className="h-4 w-4 text-red-500" />
            <span>{profile.familyType}</span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex-1 border-red-500 text-red-600 hover:bg-red-50 bg-transparent">
            View Profile
          </Button>
          <Button className="flex-1 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white">
            Express Interest
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
