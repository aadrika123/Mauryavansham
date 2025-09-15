// import SignUpForm from "./signup-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Crown } from "lucide-react"
import Link from "next/link"
import SignUpForm from "./signup-form"

export default function SignUpPage() {
  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-yellow-50 to-orange-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <Crown className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-red-700 mb-2">Join Mauryavansh</h1>
          <p className="text-red-600">Create your matrimonial profile today</p>
        </div>

        {/* Sign Up Form */}
        <Card className="bg-yellow-50 border-yellow-200 shadow-lg">
          <CardHeader>
            <CardTitle className="text-center text-red-700">Create Account</CardTitle>
          </CardHeader>
          <CardContent>
            <SignUpForm />

            {/* Sign In Link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <Link href="/sign-in" className="text-red-600 hover:underline font-medium">
                  Sign in here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        {/* <div className="mt-8 text-center text-sm text-gray-600">
          <p>By signing up, you agree to our</p>
          <div className="flex justify-center gap-4 mt-1">
            <Link href="/terms" className="text-red-600 hover:underline">
              Terms of Service
            </Link>
            <span>•</span>
            <Link href="/privacy" className="text-red-600 hover:underline">
              Privacy Policy
            </Link>
          </div>
        </div> */}
      </div>
    </div>
  )
}
