export function CommunityStatsSection() {
  return (
    <div className="bg-[#FFFDEF] px-4 sm:px-6 lg:px-8 py-10">
      <div className="container mx-auto">
        <div className="bg-[linear-gradient(125deg,#ffae00,#8B0000,#FF5C00)] text-white py-10 rounded-2xl shadow-xl">
          {/* Heading */}
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold mb-3">
              Our Growing Community
            </h2>
            <p className="text-sm sm:text-base text-white/80">
              Connecting families and creating lifelong bonds
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 px-4 sm:px-6 lg:px-12">
            {/* Stat Item */}
            <div className="text-center hover:scale-105 transition-transform duration-300">
              <div className="text-3xl sm:text-4xl font-bold mb-2">25,000+</div>
              <div className="text-sm sm:text-base text-white/80">
                Registered Families
              </div>
            </div>

            <div className="text-center hover:scale-105 transition-transform duration-300">
              <div className="text-3xl sm:text-4xl font-bold mb-2">500+</div>
              <div className="text-sm sm:text-base text-white/80">
                Successful Marriages
              </div>
            </div>

            <div className="text-center hover:scale-105 transition-transform duration-300">
              <div className="text-3xl sm:text-4xl font-bold mb-2">50+</div>
              <div className="text-sm sm:text-base text-white/80">
                Countries Connected
              </div>
            </div>

            <div className="text-center hover:scale-105 transition-transform duration-300">
              <div className="text-3xl sm:text-4xl font-bold mb-2">10,000+</div>
              <div className="text-sm sm:text-base text-white/80">
                Forum Discussions
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
