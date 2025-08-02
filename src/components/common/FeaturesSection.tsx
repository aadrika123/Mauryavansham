import Link from "next/link"
import { Button } from "@/src/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Users, Heart, ShoppingBag, Calendar, HandHeart, Trophy, Sparkles, Star } from "lucide-react"

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
      href: "/",
    },
    {
      icon: Calendar,
      title: "Events & Calendar",
      description: "Stay updated with community events and celebrations",
      href: "/",
    },
    {
      icon: HandHeart,
      title: "Help Exchange",
      description: "Get help or offer assistance to community members",
      href: "/",
    },
    {
      icon: Trophy,
      title: "Achievements",
      description: "Showcase and celebrate community achievements",
      href: "/",
    },
  ]

  return (
    <section className="py-16 bg-[#FFFDEF] px-8">

 
 <div className="container mx-auto px-8 py-2 w-5/6">
        <div className="relative">
          {/* Book-style Ad Banner */}
          <div className="bg-gradient-to-r from-amber-100 via-yellow-50 to-amber-100 border-4 border-amber-300 rounded-2xl shadow-2xl overflow-hidden transform hover:scale-105 transition-transform duration-300">
            <div className="relative p-8 ">
              {/* Decorative Elements */}

              {/* Book Pages Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20"></div>

              {/* Content */}
              <div className="text-center relative z-10">

                <div className=" relative border-2 border-dashed border-amber-400 rounded-lg p-8 bg-gradient-to-br from-amber-50 to-yellow-100">
                  <h3 className="text-xl md:text-3xl font-bold text-amber-800 mb-4">
                   Book Your Ad 
                  </h3>


                  <div className="space-y-4">
                    <div className="absolute top-4 left-4">
                      <Sparkles className="h-8 w-8 text-amber-500 animate-pulse" />
                    </div>
                    <div className="absolute top-4 right-4">
                      <Star className="h-8 w-8 text-amber-500 animate-pulse" />
                    </div>
                    <button className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white font-bold py-3 px-8 rounded-full shadow-lg transform hover:scale-105 transition-all duration-200">
                      Place Your Ad Here
                    </button>

                    <p className="text-sm text-amber-600 mt-2">
                      Contact us to feature your message in this premium space 
                    </p>
                  </div>
                </div>
              </div>

              {/* Decorative Border Pattern */}
              <div className="absolute inset-x-0 top-0 h-2 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-400"></div>
              <div className="absolute inset-x-0 bottom-0 h-2 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-400"></div>
            </div>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 mt-10">
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
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className={feature.href === "/" ? "  cursor-not-allowed" : "text-orange-600"}
                  disabled={feature.href === "/"} // Disable the button when href is "/"
                >
                  <Link href={feature.href}>
                    {feature.href === "/" ? "Coming Soon" : "Learn More"}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
