import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-black/30 backdrop-blur-sm border-t border-white/10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-white/50 text-sm">
            © {new Date().getFullYear()} Agency Astrology. Synchronicity Go™. All rights reserved.
          </div>
          <div className="flex gap-6 text-sm">
            <Link href="/terms" className="text-white/70 hover:text-white transition">
              Terms of Service
            </Link>
            <Link href="/privacy" className="text-white/70 hover:text-white transition">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
