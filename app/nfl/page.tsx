'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

type NewsTab = 'league' | 'fantasy' | 'falcons';

interface NewsItem {
  id: string;
  title: string;
  description: string;
  source: string;
  timestamp: string;
  imageUrl?: string;
  url?: string;
}

export default function NFLPage() {
  const [activeTab, setActiveTab] = useState<NewsTab>('league');
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const tabs: { key: NewsTab; label: string; icon: string }[] = [
    { key: 'league', label: 'League', icon: '🏈' },
    { key: 'fantasy', label: 'Fantasy', icon: '📊' },
    { key: 'falcons', label: 'Falcons', icon: '🔴' },
  ];

  // Super Bowl LIX - February 9, 2025
  const superBowlDate = new Date('2025-02-09T18:30:00-05:00');
  const now = new Date();
  const daysUntilSuperBowl = Math.ceil((superBowlDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  useEffect(() => {
    fetchNews(activeTab);

    // Auto-refresh every 2 minutes for breaking news
    const interval = setInterval(() => {
      fetchNews(activeTab);
    }, 120000);

    return () => clearInterval(interval);
  }, [activeTab]);

  async function fetchNews(tab: NewsTab, showLoading = true) {
    if (showLoading) setLoading(true);
    try {
      const response = await fetch(`/api/nfl-news?category=${tab}`);
      if (response.ok) {
        const data = await response.json();
        setNews(data.articles || []);
        setLastUpdated(new Date());
      }
    } catch (error) {
      console.error('Error fetching news:', error);
    }
    setLoading(false);
  }

  function handleRefresh() {
    fetchNews(activeTab);
  }

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <div className="relative h-52 w-full overflow-hidden">
        <Image
          src="/images/falcons/team-action.jpg"
          alt="NFL Football"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/70" />
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h1 className="font-display text-2xl font-bold text-white drop-shadow-lg">
            NFL News
          </h1>
          <p className="text-white/90 text-sm drop-shadow">
            League updates, fantasy insights, and Falcons news
          </p>
        </div>
      </div>

      {/* Super Bowl Countdown */}
      <div className="px-4 py-4">
        <div
          className="card-elevated overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, var(--falcons-red) 0%, var(--falcons-red-dark) 100%)'
          }}
        >
          <div className="p-4 text-center text-white">
            <div className="text-sm font-medium opacity-90 mb-1">SUPER BOWL LIX</div>
            <div className="font-display text-4xl font-bold mb-1">
              {daysUntilSuperBowl} Days
            </div>
            <div className="text-sm opacity-80">
              February 9, 2025 • New Orleans
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 px-4 pb-4 overflow-x-auto scrollbar-hide">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-5 py-3 rounded-card text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
              activeTab === tab.key
                ? 'text-white shadow-glow-sm'
                : ''
            }`}
            style={{
              background: activeTab === tab.key
                ? 'linear-gradient(135deg, var(--falcons-red) 0%, var(--falcons-red-dark) 100%)'
                : 'var(--bg-surface)',
              color: activeTab === tab.key ? 'white' : 'var(--text-secondary)',
            }}
          >
            <span className="text-lg">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Refresh Bar */}
      <div className="px-4 pb-4 flex items-center justify-between">
        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
          {lastUpdated
            ? `Updated ${lastUpdated.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`
            : 'Loading...'}
        </span>
        <button
          onClick={handleRefresh}
          disabled={loading}
          className="flex items-center gap-2 px-3 py-2 rounded-card text-sm font-medium transition-all"
          style={{
            backgroundColor: 'var(--bg-surface)',
            color: 'var(--text-secondary)',
          }}
        >
          <svg
            className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`}
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
          Refresh
        </button>
      </div>

      {/* News Feed */}
      <div className="px-4 pb-8 space-y-3">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-6 h-6 border-2 border-falcons-red border-t-transparent rounded-full animate-spin" />
          </div>
        ) : news.length === 0 ? (
          <div className="card-elevated p-8 text-center">
            <p style={{ color: 'var(--text-secondary)' }}>
              No news available right now. Check back soon!
            </p>
          </div>
        ) : (
          news.map((item, index) => (
            <a
              key={item.id}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="card-elevated block animate-slide-up hover:scale-[1.01] transition-transform"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              {item.imageUrl && (
                <div className="relative h-40 w-full overflow-hidden rounded-t-card -mt-5 -mx-5 mb-3" style={{ width: 'calc(100% + 40px)' }}>
                  <Image
                    src={item.imageUrl}
                    alt={item.title}
                    fill
                    className="object-cover"
                    sizes="100vw"
                  />
                </div>
              )}
              <h3
                className="font-display text-lg font-semibold mb-2"
                style={{ color: 'var(--text-primary)' }}
              >
                {item.title}
              </h3>
              <p
                className="text-sm mb-3 line-clamp-2"
                style={{ color: 'var(--text-secondary)' }}
              >
                {item.description}
              </p>
              <div className="flex items-center justify-between">
                <span
                  className="text-xs"
                  style={{ color: 'var(--text-muted)' }}
                >
                  {item.source}
                </span>
                <span
                  className="text-xs"
                  style={{ color: 'var(--text-muted)' }}
                >
                  {item.timestamp}
                </span>
              </div>
            </a>
          ))
        )}
      </div>
    </div>
  );
}
