'use client';
import { Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Crown } from 'lucide-react';
import Link from 'next/link';
import SignInForm from './signin-form'; // client component

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-orange-50 flex items-center justify-center ">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Crown className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-red-700 mb-2">Welcome Back</h1>
          <p className="text-red-600">Sign in to your Mauryavansham account</p>
        </div>

        {/* Sign In Form */}
        <Card className="bg-yellow-50 border-yellow-200 shadow-lg">
          <CardHeader>
            <CardTitle className="text-center text-red-700">Sign In</CardTitle>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<div>Loading form...</div>}>
              <SignInForm />
            </Suspense>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link href="/sign-up" className="text-red-600 hover:underline font-medium">
                  Create one here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
