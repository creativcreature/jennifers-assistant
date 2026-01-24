import { NextResponse } from 'next/server';

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

export async function GET() {
  try {
    const response = await fetch(
      'https://site.api.espn.com/apis/v2/sports/football/nfl/standings',
      { cache: 'no-store' }
    );

    if (!response.ok) {
      console.error('ESPN Standings API error:', response.status);
      return NextResponse.json({ nfcSouth: [] });
    }

    const data = await response.json();
    const nfcSouth: TeamStanding[] = [];

    // Navigate ESPN standings structure to find NFC South
    const children = data.children || [];
    for (const conference of children) {
      if (conference.name === 'National Football Conference' || conference.abbreviation === 'NFC') {
        const divisions = conference.children || [];
        for (const division of divisions) {
          if (division.name === 'NFC South' || (division.name || '').includes('South')) {
            const standings = division.standings?.entries || [];
            for (const entry of standings) {
              const team = entry.team || {};
              const stats = entry.stats || [];

              const winsObj = stats.find((s: any) => s.name === 'wins' || s.abbreviation === 'W');
              const lossesObj = stats.find((s: any) => s.name === 'losses' || s.abbreviation === 'L');
              const tiesObj = stats.find((s: any) => s.name === 'ties' || s.abbreviation === 'T');
              const pctObj = stats.find((s: any) => s.name === 'winPercent' || s.abbreviation === 'PCT');

              const teamName = team.displayName || team.name || '';

              nfcSouth.push({
                name: teamName,
                abbreviation: team.abbreviation || '',
                wins: winsObj?.value || 0,
                losses: lossesObj?.value || 0,
                ties: tiesObj?.value || 0,
                pct: pctObj?.displayValue || '.000',
                logo: team.logos?.[0]?.href || team.logo,
                isFalcons: teamName.includes('Falcons') || team.abbreviation === 'ATL',
              });
            }
          }
        }
      }
    }

    // Sort by win percentage descending
    nfcSouth.sort((a, b) => parseFloat(b.pct) - parseFloat(a.pct));

    return NextResponse.json({ nfcSouth });
  } catch (error) {
    console.error('NFL Standings error:', error);
    return NextResponse.json({ nfcSouth: [] });
  }
}
