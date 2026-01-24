'use client';

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

export default function ScoreCard({ game }: { game: GameScore }) {
  const statusColor = game.status === 'in_progress' ? 'var(--falcons-red)' : 'var(--text-muted)';

  return (
    <div
      className="rounded-xl p-4"
      style={{
        backgroundColor: 'var(--bg-surface)',
        border: game.isFalconsGame ? '2px solid var(--falcons-red)' : '1px solid var(--border-color)',
      }}
    >
      {/* Status */}
      <div className="flex items-center justify-between mb-3">
        <span
          className="text-xs font-bold uppercase tracking-wide"
          style={{ color: statusColor }}
        >
          {game.status === 'in_progress' && (
            <span className="inline-block w-2 h-2 bg-red-500 rounded-full mr-1 animate-pulse" />
          )}
          {game.statusDetail || (game.status === 'scheduled' ? formatTime(game.startTime) : game.status.toUpperCase())}
        </span>
        {game.broadcast && game.status === 'scheduled' && (
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{game.broadcast}</span>
        )}
        {game.isFalconsGame && (
          <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-falcons-red text-white">ATL</span>
        )}
      </div>

      {/* Teams & Scores */}
      <div className="space-y-2">
        <TeamRow
          abbreviation={game.awayTeam.abbreviation}
          name={game.awayTeam.name}
          score={game.awayTeam.score}
          isWinning={game.awayTeam.score > game.homeTeam.score}
          showScore={game.status !== 'scheduled'}
          isFalcons={game.awayTeam.name.includes('Falcons')}
        />
        <TeamRow
          abbreviation={game.homeTeam.abbreviation}
          name={game.homeTeam.name}
          score={game.homeTeam.score}
          isWinning={game.homeTeam.score > game.awayTeam.score}
          showScore={game.status !== 'scheduled'}
          isFalcons={game.homeTeam.name.includes('Falcons')}
        />
      </div>
    </div>
  );
}

function TeamRow({ abbreviation, name, score, isWinning, showScore, isFalcons }: {
  abbreviation: string;
  name: string;
  score: number;
  isWinning: boolean;
  showScore: boolean;
  isFalcons: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span
          className="font-bold text-sm w-8"
          style={{ color: isFalcons ? 'var(--falcons-red)' : 'var(--text-primary)' }}
        >
          {abbreviation}
        </span>
        <span
          className="text-sm truncate max-w-[160px]"
          style={{ color: 'var(--text-secondary)' }}
        >
          {name}
        </span>
      </div>
      {showScore && (
        <span
          className="font-display text-2xl font-bold"
          style={{ color: isWinning ? 'var(--text-primary)' : 'var(--text-muted)' }}
        >
          {score}
        </span>
      )}
    </div>
  );
}

function formatTime(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  } catch {
    return '';
  }
}
