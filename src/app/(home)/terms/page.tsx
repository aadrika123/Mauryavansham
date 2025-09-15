"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function TermsPage() {
  return (
    <>
     <div className="container mx-auto px-4 py-4 bg-orange-50">
        <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 flex-wrap">
          <ArrowLeft className="h-4 w-4 text-red-600" />
          <Link href="/" className="text-red-600 hover:underline">
            Home
          </Link>
          <span>/</span>
          <span>Privacy Policy</span>
        </div>
      </div>
    <div className="bg-orange-50 min-h-screen py-12 px-4 sm:px-6 lg:px-12">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-2xl md:text-3xl font-bold text-red-800 mb-4 text-center underline">
          Terms of Use
        </h1>
        <p className="text-sm text-gray-500 mb-8">
          Last Updated: 15th September 2025
        </p>

        {/* Sections */}
        <div className="space-y-8 text-gray-700 leading-relaxed">
          {/* 1. Introduction */}
          <section>
            <h2 className="text-lg font-semibold text-orange-700 mb-2">
              1. Introduction
            </h2>
            <p>
              Welcome to <strong>MauryaVansham.com</strong> (hereinafter referred
              to as “the Portal”, “Website”, or “Platform”), an exclusive online
              community platform developed, designed, and hosted by{" "}
              <strong>Aadrika Enterprises</strong>, whose Promoters proudly
              belong to the Kushwaha / Koiri / Maurya / Sakhya / Sainy
              Community.
            </p>
            <p className="mt-2">
              This Portal has been created purely for community development, to
              bring together members of the Kushwaha lineage and provide them
              with a unified platform for:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Building professional and business networks</li>
              <li>Creating matrimonial connections within the community</li>
              <li>Preserving family heritage and genealogical records</li>
              <li>Facilitating peer-to-peer help and collaboration</li>
              <li>Showcasing achievements and contributions</li>
              <li>Promoting cultural, social, and educational development</li>
            </ul>
            <p className="mt-2">
              The Portal is <strong>non-commercial in nature</strong> and is
              driven by the spirit of unity, growth, and collective welfare of
              the community.
            </p>
          </section>

          {/* 2. Eligibility for Membership */}
          <section>
            <h2 className="text-lg font-semibold text-orange-700 mb-2">
              2. Eligibility for Membership
            </h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>
                Membership is <strong>strictly restricted</strong> to
                individuals belonging to the Kushwaha / Koiri / Maurya / Sakhya
                / Sainy community.
              </li>
              <li>
                Any person of any age may sign up, but must mandatorily belong
                to one of the above-mentioned communities.
              </li>
              <li>
                Upon registration, the member’s profile will remain{" "}
                <strong>inactive</strong> until verified and approved by at
                least three (3) Admin Members.
              </li>
              <li>
                The verification process will confirm the applicant’s community
                identity. Admins may request supporting information, references,
                or endorsements.
              </li>
              <li>
                Only after triple-admin approval, the member shall gain full
                access to the Portal.
              </li>
            </ul>
          </section>

          {/* 3. Nature of Membership */}
          <section>
            <h2 className="text-lg font-semibold text-orange-700 mb-2">
              3. Nature of Membership
            </h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>Each member is treated as an individual member.</li>
              <li>
                Membership is non-transferable and limited to verified
                individuals.
              </li>
              <li>
                Any false representation of community identity shall result in{" "}
                <strong>immediate termination</strong>.
              </li>
            </ul>
          </section>

          {/* 4. Community Directories */}
          <section>
            <h2 className="text-lg font-semibold text-orange-700 mb-2">
              4. Community Directories & Listings
            </h2>
            <p>The Portal maintains features including:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Member Directory</li>
              <li>Business Directory</li>
              <li>Matrimonial Listings</li>
              <li>Peer-to-Peer Help Exchange</li>
              <li>Achievements & Recognition Section</li>
            </ul>
            <p className="mt-2">
              All data is subject to verification, moderation, and approval by
              Admins.
            </p>
          </section>

          {/* 5. User Responsibilities */}
          <section>
            <h2 className="text-lg font-semibold text-orange-700 mb-2">
              5. User Responsibilities
            </h2>
            <p>By using this Portal, you agree to:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Provide true, accurate, and updated information.</li>
              <li>Respect the privacy and dignity of other members.</li>
              <li>Not misuse the Portal for fraudulent or unlawful activities.</li>
              <li>Not post defamatory, offensive, or misleading content.</li>
              <li>
                Use the Portal in good faith for the benefit of the entire
                community.
              </li>
            </ul>
          </section>

          {/* 6. Admin */}
          <section>
            <h2 className="text-lg font-semibold text-orange-700 mb-2">
              6. Administration & Governance
            </h2>
            <p>The Portal is governed by Admin Members who can:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Approve or reject applications</li>
              <li>Review, modify, or remove content</li>
              <li>Enforce community rules</li>
              <li>Suspend or terminate users</li>
            </ul>
            <p className="mt-2">The decision of the Admins is final.</p>
          </section>

          {/* 7. Disclaimer */}
          <section>
            <h2 className="text-lg font-semibold text-orange-700 mb-2">
              7. Disclaimer of Liability
            </h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>
                The Portal does not guarantee business, matrimonial, or
                professional outcomes.
              </li>
              <li>
                Admins and Aadrika Enterprises are not liable for disputes,
                misrepresentation, or misuse of information.
              </li>
              <li>
                Members should exercise due diligence while engaging with others.
              </li>
            </ul>
          </section>

          {/* 8. Ownership */}
          <section>
            <h2 className="text-lg font-semibold text-orange-700 mb-2">
              8. Ownership & Intellectual Property
            </h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>
                www.mauryavansham.com is fully owned by{" "}
                <strong>Aadrika Enterprises</strong>.
              </li>
              <li>
                All intellectual property (design, content, features) are the
                exclusive property of Aadrika Enterprises.
              </li>
              <li>
                Members may not copy, distribute, or exploit content without
                prior written consent.
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>
    </>

  );
}
