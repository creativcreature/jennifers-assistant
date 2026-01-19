'use client';

import { useState } from 'react';
import Image from 'next/image';

interface VideoPlayerProps {
  videoId: string;
  title: string;
  thumbnail?: string;
  onClose?: () => void;
}

export default function VideoPlayer({ videoId, title, thumbnail, onClose }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  if (!isPlaying) {
    return (
      <div className="relative w-full aspect-video rounded-xl overflow-hidden cursor-pointer group">
        {/* Thumbnail */}
        {thumbnail ? (
          <Image
            src={thumbnail}
            alt={title}
            fill
            className="object-cover"
            sizes="100vw"
          />
        ) : (
          <div className="w-full h-full bg-gray-800 flex items-center justify-center">
            <span className="text-white/50">No thumbnail</span>
          </div>
        )}

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors" />

        {/* Play Button */}
        <button
          onClick={() => setIsPlaying(true)}
          className="absolute inset-0 flex items-center justify-center"
        >
          <div className="w-20 h-20 rounded-full bg-falcons-red flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
            <svg className="w-10 h-10 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </button>

        {/* Title */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
          <h3 className="text-white font-semibold text-sm line-clamp-2">{title}</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black">
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-2 right-2 z-10 w-8 h-8 rounded-full bg-black/60 flex items-center justify-center"
        >
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
      <iframe
        width="100%"
        height="100%"
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="absolute inset-0"
      />
    </div>
  );
}
