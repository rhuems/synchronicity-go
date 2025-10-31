"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

interface TagTrend {
  tag: string;
  usage_count: number;
  unique_users: number;
  last_used: string;
}

interface RecentSync {
  id: string;
  title: string;
  description: string;
  occurred_at: string;
  tags: string[];
  display_name: string;
}

export default function TrendsPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [tagTrends, setTagTrends] = useState<TagTrend[]>([]);
  const [recentSyncs, setRecentSyncs] = useState<RecentSync[]>([]);
  const [totalSyncs, setTotalSyncs] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  useEffect(() => {
    checkUser();
  }, []);

  useEffect(() => {
    if (user) {
      loadTrends();
    }
  }, [user]);

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      router.push('/login');
      return;
    }
    setUser(session.user);
  };

  const loadTrends = async () => {
    try {
      const [trendsRes, syncsRes, statsRes] = await Promise.all([
        supabase.from('global_tag_trends').select('*').limit(30),
        supabase
          .from('synchronicities')
          .select('id, title, description, occurred_at, tags, display_name')
          .eq('visibility', 'shared')
          .order('created_at', { ascending: false })
          .limit(10),
        supabase
          .from('synchronicities')
          .select('user_id', { count: 'exact' })
          .eq('visibility', 'shared')
      ]);

      if (trendsRes.data) setTagTrends(trendsRes.data);
      if (syncsRes.data) setRecentSyncs(syncsRes.data);
      if (statsRes.count !== null) {
        setTotalSyncs(statsRes.count);
        const uniqueUsers = new Set(statsRes.data?.map(s => s.user_id) || []).size;
        setTotalUsers(uniqueUsers);
      }
    } catch (error) {
      console.error('Error loading trends:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTagClick = (tag: string) => {
    setSelectedTag(selectedTag === tag ? null : tag);
  };

  const filteredSyncs = selectedTag
    ? recentSyncs.filter(sync => sync.tags?.includes(selectedTag))
    : recentSyncs;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading global trends...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      <nav className="bg-black/30 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/dashboard" className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Synchronicity Go™
          </Link>
          <div className="flex gap-4">
            <Link href="/dashboard" className="hover:text-purple-300 transition">Dashboard</Link>
            <Link href="/community" className="hover:text-purple-300 transition">Community</Link>
            <Link href="/map" className="hover:text-purple-300 transition">Map</Link>
            <Link href="/trends" className="text-purple-300">Trends</Link>
            <Link href="/profile" className="hover:text-purple-300 transition">Profile</Link>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Global Sync Trends
          </h1>
          <p className="text-white/70">Discover what signs the collective is experiencing worldwide</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <div className="text-3xl font-bold text-purple-400 mb-2">{totalSyncs}</div>
            <div className="text-white/70">Total Shared Synchronicities</div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <div className="text-3xl font-bold text-pink-400 mb-2">{totalUsers}</div>
            <div className="text-white/70">Active Seekers</div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <div className="text-3xl font-bold text-blue-400 mb-2">{tagTrends.length}</div>
            <div className="text-white/70">Unique Sign Types</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 mb-6">
              <h2 className="text-2xl font-semibold mb-4">Trending Signs</h2>
              <div className="flex flex-wrap gap-2">
                {tagTrends.slice(0, 20).map((trend) => (
                  <button
                    key={trend.tag}
                    onClick={() => handleTagClick(trend.tag)}
                    className={`px-4 py-2 rounded-full transition-all ${
                      selectedTag === trend.tag
                        ? 'bg-purple-500 text-white'
                        : 'bg-white/10 hover:bg-white/20 text-white/90'
                    }`}
                  >
                    #{trend.tag} ({trend.usage_count})
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <h2 className="text-2xl font-semibold mb-4">
                {selectedTag ? `Recent #${selectedTag} Synchronicities` : 'Recent Synchronicities'}
              </h2>
              <div className="space-y-4">
                {filteredSyncs.length === 0 ? (
                  <p className="text-white/50 text-center py-8">
                    No synchronicities found {selectedTag && `with #${selectedTag}`}
                  </p>
                ) : (
                  filteredSyncs.map((sync) => (
                    <div
                      key={sync.id}
                      className="bg-white/5 rounded-lg p-4 border border-white/10 hover:border-purple-500/50 transition-all"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-semibold text-white">{sync.title}</h3>
                        <span className="text-xs text-white/50">
                          {new Date(sync.occurred_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-white/70 text-sm mb-3 line-clamp-2">{sync.description}</p>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {sync.tags?.slice(0, 5).map((tag) => (
                          <span
                            key={tag}
                            className="text-xs px-2 py-1 bg-purple-500/20 text-purple-300 rounded-full"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                      <div className="text-xs text-white/50">by {sync.display_name}</div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 sticky top-4">
              <h2 className="text-2xl font-semibold mb-4">Top Signs by Popularity</h2>
              <div className="space-y-3">
                {tagTrends.slice(0, 15).map((trend, index) => (
                  <div
                    key={trend.tag}
                    className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-all cursor-pointer"
                    onClick={() => handleTagClick(trend.tag)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-semibold text-white">#{trend.tag}</div>
                        <div className="text-xs text-white/50">{trend.unique_users} seekers</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-purple-400">{trend.usage_count}</div>
                      <div className="text-xs text-white/50">reports</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
