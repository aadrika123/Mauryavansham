import { withAuth } from "next-auth/middleware"

export default withAuth(
  function middleware(req) {
    // Add any additional middleware logic here
  },
  // {
  //   callbacks: {
  //     authorized: ({ token, req }) => {
  //       // Protect these routes
  //       if (req.nextUrl.pathname.startsWith("/dashboard")) {
  //         return !!token
  //       }
  //       // if (req.nextUrl.pathname.startsWith("/create-profile")) {
  //       //   return !token
  //       // }
  //       // if (req.nextUrl.pathname.startsWith("/profile/edit")) {
  //       //   return !!token
  //       // }
  //       return true
  //     },
  //   },
  // },
)

export const config = {
  matcher: ["/dashboard/:path", "/create-profile/:path*", "/profile/edit/:path*"],
}