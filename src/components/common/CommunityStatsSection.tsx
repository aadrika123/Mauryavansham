export function CommunityStatsSection() {
  return (
    <div className="bg-[#FFFDEF] px-8">
      <div className="container mx-auto px-4">
        <div className="bg-[linear-gradient(125deg,#ffae00,#8B0000,#FF5C00)] text-white py-8 rounded-2xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Growing Community</h2>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">25,000+</div>
              <div className="text-white/80">Registered Families</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">500+</div>
              <div className="text-white/80">Successful Marriages</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">50+</div>
              <div className="text-white/80">Countries Connected</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">10,000+</div>
              <div className="text-white/80">Forum Discussions</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
