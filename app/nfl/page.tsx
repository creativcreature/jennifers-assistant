'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  Bookmark,
  BookmarkedVideo,
  BookmarkedArticle,
  getBookmarks,
  toggleBookmark,
  isBookmarked,
} from '@/lib/bookmarks';

// Copyright-free fallback images from Unsplash based on content keywords
const FALLBACK_IMAGES: Record<string, string> = {
  // Sports/NFL themed
  football: 'https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=800&q=80',
  stadium: 'https://images.unsplash.com/photo-1495809269252-a91f04d3b5e6?w=800&q=80',
  field: 'https://images.unsplash.com/photo-1508098682722-e99c643e7f0b?w=800&q=80',
  players: 'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=800&q=80',
  superbowl: 'https://images.unsplash.com/photo-1504450758481-7338bbe75c8e?w=800&q=80',
  trophy: 'https://images.unsplash.com/photo-1569517282132-25d22f4573e6?w=800&q=80',
  crowd: 'https://images.unsplash.com/photo-1459865264687-595d652de67e?w=800&q=80',
  athlete: 'https://images.unsplash.com/photo-1474224017046-182bbe68cc3a?w=800&q=80',
  default: 'https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=800&q=80',
};

// Get contextual fallback image based on article title/description
function getContextualFallback(title: string, description?: string): string {
  const text = `${title} ${description || ''}`.toLowerCase();

  if (text.includes('super bowl') || text.includes('championship')) {
    return FALLBACK_IMAGES.superbowl;
  }
  if (text.includes('stadium') || text.includes('venue') || text.includes('arena')) {
    return FALLBACK_IMAGES.stadium;
  }
  if (text.includes('trophy') || text.includes('award') || text.includes('mvp') || text.includes('win')) {
    return FALLBACK_IMAGES.trophy;
  }
  if (text.includes('fan') || text.includes('crowd') || text.includes('home')) {
    return FALLBACK_IMAGES.crowd;
  }
  if (text.includes('player') || text.includes('quarterback') || text.includes('receiver') ||
      text.includes('running back') || text.includes('draft') || text.includes('rookie')) {
    return FALLBACK_IMAGES.players;
  }
  if (text.includes('injury') || text.includes('training') || text.includes('practice')) {
    return FALLBACK_IMAGES.athlete;
  }
  if (text.includes('field') || text.includes('yard') || text.includes('touchdown')) {
    return FALLBACK_IMAGES.field;
  }

  // Default to football image
  return FALLBACK_IMAGES.football;
}

type FeedTab = 'all' | 'fantasy' | 'falcons' | 'videos' | 'saved';

interface FeedItem {
  id: string;
  title: string;
  description: string;
  source: string;
  timestamp: string;
  imageUrl?: string;
  url?: string;
}

interface Video {
  id: string;
  title: string;
  thumbnail: string;
  duration?: string;
  source: string;
  videoId: string;
}

