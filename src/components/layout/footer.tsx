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
} from "lucide-react";

export function Footer() {
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
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
              <div className="w-8 h-8 bg-red-800 rounded flex items-center justify-center">
                <span className="text-sm">f</span>
              </div>
              <div className="w-8 h-8 bg-red-800 rounded flex items-center justify-center">
                <span className="text-sm">t</span>
              </div>
              <div className="w-8 h-8 bg-red-800 rounded flex items-center justify-center">
                <span className="text-sm">i</span>
              </div>
              <div className="w-8 h-8 bg-red-800 rounded flex items-center justify-center">
                <span className="text-sm">y</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold text-yellow-400 mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2 text-red-200 text-sm sm:text-base">
              <li>
                <Link href="/" className="hover:text-white">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/heritage" className="hover:text-white">
                  Our Heritage
                </Link>
              </li>
              <li>
                <Link href="/community" className="hover:text-white">
                  Join Community
                </Link>
              </li>
              <li>
                <Link href="/matrimonial" className="hover:text-white">
                  Matrimonial
                </Link>
              </li>
              <li>
                <Link href="/forum" className="hover:text-white">
                  Community Forum
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-bold text-yellow-400 mb-4">Services</h4>
            <ul className="space-y-2 text-red-200 text-sm sm:text-base">
              <li>
                <Link href="/family-registration" className="hover:text-white">
                  Family Registration
                </Link>
              </li>
              <li>
                <Link href="/marriage-bureau" className="hover:text-white">
                  Marriage Bureau
                </Link>
              </li>
              <li>
                <Link href="/events" className="hover:text-white">
                  Cultural Events
                </Link>
              </li>
              <li>
                <Link href="/business" className="hover:text-white">
                  Business Directory
                </Link>
              </li>
              <li>
                <Link href="/support" className="hover:text-white">
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
              <div className="flex items-center gap-2">
                <span className="text-yellow-400">✉</span>
                <span>Info.mauryavansham@gmail.com</span>
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
    </footer>
  );
}
