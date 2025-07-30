import { Card, CardContent } from "@/src/components/ui/card"
import { Badge } from "@/src/components/ui/badge"
import Image from "next/image"

interface HeritageCardProps {
  item: {
    title: string
    description: string
    timePeriod: string
    image?: string
  }
}

export function HeritageCard({ item }: HeritageCardProps) {
  return (
    <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
      <div className="h-64 relative overflow-hidden">
        <Image
          src={item.image || "/placeholder.svg?height=256&width=400&text=Heritage"}
          alt={item.title}
          fill
          className="object-cover"
        />
      </div>
      <CardContent className="p-6 bg-yellow-50">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xl font-bold text-red-700">{item.title}</h3>
          <Badge className="bg-yellow-200 text-yellow-800 border-yellow-300">{item.timePeriod}</Badge>
        </div>
        <p className="text-gray-700">{item.description}</p>
      </CardContent>
    </Card>
  )
}
