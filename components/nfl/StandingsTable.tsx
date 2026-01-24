'use client';

import { useState, useEffect } from 'react';

interface TeamStanding {
  name: string;
  abbreviation: string;
  wins: number;
  losses: number;
  ties: number;
  pct: string;
  logo?: string;
  isFalcons: boolean;
}

export default function StandingsTable() {
  const [standings, setStandings] = useState<TeamStanding[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStandings();
  }, []);

  async function fetchStandings() {
    try {
      const res = await fetch('/api/nfl-standings');
      if (res.ok) {
        const data = await res.json();
        setStandings(data.nfcSouth || []);
        localStorage.setItem('nfl-standings-cache', JSON.stringify(data));
      }
    } catch {
      const cached = localStorage.getItem('nfl-standings-cache');
      if (cached) {
        const data = JSON.parse(cached);
        setStandings(data.nfcSouth || []);
      }
    }
    setLoading(false);
  }

  if (loading) {
    return (
      <div className="rounded-xl p-4 animate-pulse" style={{ backgroundColor: 'var(--bg-surface)' }}>
        <div className="h-5 w-32 rounded mb-4" style={{ backgroundColor: 'var(--bg-card)' }} />
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-8 w-full rounded mb-2" style={{ backgroundColor: 'var(--bg-card)' }} />
        ))}
      </div>
    );
  }

  if (standings.length === 0) {
    return (
      <div className="rounded-xl p-4" style={{ backgroundColor: 'var(--bg-surface)' }}>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          Standings unavailable. Check back during the season.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl overflow-hidden" style={{ backgroundColor: 'var(--bg-surface)' }}>
      <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--border-color)' }}>
        <h3 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>
          NFC South Standings
        </h3>
      </div>

      {/* Header */}
      <div className="flex items-center px-4 py-2 text-xs font-bold" style={{ color: 'var(--text-muted)' }}>
        <span className="flex-1">Team</span>
        <span className="w-8 text-center">W</span>
        <span className="w-8 text-center">L</span>
        <span className="w-12 text-center">PCT</span>
      </div>

      {/* Teams */}
      {standings.map((team, index) => (
        <div
          key={team.abbreviation}
          className="flex items-center px-4 py-3"
          style={{
            backgroundColor: team.isFalcons ? 'rgba(var(--falcons-red-rgb, 168, 28, 28), 0.1)' : 'transparent',
            borderLeft: team.isFalcons ? '3px solid var(--falcons-red)' : '3px solid transparent',
          }}
        >
          <div className="flex-1 flex items-center gap-2">
            <span
              className="text-xs font-bold w-5 text-center"
              style={{ color: 'var(--text-muted)' }}
            >
              {index + 1}
            </span>
            <span
              className="font-semibold text-sm"
              style={{ color: team.isFalcons ? 'var(--falcons-red)' : 'var(--text-primary)' }}
            >
              {team.abbreviation}
            </span>
            <span className="text-xs truncate" style={{ color: 'var(--text-secondary)' }}>
              {team.name}
            </span>
          </div>
          <span className="w-8 text-center text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
            {team.wins}
          </span>
          <span className="w-8 text-center text-sm" style={{ color: 'var(--text-secondary)' }}>
            {team.losses}
          </span>
          <span className="w-12 text-center text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
            {team.pct}
          </span>
        </div>
      ))}
    </div>
  );
}
