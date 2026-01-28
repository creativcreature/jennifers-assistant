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
// Real NFL/Falcons videos that are embeddable
const FALLBACK_VIDEOS: Record<string, Video[]> = {
  nfl: [
    { id: 'EyZuZ0pmZTA', title: 'Top Plays of the 2025 Regular Season', thumbnail: 'https://img.youtube.com/vi/EyZuZ0pmZTA/hqdefault.jpg', source: 'NFL', videoId: 'EyZuZ0pmZTA' },
    { id: '8RR2j7RGUzI', title: "Raiders' Top 10 Plays from the 2025 NFL Season", thumbnail: 'https://img.youtube.com/vi/8RR2j7RGUzI/hqdefault.jpg', source: 'Las Vegas Raiders', videoId: '8RR2j7RGUzI' },
    { id: 'QXxCbN48UE8', title: '49ers vs Seahawks Divisional Highlights', thumbnail: 'https://img.youtube.com/vi/QXxCbN48UE8/hqdefault.jpg', source: 'NFL', videoId: 'QXxCbN48UE8' },
  ],
  falcons: [
    { id: '_ngIAV9QZXE', title: 'Bijan Robinson - Every Scrimmage Yard from 2025', thumbnail: 'https://img.youtube.com/vi/_ngIAV9QZXE/hqdefault.jpg', source: 'Atlanta Falcons', videoId: '_ngIAV9QZXE' },
    { id: 'o0TlQZJ561Y', title: 'Bijan Robinson Ultimate Highlights 2025', thumbnail: 'https://img.youtube.com/vi/o0TlQZJ561Y/hqdefault.jpg', source: 'Falcons Highlights', videoId: 'o0TlQZJ561Y' },
    { id: 'QQ-BsRPpfxA', title: 'Every Atlanta Falcons Sack from 2025 Season', thumbnail: 'https://img.youtube.com/vi/QQ-BsRPpfxA/hqdefault.jpg', source: 'Atlanta Falcons', videoId: 'QQ-BsRPpfxA' },
    { id: '06l_30fKC38', title: 'Rams vs Falcons Week 17 Highlights', thumbnail: 'https://img.youtube.com/vi/06l_30fKC38/hqdefault.jpg', source: 'NFL', videoId: '06l_30fKC38' },
    { id: 'T2FC4Q6qqv4', title: 'Bijan Robinson vs Saints Highlights', thumbnail: 'https://img.youtube.com/vi/T2FC4Q6qqv4/hqdefault.jpg', source: 'Atlanta Falcons', videoId: 'T2FC4Q6qqv4' },
    { id: '8AvXqeI9tyE', title: 'Bijan Robinson 2025 Season Highlights', thumbnail: 'https://img.youtube.com/vi/8AvXqeI9tyE/hqdefault.jpg', source: 'NFL', videoId: '8AvXqeI9tyE' },
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
