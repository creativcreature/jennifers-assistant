import { NextResponse } from 'next/server';

interface Video {
  id: string;
  title: string;
  thumbnail: string;
  duration?: string;
  source: string;
  videoId: string;
}

// YouTube Data API is free up to 10,000 units/day
// Search costs 100 units, so we can do ~100 searches/day
// We'll cache results and use a mix of search + curated content

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

async function fetchYouTubeVideos(query: string): Promise<Video[]> {
  if (!YOUTUBE_API_KEY) {
    return [];
  }

  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&q=${encodeURIComponent(query)}&type=video&key=${YOUTUBE_API_KEY}`,
      { next: { revalidate: 3600 } } // Cache for 1 hour
    );

    if (!response.ok) {
      throw new Error('YouTube API request failed');
    }

    const data = await response.json();

    return data.items.map((item: any) => ({
      id: item.id.videoId,
      title: item.snippet.title,
      thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.medium?.url,
      source: item.snippet.channelTitle,
      videoId: item.id.videoId,
    }));
  } catch (error) {
    console.error('YouTube API error:', error);
    return [];
  }
}

// Curated NFL videos - popular highlights that work without API key
const CURATED_VIDEOS: Video[] = [
  {
    id: '1',
    title: 'NFL Playoffs 2025 - Best Moments So Far',
    thumbnail: 'https://i.ytimg.com/vi/QJHUbtR0yI8/maxresdefault.jpg',
    duration: '10:23',
    source: 'NFL',
    videoId: 'QJHUbtR0yI8',
  },
  {
    id: '2',
    title: 'Atlanta Falcons 2024 Season Highlights',
    thumbnail: 'https://i.ytimg.com/vi/8_TlZqJpgHI/maxresdefault.jpg',
    duration: '12:45',
    source: 'NFL',
    videoId: '8_TlZqJpgHI',
  },
  {
    id: '3',
    title: 'Bijan Robinson - Top Plays 2024',
    thumbnail: 'https://i.ytimg.com/vi/vg-AC-rLqXE/maxresdefault.jpg',
    duration: '8:30',
    source: 'NFL',
    videoId: 'vg-AC-rLqXE',
  },
  {
    id: '4',
    title: 'Drake London Incredible Catches',
    thumbnail: 'https://i.ytimg.com/vi/KqFwDFGPbWA/maxresdefault.jpg',
    duration: '6:15',
    source: 'NFL',
    videoId: 'KqFwDFGPbWA',
  },
  {
    id: '5',
    title: 'NFL Week 20 Highlights | 2024-2025',
    thumbnail: 'https://i.ytimg.com/vi/h9k3KPoEbqg/maxresdefault.jpg',
    duration: '15:00',
    source: 'NFL',
    videoId: 'h9k3KPoEbqg',
  },
  {
    id: '6',
    title: 'Top 10 Plays of the Divisional Round',
    thumbnail: 'https://i.ytimg.com/vi/ZkPHD6BsLX8/maxresdefault.jpg',
    duration: '7:42',
    source: 'NFL',
    videoId: 'ZkPHD6BsLX8',
  },
  {
    id: '7',
    title: 'Michael Vick - Greatest Falcons Moments',
    thumbnail: 'https://i.ytimg.com/vi/TRoO-Fy1E0k/maxresdefault.jpg',
    duration: '11:20',
    source: 'NFL Throwback',
    videoId: 'TRoO-Fy1E0k',
  },
  {
    id: '8',
    title: 'Julio Jones - Atlanta Falcons Legend',
    thumbnail: 'https://i.ytimg.com/vi/7YphF2NxQj4/maxresdefault.jpg',
    duration: '9:55',
    source: 'NFL Throwback',
    videoId: '7YphF2NxQj4',
  },
];

export async function GET() {
  let videos: Video[] = [];

  // Try to fetch fresh videos from YouTube API
  if (YOUTUBE_API_KEY) {
    const searchQueries = [
      'NFL playoffs 2025 highlights',
      'Atlanta Falcons highlights 2024',
    ];

    for (const query of searchQueries) {
      const results = await fetchYouTubeVideos(query);
      videos = [...videos, ...results];
    }
  }

  // If no API results, use curated videos
  if (videos.length === 0) {
    videos = CURATED_VIDEOS;
  }

  // Remove duplicates and limit
  const uniqueVideos = videos.filter(
    (video, index, self) => index === self.findIndex((v) => v.videoId === video.videoId)
  ).slice(0, 15);

  return NextResponse.json({ videos: uniqueVideos });
}
