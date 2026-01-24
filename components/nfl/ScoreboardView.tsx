'use client';

import { useState, useEffect } from 'react';
import ScoreCard from './ScoreCard';

interface GameScore {
  id: string;
  status: 'scheduled' | 'in_progress' | 'final';
  statusDetail: string;
  homeTeam: { name: string; abbreviation: string; score: number; logo?: string };
  awayTeam: { name: string; abbreviation: string; score: number; logo?: string };
  startTime: string;
  broadcast?: string;
  isFalconsGame: boolean;
}

export default function ScoreboardView() {
  const [games, setGames] = useState<GameScore[]>([]);
  const [week, setWeek] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchScores();
    // Refresh every 30 seconds for live games
    const interval = setInterval(fetchScores, 30000);
    return () => clearInterval(interval);
  }, []);

  async function fetchScores() {
    try {
      const res = await fetch('/api/nfl-scores');
      if (res.ok) {
        const data = await res.json();
        setGames(data.games || []);
        setWeek(data.week || '');
        // Cache for offline
        localStorage.setItem('nfl-scores-cache', JSON.stringify(data));
      }
    } catch {
      // Try cached data
      const cached = localStorage.getItem('nfl-scores-cache');
      if (cached) {
        const data = JSON.parse(cached);
        setGames(data.games || []);
        setWeek(data.week || '');
      }
    }
    setLoading(false);
  }

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map(i => (
          <div key={i} className="rounded-xl p-4 animate-pulse" style={{ backgroundColor: 'var(--bg-surface)' }}>
            <div className="h-4 w-20 rounded" style={{ backgroundColor: 'var(--bg-card)' }} />
            <div className="mt-3 space-y-2">
              <div className="h-6 w-full rounded" style={{ backgroundColor: 'var(--bg-card)' }} />
              <div className="h-6 w-full rounded" style={{ backgroundColor: 'var(--bg-card)' }} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (games.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
          No games scheduled
        </p>
        <p style={{ color: 'var(--text-secondary)' }}>
          Check back when the season is active for live scores!
        </p>
      </div>
    );
  }

  // Show Falcons games first
  const sortedGames = [...games].sort((a, b) => {
    if (a.isFalconsGame && !b.isFalconsGame) return -1;
    if (!a.isFalconsGame && b.isFalconsGame) return 1;
    if (a.status === 'in_progress' && b.status !== 'in_progress') return -1;
    if (a.status !== 'in_progress' && b.status === 'in_progress') return 1;
    return 0;
  });

  return (
    <div>
      {week && (
        <div className="mb-3">
          <span className="text-sm font-bold" style={{ color: 'var(--text-secondary)' }}>
            {week}
          </span>
        </div>
      )}
      <div className="space-y-3">
        {sortedGames.map(game => (
          <ScoreCard key={game.id} game={game} />
        ))}
      </div>
    </div>
  );
}
