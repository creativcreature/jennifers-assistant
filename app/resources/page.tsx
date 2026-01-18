'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import { RESOURCES, Resource, sortResourcesByDistance } from '@/lib/resources';
import { useGeolocation } from '@/hooks/useGeolocation';
import ResourceCard from '@/components/resources/ResourceCard';

type ResourceType = 'all' | 'food' | 'healthcare' | 'services';

export default function ResourcesPage() {
  const [filter, setFilter] = useState<ResourceType>('food');
  const { location, loading: locationLoading, error: locationError, requestLocation } = useGeolocation();

  const filteredResources = useMemo(() => {
    let resources = RESOURCES.filter((r) => {
      if (filter === 'all') return true;
      return r.type === filter;
    });

    if (location) {
      resources = sortResourcesByDistance(resources, location.latitude, location.longitude);
    }

    return resources;
  }, [filter, location]);

  const tabs: { key: ResourceType; label: string; icon: string }[] = [
    { key: 'food', label: 'Food', icon: '🍎' },
    { key: 'healthcare', label: 'Health', icon: '🏥' },
    { key: 'services', label: 'Help', icon: '📋' },
    { key: 'all', label: 'All', icon: '📍' },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <div className="relative h-52 w-full overflow-hidden">
        <Image
          src="/images/falcons/team-action.jpg"
          alt="Atlanta Falcons team"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/70" />
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h1 className="font-display text-2xl font-bold text-white drop-shadow-lg">
            Atlanta Resources
          </h1>
          <p className="text-white/90 text-sm drop-shadow">
            Food, healthcare, and services near you
          </p>
        </div>
      </div>

      {/* Location Status */}
      <div className="px-4 py-4">
        {locationLoading && (
          <div className="card p-3 text-sm flex items-center gap-3">
            <div className="w-5 h-5 border-2 border-falcons-red border-t-transparent rounded-full animate-spin" />
            <span className="text-secondary">Finding your location...</span>
          </div>
        )}
        {location && (
          <div className="card p-3 text-sm flex items-center gap-3 border-success/30">
            <div className="w-8 h-8 rounded-full bg-success/20 flex items-center justify-center">
              <span>📍</span>
            </div>
            <span className="text-success font-medium">Showing nearest locations to you</span>
          </div>
        )}
        {locationError && !location && (
          <button
            onClick={requestLocation}
            className="card p-3 text-sm flex items-center gap-3 w-full text-left hover:border-warning/50 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-warning/20 flex items-center justify-center">
              <span>📍</span>
            </div>
            <span className="text-warning font-medium">Tap to enable location for nearby resources</span>
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 px-4 mb-4 overflow-x-auto scrollbar-hide py-1">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`flex items-center gap-2 px-5 py-3 rounded-card text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
              filter === tab.key
                ? 'text-white shadow-glow-sm'
                : 'text-secondary hover:text-primary'
            }`}
            style={{
              background: filter === tab.key
                ? 'linear-gradient(135deg, var(--falcons-red) 0%, var(--falcons-red-dark) 100%)'
                : 'var(--bg-surface)',
            }}
          >
            <span className="text-lg">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Quick Call Button */}
      <div className="px-4 mb-4">
        <a
          href="tel:211"
          className="btn-call w-full"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
            />
          </svg>
          Call 211 - Find Any Resource
        </a>
      </div>

      {/* Motivational Card with Player Image */}
      <div className="px-4 mb-4">
        <div className="card-elevated overflow-hidden">
          <div className="relative h-24">
            <Image
              src="/images/falcons/michael-vick.jpg"
              alt="Michael Vick"
              fill
              className="object-cover object-top"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent" />
            <div className="absolute inset-0 flex items-center p-4">
              <p className="text-white font-display text-lg">Keep pushing forward!</p>
            </div>
          </div>
        </div>
      </div>

      {/* Resources List */}
      <div className="space-y-3 px-4 pb-8">
        {filteredResources.length === 0 ? (
          <div className="card-elevated p-8 text-center animate-fade-in">
            <p className="text-secondary">
              No resources found for this category.
            </p>
          </div>
        ) : (
          filteredResources.map((resource, index) => (
            <div
              key={resource.id}
              className="animate-slide-up"
              style={{ animationDelay: `${index * 0.03}s` }}
            >
              <ResourceCard
                resource={resource as Resource & { distance?: number }}
                userLocation={location}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
