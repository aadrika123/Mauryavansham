import { Sparkles, Star } from 'lucide-react'
import React from 'react'

export const LeftSideAddBanner = () => {
  return (
   
        
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







  )
}
