// import Link from "next/link"
// import { Button } from "@/src/components/ui/button"
// import { ImageCarousel } from "@/src/components/image-carousel"
// import { Sparkles, Star } from "lucide-react"

// export function HeroSection() {
//   const carouselImages = [
//     { src: "/images/maurya-empire-art.png", alt: "Ancient Maurya Empire Art" },
//     { src: "/images/lord-ram-temple.png", alt: "Lord Ram Temple Ayodhya" },
//     { src: "/images/ashoka-pillar.png", alt: "Ashoka Pillar in Ancient India" },
//     {
//       src: "/images/indian-family-celebration.png",
//       alt: "Indian Family Celebration",
//     },
//     {
//       src: "/images/indian-community-gathering.png",
//       alt: "Large Indian Community Gathering",
//     },
//   ]

//   return (
//     <section className="relative text-white py-20 md:py-28 lg:py-32 overflow-hidden">
//       <ImageCarousel images={carouselImages} />
//       <div
//         className="absolute inset-0 bg-gradient-to-r to-[#ffae00] via-[#FF5C00] from-[#8B0000] text-white"
//         aria-hidden="true"
//       ></div>{" "}

//       <div className="container mx-auto px-8 py-10 w-5/6">
//         <div className="relative">
//           {/* Book-style Ad Banner */}
//           <div className="bg-gradient-to-r from-amber-100 via-yellow-50 to-amber-100 border-4 border-amber-300 rounded-2xl shadow-2xl overflow-hidden transform hover:scale-105 transition-transform duration-300">
//             <div className="relative p-8 md:p-12">
//               {/* Decorative Elements */}

//               {/* Book Pages Effect */}
//               <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20"></div>

//               {/* Content */}
//               <div className="text-center relative z-10">

//                 <div className=" relative border-2 border-dashed border-amber-400 rounded-lg p-8 bg-gradient-to-br from-amber-50 to-yellow-100">
//                   <h3 className="text-2xl md:text-3xl font-bold text-amber-800 mb-4">
//                     Book Your Ad
//                   </h3>

//                   <div className="space-y-4">
//                     <div className="absolute top-4 left-4">
//                       <Sparkles className="h-8 w-8 text-amber-500 animate-pulse" />
//                     </div>
//                     <div className="absolute top-4 right-4">
//                       <Star className="h-8 w-8 text-amber-500 animate-pulse" />
//                     </div>
//                     <button className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white font-bold py-3 px-8 rounded-full shadow-lg transform hover:scale-105 transition-all duration-200">
//                       Place Your Ad Here
//                     </button>

//                     <p className="text-sm text-amber-600 mt-2">
//                       Contact us to feature your message in this premium space
//                     </p>
//                   </div>
//                 </div>
//               </div>

//               {/* Decorative Border Pattern */}
//               <div className="absolute inset-x-0 top-0 h-2 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-400"></div>
//               <div className="absolute inset-x-0 bottom-0 h-2 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-400"></div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Overlay for text readability */}
//       <div className="container mx-auto px-4 relative z-10">
//         <div className="max-w-4xl mx-auto text-center">
//           <h1 className="text-5xl font-bold mb-6">The Royal Heritage of Maurya Community</h1>
//           <p className="text-xl mb-8 opacity-90">
//             Descendants of Lord Ram, inheritors of Samrat Chandragupta Maurya's legacy, and followers of Samrat Ashoka's
//             wisdom. Join our proud community portal connecting Mauryas and Kushwahas across the globe.
//           </p>
//           <div className="flex flex-col sm:flex-row gap-4 justify-center">
//             <Button size="lg" className="bg-white text-orange-600 hover:bg-gray-100" asChild>
//               <Link href="/sign-up">Join Community</Link>
//             </Button>
//             <Button
//               size="lg"
//               variant="outline"
//               className="border-white text-white hover:bg-white hover:text-orange-600 bg-transparent"
//               asChild
//             >
//               <Link href="/sign-in">Sign In</Link>
//             </Button>
//           </div>
//         </div>
//       </div>
//     </section>
//   )
// }
"use client";
import Link from "next/link";
import { Button } from "@/src/components/ui/button";
import { ImageCarousel } from "@/src/components/image-carousel";
import { Sparkles, Star } from "lucide-react";
import { useSession } from "next-auth/react";

