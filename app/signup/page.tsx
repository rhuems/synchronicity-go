"use client";

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function SignUpPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showDisclaimer, setShowDisclaimer] = useState(true);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!agreedToTerms) {
      setError('You must agree to the vibration disclaimer to continue.');
      return;
    }

    setLoading(true);

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
          },
        },
      });

      if (signUpError) throw signUpError;

      if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            display_name: username,
            share_synchronicities: false,
          });

        if (profileError) {
          console.error('Profile creation error:', profileError);
        }

        router.push('/');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to sign up');
    } finally {
      setLoading(false);
    }
  };

  if (showDisclaimer) {
    return (
      <main className="min-h-screen px-4 py-8 flex flex-col justify-center items-center bg-[#fffbe9] font-sans">
        <div className="bg-white p-6 md:p-8 rounded-xl max-w-2xl shadow-xl">
          <h1 className="text-2xl md:text-3xl font-bold mb-4 text-center">⚠️ Vibration Disclaimer</h1>
          <div className="text-sm md:text-base leading-relaxed mb-6">
            <p className="mb-4">Synchronicity Go is a high-frequency space.</p>
            <p className="mb-2">By creating an account, you agree to:</p>
            <ul className="pl-6 mb-4 list-disc">
              <li>Connect to the collective conscious with integrity.</li>
              <li>Use only language aligned with light, growth, truth, and love.</li>
              <li>Never post hate, darkness, or low-vibe projection.</li>
            </ul>
            <p className="font-semibold mt-4">
              💡 Energy doesn&apos;t care about the medium — vibration transfers here like anywhere else.
            </p>
            <p className="font-semibold mt-4">
              This app is a container for frequency. If your post includes harmful language, it will be flagged before publishing.
            </p>
            <p className="font-semibold mt-4 text-base md:text-lg">
              🧘‍♀️ If you aren&apos;t in the light, you&apos;re not in the right app.
            </p>
          </div>
          <button
            onClick={() => setShowDisclaimer(false)}
            className="w-full px-4 py-3 bg-black text-white text-sm md:text-base rounded-lg cursor-pointer font-medium"
          >
            I Understand — Continue to Sign Up
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-4 py-8 flex flex-col justify-center items-center bg-[#fffbe9] font-sans">
      <h1 className="text-2xl md:text-3xl font-bold mb-2">🌟 Create Your Account</h1>
      <p className="text-sm md:text-base mb-6 text-gray-600">Let&apos;s get you synced up with the signs.</p>

      <form className="flex flex-col gap-4 w-full max-w-sm" onSubmit={handleSignUp}>
        <input
          type="text"
          placeholder="Username"
          className="px-3 py-3 rounded-md border border-gray-300 text-sm md:text-base"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          className="px-3 py-3 rounded-md border border-gray-300 text-sm md:text-base"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="px-3 py-3 rounded-md border border-gray-300 text-sm md:text-base"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
        />

        <label className="flex items-start gap-2 text-xs md:text-sm leading-snug cursor-pointer">
          <input
            type="checkbox"
            checked={agreedToTerms}
            onChange={(e) => setAgreedToTerms(e.target.checked)}
            className="mt-1 w-5 h-5 cursor-pointer"
          />
          <span>I agree to maintain high-frequency energy and align with light, growth, truth, and love.</span>
        </label>

        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button type="submit" className="px-4 py-3 bg-black text-white text-sm md:text-base rounded-md cursor-pointer font-medium" disabled={loading}>
          {loading ? 'Signing up...' : 'Sign Up'}
        </button>
      </form>

      <p className="mt-4 text-sm md:text-base text-gray-600">
        Already have an account? <Link href="/login" className="underline">Log in</Link>
      </p>
    </main>
  );
}
