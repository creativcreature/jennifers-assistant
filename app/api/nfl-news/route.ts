import { NextRequest, NextResponse } from 'next/server';

interface NewsArticle {
  id: string;
  title: string;
  description: string;
  content?: string;
  source: string;
  timestamp: string;
  imageUrl?: string;
  url?: string;
}

// ESPN API endpoints
const ESPN_API = {
  league: 'https://site.api.espn.com/apis/site/v2/sports/football/nfl/news',
  falcons: 'https://site.api.espn.com/apis/site/v2/sports/football/nfl/teams/1/news',
  college: 'https://site.api.espn.com/apis/site/v2/sports/football/college-football/news',
};

function parseRelativeTime(dateString: string): string {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  } catch {
    return 'Recently';
  }
}

async function fetchESPNApi(url: string): Promise<NewsArticle[]> {
  try {
    const response = await fetch(url, { cache: 'no-store' });
    if (!response.ok) {
      console.error(`ESPN API returned ${response.status} for ${url}`);
      return [];
    }
    const data = await response.json();
    const articles: NewsArticle[] = [];

    // Handle alternate ESPN response structures
    const rawArticles = data.articles || data.news || data.items || [];

    for (let i = 0; i < Math.min(rawArticles.length, 25); i++) {
      const article = rawArticles[i];
      const espnImage = article.images?.[0]?.url;
      const fallbackImage = FALLBACK_IMAGES[i % FALLBACK_IMAGES.length];

      articles.push({
        id: article.id || String(Math.random()),
        title: article.headline || article.title || 'NFL News',
        description: article.description || article.summary || '',
        source: 'ESPN',
        timestamp: parseRelativeTime(article.published || article.lastModified || new Date().toISOString()),
        imageUrl: espnImage || fallbackImage,
        url: article.links?.web?.href || article.link || `https://www.espn.com/nfl/story/_/id/${article.id}`,
      });
    }
    return articles;
  } catch (error) {
    console.error('ESPN API error for', url, ':', error);
    return [];
  }
}

// Reliable placeholder images (Unsplash - always works)
const PLACEHOLDER_IMAGES = {
  football: 'https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=800&q=80',
  stadium: 'https://images.unsplash.com/photo-1495809269252-a91f04d3b5e6?w=800&q=80',
  field: 'https://images.unsplash.com/photo-1508098682722-e99c643e7f0b?w=800&q=80',
  players: 'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=800&q=80',
  superbowl: 'https://images.unsplash.com/photo-1504450758481-7338bbe75c8e?w=800&q=80',
  trophy: 'https://images.unsplash.com/photo-1569517282132-25d22f4573e6?w=800&q=80',
  fantasy: 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=800&q=80',
  draft: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&q=80',
  falcons: 'https://images.unsplash.com/photo-1551958219-acbc608c6377?w=800&q=80',
};

// Fallback images pool for ESPN articles
const FALLBACK_IMAGES = [
  PLACEHOLDER_IMAGES.football,
  PLACEHOLDER_IMAGES.stadium,
  PLACEHOLDER_IMAGES.field,
  PLACEHOLDER_IMAGES.players,
];

