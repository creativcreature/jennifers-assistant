'use client';

export interface BookmarkedVideo {
  type: 'video';
  id: string;
  title: string;
  thumbnail: string;
  source: string;
  videoId: string;
  savedAt: number;
}

export interface BookmarkedArticle {
  type: 'article';
  id: string;
  title: string;
  description: string;
  source: string;
  imageUrl?: string;
  url?: string;
  savedAt: number;
}

export type Bookmark = BookmarkedVideo | BookmarkedArticle;

const STORAGE_KEY = 'jennifer-bookmarks';

export function getBookmarks(): Bookmark[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function saveBookmark(bookmark: Bookmark): void {
  const bookmarks = getBookmarks();
  // Don't add duplicates
  if (bookmarks.some(b => b.id === bookmark.id && b.type === bookmark.type)) {
    return;
  }
  bookmarks.unshift(bookmark); // Add to beginning
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
  // Dispatch event for other components to update
  window.dispatchEvent(new CustomEvent('bookmarks-changed'));
}

export function removeBookmark(id: string, type: 'video' | 'article'): void {
  const bookmarks = getBookmarks();
  const filtered = bookmarks.filter(b => !(b.id === id && b.type === type));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  window.dispatchEvent(new CustomEvent('bookmarks-changed'));
}

export function isBookmarked(id: string, type: 'video' | 'article'): boolean {
  const bookmarks = getBookmarks();
  return bookmarks.some(b => b.id === id && b.type === type);
}

export function toggleBookmark(bookmark: Bookmark): boolean {
  if (isBookmarked(bookmark.id, bookmark.type)) {
    removeBookmark(bookmark.id, bookmark.type);
    return false;
  } else {
    saveBookmark(bookmark);
    return true;
  }
}
