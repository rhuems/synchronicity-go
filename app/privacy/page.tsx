import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      <nav className="bg-black/30 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Synchronicity Go™
          </Link>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          Privacy Policy
        </h1>

        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10 space-y-6 text-white/90">
          <section>
            <h2 className="text-2xl font-semibold mb-3 text-white">1. Information We Collect</h2>
            <p className="mb-3">We collect information that you provide directly to us, including:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Account information (email address, display name)</li>
              <li>Synchronicity records (descriptions, locations, dates, photos)</li>
              <li>Profile information and preferences</li>
              <li>Usage data and interactions with the service</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3 text-white">2. How We Use Your Information</h2>
            <p className="mb-3">We use the information we collect to:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Provide, maintain, and improve our services</li>
              <li>Process and complete transactions</li>
              <li>Send you technical notices and support messages</li>
              <li>Respond to your comments and questions</li>
              <li>Analyze usage patterns and trends</li>
              <li>Protect against fraudulent or illegal activity</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3 text-white">3. Information Sharing</h2>
            <p className="mb-3">
              We do not sell your personal information. We may share your information in the following circumstances:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>When you choose to make your synchronicities public or shared</li>
              <li>With service providers who assist in operating our service</li>
              <li>To comply with legal obligations</li>
              <li>To protect our rights and prevent fraud or security issues</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3 text-white">4. Data Visibility</h2>
            <p className="mb-3">
              You control the visibility of your synchronicities:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Private:</strong> Only visible to you</li>
              <li><strong>Shared:</strong> Visible to other users in the community and on the map</li>
            </ul>
            <p className="mt-3">
              Your display name and basic profile information will be visible when you share synchronicities publicly.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3 text-white">5. Data Security</h2>
            <p>
              We implement appropriate technical and organizational measures to protect your personal information. However, no internet transmission is completely secure, and we cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3 text-white">6. Data Retention</h2>
            <p>
              We retain your information for as long as your account is active or as needed to provide services. You may delete your synchronicities at any time, and you can request account deletion by contacting us.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3 text-white">7. Cookies and Tracking</h2>
            <p>
              We use cookies and similar tracking technologies to track activity on our service and hold certain information to improve and analyze our service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3 text-white">8. Your Rights</h2>
            <p className="mb-3">You have the right to:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Access your personal information</li>
              <li>Correct inaccurate information</li>
              <li>Request deletion of your information</li>
              <li>Object to processing of your information</li>
              <li>Export your data</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3 text-white">9. Children&apos;s Privacy</h2>
            <p>
              Our service is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3 text-white">10. Third-Party Services</h2>
            <p>
              Our service uses Supabase for authentication and data storage. Supabase has its own privacy policy governing their use of your information.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3 text-white">11. Changes to Privacy Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the &quot;Last updated&quot; date.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3 text-white">12. Contact Us</h2>
            <p className="mb-3">
              If you have any questions about this Privacy Policy, please contact us at cpkotz@gmail.com.
            </p>
            <p>
              Agency Astrology<br />
              Synchronicity Go™<br />
              Jasper County, Missouri
            </p>
          </section>

          <p className="text-sm text-white/50 mt-8 pt-6 border-t border-white/10">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        <div className="mt-8 text-center">
          <Link href="/" className="text-purple-400 hover:text-purple-300 transition">
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
