"use client"
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Footer } from '@/components/Footer';

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        router.push('/dashboard');
      }
      setLoading(false);
    };

    checkUser();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-purple-500 border-t-transparent mb-4"></div>
          <p className="text-white text-xl">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white flex flex-col">
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <div className="text-center max-w-4xl">
          <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
            ✨ Welcome to Synchronicity Go™
          </h1>

          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 md:p-12 border border-white/10 mb-12 text-left">
            <p className="text-lg md:text-xl text-white/90 leading-relaxed mb-6">
              I created Synchronicity Go as something real—something you can hold onto when you&apos;re following the breadcrumbs.
            </p>

            <p className="text-lg md:text-xl text-white/90 leading-relaxed mb-6">
              No matter where you are or how you feel—whether you&apos;re creating, unraveling, beginning again, or standing at an ending that asks you to rise—may this find you.
            </p>

            <p className="text-xl md:text-2xl font-semibold text-purple-300 mb-6 text-center">
              You are never alone.
            </p>

            <p className="text-lg md:text-xl text-white/90 leading-relaxed mb-6">
              Because synchronicity is always there—quietly guiding, gently weaving, reminding you that meaning is everywhere when you choose to see it.
            </p>

            <div className="my-8 text-center space-y-2">
              <p className="text-lg text-purple-300">Follow the breadcrumbs.</p>
              <p className="text-lg text-purple-300">Follow the hashtags.</p>
            </div>

            <p className="text-lg md:text-xl text-white/90 leading-relaxed mb-6">
              You&apos;ll find others walking this same path—each of us reflecting light for one another, connecting through what is highest, purest, and true.
            </p>

            <div className="my-8 text-center space-y-2">
              <p className="text-xl font-semibold text-pink-300">My friend, you are on purpose.</p>
              <p className="text-xl font-semibold text-pink-300">You are in sync.</p>
            </div>

            <p className="text-lg md:text-xl text-white/90 leading-relaxed mb-6">
              Use this app with a humble heart. Share your gratitude for Source, for the divine light—whatever that means to you—for the unseen pattern that connects us all.
            </p>

            <p className="text-lg md:text-xl text-white/90 leading-relaxed mb-6">
              I built Synchronicity Go so that none of us would ever forget—someone, somewhere, is seeing the same signs, hearing the same whispers, feeling the same call to awaken.
            </p>

            <div className="my-8 text-center italic text-white/80 space-y-2">
              <p>Some will rise while others rest.</p>
              <p>Some will fall apart while others rebuild.</p>
              <p>That&apos;s the rhythm of life—the pulse of service—how we hold one another through the great turning.</p>
            </div>

            <div className="my-8 text-center space-y-2">
              <p className="text-lg text-white/90">Sometimes it&apos;s eye to eye.</p>
              <p className="text-lg text-white/90">Sometimes heart to heart.</p>
              <p className="text-xl font-semibold text-purple-300">Always soul to soul.</p>
            </div>

            <div className="mt-10 pt-8 border-t border-white/20 text-center">
              <p className="text-lg text-white/90 leading-relaxed mb-4">
                I dedicate this to the higher vibration of humanity.
              </p>
              <div className="space-y-2 text-xl font-semibold">
                <p className="text-purple-300">May you rise.</p>
                <p className="text-pink-300">May you remember.</p>
                <p className="text-purple-300">May you synchronize your soul.</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link
              href="/signup"
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:opacity-90 transition-all transform hover:scale-105"
            >
              Begin Your Journey
            </Link>
            <Link
              href="/login"
              className="bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white/20 transition-all border border-white/20"
            >
              Log In
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <div className="text-4xl mb-4">📍</div>
              <h3 className="text-xl font-semibold mb-2">Track Your Signs</h3>
              <p className="text-white/70">Log synchronicities, angel numbers, and meaningful coincidences as they happen</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <div className="text-4xl mb-4">🌍</div>
              <h3 className="text-xl font-semibold mb-2">Global Community</h3>
              <p className="text-white/70">Connect with seekers worldwide and discover collective patterns</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <div className="text-4xl mb-4">✨</div>
              <h3 className="text-xl font-semibold mb-2">Find Meaning</h3>
              <p className="text-white/70">Visualize your journey and uncover the patterns in your signs</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
