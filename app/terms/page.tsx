import Link from 'next/link';

export default function TermsPage() {
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
          Terms of Service
        </h1>

        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10 space-y-6 text-white/90">
          <section>
            <h2 className="text-2xl font-semibold mb-3 text-white">1. Acceptance of Terms</h2>
            <p>
              By accessing and using Synchronicity Go™ (the &quot;Service&quot;), operated by Agency Astrology, you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to these terms, please do not use the Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3 text-white">2. Use License</h2>
            <p className="mb-3">
              Permission is granted to use Synchronicity Go™ for personal, non-commercial purposes. This is the grant of a license, not a transfer of title, and under this license you may not:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Modify or copy the materials</li>
              <li>Use the materials for any commercial purpose without authorization</li>
              <li>Attempt to reverse engineer any software contained in the Service</li>
              <li>Remove any copyright or other proprietary notations from the materials</li>
              <li>Transfer the materials to another person or mirror the materials on any other server</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3 text-white">3. User Content</h2>
            <p className="mb-3">
              You retain all rights to the content you post on the Service. By posting content, you grant Agency Astrology a worldwide, non-exclusive, royalty-free license to use, reproduce, and display your content in connection with the Service.
            </p>
            <p>
              You are responsible for the content you post and must ensure it does not violate any laws or infringe on the rights of others.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3 text-white">4. Privacy</h2>
            <p>
              Your use of the Service is also governed by our Privacy Policy. Please review our Privacy Policy to understand our practices.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3 text-white">5. Disclaimer</h2>
            <p>
              The Service is provided on an &quot;as is&quot; and &quot;as available&quot; basis. Agency Astrology makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3 text-white">6. Limitations</h2>
            <p>
              In no event shall Agency Astrology or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3 text-white">7. Account Termination</h2>
            <p>
              We reserve the right to terminate or suspend your account at any time for any reason, including but not limited to violation of these Terms of Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3 text-white">8. Changes to Terms</h2>
            <p>
              We reserve the right to modify these terms at any time. Your continued use of the Service after changes constitutes acceptance of those changes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3 text-white">9. Governing Law</h2>
            <p>
              These terms shall be governed by and construed in accordance with the laws of the State of Missouri, Jasper County, without regard to its conflict of law provisions.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3 text-white">10. Contact Information</h2>
            <p>
              If you have any questions about these Terms of Service, please contact us at cpkotz@gmail.com.
            </p>
            <p className="mt-3">
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
