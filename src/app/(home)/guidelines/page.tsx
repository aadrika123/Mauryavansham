'use client';

import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

export default function CommunityGuidelines() {
  return (
    <div className="bg-orange-50 min-h-screen">
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 flex-wrap">
          <ArrowLeft className="h-4 w-4 text-red-600" />
          <Link href="/" className="text-red-600 hover:underline">
            Home
          </Link>
          <span>/</span>
          <span className="font-medium">Guidelines</span>
        </div>
      </div>

      {/* Content */}
      <div className="bg-orange-50 min-h-screen py-8 px-4 sm:px-6 lg:px-12">
        <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-8">
          <h1 className="text-3xl font-bold text-red-800 mb-6 text-center underline">Community Guidelines</h1>
          <p className="text-gray-700 mb-6">
            Welcome to <span className="font-semibold">Mauryavansham.com</span> – a platform created by the community,
            for the community. <br />
            To ensure a safe, respectful, and meaningful space for all members, we request every user to follow these
            Community Guidelines. By using this website, you agree to abide by these rules and respect fellow members.
          </p>

          {/* Guidelines List */}
          <div className="space-y-6 text-gray-800 leading-relaxed">
            <div>
              <h2 className="text-lg font-semibold text-red-600 mb-2">1. Respect & Dignity</h2>
              <ul className="list-disc list-inside space-y-1">
                <li>Treat every member with respect regardless of their opinions, profession, or background.</li>
                <li>Abusive, derogatory, casteist, communal, or discriminatory remarks will not be tolerated.</li>
                <li>Personal attacks, harassment, or bullying in any form are strictly prohibited.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-red-600 mb-2">2. Authentic Identity & Information</h2>
              <ul className="list-disc list-inside space-y-1">
                <li>
                  Provide accurate information during registration, including family lineage for verification purposes.
                </li>
                <li>Do not impersonate others or provide misleading details.</li>
                <li>Any fraudulent activity will result in immediate suspension.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-red-600 mb-2">3. Content Standards</h2>
              <p>Prohibited content includes:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Hate speech, inflammatory political or religious propaganda.</li>
                <li>Pornographic, obscene, or offensive material.</li>
                <li>False information, rumors, or unverified claims.</li>
              </ul>
              <p className="mt-2">
                ✅ Posts promoting unity, culture, knowledge, business, and opportunities are encouraged.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-red-600 mb-2">4. Matrimonial & Networking Etiquette</h2>
              <ul className="list-disc list-inside space-y-1">
                <li>Use features with serious intent and honesty.</li>
                <li>Respect privacy—do not misuse contact details.</li>
                <li>All interactions must remain professional and courteous.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-red-600 mb-2">5. Business & Marketplace Usage</h2>
              <ul className="list-disc list-inside space-y-1">
                <li>Promote businesses ethically without spamming.</li>
                <li>Ensure all listings are lawful and truthful.</li>
                <li>Fraudulent transactions or MLM schemes = strict action.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-red-600 mb-2">6. Privacy & Confidentiality</h2>
              <ul className="list-disc list-inside space-y-1">
                <li>Do not share members’ personal information without consent.</li>
                <li>Screenshots, copying, or misusing portal data is forbidden.</li>
                <li>Mauryavansham.com respects your privacy; members are expected to do the same.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-red-600 mb-2">7. Responsible Engagement</h2>
              <ul className="list-disc list-inside space-y-1">
                <li>Discussions on culture, heritage, social issues are encouraged if respectful.</li>
                <li>Political discussions allowed, but no hate speech or divisive language.</li>
                <li>Report inappropriate content to admins immediately.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-red-600 mb-2">8. Compliance with Law</h2>
              <p>
                Members must not use this platform for illegal, defamatory, or fraudulent activities. All activities
                must comply with Indian law (IT Act, cybercrime laws, and intellectual property rights).
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-red-600 mb-2">9. Consequences of Violations</h2>
              <ul className="list-disc list-inside space-y-1">
                <li>Warning or content removal.</li>
                <li>Temporary suspension of account.</li>
                <li>Permanent ban for repeated or serious violations (including legal action).</li>
              </ul>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-red-600 mb-2">10. Our Collective Responsibility</h2>
              <p>
                This forum exists to connect, empower, and uplift the Kushwaha/Maurya/Shakhya/Saini/Dangi community.
                Every member plays a role in maintaining its integrity. By following these guidelines, you help create a
                safe, inclusive, and inspiring platform for all.
              </p>
              <p className="mt-3 font-semibold text-red-700">
                📌 Remember: Mauryavansham.com is not just a website, it’s our shared digital home. Let’s protect it
                with dignity, honesty, and unity.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
