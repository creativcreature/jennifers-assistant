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

// Fallback videos for when API quota is exhausted or returns empty
const FALLBACK_VIDEOS: Record<string, Video[]> = {
  nfl: [
    { id: 'dQw4w9WgXcQ', title: 'NFL 2025 Season - Best Plays & Highlights', thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg', source: 'NFL Highlights', videoId: 'dQw4w9WgXcQ' },
    { id: 'jNQXAC9IVRw', title: 'Top 10 NFL Catches of the Season', thumbnail: 'https://img.youtube.com/vi/jNQXAC9IVRw/hqdefault.jpg', source: 'Football Films', videoId: 'jNQXAC9IVRw' },
  ],
  falcons: [
    { id: 'dQw4w9WgXcQ', title: 'Atlanta Falcons 2025 Season Highlights', thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg', source: 'Falcons Fan TV', videoId: 'dQw4w9WgXcQ' },
    { id: 'jNQXAC9IVRw', title: 'Bijan Robinson Best Runs - Falcons RB', thumbnail: 'https://img.youtube.com/vi/jNQXAC9IVRw/hqdefault.jpg', source: 'ATL Football', videoId: 'jNQXAC9IVRw' },
  ],
};

async function fetchYouTubeVideos(query: string, maxResults: number = 10): Promise<Video[]> {
  if (!YOUTUBE_API_KEY) {
    console.log('No YouTube API key configured');
    return [];
  }

  try {
    // Only get videos from the last 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    const publishedAfter = sixMonthsAgo.toISOString();

    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=${maxResults}&q=${encodeURIComponent(query)}&type=video&videoEmbeddable=true&order=relevance&publishedAfter=${publishedAfter}&key=${YOUTUBE_API_KEY}`,
      { next: { revalidate: 7200 } } // Cache for 2 hours
    );

    if (!response.ok) {
      const error = await response.text();
      console.error('YouTube API error:', response.status, error);
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

  // Only block channels that truly don't allow embedding
  const blockedChannels = ['NFL', 'NFL Network'];

  let videos: Video[] = [];

  // Use only 2 queries to conserve API quota
  if (filter === 'falcons') {
    const results = await fetchYouTubeVideos('Atlanta Falcons highlights 2025', 12);
    videos = results.filter(v =>
      !blockedChannels.some(ch => v.source === ch)
    );
  } else {
    const results = await fetchYouTubeVideos('NFL highlights 2025 best plays', 12);
    videos = results.filter(v =>
      !blockedChannels.some(ch => v.source === ch)
    );
  }

  // Remove duplicates by videoId
  const uniqueVideos = videos.filter(
    (video, index, self) => index === self.findIndex((v) => v.videoId === video.videoId)
  ).slice(0, 12);

  // Use fallback if no results from API
  const finalVideos = uniqueVideos.length > 0 ? uniqueVideos : (FALLBACK_VIDEOS[filter] || FALLBACK_VIDEOS.nfl);

  return NextResponse.json({
    videos: finalVideos,
    filter,
    source: uniqueVideos.length > 0 ? 'youtube' : 'fallback'
  });
}
