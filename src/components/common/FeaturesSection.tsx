import Link from "next/link"
import { Button } from "@/src/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Users, Heart, ShoppingBag, Calendar, HandHeart, Trophy } from "lucide-react"

export function FeaturesSection() {
  const features = [
    {
      icon: Users,
      title: "Community Management",
      description: "Connect with fellow Maurya community members worldwide",
      href: "/community",
    },
    {
      icon: Heart,
      title: "Matrimonial Services",
      description: "Find your perfect life partner within the community",
      href: "/matrimonial",
    },
    {
      icon: ShoppingBag,
      title: "Trading Platform",
      description: "Buy and sell products/services within the community",
      href: "/trading",
    },
    {
      icon: Calendar,
      title: "Events & Calendar",
      description: "Stay updated with community events and celebrations",
      href: "/events",
    },
    {
      icon: HandHeart,
      title: "Help Exchange",
      description: "Get help or offer assistance to community members",
      href: "/help",
    },
    {
      icon: Trophy,
      title: "Achievements",
      description: "Showcase and celebrate community achievements",
      href: "/achievements",
    },
  ]

  return (
    <section className="py-16 bg-[#FFFDEF]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 text-[#8B0000]">Community Services</h2>
          <p className="text-[#8B4513] max-w-2xl mx-auto">
            Strengthening our Maurya community through digital connectivity, preserving our heritage, and fostering
            meaningful relationships
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="hover:shadow-[#ffd500] hover:shadow-lg bg-[#FFF8DE] border border-[#FFF6D5]">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <feature.icon className="h-6 w-6 text-orange-600" />
                  </div>
                  <CardTitle className="text-lg text-[#8B0000]">{feature.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4">{feature.description}</CardDescription>
                <Button variant="outline" size="sm" asChild>
                  <Link href={feature.href}>Learn More</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