// Curated content with full article text
const LEAGUE_CONTENT: NewsArticle[] = [
  {
    id: 'sb-preview',
    title: 'Super Bowl LX Preview: The Road to New Orleans',
    description: 'Everything you need to know about Super Bowl LX, including matchups, storylines, and predictions.',
    content: `<p>The road to Super Bowl LX culminates in New Orleans on February 8, 2026, as the NFL's two best teams battle for the Lombardi Trophy at the Caesars Superdome.</p>

<p><strong>The Venue</strong></p>
<p>The Caesars Superdome has hosted more Super Bowls than any other venue in NFL history. The iconic dome provides a perfect backdrop for the biggest game in American sports.</p>

<p><strong>Broadcast Information</strong></p>
<p>Super Bowl LX will air on FOX, with kickoff set for 6:30 PM ET. The game will also be available for streaming on the FOX Sports app and NFL+.</p>

<p><strong>Key Storylines to Watch</strong></p>
<ul>
<li>Which quarterback will rise to the occasion on the biggest stage?</li>
<li>How will the defenses adjust after two weeks of preparation?</li>
<li>Can the favorites handle the pressure, or will we see an upset?</li>
</ul>

<p>Stay tuned for complete coverage as we count down to the big game!</p>`,
    source: 'NFL.com',
    timestamp: 'Today',
    imageUrl: PLACEHOLDER_IMAGES.superbowl,
    url: 'https://www.nfl.com/super-bowl/',
  },
  {
    id: 'playoff-bracket',
    title: '2025-26 NFL Playoff Bracket: Track Every Game',
    description: 'Follow the complete playoff bracket as teams compete for a spot in Super Bowl LX.',
    content: `<p>The 2025-26 NFL playoffs are in full swing, with the league's best teams battling for the ultimate prize.</p>

<p><strong>AFC Bracket</strong></p>
<p>The AFC features some of the most talented quarterbacks in the game, all vying for a trip to New Orleans.</p>

<p><strong>NFC Bracket</strong></p>
<p>The NFC playoffs have delivered drama at every turn, with several close games and stunning upsets.</p>

<p><strong>Championship Weekend</strong></p>
<p>The Conference Championship games will determine who plays in Super Bowl LX. Both games promise to be epic showdowns between evenly matched teams.</p>

<p>Check the official NFL playoff bracket for the latest results and upcoming matchups.</p>`,
    source: 'NFL.com',
    timestamp: '1h ago',
    imageUrl: PLACEHOLDER_IMAGES.stadium,
    url: 'https://www.nfl.com/playoffs/2025/bracket',
  },
  {
    id: 'power-rankings',
    title: 'NFL Power Rankings: Playoff Edition',
    description: 'Where do the remaining playoff teams rank heading into championship weekend?',
    content: `<p>With the divisional round in the books, it's time to re-evaluate where each remaining team stands.</p>

<p><strong>The Favorites</strong></p>
<p>The top seeds have largely held serve, but the gap between the best teams is razor-thin. Any of the remaining teams could realistically win the Super Bowl.</p>

<p><strong>Rising Teams</strong></p>
<p>Several teams have exceeded expectations this postseason, riding hot streaks and opportunistic play deep into January.</p>

<p><strong>What to Watch</strong></p>
<p>Championship weekend will reveal which teams have what it takes to perform under the brightest lights. Execution, coaching adjustments, and clutch plays will determine who advances.</p>`,
    source: 'CBS Sports',
    timestamp: '2h ago',
    imageUrl: PLACEHOLDER_IMAGES.players,
    url: 'https://www.cbssports.com/nfl/news/nfl-power-rankings/',
  },
  {
    id: 'injury-report',
    title: 'Championship Weekend Injury Report',
    description: 'The latest injury updates for all four conference championship teams.',
    content: `<p>As teams prepare for the biggest games of the season, health is paramount. Here's the latest on key players dealing with injuries.</p>

<p><strong>AFC Championship</strong></p>
<p>Both teams are relatively healthy heading into Sunday, though a few key contributors are dealing with minor issues that bear monitoring.</p>

<p><strong>NFC Championship</strong></p>
<p>The NFC matchup features some injury concerns, with teams managing their star players carefully after a physical divisional round.</p>

<p><strong>Practice Reports</strong></p>
<p>Full practice participation is expected from most starters, but teams will be cautious with any players showing signs of wear.</p>`,
    source: 'Pro Football Talk',
    timestamp: '3h ago',
    imageUrl: PLACEHOLDER_IMAGES.field,
    url: 'https://profootballtalk.nbcsports.com/',
  },
  {
    id: 'betting-preview',
    title: 'Championship Weekend: Betting Preview and Analysis',
    description: 'Expert picks, spreads, and over/unders for both conference championship games.',
    content: `<p>The conference championships offer two compelling matchups for bettors. Here's our complete breakdown.</p>

<p><strong>Line Movement</strong></p>
<p>Early money has shifted the lines in both games, reflecting sharp action on specific sides.</p>

<p><strong>Key Numbers</strong></p>
<p>Three and seven remain the most important numbers in NFL betting. Understanding how these games might land relative to key numbers is crucial.</p>

<p><strong>Our Picks</strong></p>
<p>After analyzing matchups, trends, and situational factors, we lean toward the favorites in close games this weekend.</p>`,
    source: 'Yahoo Sports',
    timestamp: '4h ago',
    imageUrl: PLACEHOLDER_IMAGES.football,
    url: 'https://sports.yahoo.com/nfl/',
  },
];

