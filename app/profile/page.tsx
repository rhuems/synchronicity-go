"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const [displayName, setDisplayName] = useState('');
  const [shareSynchronicities, setShareSynchronicities] = useState(false);
  const [points, setPoints] = useState(0);
  const [level, setLevel] = useState(1);
  const [streakDays, setStreakDays] = useState(0);

  const [syncCount, setSyncCount] = useState(0);
  const [sharedCount, setSharedCount] = useState(0);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();

    if (!session?.user) {
      router.push('/login');
      return;
    }

    setUser(session.user);
    await loadProfile(session.user.id);
    await loadStats(session.user.id);
    setLoading(false);
  };

  const loadProfile = async (userId: string) => {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      console.error('Error loading profile:', error);
    } else if (profile) {
      setDisplayName(profile.display_name || '');
      setShareSynchronicities(profile.share_synchronicities || false);
      setPoints(profile.points || 0);
      setLevel(profile.level || 1);
      setStreakDays(profile.streak_days || 0);
    }
  };

  const loadStats = async (userId: string) => {
    const { count: totalCount } = await supabase
      .from('synchronicities')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    const { count: sharedCount } = await supabase
      .from('synchronicities')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('visibility', 'shared');

    setSyncCount(totalCount || 0);
    setSharedCount(sharedCount || 0);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          display_name: displayName,
          share_synchronicities: shareSynchronicities,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) throw error;

      setMessage('Profile updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err: any) {
      setMessage(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen p-4 md:p-8 bg-[#fdf6f0] font-sans">
        <p>Loading...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-4 md:p-8 bg-[#fdf6f0] font-sans">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">👤 Your Profile</h1>
        <Link href="/dashboard" className="px-4 py-2 bg-white text-black border border-gray-300 rounded-md text-sm">
          ← Back to Dashboard
        </Link>
      </header>

      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h2 className="text-xl md:text-2xl font-bold mb-6">Your Journey</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            <div className="bg-white p-4 md:p-6 rounded-xl text-center shadow-sm">
              <div className="text-2xl md:text-3xl font-bold text-black mb-2">{points}</div>
              <div className="text-xs md:text-sm text-gray-600 uppercase tracking-wide">Total Points</div>
            </div>
            <div className="bg-white p-4 md:p-6 rounded-xl text-center shadow-sm">
              <div className="text-2xl md:text-3xl font-bold text-black mb-2">Level {level}</div>
              <div className="text-xs md:text-sm text-gray-600 uppercase tracking-wide">Spiritual Level</div>
            </div>
            <div className="bg-white p-4 md:p-6 rounded-xl text-center shadow-sm">
              <div className="text-2xl md:text-3xl font-bold text-black mb-2">{streakDays}</div>
              <div className="text-xs md:text-sm text-gray-600 uppercase tracking-wide">Day Streak</div>
            </div>
            <div className="bg-white p-4 md:p-6 rounded-xl text-center shadow-sm">
              <div className="text-2xl md:text-3xl font-bold text-black mb-2">{syncCount}</div>
              <div className="text-xs md:text-sm text-gray-600 uppercase tracking-wide">Total Synchronicities</div>
            </div>
            <div className="bg-white p-4 md:p-6 rounded-xl text-center shadow-sm">
              <div className="text-2xl md:text-3xl font-bold text-black mb-2">{sharedCount}</div>
              <div className="text-xs md:text-sm text-gray-600 uppercase tracking-wide">Shared with Community</div>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 md:p-8 rounded-xl shadow-sm">
          <h2 className="text-xl md:text-2xl font-bold mb-6">Profile Settings</h2>
          <form onSubmit={handleSave} className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm md:text-base font-semibold">Display Name</label>
              <input
                type="text"
                className="px-3 py-2 rounded-md border border-gray-300 text-sm md:text-base"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                required
              />
              <p className="text-xs md:text-sm text-gray-600">
                This name will appear on your shared synchronicities
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm md:text-base font-semibold">Email</label>
              <input
                type="email"
                className="px-3 py-2 rounded-md border border-gray-200 text-sm md:text-base bg-gray-100 text-gray-500"
                value={user?.email || ''}
                disabled
              />
              <p className="text-xs md:text-sm text-gray-600">
                Email cannot be changed
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <label className="flex items-start gap-3 text-sm md:text-base cursor-pointer">
                <input
                  type="checkbox"
                  checked={shareSynchronicities}
                  onChange={(e) => setShareSynchronicities(e.target.checked)}
                  className="w-5 h-5 mt-1 cursor-pointer"
                />
                <span>
                  Allow my synchronicities to be visible in community feeds by default
                </span>
              </label>
              <p className="text-xs md:text-sm text-gray-600">
                You can still control visibility on each individual synchronicity
              </p>
            </div>

            {message && (
              <div className={`p-4 rounded-md ${
                message.includes('success')
                  ? 'bg-green-50 text-green-800 border border-green-200'
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}>
                {message}
              </div>
            )}

            <button
              type="submit"
              className="px-6 py-3 bg-black text-white rounded-lg text-sm md:text-base font-semibold"
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}

