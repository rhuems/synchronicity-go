"use client";
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data, error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (loginError) throw loginError;

      if (data.user) {
        router.push('/');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to log in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen px-4 py-8 font-sans">
      <h1 className="text-3xl md:text-4xl font-bold mb-4 text-center">Welcome Back ✨</h1>
      <p className="text-sm md:text-base mb-8 text-center max-w-md text-gray-600">Log in to track your synchronicities and join the collective.</p>

      <form className="flex flex-col w-full max-w-sm gap-4 mb-8" onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          className="px-3 py-3 text-sm md:text-base border border-gray-300 rounded-lg"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="px-3 py-3 text-sm md:text-base border border-gray-300 rounded-lg"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button type="submit" className="px-4 py-3 text-sm md:text-base bg-black text-white rounded-lg font-medium" disabled={loading}>
          {loading ? 'Logging in...' : 'Log In'}
        </button>
      </form>

      <p className="text-sm md:text-base text-center text-gray-600">
        Don&apos;t have an account? <Link href="/signup" className="underline">Sign up</Link>
      </p>
    </main>
  );
}