export default function NFLPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<FeedTab>('all');
  const [feed, setFeed] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0, isOver: false });
  const [videos, setVideos] = useState<Video[]>([]);
  const [loadingVideos, setLoadingVideos] = useState(false);
  const [videoFilter, setVideoFilter] = useState<'nfl' | 'falcons'>('nfl');
  const [playingVideo, setPlayingVideo] = useState<Video | null>(null);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [bookmarkState, setBookmarkState] = useState<Record<string, boolean>>({});

  const tabs: { key: FeedTab; label: string; icon?: string }[] = [
    { key: 'all', label: 'League' },
    { key: 'fantasy', label: 'Fantasy' },
    { key: 'falcons', label: 'Falcons' },
    { key: 'videos', label: 'Videos' },
    { key: 'saved', label: 'Saved' },
  ];

  // Load bookmarks on mount and listen for changes
  useEffect(() => {
    setBookmarks(getBookmarks());

    // Update bookmark state for quick lookup
    const bookmarkMap: Record<string, boolean> = {};
    getBookmarks().forEach(b => {
      bookmarkMap[`${b.type}-${b.id}`] = true;
    });
    setBookmarkState(bookmarkMap);

    const handleBookmarksChanged = () => {
      setBookmarks(getBookmarks());
      const newMap: Record<string, boolean> = {};
      getBookmarks().forEach(b => {
        newMap[`${b.type}-${b.id}`] = true;
      });
      setBookmarkState(newMap);
    };

    window.addEventListener('bookmarks-changed', handleBookmarksChanged);
    return () => window.removeEventListener('bookmarks-changed', handleBookmarksChanged);
  }, []);

  function handleBookmarkVideo(video: Video, e: React.MouseEvent) {
    e.stopPropagation();
    const bookmark: BookmarkedVideo = {
      type: 'video',
      id: video.id,
      title: video.title,
      thumbnail: video.thumbnail,
      source: video.source,
      videoId: video.videoId,
      savedAt: Date.now(),
    };
    toggleBookmark(bookmark);
  }

  function handleBookmarkArticle(item: FeedItem, e: React.MouseEvent) {
    e.stopPropagation();
    const bookmark: BookmarkedArticle = {
      type: 'article',
      id: item.id,
      title: item.title,
      description: item.description,
      source: item.source,
      imageUrl: item.imageUrl,
      url: item.url,
      savedAt: Date.now(),
    };
    toggleBookmark(bookmark);
  }

  function isVideoBookmarked(videoId: string): boolean {
    return bookmarkState[`video-${videoId}`] || false;
  }

  function isArticleBookmarked(articleId: string): boolean {
    return bookmarkState[`article-${articleId}`] || false;
  }

  // Super Bowl LX - February 8, 2026 at 6:30 PM ET
  const superBowlDate = new Date('2026-02-08T18:30:00-05:00');

  // Update countdown every second
  useEffect(() => {
    function updateCountdown() {
      const now = new Date();
      const diff = superBowlDate.getTime() - now.getTime();

      if (diff <= 0) {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0, isOver: true });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setCountdown({ days, hours, minutes, seconds, isOver: false });
    }

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (activeTab === 'videos') {
      fetchVideos(videoFilter);
    } else if (activeTab === 'saved') {
      // Bookmarks are already loaded, just refresh
      setBookmarks(getBookmarks());
    } else {
      setFeed([]);
      setPage(1);
      setHasMore(true);
      fetchFeed(activeTab, 1, true);

      // Auto-refresh every 2 minutes
      const interval = setInterval(() => {
        fetchFeed(activeTab, 1, false);
      }, 120000);

      return () => clearInterval(interval);
    }
  }, [activeTab]);

  async function fetchVideos(filter: 'nfl' | 'falcons') {
    setLoadingVideos(true);
    try {
      const response = await fetch(`/api/nfl-videos?filter=${filter}`);
      if (response.ok) {
        const data = await response.json();
        setVideos(data.videos || []);
      }
    } catch (error) {
      console.error('Error fetching videos:', error);
    }
    setLoadingVideos(false);
  }

  // Fetch videos when filter changes
  useEffect(() => {
    if (activeTab === 'videos') {
      fetchVideos(videoFilter);
    }
  }, [videoFilter]);

  async function fetchFeed(tab: FeedTab, pageNum: number, showLoading = true) {
    if (showLoading) setLoading(true);
    try {
      const category = tab === 'all' ? 'league' : tab;
      const response = await fetch(`/api/nfl-news?category=${category}&page=${pageNum}`);
      if (response.ok) {
        const data = await response.json();
        if (pageNum === 1) {
          setFeed(data.articles || []);
        } else {
          setFeed(prev => [...prev, ...(data.articles || [])]);
        }
        setHasMore(data.hasMore);
        setLastUpdated(new Date());
      }
    } catch (error) {
      console.error('Error fetching feed:', error);
    }
    setLoading(false);
    setLoadingMore(false);
  }

  function handleRefresh() {
    setPage(1);
    setHasMore(true);
    fetchFeed(activeTab, 1);
  }

  function handleLoadMore() {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    const nextPage = page + 1;
    setPage(nextPage);
    fetchFeed(activeTab, nextPage, false);
  }

  function openArticle(item: FeedItem) {
    const params = new URLSearchParams({
      url: item.url || '',
      title: item.title,
      description: item.description,
      image: item.imageUrl || '',
      source: item.source,
    });
    router.push(`/nfl/article?${params.toString()}`);
  }

  function handleVideoClick(video: Video) {
    setPlayingVideo(video);
  }

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="px-4 pt-4 pb-2">
        <h1 className="font-display text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
          NFL News
        </h1>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
          {activeTab === 'fantasy'
            ? 'Fantasy football news, dynasty rankings, and draft prospects'
            : activeTab === 'falcons'
            ? 'Atlanta Falcons news, updates, and analysis'
            : activeTab === 'videos'
            ? 'Highlights, game recaps, and NFL moments'
            : 'League updates, playoff coverage, and breaking news'}
        </p>
      </div>

      {/* Super Bowl Countdown - Only show if not over */}
      {!countdown.isOver && (
        <div className="px-4 py-3">
          <div
            className="rounded-xl overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, var(--falcons-red) 0%, #1a1a2e 100%)'
            }}
          >
            <div className="p-4 text-white">
              <div className="flex items-center justify-between mb-2">
                <div className="text-xs font-bold tracking-wider opacity-90">SUPER BOWL LX</div>
                <a
                  href="https://www.nfl.com/playoffs/2025/bracket"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-medium underline opacity-80 hover:opacity-100"
                >
                  View Bracket
                </a>
              </div>

              {/* Countdown Timer */}
              <div className="flex justify-center gap-3 mb-3">
                <div className="text-center">
                  <div className="font-display text-3xl font-bold">{countdown.days}</div>
                  <div className="text-[10px] uppercase tracking-wide opacity-70">Days</div>
                </div>
                <div className="text-2xl font-bold opacity-50">:</div>
                <div className="text-center">
                  <div className="font-display text-3xl font-bold">{String(countdown.hours).padStart(2, '0')}</div>
                  <div className="text-[10px] uppercase tracking-wide opacity-70">Hours</div>
                </div>
                <div className="text-2xl font-bold opacity-50">:</div>
                <div className="text-center">
                  <div className="font-display text-3xl font-bold">{String(countdown.minutes).padStart(2, '0')}</div>
                  <div className="text-[10px] uppercase tracking-wide opacity-70">Min</div>
                </div>
                <div className="text-2xl font-bold opacity-50">:</div>
                <div className="text-center">
                  <div className="font-display text-3xl font-bold">{String(countdown.seconds).padStart(2, '0')}</div>
                  <div className="text-[10px] uppercase tracking-wide opacity-70">Sec</div>
                </div>
              </div>

              {/* Game Info */}
              <div className="flex items-center justify-center gap-4 text-xs">
                <div className="flex items-center gap-1">
                  <span className="opacity-70">Feb 8, 2026</span>
                </div>
                <div className="w-1 h-1 rounded-full bg-white/50" />
                <div className="flex items-center gap-1">
                  <span className="opacity-70">6:30 PM ET</span>
                </div>
                <div className="w-1 h-1 rounded-full bg-white/50" />
                <div className="flex items-center gap-1 font-semibold">
                  <span>Watch on FOX</span>
                </div>
              </div>

              {/* Venue */}
              <div className="text-center mt-2 text-xs opacity-60">
                Caesars Superdome • New Orleans, LA
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 px-4 pb-3 border-b" style={{ borderColor: 'var(--border-color)' }}>
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
              activeTab === tab.key ? 'text-white' : ''
            }`}
            style={{
              background: activeTab === tab.key
                ? 'var(--falcons-red)'
                : 'var(--bg-surface)',
              color: activeTab === tab.key ? 'white' : 'var(--text-secondary)',
            }}
          >
            {tab.label}
          </button>
        ))}

        {/* Refresh button */}
        <button
          onClick={handleRefresh}
          disabled={loading}
          className="ml-auto p-2 rounded-full transition-all"
          style={{ backgroundColor: 'var(--bg-surface)' }}
          aria-label="Refresh"
        >
          <svg
            className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`}
            style={{ color: 'var(--text-secondary)' }}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
        </button>
      </div>

      {/* Last Updated */}
      {lastUpdated && (
        <div className="px-4 py-2">
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
            Updated {lastUpdated.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
          </span>
        </div>
      )}

      {/* Videos Tab Content */}
      {activeTab === 'videos' ? (
        <div className="px-4 py-4">
          {/* NFL / Falcons Toggle */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => { setVideoFilter('nfl'); setPlayingVideo(null); }}
              className="flex-1 py-2.5 px-4 rounded-full text-sm font-semibold transition-all"
              style={{
                backgroundColor: videoFilter === 'nfl' ? 'var(--falcons-red)' : 'var(--bg-surface)',
                color: videoFilter === 'nfl' ? 'white' : 'var(--text-secondary)',
              }}
            >
              NFL Highlights
            </button>
            <button
              onClick={() => { setVideoFilter('falcons'); setPlayingVideo(null); }}
              className="flex-1 py-2.5 px-4 rounded-full text-sm font-semibold transition-all"
              style={{
                backgroundColor: videoFilter === 'falcons' ? 'var(--falcons-red)' : 'var(--bg-surface)',
                color: videoFilter === 'falcons' ? 'white' : 'var(--text-secondary)',
              }}
            >
              Falcons
            </button>
          </div>

          {loadingVideos ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-6 h-6 border-2 border-falcons-red border-t-transparent rounded-full animate-spin" />
            </div>
          ) : videos.length === 0 ? (
            <div className="p-8 text-center">
              <p style={{ color: 'var(--text-secondary)' }}>
                No videos available right now. Check back soon!
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Video List - plays inline */}
              {videos.map((video) => (
                <div
                  key={video.id}
                  className="rounded-xl overflow-hidden"
                  style={{ backgroundColor: 'var(--bg-surface)' }}
                >
                  {playingVideo?.id === video.id ? (
                    /* Inline Video Player */
                    <div className="p-3">
                      <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-black">
                        <button
                          onClick={() => setPlayingVideo(null)}
                          className="absolute top-2 right-2 z-10 w-8 h-8 rounded-full bg-black/60 flex items-center justify-center hover:bg-black/80 transition-colors"
                        >
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                        <iframe
                          width="100%"
                          height="100%"
                          src={`https://www.youtube.com/embed/${video.videoId}?autoplay=1&rel=0`}
                          title={video.title}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="absolute inset-0"
                        />
                      </div>
                      <div className="mt-3 flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
                            {video.title}
                          </h3>
                          <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                            {video.source}
                          </p>
                        </div>
                        {/* Bookmark button */}
                        <button
                          onClick={(e) => handleBookmarkVideo(video, e)}
                          className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all"
                          style={{
                            backgroundColor: isVideoBookmarked(video.id) ? 'var(--falcons-red)' : 'var(--bg-card)',
                          }}
                        >
                          <svg
                            className="w-5 h-5"
                            fill={isVideoBookmarked(video.id) ? 'white' : 'none'}
                            stroke={isVideoBookmarked(video.id) ? 'white' : 'var(--text-secondary)'}
                            strokeWidth={2}
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Video Thumbnail */
                    <div className="flex gap-3 p-3">
                      {/* Thumbnail - clickable to play */}
                      <button
                        onClick={() => handleVideoClick(video)}
                        className="relative w-32 h-20 flex-shrink-0 rounded-lg overflow-hidden"
                      >
                        <Image
                          src={video.thumbnail}
                          alt={video.title}
                          fill
                          className="object-cover"
                          sizes="128px"
                          unoptimized
                        />
                        {/* Play overlay */}
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                          <div className="w-8 h-8 rounded-full bg-falcons-red flex items-center justify-center">
                            <svg className="w-4 h-4 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          </div>
                        </div>
                      </button>

                      {/* Info */}
                      <button
                        onClick={() => handleVideoClick(video)}
                        className="flex-1 min-w-0 text-left"
                      >
                        <h3
                          className="font-medium text-sm line-clamp-2 mb-1"
                          style={{ color: 'var(--text-primary)' }}
                        >
                          {video.title}
                        </h3>
                        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                          {video.source}
                        </p>
                      </button>

                      {/* Bookmark button - large and visible */}
                      <button
                        onClick={(e) => handleBookmarkVideo(video, e)}
                        className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center transition-all self-center"
                        style={{
                          backgroundColor: isVideoBookmarked(video.id) ? 'var(--falcons-red)' : 'var(--bg-card)',
                        }}
                      >
                        <svg
                          className="w-6 h-6"
                          fill={isVideoBookmarked(video.id) ? 'white' : 'none'}
                          stroke={isVideoBookmarked(video.id) ? 'white' : 'var(--text-secondary)'}
                          strokeWidth={2}
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ) : activeTab === 'saved' ? (
        /* Saved/Bookmarks Tab */
        <div className="px-4 py-4">
          {bookmarks.length === 0 ? (
            <div className="p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-surface flex items-center justify-center">
                <svg className="w-8 h-8" style={{ color: 'var(--text-muted)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
              </div>
              <h3 className="font-semibold text-lg mb-2" style={{ color: 'var(--text-primary)' }}>
                No saved items yet
              </h3>
              <p style={{ color: 'var(--text-secondary)' }}>
                Tap the bookmark icon on any video or story to save it for later!
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {bookmarks.map((bookmark) => (
                <div
                  key={`${bookmark.type}-${bookmark.id}`}
                  className="rounded-xl overflow-hidden"
                  style={{ backgroundColor: 'var(--bg-surface)' }}
                >
                  {bookmark.type === 'video' ? (
                    /* Saved Video */
                    <div className="flex gap-3 p-3">
                      <button
                        onClick={() => {
                          setActiveTab('videos');
                          setPlayingVideo({
                            id: bookmark.id,
                            title: bookmark.title,
                            thumbnail: bookmark.thumbnail,
                            source: bookmark.source,
                            videoId: bookmark.videoId,
                          });
                        }}
                        className="relative w-32 h-20 flex-shrink-0 rounded-lg overflow-hidden"
                      >
                        <Image
                          src={bookmark.thumbnail}
                          alt={bookmark.title}
                          fill
                          className="object-cover"
                          sizes="128px"
                          unoptimized
                        />
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                          <div className="w-8 h-8 rounded-full bg-falcons-red flex items-center justify-center">
                            <svg className="w-4 h-4 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          </div>
                        </div>
                        {/* Video badge */}
                        <div className="absolute top-1 left-1 px-1.5 py-0.5 bg-black/70 rounded text-[10px] text-white font-medium">
                          VIDEO
                        </div>
                      </button>
                      <button
                        onClick={() => {
                          setActiveTab('videos');
                          setPlayingVideo({
                            id: bookmark.id,
                            title: bookmark.title,
                            thumbnail: bookmark.thumbnail,
                            source: bookmark.source,
                            videoId: bookmark.videoId,
                          });
                        }}
                        className="flex-1 min-w-0 text-left"
                      >
                        <h3 className="font-medium text-sm line-clamp-2 mb-1" style={{ color: 'var(--text-primary)' }}>
                          {bookmark.title}
                        </h3>
                        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                          {bookmark.source}
                        </p>
                      </button>
                      <button
                        onClick={() => toggleBookmark(bookmark)}
                        className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center self-center"
                        style={{ backgroundColor: 'var(--falcons-red)' }}
                      >
                        <svg className="w-6 h-6" fill="white" stroke="white" strokeWidth={2} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                        </svg>
                      </button>
                    </div>
                  ) : (
                    /* Saved Article */
                    <div className="flex gap-3 p-3">
                      <button
                        onClick={() => {
                          const params = new URLSearchParams({
                            url: bookmark.url || '',
                            title: bookmark.title,
                            description: bookmark.description,
                            image: bookmark.imageUrl || '',
                            source: bookmark.source,
                          });
                          router.push(`/nfl/article?${params.toString()}`);
                        }}
                        className="flex-1 min-w-0 text-left"
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs px-1.5 py-0.5 rounded font-medium" style={{ backgroundColor: 'var(--bg-card)', color: 'var(--text-muted)' }}>
                            STORY
                          </span>
                          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                            {bookmark.source}
                          </span>
                        </div>
                        <h3 className="font-medium text-sm line-clamp-2 mb-1" style={{ color: 'var(--text-primary)' }}>
                          {bookmark.title}
                        </h3>
                        {bookmark.description && (
                          <p className="text-xs line-clamp-1" style={{ color: 'var(--text-secondary)' }}>
                            {bookmark.description}
                          </p>
                        )}
                      </button>
                      {bookmark.imageUrl && (
                        <div className="flex-shrink-0 w-16 h-16 relative rounded-lg overflow-hidden">
                          <Image
                            src={bookmark.imageUrl}
                            alt=""
                            fill
                            className="object-cover"
                            sizes="64px"
                          />
                        </div>
                      )}
                      <button
                        onClick={() => toggleBookmark(bookmark)}
                        className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center self-center"
                        style={{ backgroundColor: 'var(--falcons-red)' }}
                      >
                        <svg className="w-6 h-6" fill="white" stroke="white" strokeWidth={2} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* News Feed - Visual Card Layout */
        <div className="px-4 py-4 space-y-4">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-6 h-6 border-2 border-falcons-red border-t-transparent rounded-full animate-spin" />
            </div>
          ) : feed.length === 0 ? (
            <div className="p-8 text-center">
              <p style={{ color: 'var(--text-secondary)' }}>
                No news available right now. Check back soon!
              </p>
            </div>
          ) : (
            <>
              {feed.map((item, index) => (
                <div
                  key={item.id}
                  className="rounded-xl overflow-hidden"
                  style={{ backgroundColor: 'var(--bg-surface)' }}
                >
                  {/* Large Image - Full Width */}
                  {item.imageUrl && (
                    <button
                      onClick={() => openArticle(item)}
                      className="relative w-full aspect-[16/9] overflow-hidden"
                    >
                      <Image
                        src={item.imageUrl}
                        alt={item.title}
                        fill
                        className="object-cover transition-transform hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 600px"
                        priority={index < 3}
                      />
                      {/* Gradient overlay for text readability */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                      {/* Source badge on image */}
                      <div className="absolute top-3 left-3">
                        <span
                          className="px-2 py-1 text-xs font-bold rounded-md backdrop-blur-sm"
                          style={{
                            backgroundColor: 'rgba(0,0,0,0.6)',
                            color: 'white',
                          }}
                        >
                          {item.source}
                        </span>
                      </div>

                      {/* Bookmark button on image */}
                      <button
                        onClick={(e) => handleBookmarkArticle(item, e)}
                        className="absolute top-3 right-3 w-10 h-10 rounded-full flex items-center justify-center transition-all backdrop-blur-sm"
                        style={{
                          backgroundColor: isArticleBookmarked(item.id) ? 'var(--falcons-red)' : 'rgba(0,0,0,0.5)',
                        }}
                      >
                        <svg
                          className="w-5 h-5"
                          fill={isArticleBookmarked(item.id) ? 'white' : 'none'}
                          stroke="white"
                          strokeWidth={2}
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                        </svg>
                      </button>
                    </button>
                  )}

                  {/* Content */}
                  <button
                    onClick={() => openArticle(item)}
                    className="w-full text-left p-4"
                  >
                    {/* No image fallback - show source here */}
                    {!item.imageUrl && (
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-bold" style={{ color: 'var(--falcons-red)' }}>
                          {item.source}
                        </span>
                        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                          · {item.timestamp}
                        </span>
                        {/* Bookmark for no-image items */}
                        <button
                          onClick={(e) => handleBookmarkArticle(item, e)}
                          className="ml-auto w-10 h-10 rounded-full flex items-center justify-center transition-all"
                          style={{
                            backgroundColor: isArticleBookmarked(item.id) ? 'var(--falcons-red)' : 'var(--bg-card)',
                          }}
                        >
                          <svg
                            className="w-5 h-5"
                            fill={isArticleBookmarked(item.id) ? 'white' : 'none'}
                            stroke={isArticleBookmarked(item.id) ? 'white' : 'var(--text-secondary)'}
                            strokeWidth={2}
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                          </svg>
                        </button>
                      </div>
                    )}

                    {/* Title - larger and bolder */}
                    <h3
                      className="font-bold text-lg leading-tight mb-2 line-clamp-3"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {item.title}
                    </h3>

                    {/* Description */}
                    {item.description && (
                      <p
                        className="text-sm line-clamp-2 mb-2"
                        style={{ color: 'var(--text-secondary)' }}
                      >
                        {item.description}
                      </p>
                    )}

                    {/* Timestamp for items with images */}
                    {item.imageUrl && (
                      <div className="flex items-center gap-2">
                        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                          {item.timestamp}
                        </span>
                      </div>
                    )}
                  </button>
                </div>
              ))}

              {/* Load More Button */}
              {hasMore && (
                <div className="p-4">
                  <button
                    onClick={handleLoadMore}
                    disabled={loadingMore}
                    className="w-full py-3 rounded-xl font-semibold text-sm transition-all"
                    style={{
                      backgroundColor: 'var(--bg-surface)',
                      color: 'var(--text-secondary)',
                    }}
                  >
                    {loadingMore ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        Loading...
                      </span>
                    ) : (
                      'Load More'
                    )}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Bottom padding for nav */}
      <div className="h-8" />
    </div>
  );
}