const FANTASY_CONTENT: NewsArticle[] = [
  {
    id: 'dynasty-rankings',
    title: '2026 Dynasty Rankings: Top 50 Players',
    description: 'Our updated dynasty rankings heading into the offseason, featuring risers and fallers.',
    content: `<p>With the NFL season winding down, it's time to evaluate dynasty assets for the long haul.</p>

<p><strong>Tier 1: The Elite</strong></p>
<p>The top tier of dynasty assets features young players at premium positions who have already proven themselves as elite producers.</p>

<p><strong>Rising Stars</strong></p>
<p>Second and third-year players who broke out this season see significant bumps in our rankings. These are the players to acquire now before their price skyrockets.</p>

<p><strong>Sell High Candidates</strong></p>
<p>Some veterans may have peaked. Identifying the right time to sell aging assets is crucial for long-term dynasty success.</p>

<p><strong>Rookie Class Preview</strong></p>
<p>The 2026 rookie class looks promising, with several potential fantasy stars at running back and wide receiver.</p>`,
    source: 'FantasyPros',
    timestamp: 'Today',
    imageUrl: PLACEHOLDER_IMAGES.fantasy,
    url: 'https://www.fantasypros.com/nfl/rankings/dynasty-overall.php',
  },
  {
    id: 'draft-prospects',
    title: '2026 NFL Draft: Top Fantasy Prospects',
    description: 'Breaking down the college players who could make immediate fantasy impact.',
    content: `<p>The 2026 NFL Draft class is loaded with fantasy-relevant talent. Here are the prospects to know.</p>

<p><strong>Running Backs</strong></p>
<p>After several weak RB classes, 2026 offers multiple first-round caliber backs who can contribute immediately.</p>

<p><strong>Wide Receivers</strong></p>
<p>The receiver class is deep as usual, with several players profiling as alpha WR1 types at the next level.</p>

<p><strong>Tight Ends</strong></p>
<p>A few tight end prospects stand out as potential fantasy difference-makers, though the position typically requires patience.</p>

<p><strong>Quarterbacks</strong></p>
<p>Several quarterbacks could hear their names called in the first round, with landing spot determining their fantasy outlook.</p>`,
    source: 'ESPN Fantasy',
    timestamp: '2h ago',
    imageUrl: PLACEHOLDER_IMAGES.players,
    url: 'https://www.espn.com/fantasy/football/',
  },
  {
    id: 'keeper-strategy',
    title: 'Keeper League Strategy: Who to Keep, Who to Cut',
    description: 'Make the right keeper decisions to set yourself up for a championship run.',
    content: `<p>Keeper decisions can make or break your fantasy season before it even starts. Here's how to approach the tough calls.</p>

<p><strong>Value Over Replacement</strong></p>
<p>The key to keeper decisions is understanding the value you're getting relative to draft cost. A solid player in a late round often beats a star in the early rounds.</p>

<p><strong>Age and Trajectory</strong></p>
<p>Prioritize players entering their prime years. Running backs over 27 and receivers over 30 carry more risk.</p>

<p><strong>Roster Construction</strong></p>
<p>Consider how your keepers fit together. Balancing your roster with keepers at different positions prevents draft-day scrambles.</p>`,
    source: 'Yahoo Fantasy',
    timestamp: '4h ago',
    imageUrl: PLACEHOLDER_IMAGES.football,
    url: 'https://sports.yahoo.com/fantasy/',
  },
  {
    id: 'best-ball',
    title: 'Best Ball Strategy: Early Draft Targets',
    description: 'Get ahead of the competition with these undervalued best ball picks.',
    content: `<p>Best ball season is upon us, and early drafters have the chance to grab value before ADP adjusts.</p>

<p><strong>Late Round Gems</strong></p>
<p>Every championship best ball team needs late-round hits. These players are going undrafted but have league-winning upside.</p>

<p><strong>Zero RB Viability</strong></p>
<p>The zero RB strategy remains viable in best ball formats, allowing you to stack elite receivers while finding running back value late.</p>

<p><strong>Stacking Strategies</strong></p>
<p>QB-WR stacks from high-powered offenses provide the correlation needed to win best ball tournaments.</p>`,
    source: 'Underdog Fantasy',
    timestamp: '6h ago',
    imageUrl: PLACEHOLDER_IMAGES.stadium,
    url: 'https://underdogfantasy.com/',
  },
  {
    id: 'breakout-candidates',
    title: 'Breakout Candidates: Players Ready to Explode in 2026',
    description: 'These young players are primed for massive leaps next season.',
    content: `<p>Every year, several players make the jump from role players to fantasy stars. Here are our top breakout candidates for 2026.</p>

<p><strong>Second-Year Receivers</strong></p>
<p>The sophomore leap is real for receivers. Several 2025 rookies flashed enough to suggest stardom is coming.</p>

<p><strong>Running Back Opportunities</strong></p>
<p>Opportunity is everything for running backs. These players are in line for expanded roles due to free agency and depth chart changes.</p>

<p><strong>Quarterback Situations</strong></p>
<p>New offensive coordinators and improved supporting casts could unlock several quarterbacks who underperformed this season.</p>`,
    source: 'Dynasty Nerds',
    timestamp: '1d ago',
    imageUrl: PLACEHOLDER_IMAGES.field,
    url: 'https://dynastynerds.com/',
  },
];

