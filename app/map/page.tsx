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
  visibility: string;
}

export default function MapPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [synchronicities, setSynchronicities] = useState<Synchronicity[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSync, setSelectedSync] = useState<Synchronicity | null>(null);

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
    await loadSynchronicities(session.user.id);
    setLoading(false);
  };

  const loadSynchronicities = async (userId: string) => {
    const { data, error } = await supabase
      .from('synchronicities')
      .select('*')
      .or(`user_id.eq.${userId},visibility.eq.shared`)
      .not('location', 'is', null)
      .order('occurred_at', { ascending: false });

    if (error) {
      console.error('Error loading synchronicities:', error);
    } else {
      setSynchronicities(data || []);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen p-4 md:p-8 bg-[#f5f9f5] font-sans">
        <p>Loading...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-4 md:p-8 bg-[#f5f9f5] font-sans">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">🗺️ Map View</h1>
        <Link href="/dashboard" className="px-4 py-2 bg-white text-black border border-gray-300 rounded-md text-sm">
          ← Back to Dashboard
        </Link>
      </header>

      <div className="bg-green-50 p-4 md:p-6 rounded-xl mb-6 border-2 border-green-200">
        <p className="text-sm md:text-base mb-2 font-semibold">
          📍 Map visualization coming soon! This feature will display synchronicities with GPS coordinates on an interactive map.
        </p>
        <p className="text-xs md:text-sm text-gray-600">
          For now, here are all synchronicities with location data:
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {synchronicities.length === 0 ? (
          <div className="p-6 md:p-12 bg-white rounded-xl text-center">
            <p className="text-base md:text-lg text-gray-600 mb-2">
              No synchronicities with location data yet.
            </p>
            <p className="text-sm md:text-base text-gray-400 mb-6">
              Add locations to your synchronicities to see them on the map!
            </p>
            <Link href="/dashboard" className="inline-block px-6 py-3 bg-black text-white rounded-lg text-sm md:text-base">
              Log a Synchronicity
            </Link>
          </div>
        ) : (
          synchronicities.map((sync) => (
            <div
              key={sync.id}
              className="bg-white p-4 md:p-5 rounded-xl shadow-sm cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setSelectedSync(selectedSync?.id === sync.id ? null : sync)}
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-2">
                <h3 className="text-lg md:text-xl font-bold m-0">{sync.title}</h3>
                <span className="text-xs md:text-sm px-3 py-2 bg-green-50 rounded-full text-green-700 font-semibold">📍 {sync.location}</span>
              </div>

              {sync.visibility === 'shared' && sync.display_name && (
                <p className="text-xs md:text-sm text-gray-400 mb-3">by {sync.display_name}</p>
              )}

              {selectedSync?.id === sync.id && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex flex-wrap gap-2 mb-4 items-center">
                    {sync.category && (
                      <span className="inline-block px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs capitalize">{sync.category}</span>
                    )}
                    {sync.tags && sync.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {sync.tags.map(tag => (
                          <span key={tag} className="inline-block px-2 py-1 bg-gray-200 text-gray-700 rounded text-xs">#{tag}</span>
                        ))}
                      </div>
                    )}
                  </div>

                  <p className="text-sm md:text-base leading-relaxed mb-4 text-gray-700">{sync.description}</p>

                  {sync.photo_url && (
                    <img
                      src={sync.photo_url}
                      alt="Synchronicity"
                      className="w-full max-h-[250px] md:max-h-[300px] object-cover rounded-lg mb-3"
                    />
                  )}

                  <p className="text-xs md:text-sm text-gray-600 my-1">
                    🕐 {new Date(sync.occurred_at).toLocaleString()}
                  </p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </main>
  );
}

