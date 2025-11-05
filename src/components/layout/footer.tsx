"use client";
import Link from "next/link";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import {
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Mail,
  Phone,
  MapPin,
  Crown,
  Lock,
  X,
  User,
} from "lucide-react";
import {
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaXTwitter,
} from "react-icons/fa6";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export function Footer() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { data: session } = useSession();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const Router = useRouter();

  console.log("session", session);
  useEffect(() => {
    if (session?.user) {
      setCurrentUser(session.user);
    }
  }, [session]);

  const footerLinks = {
    community: [
      { name: "Members Directory", href: "/community" },
      { name: "Family Tree", href: "/family-tree" },
      { name: "Achievements", href: "/achievements" },
      { name: "Help Exchange", href: "/help" },
    ],
    services: [
      { name: "Matrimonial", href: "/matrimonial" },
      { name: "Trading Platform", href: "/trading" },
      { name: "Events", href: "/events" },
      { name: "Donations", href: "/donations" },
    ],
    heritage: [
      { name: "Our History", href: "/heritage/history" },
      { name: "Cultural Timeline", href: "/heritage/timeline" },
      { name: "Traditions", href: "/heritage/traditions" },
      { name: "Notable Figures", href: "/heritage/figures" },
    ],
    support: [
      { name: "Help Center", href: "/support" },
      { name: "Contact Us", href: "/contact" },
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Terms of Service", href: "/terms" },
    ],
  };

  return (
    <footer className="bg-[#8B0000] text-white py-10 sm:py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Crown className="h-8 w-8 text-yellow-400" />
              <div>
                <h3 className="text-xl font-bold">Mauryavansh</h3>
                <p className="text-sm text-yellow-200">मौर्यवंश</p>
              </div>
            </div>
            <p className="text-red-200 mb-4 text-sm sm:text-base">
              Connecting the global Maurya community and preserving our royal
              heritage for future generations.
            </p>
            <div className="flex gap-3 sm:gap-4">
              <Link
                href="https://www.facebook.com/profile.php?id=61580881266044"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 bg-red-800 rounded flex items-center justify-center hover:bg-red-700"
              >
                <FaFacebookF className="text-white text-lg" />
              </Link>
              <Link
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 bg-red-800 rounded flex items-center justify-center hover:bg-red-700"
              >
                <FaXTwitter className="text-white text-lg" />
              </Link>
              <Link
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 bg-red-800 rounded flex items-center justify-center hover:bg-red-700"
              >
                <FaInstagram className="text-white text-lg" />
              </Link>
              <Link
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 bg-red-800 rounded flex items-center justify-center hover:bg-red-700"
              >
                <FaYoutube className="text-white text-lg" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold text-yellow-400 mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2 text-red-200 text-sm sm:text-base">
              {/* <li>
                <Link href="/" className="hover:text-white">
                  Home
                </Link>
              </li> */}
              <li>
                <Link href="/heritage" className="hover:text-white">
                  Heritage
                </Link>
              </li>
              <li>
                <Link href="/community" className="hover:text-white">
                  Community Forum
                </Link>
              </li>
              <li>
                <Link href="/matrimonial" className="hover:text-white">
                  Matrimonial
                </Link>
              </li>
              <li>
                <Link href="/business" className="hover:text-white">
                  Business Forum
                </Link>
              </li>
              <li>
                <Link href="/events" className="hover:text-white">
                  Events & Calendar
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-bold text-yellow-400 mb-4">Services</h4>
            <ul className="space-y-2 text-red-200 text-sm sm:text-base">
              <li>
                <button
                  onClick={() => {
                    if (!currentUser) {
                      setShowLoginModal(true);
                      return;
                    }

                    if (currentUser.role === "user") {
                      Router.push("/dashboard/create-profile");
                    } else if (
                      currentUser.role === "admin" ||
                      currentUser.role === "superAdmin"
                    ) {
                      Router.push("/admin/create-profile");
                    }
                  }}
                  className="hover:text-white text-left"
                >
                  Create Matrimonial
                </button>
              </li>

              <li>
                <button
                  onClick={() => {
                    if (!currentUser) {
                      setShowLoginModal(true);
                      return;
                    }

                    if (currentUser.role === "user") {
                      Router.push("/dashboard/register-business");
                    } else if (
                      currentUser.role === "admin" ||
                      currentUser.role === "superAdmin"
                    ) {
                      Router.push("/admin/register-business");
                    }
                  }}
                  className="hover:text-white text-left"
                >
                  Register Businesses
                </button>
              </li>

              {/* <li>
                <Link
                  href="/dashboard/create-profile"
                  className="hover:text-white"
                >
                  Matrimonial
                </Link>
              </li> */}
              <li>
                <Link href="/events" className="hover:text-white">
                  Events & Calendar
                </Link>
              </li>
              {/* <li>
                <Link
                  href="/dashboard/register-business"
                  className="hover:text-white"
                >
                  Business Registration
                </Link>
              </li> */}
              <li>
                <Link href="#" className="hover:text-white">
                  Help & Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-bold text-yellow-400 mb-4">
              Contact Us
            </h4>
            <div className="space-y-3 text-red-200 text-sm sm:text-base">
              <div className="flex items-center gap-2 max-w-[180px] sm:max-w-none">
                <span className="text-yellow-400">✉</span>
                <span className="text-xs text-ellipsis overflow-hidden whitespace-nowrap">
                  Info.mauryavansham@gmail.com
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-yellow-400">📞</span>
                <span>+91 88629 41658</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-yellow-400">📍</span>
                <span>Ranchi, Jharkhand</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-red-800 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-red-200 text-xs sm:text-sm text-center md:text-left">
            © 2025 Mauryavansh.com. All rights reserved. | Developed &
            Maintained by{" "}
            <Link
              href="https://aadrikaenterprises.com/"
              className="underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Aadrika Enterprises
            </Link>
          </p>

          <div className="flex gap-4 sm:gap-6 text-xs sm:text-sm text-red-200">
            <Link href="/privacy" className="hover:text-white">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-white">
              Terms of Service
            </Link>
            <Link href="/guidelines" className="hover:text-white">
              Community Guidelines
            </Link>
          </div>
        </div>
      </div>
      {showLoginModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-red-700 flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Login Required
              </h3>
              <button
                onClick={() => setShowLoginModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="text-gray-600 mb-6">
              Please login to participate in community discussions and create
              new topics.
            </p>
            <div className="space-y-3">
              <Button
                onClick={() => Router.push("/sign-in")}
                className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white"
              >
                <User className="h-4 w-4 mr-2" />
                Login
              </Button>
              <Button
                onClick={() => setShowLoginModal(false)}
                variant="outline"
                className="w-full text-black hover:bg-gray-100"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
}