export function HeroSection() {
  const { data: session } = useSession();
  const isAuthenticated = !!session?.user;
  const userName = session?.user?.name || "User";
  const userImage = session?.user?.image;

  const carouselImages = [
    { src: "/images/maurya-empire-art.png", alt: "Ancient Maurya Empire Art" },
    { src: "/images/lord-ram-temple.png", alt: "Lord Ram Temple Ayodhya" },
    { src: "/images/ashoka-pillar.png", alt: "Ashoka Pillar in Ancient India" },
    {
      src: "/images/indian-family-celebration.png",
      alt: "Indian Family Celebration",
    },
    {
      src: "/images/indian-community-gathering.png",
      alt: "Large Indian Community Gathering",
    },
  ];

  return (
    <section className="relative text-white py-20  overflow-hidden">
      <ImageCarousel images={carouselImages} />
      <div
        className="absolute inset-0 bg-gradient-to-r to-[#ffae00] via-[#FF5C00] from-[#8B0000] text-white"
        aria-hidden="true"
      ></div>

      {/* Main Content Container */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex gap-6">
          {/* Vertical Ad Banner - Left Side */}
          <div className="hidden lg:block w-48 flex-shrink-0">
            <div className="sticky top-6">
              <div className="bg-gradient-to-b from-amber-100 via-yellow-50 to-amber-100 border-4 border-amber-300 rounded-2xl shadow-2xl overflow-hidden transform hover:scale-105 transition-transform duration-300 h-96">
                <div className="relative p-4 h-full">
                  {/* Decorative Elements */}
                  <div className="absolute top-3 left-3">
                    <Sparkles className="h-6 w-6 text-amber-500 animate-pulse" />
                  </div>
                  <div className="absolute top-3 right-3">
                    <Star className="h-6 w-6 text-amber-500 animate-pulse" />
                  </div>
                  <div className="absolute bottom-3 left-3">
                    <Star className="h-5 w-5 text-amber-400" />
                  </div>
                  <div className="absolute bottom-3 right-3">
                    <Sparkles className="h-5 w-5 text-amber-400" />
                  </div>

                  {/* Book Pages Effect */}
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white to-transparent opacity-20"></div>

                  {/* Content */}
                  <div className="text-center relative z-10 h-full flex flex-col justify-center">
                    <div className="absolute top-3 left-3">
                      <Sparkles className="h-6 w-6 text-amber-500 animate-pulse" />
                    </div>

                    <div className="absolute top-3 right-3">
                      <Sparkles className="h-6 w-6 text-amber-500 animate-pulse" />
                    </div>

                    <div className="border-2 border-dashed border-amber-400 rounded-lg p-4 bg-gradient-to-br from-amber-50 to-yellow-100 h-full flex flex-col justify-center">
                      <h3 className="text-lg font-bold text-amber-800 mb-3">
                        Book Your Ad
                      </h3>

                      <div className="space-y-3 flex-1 flex flex-col justify-center">
                        <p className="text-xs text-amber-700 leading-relaxed">
                          Premium vertical space for your business
                        </p>

                        <div className="space-y-2">
                          {/* <div className="text-xs text-amber-600 space-y-1">
                            <span className="bg-amber-200 px-2 py-1 rounded-full block">✨ Prime Position</span>
                            <span className="bg-amber-200 px-2 py-1 rounded-full block">👑 Always Visible</span>
                            <span className="bg-amber-200 px-2 py-1 rounded-full block">🌟 High Impact</span>
                          </div> */}

                          <button className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white font-bold py-2 px-3 rounded-full shadow-lg transform hover:scale-105 transition-all duration-200 text-xs">
                            Place Ad Here
                          </button>

                          <p className="text-xs text-amber-600">
                            Contact us for this premium vertical space
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Decorative Border Pattern */}
                  <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-amber-400 via-yellow-400 to-amber-400"></div>
                  <div className="absolute inset-y-0 right-0 w-1 bg-gradient-to-b from-amber-400 via-yellow-400 to-amber-400"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-5xl font-bold mb-6">
                The Royal Heritage of Maurya Community
              </h1>
              <p className="text-xl mb-8 opacity-90">
                Descendants of Lord Ram, inheritors of Samrat Chandragupta
                Maurya's legacy, and followers of Samrat Ashoka's wisdom. Join
                our proud community portal connecting Mauryas and Kushwahas
                across the globe.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {/* <Button size="lg" className="bg-white text-orange-600 hover:bg-gray-100" asChild>
                  <Link href="/sign-up">Join Community</Link>
                </Button> */}
                {isAuthenticated ? (
                  // <Button className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white">
                  //   <Link href="/dashboard">Dashboard</Link>
                  // </Button>
                  ""
                ) : (
                  <Button className="bg-white text-orange-600 hover:bg-orange-100">
                    <Link href="/sign-up">Join Community</Link>
                  </Button>
                )}
                {/* <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-orange-600 bg-transparent"
                  asChild
                >
                  <Link href="/sign-in">Sign In</Link>
                </Button> */}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Ad Banner - Shows on smaller screens */}
        <div className="lg:hidden mt-8">
          <div className="bg-gradient-to-r from-amber-100 via-yellow-50 to-amber-100 border-4 border-amber-300 rounded-2xl shadow-2xl overflow-hidden transform hover:scale-105 transition-transform duration-300">
            <div className="relative p-6">
              {/* Decorative Elements */}
              <div className="absolute top-3 left-3">
                <Sparkles className="h-6 w-6 text-amber-500 animate-pulse" />
              </div>
              <div className="absolute top-3 right-3">
                <Star className="h-6 w-6 text-amber-500 animate-pulse" />
              </div>

              {/* Book Pages Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20"></div>

              {/* Content */}
              <div className="text-center relative z-10">
                <div className="border-2 border-dashed border-amber-400 rounded-lg p-4 bg-gradient-to-br from-amber-50 to-yellow-100">
                  <h3 className="text-xl font-bold text-amber-800 mb-3">
                    Book Your Ad
                  </h3>

                  <div className="space-y-3">
                    {/* <div className="flex flex-wrap justify-center gap-2 text-xs text-amber-600">
                      <span className="bg-amber-200 px-2 py-1 rounded-full">✨ Premium Space</span>
                      <span className="bg-amber-200 px-2 py-1 rounded-full">👑 Mobile Visible</span>
                      <span className="bg-amber-200 px-2 py-1 rounded-full">🌟 High Reach</span>
                    </div> */}

                    <button className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white font-bold py-2 px-6 rounded-full shadow-lg transform hover:scale-105 transition-all duration-200 text-sm">
                      Place Your Ad Here
                    </button>

                    <p className="text-xs text-amber-600">
                      Contact us to feature your message in this premium space
                    </p>
                  </div>
                </div>
              </div>

              {/* Decorative Border Pattern */}
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-400"></div>
              <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-400"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
