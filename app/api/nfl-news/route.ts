import { NextRequest, NextResponse } from 'next/server';

interface NewsArticle {
  id: string;
  title: string;
  description: string;
  source: string;
  timestamp: string;
  imageUrl?: string;
  url?: string;
}

// ESPN RSS feed URLs
const RSS_FEEDS = {
  league: 'https://www.espn.com/espn/rss/nfl/news',
  fantasy: 'https://www.espn.com/espn/rss/fantasy/news',
  falcons: 'https://www.espn.com/blog/feed?blog=atlantafalcons',
};

// Backup: Use ESPN API endpoints
const ESPN_API = {
  league: 'https://site.api.espn.com/apis/site/v2/sports/football/nfl/news',
  falcons: 'https://site.api.espn.com/apis/site/v2/sports/football/nfl/teams/1/news',
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

async function fetchESPNApi(category: string): Promise<NewsArticle[]> {
  try {
    let url = ESPN_API.league;
    if (category === 'falcons') {
      url = ESPN_API.falcons;
    }

    const response = await fetch(url, {
      next: { revalidate: 60 }, // Cache for 1 minute for fresh news
    });

    if (!response.ok) {
      throw new Error('ESPN API request failed');
    }

    const data = await response.json();
    const articles: NewsArticle[] = [];

    if (data.articles) {
      for (const article of data.articles.slice(0, 15)) {
        // For fantasy tab, filter for fantasy-relevant content
        if (category === 'fantasy') {
          const isFantasyRelevant =
            article.headline?.toLowerCase().includes('fantasy') ||
            article.headline?.toLowerCase().includes('injury') ||
            article.headline?.toLowerCase().includes('start') ||
            article.headline?.toLowerCase().includes('sit') ||
            article.headline?.toLowerCase().includes('waiver') ||
            article.headline?.toLowerCase().includes('rankings') ||
            article.headline?.toLowerCase().includes('touchdown') ||
            article.headline?.toLowerCase().includes('yards') ||
            article.description?.toLowerCase().includes('fantasy');

          if (!isFantasyRelevant) continue;
        }

        articles.push({
          id: article.id || String(Math.random()),
          title: article.headline || 'NFL News',
          description: article.description || '',
          source: 'ESPN',
          timestamp: parseRelativeTime(article.published || new Date().toISOString()),
          imageUrl: article.images?.[0]?.url,
          url: article.links?.web?.href || article.link,
        });
      }
    }

    return articles;
  } catch (error) {
    console.error('ESPN API error:', error);
    return [];
  }
}

async function fetchRSS(category: string): Promise<NewsArticle[]> {
  try {
    const feedUrl = RSS_FEEDS[category as keyof typeof RSS_FEEDS] || RSS_FEEDS.league;
    const response = await fetch(feedUrl, {
      next: { revalidate: 60 }, // Cache for 1 minute
    });

    if (!response.ok) {
      throw new Error('RSS fetch failed');
    }

    const text = await response.text();
    const articles: NewsArticle[] = [];

    // Simple XML parsing for RSS
    const itemMatches = text.match(/<item>([\s\S]*?)<\/item>/g) || [];

    for (const item of itemMatches.slice(0, 15)) {
      const title = item.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/)?.[1] ||
                    item.match(/<title>(.*?)<\/title>/)?.[1] || '';
      const description = item.match(/<description><!\[CDATA\[(.*?)\]\]><\/description>/)?.[1] ||
                          item.match(/<description>(.*?)<\/description>/)?.[1] || '';
      const link = item.match(/<link>(.*?)<\/link>/)?.[1] || '';
      const pubDate = item.match(/<pubDate>(.*?)<\/pubDate>/)?.[1] || '';
      const imageMatch = item.match(/<media:content[^>]*url="([^"]*)"/) ||
                         item.match(/<enclosure[^>]*url="([^"]*)"/) ||
                         description.match(/src="([^"]*\.(?:jpg|jpeg|png|webp))"/i);

      if (title) {
        articles.push({
          id: String(Math.random()),
          title: title.replace(/<[^>]*>/g, ''),
          description: description.replace(/<[^>]*>/g, '').slice(0, 200),
          source: 'ESPN',
          timestamp: parseRelativeTime(pubDate),
          imageUrl: imageMatch?.[1],
          url: link,
        });
      }
    }

    return articles;
  } catch (error) {
    console.error('RSS fetch error:', error);
    return [];
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category') || 'league';

  // Try ESPN API first, fall back to RSS
  let articles = await fetchESPNApi(category);

  if (articles.length === 0) {
    articles = await fetchRSS(category);
  }

  // If still no articles, return some fallback playoff news
  if (articles.length === 0) {
    articles = [
      {
        id: '1',
        title: 'NFL Playoffs Heating Up',
        description: 'The road to Super Bowl LIX continues as teams battle for the championship.',
        source: 'NFL',
        timestamp: 'Today',
        url: 'https://www.nfl.com/playoffs',
      },
      {
        id: '2',
        title: 'Super Bowl LIX Coming to New Orleans',
        description: 'The biggest game of the year will be held February 9, 2025 at the Caesars Superdome.',
        source: 'NFL',
        timestamp: 'Today',
        url: 'https://www.nfl.com/super-bowl',
      },
    ];
  }

  return NextResponse.json({ articles });
}
