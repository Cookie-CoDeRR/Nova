'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Sparkles, Play, ArrowRight, BookOpen, AlertCircle, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { getStudentProfile, StudentProfile } from '@/lib/userProfile';

interface Video {
  title: string;
  description: string;
  videoId: string;
  thumbnail: string;
  url: string;
  playlistId: string;
  courseName: string;
  score?: number;
}

export default function NptelSearchPage() {
  const [query, setQuery] = useState('');
  const [searchType, setSearchType] = useState<'keyword' | 'semantic'>('keyword');
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [searched, setSearched] = useState(false);
  const [searchMode, setSearchMode] = useState<'keyword' | 'semantic' | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [recommendations, setRecommendations] = useState<Video[]>([]);
  const [recLoading, setRecLoading] = useState(false);

  // Fetch all videos on mount
  const fetchAllVideos = async () => {
    setInitialLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/nptel/videos');
      if (!res.ok) throw new Error('Failed to load videos catalog');
      const data = await res.json();
      setVideos(data);
    } catch (err: any) {
      console.error(err);
      setError('Could not load the NPTEL video library. Please run the fetch script first.');
    } finally {
      setInitialLoading(false);
    }
  };

  const fetchRecommendations = async (studentProfile: any) => {
    setRecLoading(true);
    try {
      // Find a target keywords/goal from studentProfile
      const targetQuery = studentProfile.specializations?.[0] || studentProfile.primaryGoal || 'programming';
      
      const res = await fetch(`/api/nptel/search?q=${encodeURIComponent(targetQuery)}&type=semantic`);
      if (res.ok) {
        const data = await res.json();
        setRecommendations(data.slice(0, 3));
      }
    } catch (err) {
      console.error('Failed to load recommendations:', err);
    } finally {
      setRecLoading(false);
    }
  };

  useEffect(() => {
    fetchAllVideos();
    getStudentProfile().then((p: any) => {
      setProfile(p);
      if (p) {
        fetchRecommendations(p);
      }
    });
  }, []);

  const handleSearch = useCallback(async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) {
      fetchAllVideos();
      setSearched(false);
      setSearchMode(null);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/nptel/search?q=${encodeURIComponent(query)}&type=${searchType}`);
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Search failed');
      }

      const mode = res.headers.get('x-search-mode') as 'keyword' | 'semantic';
      const isFallback = res.headers.get('x-search-fallback') === 'true';

      setSearchMode(isFallback ? 'keyword' : mode);
      const data = await res.json();
      setVideos(data);
      setSearched(true);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Something went wrong during search.');
    } finally {
      setLoading(false);
    }
  }, [query, searchType]);

  // Debounced search trigger for typing (optional, but let's stick to explicit search + hot-toggles)
  useEffect(() => {
    if (searched && query.trim() !== '') {
      handleSearch();
    }
  }, [searchType]);

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#1E1B4B] py-12 px-6 sm:px-12 md:px-16 transition-all duration-300">
      
      {/* Header */}
      <header className="max-w-6xl mx-auto mb-12 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <Link href="/dashboard" className="text-sm font-semibold text-[#7C3AED] hover:underline flex items-center gap-1.5 mb-2">
            ← Back to Dashboard
          </Link>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#1E1B4B]">
            NPTEL Lecture Hub
          </h1>
          <p className="text-sm text-slate-500 mt-1 max-w-xl">
            Search, discover, and learn from thousands of verified NPTEL playlists using standard keywords or advanced AI semantic reasoning.
          </p>
        </div>

        {/* Search Mode Toggle */}
        <div className="bg-slate-100 p-1 rounded-xl flex items-center self-start md:self-center shadow-xs border border-slate-200">
          <button
            onClick={() => setSearchType('keyword')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all ${
              searchType === 'keyword'
                ? 'bg-white text-[#7C3AED] shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Keyword Search
          </button>
          <button
            onClick={() => setSearchType('semantic')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold tracking-wide flex items-center gap-1.5 transition-all ${
              searchType === 'semantic'
                ? 'bg-[#7C3AED] text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Sparkles className="w-3 h-3" />
            AI Semantic Search
          </button>
        </div>
      </header>

      {/* Main Search Controls */}
      <main className="max-w-6xl mx-auto">
        <form onSubmit={handleSearch} className="mb-8 flex gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder={
                searchType === 'semantic'
                  ? "Describe a concept (e.g., 'explain how B-trees balancing works' or 'gradient descent step size')"
                  : "Search by keywords in titles or descriptions..."
              }
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#7C3AED] focus:border-transparent shadow-sm transition-all text-slate-800 placeholder-slate-400"
            />
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-[#7C3AED] text-white px-6 py-4 rounded-xl font-semibold text-sm hover:bg-[#6D28D9] active:bg-[#5B21B6] transition-all flex items-center gap-2 shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : searchType === 'semantic' ? (
              <>
                <Sparkles className="w-4 h-4" />
                Ask AI
              </>
            ) : (
              'Search'
            )}
          </button>
        </form>

        {/* Feedback / Mode Alerts */}
        <AnimatePresence mode="wait">
          {searchMode && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`p-3.5 rounded-xl border mb-6 text-xs flex items-center justify-between ${
                searchMode === 'semantic'
                  ? 'bg-purple-50 border-purple-100 text-[#7C3AED]'
                  : 'bg-blue-50 border-blue-100 text-blue-700'
              }`}
            >
              <div className="flex items-center gap-2">
                {searchMode === 'semantic' ? (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>AI Semantic mode active: results ranked by conceptual relevance.</span>
                  </>
                ) : (
                  <>
                    <BookOpen className="w-4 h-4" />
                    <span>Keyword mode active: displaying direct matches.</span>
                  </>
                )}
              </div>
              {searchType === 'semantic' && searchMode === 'keyword' && (
                <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-md font-medium uppercase tracking-wide">
                  Fallback (No Embeddings File)
                </span>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error Alert */}
        {error && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-100 text-rose-800 text-sm mb-6 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Library Sync Required</p>
              <p className="text-xs text-rose-700 mt-1">{error}</p>
            </div>
          </div>
        )}

        {/* Recommended Videos (based on user profile targets) */}
        {!searched && recommendations.length > 0 && (
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-[#7C3AED] fill-[#7C3AED]/10 animate-pulse" />
              <h2 className="text-lg font-bold text-[#1E1B4B]">Recommended for Your Goal</h2>
              {profile?.primaryGoal && (
                <span className="text-xs text-slate-400 font-normal hidden sm:inline">
                  — based on: "{profile.primaryGoal.length > 50 ? profile.primaryGoal.substring(0, 50) + '...' : profile.primaryGoal}"
                </span>
              )}
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendations.map((video, idx) => (
                <motion.div
                  key={`rec-${video.videoId}`}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0, transition: { delay: idx * 0.1 } }}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  className="bg-white rounded-2xl border-2 border-purple-100 shadow-xs overflow-hidden flex flex-col group hover:shadow-md hover:border-purple-200 transition-all duration-300 relative"
                >
                  {/* Thumbnail */}
                  <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
                    {video.thumbnail ? (
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="object-cover w-full h-full group-hover:scale-103 transition-transform duration-500"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-300 bg-slate-50">
                        <Play className="w-8 h-8 opacity-40" />
                      </div>
                    )}
                    
                    {/* Course Badge */}
                    <span className="absolute top-2 left-2 bg-[#7C3AED] text-white text-[10px] font-semibold px-2.5 py-0.5 rounded-full shadow-sm max-w-[85%] truncate">
                      {video.courseName}
                    </span>
                    
                    {/* Target Match Badge */}
                    <span className="absolute bottom-2 right-2 bg-slate-900/80 text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md backdrop-blur-xs">
                      Target Match
                    </span>
                  </div>

                  {/* Metadata & Title */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-sm leading-snug text-[#1E1B4B] line-clamp-2 mb-2 group-hover:text-[#7C3AED] transition-colors" title={video.title}>
                        {video.title}
                      </h3>
                      <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed mb-4">
                        {video.description || "No description provided."}
                      </p>
                    </div>

                    <a
                      href={video.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#7C3AED] group/link"
                    >
                      <span className="flex items-center gap-1.5">
                        <Play className="w-3.5 h-3.5 fill-[#7C3AED]" />
                        Watch on YouTube
                      </span>
                      <ArrowRight className="w-4 h-4 transition-transform group-hover/link:translate-x-1" />
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>
            
            {/* Divider */}
            <div className="border-t border-slate-200/60 my-10" />
          </div>
        )}

        {/* Video Grid */}
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="w-5 h-5 text-slate-500" />
          <h2 className="text-lg font-bold text-[#1E1B4B]">
            {searched ? 'Search Results' : 'Complete Lecture Catalog'}
          </h2>
        </div>

        {initialLoading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <RefreshCw className="w-8 h-8 text-[#7C3AED] animate-spin" />
            <p className="text-slate-400 text-sm">Loading NPTEL course database...</p>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {videos.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-20 bg-white rounded-2xl border border-slate-100 shadow-sm"
              >
                <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-slate-700">No Videos Found</h3>
                <p className="text-sm text-slate-400 mt-1 max-w-sm mx-auto">
                  Try refining your query or checking if you have run the data gatherer script.
                </p>
              </motion.div>
            ) : (
              <motion.div
                layout
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {videos.map((video, idx) => (
                  <motion.div
                    key={video.videoId}
                    layout
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0, transition: { delay: Math.min(idx * 0.05, 0.4) } }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    whileHover={{ y: -4, transition: { duration: 0.2 } }}
                    className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col group hover:shadow-md transition-all duration-300"
                  >
                    {/* Thumbnail */}
                    <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
                      {video.thumbnail ? (
                        <img
                          src={video.thumbnail}
                          alt={video.title}
                          className="object-cover w-full h-full group-hover:scale-103 transition-transform duration-500"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-300 bg-slate-50">
                          <Play className="w-8 h-8 opacity-40" />
                        </div>
                      )}
                      
                      {/* Similarity Score Indicator */}
                      {video.score !== undefined && (
                        <span className="absolute bottom-2 right-2 bg-[#7C3AED]/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-md backdrop-blur-xs flex items-center gap-0.5">
                          <Sparkles className="w-2.5 h-2.5" />
                          {Math.round(video.score * 100)}% Match
                        </span>
                      )}

                      {/* Course / Playlist Badge */}
                      <span className="absolute top-2 left-2 bg-slate-900/75 text-white text-[10px] font-medium px-2.5 py-0.5 rounded-full backdrop-blur-xs max-w-[85%] truncate">
                        {video.courseName}
                      </span>
                    </div>

                    {/* Metadata & Title */}
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="font-bold text-sm leading-snug text-[#1E1B4B] line-clamp-2 mb-2 group-hover:text-[#7C3AED] transition-colors" title={video.title}>
                          {video.title}
                        </h3>
                        <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed mb-4">
                          {video.description || "No description provided."}
                        </p>
                      </div>

                      <a
                        href={video.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#7C3AED] group/link"
                      >
                        <span className="flex items-center gap-1.5">
                          <Play className="w-3.5 h-3.5 fill-[#7C3AED]" />
                          Watch on YouTube
                        </span>
                        <ArrowRight className="w-4 h-4 transition-transform group-hover/link:translate-x-1" />
                      </a>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </main>
    </div>
  );
}
