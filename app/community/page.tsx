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
  display_name?: string;
  created_at: string;
}

interface Reaction {
  emoji: string;
  count: number;
  userReacted: boolean;
}

const COMMON_TAGS = [
  '1111', '222', '333', 'crow', 'owl', 'whitefeather',
  'locationwink', 'briarbrook', 'mirror', 'divinetiming',
  'angelnumber', 'repeatingnumber', 'signs', 'songlyric',
  'bibleverse', 'spiritanimal', 'dreamsymbol', 'licenseplate',
  'billboard', 'randomencounter', 'randomtext', 'meaningfulglitch',
  'unexpectedcall'
];

export default function CommunityPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [synchronicities, setSynchronicities] = useState<Synchronicity[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTag, setSelectedTag] = useState<string>('');
  const [allTags, setAllTags] = useState<string[]>([]);
  const [reactions, setReactions] = useState<{ [key: string]: Reaction[] }>({});

  useEffect(() => {
    checkUser();
  }, []);

  useEffect(() => {
    if (user) {
      loadPublicSynchronicities();
    }
  }, [user, selectedTag]);

  const loadReactions = async (syncIds: string[]) => {
    const { data: reactionData, error } = await supabase
      .from('reactions')
      .select('*')
      .in('synchronicity_id', syncIds);

    if (error) {
      console.error('Error loading reactions:', error);
      return;
    }

    const reactionsBySyncId: { [key: string]: Reaction[] } = {};

    syncIds.forEach(syncId => {
      const emojis = ['❤️', '✨', '🔮'];
      const syncReactions = reactionData?.filter(r => r.synchronicity_id === syncId) || [];

      reactionsBySyncId[syncId] = emojis.map(emoji => {
        const emojiReactions = syncReactions.filter(r => r.emoji === emoji);
        return {
          emoji,
          count: emojiReactions.length,
          userReacted: emojiReactions.some(r => r.user_id === user?.id),
        };
      });
    });

    setReactions(reactionsBySyncId);
  };

  const toggleReaction = async (syncId: string, emoji: string) => {
    if (!user) return;

    const currentReaction = reactions[syncId]?.find(r => r.emoji === emoji);

    if (currentReaction?.userReacted) {
      const { error } = await supabase
        .from('reactions')
        .delete()
        .eq('synchronicity_id', syncId)
        .eq('user_id', user.id)
        .eq('emoji', emoji);

      if (error) {
        console.error('Error removing reaction:', error);
        return;
      }
    } else {
      const { error } = await supabase
        .from('reactions')
        .insert({
          synchronicity_id: syncId,
          user_id: user.id,
          emoji,
        });

      if (error) {
        console.error('Error adding reaction:', error);
        return;
      }
    }

    loadReactions([syncId]);
  };

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();

    if (!session?.user) {
      router.push('/login');
      return;
    }

    setUser(session.user);
    setLoading(false);
  };

  const loadPublicSynchronicities = async () => {
    let query = supabase
      .from('synchronicities')
      .select('*')
      .eq('visibility', 'shared')
      .order('occurred_at', { ascending: false });

    if (selectedTag) {
      query = query.contains('tags', [selectedTag]);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error loading synchronicities:', error);
    } else {
      setSynchronicities(data || []);

      const tags = new Set<string>();
      data?.forEach(sync => {
        sync.tags?.forEach((tag: string) => tags.add(tag));
      });
      setAllTags(Array.from(tags).sort());

      if (data && data.length > 0) {
        loadReactions(data.map(s => s.id));
      }
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen p-4 md:p-8 bg-[#f0f4f8] font-sans">
        <p>Loading...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-4 md:p-8 bg-[#f0f4f8] font-sans">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
        <h1 className="text-2xl md:text-3xl font-bold">🌍 Community Synchronicities</h1>
        <Link href="/dashboard" className="px-4 py-2 bg-white text-black border border-gray-300 rounded-md text-sm">
          ← Back to Dashboard
        </Link>
      </header>

      <p className="text-sm md:text-base mb-6 text-gray-600">
        Explore synchronicities shared by the community. Connect with others experiencing the same signs.
      </p>

      <div className="mb-6 flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <label className="text-sm md:text-base font-semibold">Filter by hashtag:</label>
        <select
          className="w-full sm:w-auto px-3 py-2 rounded-md border border-gray-300 text-sm md:text-base min-w-[200px]"
          value={selectedTag}
          onChange={(e) => setSelectedTag(e.target.value)}
        >
          <option value="">All community synchronicities</option>
          {allTags.map(tag => (
            <option key={tag} value={tag}>#{tag}</option>
          ))}
        </select>
      </div>

      {selectedTag && (
        <div className="mb-6 p-4 md:p-6 bg-white rounded-xl border-2 border-gray-200">
          <h2 className="text-xl md:text-2xl font-bold mb-2">#{selectedTag}</h2>
          <p className="text-sm md:text-base text-gray-600">{synchronicities.length} synchronicities</p>
        </div>
      )}

      <div className="flex flex-col gap-6">
        {synchronicities.length === 0 ? (
          <div className="p-6 md:p-12 bg-white rounded-xl text-center">
            <p className="text-base md:text-lg text-gray-600 mb-6">
              {selectedTag
                ? `No shared synchronicities with #${selectedTag} yet.`
                : 'No shared synchronicities yet. Be the first to share your signs!'}
            </p>
            <Link href="/dashboard" className="inline-block px-6 py-3 bg-black text-white rounded-lg text-sm md:text-base">
              Share Your Signs
            </Link>
          </div>
        ) : (
          synchronicities.map((sync) => (
            <div key={sync.id} className="bg-white p-4 md:p-6 rounded-xl shadow-md">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4 pb-3 border-b border-gray-200">
                <span className="font-semibold text-sm md:text-base">
                  {sync.display_name || 'Anonymous'}
                </span>
                <span className="text-xs md:text-sm text-gray-400">
                  {new Date(sync.occurred_at).toLocaleDateString()}
                </span>
              </div>

              <h3 className="text-lg md:text-xl font-bold mb-3">{sync.title}</h3>

              <div className="flex flex-wrap gap-2 mb-4 items-center">
                {sync.category && (
                  <span className="inline-block px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs capitalize">{sync.category}</span>
                )}
                {sync.tags && sync.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {sync.tags.map(tag => (
                      <button
                        key={tag}
                        className="inline-block px-2 py-1 bg-gray-200 text-gray-700 rounded text-xs cursor-pointer border-none"
                        onClick={() => setSelectedTag(tag)}
                      >
                        #{tag}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <p className="text-sm md:text-base leading-relaxed mb-4 text-gray-700">{sync.description}</p>

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

              <div className="flex gap-2 md:gap-3 mt-4 pt-4 border-t border-gray-200">
                {['❤️', '✨', '🔮'].map(emoji => {
                  const reaction = reactions[sync.id]?.find(r => r.emoji === emoji);
                  return (
                    <button
                      key={emoji}
                      onClick={() => toggleReaction(sync.id, emoji)}
                      className={`px-3 py-2 text-sm md:text-base rounded-full cursor-pointer transition-all ${
                        reaction?.userReacted
                          ? 'bg-blue-50 border-2 border-blue-500'
                          : 'bg-gray-100 border-2 border-gray-300'
                      }`}
                    >
                      {emoji} {reaction?.count || 0}
                    </button>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  );
}

