import { NextResponse } from 'next/server';

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

export async function GET() {
  try {
    const response = await fetch(
      'https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard',
      { cache: 'no-store' }
    );

    if (!response.ok) {
      console.error('ESPN Scoreboard API error:', response.status);
      return NextResponse.json({ games: [], week: '' });
    }

    const data = await response.json();
    const games: GameScore[] = [];

    const week = data.week?.number ? `Week ${data.week.number}` : data.season?.type?.name || '';

    if (data.events) {
      for (const event of data.events) {
        const competition = event.competitions?.[0];
        if (!competition) continue;

        const homeCompetitor = competition.competitors?.find((c: any) => c.homeAway === 'home');
        const awayCompetitor = competition.competitors?.find((c: any) => c.homeAway === 'away');

        if (!homeCompetitor || !awayCompetitor) continue;

        const statusType = competition.status?.type?.name || event.status?.type?.name;
        let status: GameScore['status'] = 'scheduled';
        if (statusType === 'STATUS_FINAL' || statusType === 'STATUS_FINAL_OVERTIME') {
          status = 'final';
        } else if (statusType === 'STATUS_IN_PROGRESS' || statusType === 'STATUS_HALFTIME' || statusType === 'STATUS_END_PERIOD') {
          status = 'in_progress';
        }

        const statusDetail = competition.status?.type?.shortDetail || event.status?.type?.shortDetail || '';

        const homeName = homeCompetitor.team?.displayName || homeCompetitor.team?.name || '';
        const awayName = awayCompetitor.team?.displayName || awayCompetitor.team?.name || '';

        const isFalconsGame = homeName.includes('Falcons') || awayName.includes('Falcons');

        games.push({
          id: event.id,
          status,
          statusDetail,
          homeTeam: {
            name: homeName,
            abbreviation: homeCompetitor.team?.abbreviation || '',
            score: parseInt(homeCompetitor.score) || 0,
            logo: homeCompetitor.team?.logo,
          },
          awayTeam: {
            name: awayName,
            abbreviation: awayCompetitor.team?.abbreviation || '',
            score: parseInt(awayCompetitor.score) || 0,
            logo: awayCompetitor.team?.logo,
          },
          startTime: event.date || competition.date || '',
          broadcast: competition.broadcasts?.[0]?.names?.[0] || '',
          isFalconsGame,
        });
      }
    }

    return NextResponse.json({ games, week });
  } catch (error) {
    console.error('NFL Scores error:', error);
    return NextResponse.json({ games: [], week: '' });
  }
}
