"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

interface Synchronicity {
  id: string;
  title: string;
  description: string;
  location?: string;
  occurred_at: string;
  category?: string;
  tags?: string[];
  photo_url?: string;
  visibility: string;
  created_at: string;
}

const COMMON_TAGS = [
  '1111', '222', '333', 'crow', 'owl', 'whitefeather',
  'locationwink', 'briarbrook', 'mirror', 'divinetiming',
  'angelnumber', 'repeatingnumber', 'signs', 'songlyric',
  'bibleverse', 'spiritanimal', 'dreamsymbol', 'licenseplate',
  'billboard', 'randomencounter', 'randomtext', 'meaningfulglitch',
  'unexpectedcall'
];

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [synchronicities, setSynchronicities] = useState<Synchronicity[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [occurredAt, setOccurredAt] = useState('');
  const [category, setCategory] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [photoUrl, setPhotoUrl] = useState('');
  const [visibility, setVisibility] = useState('private');
  const [filterTag, setFilterTag] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [points, setPoints] = useState(0);
  const [level, setLevel] = useState(1);
  const [streakDays, setStreakDays] = useState(0);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

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

    const { data: profile } = await supabase
      .from('profiles')
      .select('display_name, points, level, streak_days')
      .eq('id', session.user.id)
      .maybeSingle();

    if (profile) {
      setDisplayName(profile.display_name);
      setPoints(profile.points || 0);
      setLevel(profile.level || 1);
      setStreakDays(profile.streak_days || 0);
    }

    await loadSynchronicities(session.user.id);
    setLoading(false);
  };

  const loadSynchronicities = async (userId: string) => {
    const { data, error } = await supabase
      .from('synchronicities')
      .select('*')
      .eq('user_id', userId)
      .order('occurred_at', { ascending: false });

    if (error) {
      console.error('Error loading synchronicities:', error);
    } else {
      setSynchronicities(data || []);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const { error: insertError } = await supabase
        .from('synchronicities')
        .insert({
          user_id: user.id,
          title,
          description,
          location: location || null,
          occurred_at: occurredAt || new Date().toISOString(),
          category: category || null,
          tags: selectedTags.length > 0 ? selectedTags : null,
          photo_url: photoUrl || null,
          visibility: visibility,
          display_name: visibility === 'shared' ? displayName : null,
        });

      if (insertError) throw insertError;

      await awardPoints(user.id, occurredAt);
      await checkAndUpdateStreak(user.id);

      setTitle('');
      setDescription('');
      setLocation('');
      setOccurredAt('');
      setCategory('');
      setSelectedTags([]);
      setPhotoUrl('');
      setVisibility('private');
      setShowForm(false);

      await loadSynchronicities(user.id);
    } catch (err: any) {
      setError(err.message || 'Failed to log synchronicity');
    } finally {
      setSubmitting(false);
    }
  };

  const awardPoints = async (userId: string, occurredAt: string) => {
    let pointsToAward = 10;
    let reason = 'Daily synchronicity log';

    const occurredDate = new Date(occurredAt || new Date());
    const hours = occurredDate.getHours();
    const minutes = occurredDate.getMinutes();

    const isSpecialTime = (
      (hours === 11 && minutes === 11) ||
      (hours === 2 && minutes === 22) ||
      (hours === 3 && minutes === 33) ||
      (hours === 4 && minutes === 44) ||
      (hours === 5 && minutes === 55)
    );

    if (isSpecialTime) {
      pointsToAward = 25;
      reason = `Special timing: ${hours}:${String(minutes).padStart(2, '0')}`;
    }

    const divineHashtags = ['1111', '222', '333', 'divinetiming', 'angelnumber'];
    const hasDivineTag = selectedTags.some(tag => divineHashtags.includes(tag));

    if (hasDivineTag) {
      pointsToAward += 15;
      reason += ' + divine hashtag';
    }

    if (visibility === 'shared') {
      const { count } = await supabase
        .from('synchronicities')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('visibility', 'shared');

      if (count === 0) {
        pointsToAward += 50;
        reason += ' + first shared synchronicity!';
      }
    }

    await supabase.rpc('award_points', {
      p_user_id: userId,
      p_points: pointsToAward,
      p_reason: reason,
    });

    const { data: updatedProfile } = await supabase
      .from('profiles')
      .select('points, level')
      .eq('id', userId)
      .maybeSingle();

    if (updatedProfile) {
      setPoints(updatedProfile.points || 0);
      setLevel(updatedProfile.level || 1);
    }
  };

  const checkAndUpdateStreak = async (userId: string) => {
    const { data: profile } = await supabase
      .from('profiles')
      .select('last_log_date, streak_days')
      .eq('id', userId)
      .maybeSingle();

    if (!profile) return;

    const today = new Date().toISOString().split('T')[0];
    const lastLogDate = profile.last_log_date;

    let newStreak = profile.streak_days || 0;

    if (!lastLogDate) {
      newStreak = 1;
    } else {
      const lastDate = new Date(lastLogDate);
      const todayDate = new Date(today);
      const diffDays = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        newStreak += 1;
        if (newStreak === 7) {
          await supabase.rpc('award_points', {
            p_user_id: userId,
            p_points: 100,
            p_reason: '7-day logging streak!',
          });
        }
      } else if (diffDays > 1) {
        newStreak = 1;
      }
    }

    await supabase
      .from('profiles')
      .update({
        last_log_date: today,
        streak_days: newStreak,
      })
      .eq('id', userId);

    setStreakDays(newStreak);
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const filteredSynchronicities = filterTag
    ? synchronicities.filter(sync => sync.tags?.includes(filterTag))
    : synchronicities;

  const getTagCounts = () => {
    const tagCounts: { [key: string]: number } = {};
    synchronicities.forEach(sync => {
      sync.tags?.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });
    return Object.entries(tagCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
  };

  const getRepeatedSigns = () => {
    const titleCounts: { [key: string]: number } = {};
    synchronicities.forEach(sync => {
      const normalizedTitle = sync.title.toLowerCase();
      titleCounts[normalizedTitle] = (titleCounts[normalizedTitle] || 0) + 1;
    });
    return Object.entries(titleCounts)
      .filter(([_, count]) => count > 1)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);
  };

  const topTags = getTagCounts();
  const repeatedSigns = getRepeatedSigns();

  if (loading) {
    return (
      <main className="min-h-screen p-4 md:p-8 bg-[#fdf6f0] font-sans">
        <p>Loading...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-4 md:p-8 bg-[#fdf6f0] font-sans">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
        <h1 className="text-2xl md:text-3xl font-bold">✨ Your Synchronicities</h1>
        <div className="flex flex-wrap gap-2">
          <Link href="/community" className="px-3 py-2 bg-blue-500 text-white rounded-md text-sm">
            🌍 Community
          </Link>
          <Link href="/map" className="px-3 py-2 bg-green-700 text-white rounded-md text-sm">
            🗺️ Map
          </Link>
          <Link href="/profile" className="px-3 py-2 bg-orange-600 text-white rounded-md text-sm">
            👤 Profile
          </Link>
          <button onClick={handleLogout} className="px-3 py-2 bg-white text-black border border-gray-300 rounded-md text-sm">
            Logout
          </button>
        </div>
      </header>

      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-2">
        <label className="text-sm md:text-base font-semibold">Filter by tag:</label>
        <select
          className="w-full sm:w-auto px-3 py-2 text-sm md:text-base border border-gray-300 rounded-md bg-white"
          value={filterTag}
          onChange={(e) => setFilterTag(e.target.value)}
        >
          <option value="">All synchronicities</option>
          {COMMON_TAGS.map(tag => (
            <option key={tag} value={tag}>#{tag}</option>
          ))}
        </select>
      </div>

      <div className="flex flex-wrap gap-3 mb-6 justify-center">
        <div className="bg-white p-4 md:p-6 rounded-xl text-center min-w-[120px] shadow-sm">
          <div className="text-2xl md:text-3xl font-bold text-black mb-2">{points}</div>
          <div className="text-xs md:text-sm text-gray-600 uppercase tracking-wide">Points</div>
        </div>
        <div className="bg-white p-4 md:p-6 rounded-xl text-center min-w-[120px] shadow-sm">
          <div className="text-2xl md:text-3xl font-bold text-black mb-2">Level {level}</div>
          <div className="text-xs md:text-sm text-gray-600 uppercase tracking-wide">Spiritual Level</div>
        </div>
        <div className="bg-white p-4 md:p-6 rounded-xl text-center min-w-[120px] shadow-sm">
          <div className="text-2xl md:text-3xl font-bold text-black mb-2">{streakDays}</div>
          <div className="text-xs md:text-sm text-gray-600 uppercase tracking-wide">Day Streak</div>
        </div>
      </div>

      <p className="text-sm md:text-base mb-6 text-gray-600">
        Welcome, {displayName || user?.user_metadata?.username || user?.email}
      </p>

      {synchronicities.length > 0 && (topTags.length > 0 || repeatedSigns.length > 0) && (
        <div className="bg-purple-50 p-4 md:p-8 rounded-xl mb-6 border-2 border-purple-200">
          <h2 className="text-xl md:text-2xl font-bold mb-6">🔮 Your Patterns</h2>

          {topTags.length > 0 && (
            <div className="bg-white p-4 md:p-6 rounded-lg mb-4">
              <h3 className="text-lg md:text-xl font-semibold mb-4 text-purple-700">Most Used Hashtags</h3>
              <div className="flex flex-col gap-3">
                {topTags.map(([tag, count]) => (
                  <div key={tag} className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                    <span className="text-sm md:text-base font-semibold text-purple-700">#{tag}</span>
                    <span className="text-xs md:text-sm font-bold text-purple-700 bg-purple-100 px-3 py-1 rounded-full">{count}x</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {repeatedSigns.length > 0 && (
            <div className="bg-white p-4 md:p-6 rounded-lg mb-4">
              <h3 className="text-lg md:text-xl font-semibold mb-4 text-purple-700">Repeated Signs</h3>
              <div className="flex flex-col gap-3">
                {repeatedSigns.map(([title, count]) => (
                  <div key={title} className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                    <span className="text-sm md:text-base text-gray-800 capitalize">{title}</span>
                    <span className="text-xs md:text-sm font-bold text-purple-700 bg-purple-100 px-3 py-1 rounded-full">{count}x</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="bg-yellow-50 p-4 md:p-6 rounded-xl mb-6 border-2 border-yellow-200">
        <h2 className="text-xl md:text-2xl font-bold mb-2">Need Help Decoding?</h2>
        <p className="text-sm md:text-base mb-4 text-gray-600">Connect with Caroline for guidance and readings</p>
        <div className="flex flex-wrap gap-2">
          <a
            href="mailto:caroline@example.com"
            className="px-4 py-2 bg-black text-white rounded-lg text-sm md:text-base"
            target="_blank"
            rel="noopener noreferrer"
          >
            📬 Ask a Question
          </a>
          <a
            href="https://calendly.com/caroline"
            className="px-4 py-2 bg-black text-white rounded-lg text-sm md:text-base"
            target="_blank"
            rel="noopener noreferrer"
          >
            📆 Book a Reading
          </a>
          <a
            href="https://carolineshanner.com"
            className="px-4 py-2 bg-black text-white rounded-lg text-sm md:text-base"
            target="_blank"
            rel="noopener noreferrer"
          >
            💌 Visit Website
          </a>
        </div>
      </div>

      <button
        onClick={() => setShowForm(!showForm)}
        className="w-full sm:w-auto px-6 py-3 bg-black text-white rounded-lg text-sm md:text-base font-medium mb-6"
      >
        {showForm ? 'Cancel' : '+ Log New Synchronicity'}
      </button>

      {showForm && (
        <form className="bg-white p-4 md:p-6 rounded-xl mb-6 shadow-md flex flex-col gap-4" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Title (e.g., '11:11 on the clock')"
            className="px-3 py-2 text-sm md:text-base border border-gray-300 rounded-md"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <textarea
            placeholder="Description - what happened?"
            className="px-3 py-2 text-sm md:text-base border border-gray-300 rounded-md min-h-[100px] resize-y"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />

          <input
            type="text"
            placeholder="Location (optional)"
            className="px-3 py-2 text-sm md:text-base border border-gray-300 rounded-md"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />

          <input
            type="datetime-local"
            placeholder="When did it occur?"
            className="px-3 py-2 text-sm md:text-base border border-gray-300 rounded-md"
            value={occurredAt}
            onChange={(e) => setOccurredAt(e.target.value)}
          />

          <select
            className="px-3 py-2 text-sm md:text-base border border-gray-300 rounded-md"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Select Category (optional)</option>
            <option value="numbers">Numbers</option>
            <option value="meeting">Meeting/Encounter</option>
            <option value="coincidence">Coincidence</option>
            <option value="sign">Sign/Symbol</option>
            <option value="dream">Dream</option>
            <option value="other">Other</option>
          </select>

          <input
            type="text"
            placeholder="Photo URL (optional)"
            className="px-3 py-2 text-sm md:text-base border border-gray-300 rounded-md"
            value={photoUrl}
            onChange={(e) => setPhotoUrl(e.target.value)}
          />

          <div className="flex flex-col gap-2">
            <label className="text-sm md:text-base font-semibold">Visibility:</label>
            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-2 text-sm md:text-base cursor-pointer">
                <input
                  type="radio"
                  name="visibility"
                  value="private"
                  checked={visibility === 'private'}
                  onChange={(e) => setVisibility(e.target.value)}
                  className="w-4 h-4 cursor-pointer"
                />
                Private (only you can see)
              </label>
              <label className="flex items-center gap-2 text-sm md:text-base cursor-pointer">
                <input
                  type="radio"
                  name="visibility"
                  value="shared"
                  checked={visibility === 'shared'}
                  onChange={(e) => setVisibility(e.target.value)}
                  className="w-4 h-4 cursor-pointer"
                />
                Shared (visible in hashtag communities)
              </label>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <label className="text-sm md:text-base font-semibold">Tags (select all that apply):</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {COMMON_TAGS.map(tag => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className={`px-3 py-2 text-xs md:text-sm rounded-md border transition-all ${
                    selectedTags.includes(tag)
                      ? 'bg-black text-white border-black'
                      : 'bg-gray-100 text-gray-700 border-gray-300'
                  }`}
                >
                  #{tag}
                </button>
              ))}
            </div>
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <button type="submit" className="px-4 py-3 bg-black text-white rounded-md text-sm md:text-base font-medium" disabled={submitting}>
            {submitting ? 'Logging...' : 'Log Synchronicity'}
          </button>
        </form>
      )}

      <div className="flex flex-col gap-4">
        {synchronicities.length === 0 ? (
          <p className="text-center text-gray-500 text-base md:text-lg py-12">
            No synchronicities logged yet. Start tracking the signs!
          </p>
        ) : filteredSynchronicities.length === 0 ? (
          <p className="text-center text-gray-500 text-base md:text-lg py-12">
            No synchronicities found with tag #{filterTag}
          </p>
        ) : (
          filteredSynchronicities.map((sync) => (
            <div key={sync.id} className="bg-white p-4 md:p-6 rounded-xl shadow-sm">
              <h3 className="text-lg md:text-xl font-bold mt-0 mb-2">{sync.title}</h3>
              <div className="flex flex-wrap gap-2 mb-3 items-center">
                {sync.category && (
                  <span className="inline-block px-3 py-1 bg-gray-100 rounded-full text-xs capitalize">{sync.category}</span>
                )}
                {sync.tags && sync.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {sync.tags.map(tag => (
                      <span key={tag} className="inline-block px-2 py-1 bg-gray-200 text-gray-700 rounded text-xs">#{tag}</span>
                    ))}
                  </div>
                )}
              </div>
              <p className="text-sm md:text-base leading-relaxed text-gray-700 mb-3">{sync.description}</p>
              {sync.photo_url && (
                <img
                  src={sync.photo_url}
                  alt="Synchronicity"
                  className="w-full max-h-[300px] md:max-h-[400px] object-cover rounded-lg mb-3"
                />
              )}
              {sync.location && (
                <p className="text-xs md:text-sm text-gray-600 my-1">📍 {sync.location}</p>
              )}
              <p className="text-xs md:text-sm text-gray-600 my-1">
                🕐 {new Date(sync.occurred_at).toLocaleString()}
              </p>
              <p className="text-xs md:text-sm text-gray-600 my-1">
                {sync.visibility === 'shared' ? '🌍 Shared' : '🔒 Private'}
              </p>
            </div>
          ))
        )}
      </div>
    </main>
  );
}

