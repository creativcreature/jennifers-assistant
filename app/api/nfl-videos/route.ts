import { NextResponse } from 'next/server';

interface Video {
  id: string;
  title: string;
  thumbnail: string;
  duration?: string;
  source: string;
  videoId: string;
}

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

async function fetchYouTubeVideos(query: string, maxResults: number = 10): Promise<Video[]> {
  if (!YOUTUBE_API_KEY) {
    console.log('No YouTube API key configured');
    return [];
  }

  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=${maxResults}&q=${encodeURIComponent(query)}&type=video&videoEmbeddable=true&order=date&key=${YOUTUBE_API_KEY}`,
      { next: { revalidate: 1800 } } // Cache for 30 minutes
    );

    if (!response.ok) {
      const error = await response.text();
      console.error('YouTube API error:', error);
      return [];
    }

    const data = await response.json();

    if (!data.items || data.items.length === 0) {
      return [];
    }

    return data.items.map((item: any) => ({
      id: item.id.videoId,
      title: item.snippet.title.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'"),
      thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.medium?.url || item.snippet.thumbnails.default?.url,
      source: item.snippet.channelTitle,
      videoId: item.id.videoId,
    }));
  } catch (error) {
    console.error('YouTube API error:', error);
    return [];
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const filter = searchParams.get('filter') || 'nfl';

  let videos: Video[] = [];

  // Blocked channels (official NFL channels that don't allow embedding)
  const blockedChannels = [
    'NFL',
    'NFL Films',
    'NFL Network',
    'Atlanta Falcons',
    'ESPN',
    'FOX Sports',
    'CBS Sports',
    'NBC Sports'
  ];

  // Fetch from YouTube API based on filter
  if (filter === 'falcons') {
    // Falcons-specific searches - target fan channels
    const queries = [
      'Bijan Robinson highlights compilation',
      'Atlanta Falcons fan highlights 2024',
      'Falcons best plays compilation',
      'Drake London highlights 2024'
    ];

    for (const query of queries) {
      const results = await fetchYouTubeVideos(query, 8);
      // Filter out official channels
      const filtered = results.filter(v =>
        !blockedChannels.some(ch => v.source.toLowerCase().includes(ch.toLowerCase()))
      );
      videos = [...videos, ...filtered];
      if (videos.length >= 10) break;
    }
  } else {
    // NFL-wide searches - target fan highlight channels
    const queries = [
      'NFL highlights compilation 2024',
      'best NFL plays fan edit',
      'NFL top plays compilation',
      'football highlights hype 2024',
      'NFL season highlights fan'
    ];

    for (const query of queries) {
      const results = await fetchYouTubeVideos(query, 8);
      // Filter out official channels
      const filtered = results.filter(v =>
        !blockedChannels.some(ch => v.source.toLowerCase().includes(ch.toLowerCase()))
      );
      videos = [...videos, ...filtered];
      if (videos.length >= 12) break;
    }
  }

  // Remove duplicates by videoId
  const uniqueVideos = videos.filter(
    (video, index, self) => index === self.findIndex((v) => v.videoId === video.videoId)
  ).slice(0, 12);

  return NextResponse.json({
    videos: uniqueVideos,
    filter,
    source: uniqueVideos.length > 0 ? 'youtube' : 'none'
  });
}
