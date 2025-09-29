"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import SignUpForm from "./signup-form";
import { Crown, X } from "lucide-react";
import Link from "next/link";

export default function SignUpPage() {
  const [isWelcomeOpen, setIsWelcomeOpen] = useState(false);

  // Open modal automatically on page load
  useEffect(() => {
    setIsWelcomeOpen(true);
  }, []);

  return (
    <div className="w-full px-40 min-h-screen bg-gradient-to-b from-yellow-50 to-orange-50 flex flex-col items-center justify-center p-4">
      {/* Header */}
      <div
        className="text-center mb-8 cursor-pointer"
        onClick={() => setIsWelcomeOpen(true)}
      >
        <Crown className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-red-700 mb-4">
          Welcome to Mauryavansham
        </h1>
      </div>

      {/* Sign Up Form */}
      <Card className="bg-yellow-50 border-yellow-200 shadow-lg ">
        <CardHeader>
          <CardTitle className="text-center text-red-700">
            Create Account
          </CardTitle>
        </CardHeader>
        <CardContent>
          <SignUpForm />
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                href="/sign-in"
                className="text-red-600 hover:underline font-medium"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Welcome Modal */}
      {isWelcomeOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl max-w-3xl w-full p-6 overflow-y-auto max-h-[90vh] relative">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              onClick={() => setIsWelcomeOpen(false)}
            >
              <X size={24} />
            </button>

            <div className="text-red-700 space-y-4 text-left">
              <h1 className="text-3xl font-bold text-center underline">Welcome to Mauryavansham</h1>
              <p>
                <strong>
                  Dear Member of the Kushwaha / Koiri / Sakhya / Sainy / Dangi
                  Community,
                </strong>
              </p>
              <p>
                It gives us immense pride and joy to invite you to be a part of{" "}
                <span className="font-semibold">www.mauryavansham.com</span> – a
                unique digital platform created by the community, for the
                community.
              </p>
              <p>
                This portal has been designed, developed, and hosted by{" "}
                <span className="font-semibold">Aadrika Enterprises</span>,
                whose promoters proudly belong to our community. The motive is
                simple yet powerful – to connect, empower, and uplift the
                Kushwaha community across India, and beyond.
              </p>

              <h2 className="text-2xl font-bold text-red-800 mt-6">
                🌟 Why Join MauryaVansham.com?
              </h2>
              <ul className="list-disc list-inside space-y-2">
                <li>
                  <strong>Exclusive Community Platform</strong> – Only members
                  of the Kushwaha / Koiri / Sakhya / Sainy community can
                  register, ensuring authenticity and trust.
                </li>
                <li>
                  <strong>Multiple Features for Growth:</strong>
                  <ul className="list-disc list-inside ml-6 space-y-1">
                    <li>
                      Matrimony: Find the right match within our trusted
                      community.
                    </li>
                    <li>
                      Business Forum: Promote and grow your business through
                      community networking.
                    </li>
                    <li>
                      Achievements & Events: Share success stories and stay
                      updated with community programs.
                    </li>
                    <li>
                      Peer Support & Marketplace: Help and get help from
                      community members.
                    </li>
                  </ul>
                </li>
                <li>
                  <strong>Data Security & Privacy:</strong>
                  <ul className="list-disc list-inside ml-6 space-y-1">
                    <li>
                      Your data is securely stored and never shared with third
                      parties.
                    </li>
                    <li>
                      Every new registration undergoes a{" "}
                      <strong>three-admin verification process</strong> to
                      ensure that only genuine community members are approved.
                    </li>
                  </ul>
                </li>
                <li>
                  <strong>Community Development Focus</strong> – This platform
                  is not commercial in nature; it is purely dedicated to
                  strengthening our unity, trust, and collective growth.
                </li>
              </ul>

              <h2 className="text-2xl font-bold text-red-800 mt-6">
                🖊️ How to Join?
              </h2>
              <ol className="list-decimal list-inside space-y-1 ml-2">
                <li>
                  Visit{" "}
                  <span className="font-semibold">www.mauryavansham.com</span>
                </li>
                <li>Complete your registration form.</li>
                <li>
                  Wait for approval by three Admins verifying your community
                  background.
                </li>
                <li>
                  Once approved, you can explore and benefit from all the
                  features of the portal.
                </li>
              </ol>

              <p className="mt-6">
                We wholeheartedly invite you to join us, contribute to this
                initiative, and be a part of this collective effort to uplift
                our community. Together, we can build stronger bonds, create
                better opportunities, and ensure a prosperous future for all.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
