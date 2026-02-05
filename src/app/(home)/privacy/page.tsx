'use client';

import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-orange-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 flex-wrap">
          <ArrowLeft className="h-4 w-4 text-red-600" />
          <Link href="/" className="text-red-600 hover:underline">
            Home
          </Link>
          <span>/</span>
          <span>Privacy Policy</span>
        </div>
      </div>
      <div className="bg-orange-50 min-h-screen py-8 px-4 sm:px-6 lg:px-12">
        <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-8">
          <h1 className="text-3xl font-bold text-red-800 mb-6 text-center underline">Privacy Policy</h1>
          <p className="text-gray-600 mb-6">
            www.mauryavansham.com is committed to protecting the personal information of its members.
          </p>

          {/* Section 9 */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-orange-700 mb-2">1. Data Collection</h2>
            <p className="text-gray-600 mb-2">
              We may collect the following categories of data during registration and use of the Portal:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-1">
              <li>
                <strong>Identity Data</strong> – Full name, date of birth, gender, family lineage details, and community
                references.
              </li>
              <li>
                <strong>Contact Data</strong> – Email address, phone number, residential address (optional).
              </li>
              <li>
                <strong>Professional Data</strong> – Business name, services, professional background (for business
                listings).
              </li>
              <li>
                <strong>Matrimonial Data</strong> – Family details, educational background, preferences (for matrimonial
                profiles).
              </li>
              <li>
                <strong>Technical Data</strong> – IP address, browser type, login details, device information.
              </li>
            </ul>
          </section>

          {/* Section 10 */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-orange-700 mb-2">2. Purpose of Data Collection</h2>
            <p className="text-gray-600 mb-2">The information collected shall be used exclusively for:</p>
            <ul className="list-disc pl-6 text-gray-600 space-y-1">
              <li>Verification of community membership</li>
              <li>Building authentic directories for business and matrimonial purposes</li>
              <li>Enabling community collaboration and support</li>
              <li>Improving member experience and platform functionality</li>
              <li>Maintaining security, accountability, and integrity of the Portal</li>
            </ul>
          </section>

          {/* Section 11 */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-orange-700 mb-2">3. Data Sharing</h2>
            <ul className="list-disc pl-6 text-gray-600 space-y-1">
              <li>
                Data shall <strong>only be visible to registered and verified community members</strong> for legitimate
                purposes (business networking, matrimonial search, etc.).
              </li>
              <li>
                The Portal shall <strong>never sell, rent, or commercially exploit</strong> member data to third
                parties.
              </li>
              <li>Data may be disclosed only if required by law, government authorities, or judicial process.</li>
            </ul>
          </section>

          {/* Section 12 */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-orange-700 mb-2">4. Data Security</h2>
            <ul className="list-disc pl-6 text-gray-600 space-y-1">
              <li>
                The Portal shall employ <strong>reasonable technical and administrative safeguards</strong> to protect
                personal data from unauthorized access, misuse, or disclosure.
              </li>
              <li>
                However, given the nature of the internet, complete security cannot be guaranteed. Members are advised
                to safeguard their login credentials.
              </li>
            </ul>
          </section>

          {/* Section 13 */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-orange-700 mb-2">5. User Rights</h2>
            <p className="text-gray-600 mb-2">Members have the right to:</p>
            <ul className="list-disc pl-6 text-gray-600 space-y-1">
              <li>Access their personal data stored on the Portal</li>
              <li>Request corrections to inaccurate or outdated data</li>
              <li>Request deletion of their profile (subject to verification and approval)</li>
              <li>Opt-out of certain listings (business/matrimonial) if desired</li>
            </ul>
          </section>

          {/* Section 14 */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-orange-700 mb-2">6. Community Purpose & Transparency</h2>
            <ul className="list-disc pl-6 text-gray-600 space-y-1">
              <li>
                This Portal is a <strong>community-owned initiative</strong>. It has been conceptualized, designed, and
                hosted by Aadrika Enterprises, whose Promoters themselves belong to the Kushwaha Community.
              </li>
              <li>
                The <strong>exclusive purpose</strong> of the Portal is community welfare and development, not
                profit-making. All data, interactions, and features are centered around uplifting the community.
              </li>
            </ul>
          </section>

          {/* Section 15 */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-orange-700 mb-2">7. Changes to the Terms & Policy</h2>
            <p className="text-gray-600">
              www.mauryavansham.com reserves the right to update or modify these Terms of Use and Privacy Policy at any
              time. Members will be notified of material changes via email or portal announcements. Continued use of the
              Portal after changes constitutes acceptance.
            </p>
          </section>

          {/* Section 16 */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-orange-700 mb-2">8. Governing Law & Jurisdiction</h2>
            <p className="text-gray-600">
              These Terms and Policies shall be governed by and construed under the laws of India, with jurisdiction
              limited to the Courts of Ranchi, Jharkhand.
            </p>
          </section>

          {/* Section 17 */}
          <section>
            <h2 className="text-xl font-semibold text-orange-700 mb-2">9. Contact Information</h2>
            <p className="text-gray-600">
              For queries, clarifications, or exercising your rights under this Policy, you may contact:
            </p>
            <p className="text-gray-600 mt-2">
              <strong>Aadrika Enterprises</strong>
              <br />
              Corporate Address: 1st Floor, MIMEC IT Park, Namkum Industrial Area, PO + PS: Namkum, Ranchi - 834010
              <br />
              Email:{' '}
              <a href="mailto:info@aadrikaenterprises.com" className="text-blue-600 underline">
                info@aadrikaenterprises.com
              </a>
              <br />
              Phone: <span className="text-gray-800">+91 88629 41658</span>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
