import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');

  if (!url) {
    return NextResponse.json({ error: 'URL required' }, { status: 400 });
  }

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; JennifersAssistant/1.0)',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch article');
    }

    const html = await response.text();

    // Extract article content using simple parsing
    const title = extractMeta(html, 'og:title') || extractTitle(html);
    const description = extractMeta(html, 'og:description') || extractMeta(html, 'description');
    const imageUrl = extractMeta(html, 'og:image');
    const author = extractMeta(html, 'author') || extractMeta(html, 'article:author');
    const published = extractMeta(html, 'article:published_time') || extractMeta(html, 'pubdate');

    // Try to extract main article content
    let content = extractArticleContent(html);

    // Clean up content
    content = cleanHtml(content);

    return NextResponse.json({
      title,
      description,
      content: content || description || 'Full article content not available.',
      imageUrl,
      author,
      published: published ? formatDate(published) : undefined,
      source: extractDomain(url),
      url,
    });
  } catch (error) {
    console.error('Error fetching article:', error);
    return NextResponse.json(
      { error: 'Failed to fetch article' },
      { status: 500 }
    );
  }
}

function extractMeta(html: string, name: string): string | null {
  // Try og: prefix
  const ogMatch = html.match(new RegExp(`<meta[^>]*property=["']og:${name}["'][^>]*content=["']([^"']*)["']`, 'i')) ||
                  html.match(new RegExp(`<meta[^>]*content=["']([^"']*)["'][^>]*property=["']og:${name}["']`, 'i'));
  if (ogMatch) return ogMatch[1];

  // Try name attribute
  const nameMatch = html.match(new RegExp(`<meta[^>]*name=["']${name}["'][^>]*content=["']([^"']*)["']`, 'i')) ||
                    html.match(new RegExp(`<meta[^>]*content=["']([^"']*)["'][^>]*name=["']${name}["']`, 'i'));
  if (nameMatch) return nameMatch[1];

  return null;
}

function extractTitle(html: string): string {
  const match = html.match(/<title[^>]*>([^<]*)<\/title>/i);
  return match ? match[1].trim() : 'Article';
}

function extractArticleContent(html: string): string {
  // Try to find article body in common containers
  const patterns = [
    /<article[^>]*>([\s\S]*?)<\/article>/i,
    /<div[^>]*class="[^"]*article-body[^"]*"[^>]*>([\s\S]*?)<\/div>/i,
    /<div[^>]*class="[^"]*story-body[^"]*"[^>]*>([\s\S]*?)<\/div>/i,
    /<div[^>]*class="[^"]*content-body[^"]*"[^>]*>([\s\S]*?)<\/div>/i,
    /<div[^>]*class="[^"]*post-content[^"]*"[^>]*>([\s\S]*?)<\/div>/i,
    /<div[^>]*class="[^"]*entry-content[^"]*"[^>]*>([\s\S]*?)<\/div>/i,
  ];

  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match && match[1].length > 200) {
      return match[1];
    }
  }

  // Fall back to finding paragraphs
  const paragraphs = html.match(/<p[^>]*>[\s\S]*?<\/p>/gi) || [];
  const contentParagraphs = paragraphs
    .filter(p => p.length > 100) // Filter out short paragraphs
    .slice(0, 10); // Take first 10 paragraphs

  return contentParagraphs.join('\n');
}

function cleanHtml(html: string): string {
  return html
    // Remove scripts and styles
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    // Remove comments
    .replace(/<!--[\s\S]*?-->/g, '')
    // Remove certain tags but keep content
    .replace(/<\/?(?:span|div|section|figure|figcaption)[^>]*>/gi, '')
    // Clean up links - keep text
    .replace(/<a[^>]*>([^<]*)<\/a>/gi, '$1')
    // Keep paragraphs, headers, lists
    .replace(/<(p|h[1-6]|ul|ol|li|blockquote)[^>]*>/gi, '<$1>')
    // Remove other tags
    .replace(/<(?!\/?(p|h[1-6]|ul|ol|li|br|blockquote))[^>]+>/gi, '')
    // Clean up whitespace
    .replace(/\s+/g, ' ')
    .replace(/>\s+</g, '><')
    .trim();
}

function extractDomain(url: string): string {
  try {
    const domain = new URL(url).hostname.replace('www.', '');
    if (domain.includes('espn')) return 'ESPN';
    if (domain.includes('nfl')) return 'NFL.com';
    if (domain.includes('yahoo')) return 'Yahoo Sports';
    if (domain.includes('cbs')) return 'CBS Sports';
    return domain;
  } catch {
    return 'Source';
  }
}

function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
}
