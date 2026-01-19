'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

type FeedTab = 'all' | 'fantasy' | 'falcons';

interface FeedItem {
  id: string;
  title: string;
  description: string;
  source: string;
  timestamp: string;
  imageUrl?: string;
  url?: string;
  type: 'news' | 'video';
  videoId?: string;
}

export default function NFLPage() {
  const [activeTab, setActiveTab] = useState<FeedTab>('all');
  const [feed, setFeed] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const tabs: { key: FeedTab; label: string }[] = [
    { key: 'all', label: 'League' },
    { key: 'fantasy', label: 'Fantasy' },
    { key: 'falcons', label: 'Falcons' },
  ];

  // Super Bowl LIX - February 9, 2025
  const superBowlDate = new Date('2025-02-09T18:30:00-05:00');
  const now = new Date();
  const daysUntilSuperBowl = Math.ceil((superBowlDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  useEffect(() => {
    fetchFeed(activeTab);

    // Auto-refresh every 2 minutes
    const interval = setInterval(() => {
      fetchFeed(activeTab, false);
    }, 120000);

    return () => clearInterval(interval);
  }, [activeTab]);

  async function fetchFeed(tab: FeedTab, showLoading = true) {
    if (showLoading) setLoading(true);
    try {
      const category = tab === 'all' ? 'league' : tab;
      const response = await fetch(`/api/nfl-news?category=${category}`);
      if (response.ok) {
        const data = await response.json();
        setFeed(data.articles || []);
        setLastUpdated(new Date());
      }
    } catch (error) {
      console.error('Error fetching feed:', error);
    }
    setLoading(false);
  }

  function handleRefresh() {
    fetchFeed(activeTab);
  }

  function openArticle(item: FeedItem) {
    if (item.url) {
      window.open(item.url, '_blank', 'noopener,noreferrer');
    }
  }

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="px-4 pt-4 pb-2">
        <h1 className="font-display text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
          NFL News
        </h1>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
          League updates, fantasy insights, and Falcons news
        </p>
      </div>

      {/* Super Bowl Countdown */}
      {daysUntilSuperBowl > 0 && (
        <div className="px-4 py-3">
          <div
            className="rounded-xl overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, var(--falcons-red) 0%, var(--falcons-red-dark) 100%)'
            }}
          >
            <div className="p-4 text-center text-white">
              <div className="text-xs font-medium opacity-90 mb-1">SUPER BOWL LIX</div>
              <div className="font-display text-3xl font-bold">
                {daysUntilSuperBowl} Days
              </div>
              <div className="text-xs opacity-80">
                February 9, 2025
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

      {/* Feed */}
      <div className="divide-y" style={{ borderColor: 'var(--border-color)' }}>
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
          feed.map((item) => (
            <button
              key={item.id}
              onClick={() => openArticle(item)}
              className="w-full text-left p-4 hover:bg-surface/50 transition-colors"
              style={{ borderColor: 'var(--border-color)' }}
            >
              <div className="flex gap-3">
                {/* Content */}
                <div className="flex-1 min-w-0">
                  {/* Source and time */}
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                      {item.source}
                    </span>
                    <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                      · {item.timestamp}
                    </span>
                  </div>

                  {/* Title */}
                  <h3
                    className="font-medium text-base mb-1 line-clamp-2"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {item.title}
                  </h3>

                  {/* Description */}
                  {item.description && (
                    <p
                      className="text-sm line-clamp-2"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      {item.description}
                    </p>
                  )}
                </div>

                {/* Thumbnail */}
                {item.imageUrl && (
                  <div className="flex-shrink-0 w-20 h-20 relative rounded-lg overflow-hidden">
                    <Image
                      src={item.imageUrl}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>
                )}
              </div>
            </button>
          ))
        )}
      </div>

      {/* Bottom padding for nav */}
      <div className="h-8" />
    </div>
  );
}
