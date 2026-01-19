'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';

interface ArticleData {
  title: string;
  description: string;
  content: string;
  imageUrl?: string;
  source: string;
  author?: string;
  published?: string;
  url: string;
}

function ArticleContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [article, setArticle] = useState<ArticleData | null>(null);
  const [loading, setLoading] = useState(true);

  const url = searchParams.get('url');
  const title = searchParams.get('title');
  const description = searchParams.get('description');
  const imageUrl = searchParams.get('image');
  const source = searchParams.get('source');

  useEffect(() => {
    if (url) {
      fetchArticle(url);
    } else {
      setLoading(false);
    }
  }, [url]);

  async function fetchArticle(articleUrl: string) {
    setLoading(true);
    try {
      const response = await fetch(`/api/fetch-article?url=${encodeURIComponent(articleUrl)}`);
      if (response.ok) {
        const data = await response.json();
        setArticle(data);
      } else {
        // Fall back to passed params
        setArticle({
          title: title || 'Article',
          description: description || '',
          content: description || 'Unable to load full article. Tap "Read Full Article" below to view on the source website.',
          imageUrl: imageUrl || undefined,
          source: source || 'ESPN',
          url: articleUrl,
        });
      }
    } catch (error) {
      console.error('Error fetching article:', error);
      setArticle({
        title: title || 'Article',
        description: description || '',
        content: description || 'Unable to load full article. Tap "Read Full Article" below to view on the source website.',
        imageUrl: imageUrl || undefined,
        source: source || 'ESPN',
        url: articleUrl,
      });
    }
    setLoading(false);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-falcons-red border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="p-4 text-center">
        <p style={{ color: 'var(--text-secondary)' }}>Article not found</p>
        <button
          onClick={() => router.back()}
          className="mt-4 text-falcons-red font-semibold"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {/* Back Button */}
      <div className="sticky top-0 z-10 p-4" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm font-medium"
          style={{ color: 'var(--text-secondary)' }}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to NFL News
        </button>
      </div>

      {/* Article Image */}
      {article.imageUrl && (
        <div className="relative h-56 w-full">
          <Image
            src={article.imageUrl}
            alt={article.title}
            fill
            className="object-cover"
            sizes="100vw"
          />
        </div>
      )}

      {/* Article Content */}
      <div className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <span
            className="text-xs font-semibold px-2 py-1 rounded"
            style={{ backgroundColor: 'var(--falcons-red)', color: 'white' }}
          >
            {article.source}
          </span>
          {article.published && (
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
              {article.published}
            </span>
          )}
        </div>

        <h1
          className="font-display text-2xl font-bold mb-4"
          style={{ color: 'var(--text-primary)' }}
        >
          {article.title}
        </h1>

        {article.author && (
          <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>
            By {article.author}
          </p>
        )}

        <div
          className="text-base leading-relaxed space-y-4 article-content"
          style={{ color: 'var(--text-secondary)' }}
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

        {/* Read Full Article Button */}
        <div className="mt-6 pt-4 border-t" style={{ borderColor: 'var(--border-color)' }}>
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
          >
            Read Full Article on {article.source}
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}

export default function ArticlePage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-falcons-red border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <ArticleContent />
    </Suspense>
  );
}