const FALCONS_CONTENT: NewsArticle[] = [
  {
    id: 'season-review',
    title: 'Falcons 2025 Season Review: Building for the Future',
    description: 'A comprehensive look at Atlanta\'s season and what\'s next for the franchise.',
    content: `<p>The Atlanta Falcons' 2025 season is complete, and it's time to evaluate where the franchise stands.</p>

<p><strong>Offensive Highlights</strong></p>
<p>The Falcons' offense showed flashes of brilliance, led by their dynamic skill position players. Drake London continued his emergence as one of the league's premier receivers, while Bijan Robinson proved he's a true three-down back.</p>

<p><strong>Defensive Struggles</strong></p>
<p>The defense remains a work in progress, with inconsistent play in the secondary and a need for more pass rush. Addressing these issues will be a priority this offseason.</p>

<p><strong>Looking Ahead</strong></p>
<p>With cap space and draft capital, the Falcons are positioned to make significant improvements. The NFC South remains competitive, but Atlanta has the foundation for a playoff push in 2026.</p>`,
    source: 'ESPN',
    timestamp: 'Today',
    imageUrl: PLACEHOLDER_IMAGES.falcons,
    url: 'https://www.espn.com/nfl/team/_/name/atl/atlanta-falcons',
  },
  {
    id: 'drake-london',
    title: 'Drake London: The Making of an Elite Receiver',
    description: 'How the former first-round pick became one of the NFL\'s best wideouts.',
    content: `<p>Drake London has established himself as one of the premier receivers in football, and his best years are still ahead.</p>

<p><strong>The Physical Tools</strong></p>
<p>At 6'4" with exceptional body control, London wins contested catches at an elite rate. His catch radius and hands make him a quarterback's best friend in the red zone.</p>

<p><strong>Route Running Development</strong></p>
<p>London's route running has improved dramatically since entering the league. He now creates separation consistently, not just relying on his size to win.</p>

<p><strong>Leadership</strong></p>
<p>Beyond his on-field production, London has emerged as a leader in the locker room. His work ethic sets the standard for the entire receiving corps.</p>

<p><strong>What's Next</strong></p>
<p>With London locked in as the WR1, the Falcons' passing game has a true alpha to build around for years to come.</p>`,
    source: 'Falcons Wire',
    timestamp: '3h ago',
    imageUrl: PLACEHOLDER_IMAGES.players,
    url: 'https://falconswire.usatoday.com/',
  },
  {
    id: 'bijan-robinson',
    title: 'Bijan Robinson: A Star in the Making',
    description: 'The dynamic running back continues to dazzle and is poised for even more.',
    content: `<p>Bijan Robinson is everything the Falcons hoped for when they selected him in the first round, and he's only getting started.</p>

<p><strong>Versatility</strong></p>
<p>Robinson is a true three-down back who excels as a runner, receiver, and pass protector. His ability to stay on the field in all situations is rare for modern running backs.</p>

<p><strong>Big Play Ability</strong></p>
<p>With elite speed and vision, Robinson is a threat to score every time he touches the ball. His home run ability keeps defenses on their heels.</p>

<p><strong>Durability</strong></p>
<p>Robinson's frame allows him to handle a heavy workload while maintaining his effectiveness. The Falcons can lean on him without fear of wearing him down.</p>`,
    source: 'AJC',
    timestamp: '5h ago',
    imageUrl: PLACEHOLDER_IMAGES.football,
    url: 'https://www.ajc.com/sports/atlanta-falcons/',
  },
  {
    id: 'offseason-priorities',
    title: 'Falcons Offseason Blueprint: Draft and Free Agency',
    description: 'What Atlanta needs to do this offseason to take the next step.',
    content: `<p>The Falcons have a clear path to improvement this offseason. Here's the blueprint for building a contender.</p>

<p><strong>Draft Priorities</strong></p>
<ul>
<li>Edge Rusher: The pass rush needs a dynamic threat off the edge</li>
<li>Cornerback: Secondary depth is a must in the modern NFL</li>
<li>Offensive Line: Protecting the quarterback and opening holes for Robinson</li>
</ul>

<p><strong>Free Agency Targets</strong></p>
<p>With cap flexibility, the Falcons can pursue impact players at positions of need. A veteran pass rusher would immediately upgrade the defense.</p>

<p><strong>Re-Signing Priorities</strong></p>
<p>Keeping the core together is essential. The Falcons must prioritize extending their own homegrown talent.</p>`,
    source: 'Bleacher Report',
    timestamp: '1d ago',
    imageUrl: PLACEHOLDER_IMAGES.stadium,
    url: 'https://bleacherreport.com/atlanta-falcons',
  },
  {
    id: 'nfc-south-preview',
    title: 'NFC South 2026 Preview: Can Falcons Claim the Division?',
    description: 'Breaking down Atlanta\'s path to an NFC South title next season.',
    content: `<p>The NFC South is wide open heading into 2026. Here's how the Falcons stack up against their division rivals.</p>

<p><strong>Tampa Bay Buccaneers</strong></p>
<p>The Bucs remain competitive but face questions at quarterback and aging key contributors.</p>

<p><strong>New Orleans Saints</strong></p>
<p>New Orleans is in transition and may take a step back before moving forward.</p>

<p><strong>Carolina Panthers</strong></p>
<p>The Panthers are building for the future and remain a year or two away from contention.</p>

<p><strong>Falcons' Path</strong></p>
<p>With the division in flux, this is Atlanta's chance to establish themselves as the team to beat. The pieces are in place for a breakout season.</p>`,
    source: 'CBS Sports',
    timestamp: '2d ago',
    imageUrl: PLACEHOLDER_IMAGES.field,
    url: 'https://www.cbssports.com/nfl/teams/ATL/atlanta-falcons/',
  },
  {
    id: 'falcons-history',
    title: 'Falcons Legends: The Greatest Moments in Team History',
    description: 'Celebrating the iconic players and plays that define Falcons football.',
    content: `<p>The Atlanta Falcons have a rich history filled with legendary players and unforgettable moments.</p>

<p><strong>Julio Jones Era</strong></p>
<p>Julio Jones redefined what a receiver could be in Atlanta. His incredible athleticism and production made him a first-ballot Hall of Fame candidate.</p>

<p><strong>Michael Vick's Electric Runs</strong></p>
<p>No player changed games quite like Michael Vick. His ability to break contain and outrun entire defenses was unlike anything the league had seen.</p>

<p><strong>The 1998 NFC Championship</strong></p>
<p>The Falcons' first trip to the Super Bowl was clinched with a dominant performance against the Vikings, sending the Georgia Dome into a frenzy.</p>

<p><strong>Deion Sanders' Playmaking</strong></p>
<p>Prime Time brought swagger and elite play to Atlanta, cementing his legacy as one of the greatest defensive backs ever.</p>

<p><strong>Rise Up</strong></p>
<p>The Dirty Birds continue to inspire fans across the South. The best is yet to come!</p>`,
    source: 'NFL Throwback',
    timestamp: '3d ago',
    imageUrl: PLACEHOLDER_IMAGES.trophy,
    url: 'https://www.nfl.com/teams/atlanta-falcons/',
  },
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category') || 'league';
  const page = parseInt(searchParams.get('page') || '1');
  const limit = 15;
  const offset = (page - 1) * limit;

  let articles: NewsArticle[] = [];

  if (category === 'league') {
    const liveNews = await fetchESPNApi(ESPN_API.league);
    articles = [...liveNews, ...LEAGUE_CONTENT];
  } else if (category === 'fantasy') {
    const liveNews = await fetchESPNApi(ESPN_API.league);
    const collegeNews = await fetchESPNApi(ESPN_API.college);

    const fantasyRelevant = liveNews.filter(article => {
      const text = (article.title + article.description).toLowerCase();
      return text.includes('fantasy') || text.includes('injury') ||
             text.includes('rankings') || text.includes('touchdown') ||
             text.includes('yards') || text.includes('breakout');
    });

    const draftNews = collegeNews.slice(0, 5).map(article => ({
      ...article,
      title: `Draft Watch: ${article.title}`,
      source: 'College Football',
    }));

    articles = [...fantasyRelevant, ...draftNews, ...FANTASY_CONTENT];
  } else if (category === 'falcons') {
    const falconsNews = await fetchESPNApi(ESPN_API.falcons);
    const generalNews = await fetchESPNApi(ESPN_API.league);

    const falconsMentions = generalNews.filter(article => {
      const text = (article.title + article.description).toLowerCase();
      return text.includes('falcon') || text.includes('atlanta') ||
             text.includes('drake london') || text.includes('bijan robinson');
    });

    articles = [...falconsNews, ...falconsMentions, ...FALCONS_CONTENT];
  }

  // Remove duplicates
  const seen = new Set<string>();
  articles = articles.filter(a => {
    const key = a.title.toLowerCase().slice(0, 30);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  // Paginate
  const paginatedArticles = articles.slice(offset, offset + limit);
  const hasMore = offset + limit < articles.length;

  return NextResponse.json({
    articles: paginatedArticles,
    hasMore,
    total: articles.length,
    page,
  });
}
