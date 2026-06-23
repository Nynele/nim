import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query');
    const playlistIdParam = searchParams.get('playlistId');
    
    let playlistId = playlistIdParam;
    
    if (!playlistId && query) {
      playlistId = await searchPlaylistId(query);
    }
    
    if (!playlistId) {
      return NextResponse.json({ error: 'Playlist ID or query not provided/resolved' }, { status: 400 });
    }
    
    const tracks = await fetchAndParsePlaylist(playlistId);
    if (!tracks) {
      return NextResponse.json({ error: 'Failed to retrieve tracks from YouTube playlist' }, { status: 500 });
    }
    
    return NextResponse.json({ playlistId, tracks });
  } catch (err: any) {
    console.error("Playlist API Route error:", err);
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}

async function searchPlaylistId(query: string): Promise<string | null> {
  const url = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}&sp=EgIQAw%253D%253D`;
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept-Language': 'en-US,en;q=0.9'
    }
  });
  
  if (!res.ok) return null;
  const html = await res.text();
  const match = html.match(/ytInitialData\s*=\s*({.+?});/);
  if (!match) return null;
  const data = JSON.parse(match[1]);
  
  const contents = data.contents?.twoColumnSearchResultsRenderer?.primaryContents?.sectionListRenderer?.contents?.[0]?.itemSectionRenderer?.contents;
  if (!contents || !Array.isArray(contents)) return null;
  
  for (const item of contents) {
    if (item.playlistRenderer) {
      return item.playlistRenderer.playlistId;
    } else if (item.lockupViewModel && item.lockupViewModel.contentType === 'LOCKUP_CONTENT_TYPE_PLAYLIST') {
      return item.lockupViewModel.contentId;
    }
  }
  return null;
}

async function fetchAndParsePlaylist(playlistId: string) {
  const url = `https://www.youtube.com/playlist?list=${playlistId}`;
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept-Language': 'en-US,en;q=0.9'
    }
  });
  
  if (!res.ok) return null;
  const html = await res.text();
  const match = html.match(/ytInitialData\s*=\s*({.+?});/);
  if (!match) return null;
  const data = JSON.parse(match[1]);
  
  const contents = data.contents?.twoColumnBrowseResultsRenderer?.tabs?.[0]?.tabRenderer?.content?.sectionListRenderer?.contents?.[0]?.itemSectionRenderer?.contents;
  if (!contents || !Array.isArray(contents)) return null;
  
  const tracks = [];
  for (const item of contents) {
    if (item.playlistVideoRenderer) {
      const v = item.playlistVideoRenderer;
      tracks.push({
        id: v.videoId,
        title: v.title?.runs?.[0]?.text || 'Unknown Title',
        artist: v.shortBylineText?.runs?.[0]?.text || 'Unknown Artist',
        url: '',
        youtubeVideoId: v.videoId
      });
    } else if (item.lockupViewModel) {
      const model = item.lockupViewModel;
      const metaModel = model.metadata?.lockupMetadataViewModel;
      const videoId = model.contentId;
      const title = metaModel?.title?.content || 'Unknown Title';
      const author = metaModel?.metadata?.contentMetadataViewModel?.metadataRows?.[0]?.metadataParts?.[0]?.text?.content || 'Unknown Artist';
      
      if (videoId) {
        tracks.push({
          id: videoId,
          title: title,
          artist: author,
          url: '',
          youtubeVideoId: videoId
        });
      }
    }
  }
  return tracks;
}
