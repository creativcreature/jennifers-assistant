'use client';

import { useState, useMemo } from 'react';
import { RESOURCES, Resource, sortResourcesByDistance } from '@/lib/resources';
import { useGeolocation } from '@/hooks/useGeolocation';
import ResourceCard from '@/components/resources/ResourceCard';

type ResourceType = 'all' | 'food' | 'healthcare' | 'services';

export default function ResourcesPage() {
  const [filter, setFilter] = useState<ResourceType>('food');
  const { location, loading: locationLoading, error: locationError, requestLocation } = useGeolocation();

  // Filter and sort resources by distance
  const filteredResources = useMemo(() => {
    let resources = RESOURCES.filter((r) => {
      if (filter === 'all') return true;
      return r.type === filter;
    });

    // Sort by distance if we have location
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
    <div className="py-4">
      <div className="px-4 mb-6">
        <h1 className="font-display text-2xl font-bold text-white">Resources</h1>
        <p className="text-sm text-falcons-silver mt-1">
          Food, healthcare, and services in Atlanta
        </p>
      </div>

      {/* Location Status */}
      <div className="px-4 mb-4">
        {locationLoading && (
          <div className="card p-3 text-sm text-falcons-silver flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-falcons-red border-t-transparent rounded-full animate-spin" />
            Finding your location...
          </div>
        )}
        {location && (
          <div className="card p-3 text-sm text-success flex items-center gap-2">
            <span>📍</span>
            Showing nearest locations to you
          </div>
        )}
        {locationError && !location && (
          <button
            onClick={requestLocation}
            className="card p-3 text-sm text-warning flex items-center gap-2 w-full text-left"
          >
            <span>📍</span>
            <span>Tap to enable location for nearby resources</span>
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 px-4 mb-6 overflow-x-auto scrollbar-hide">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`flex items-center gap-2 px-4 py-3 rounded-card text-sm font-medium whitespace-nowrap transition-colors ${
              filter === tab.key
                ? 'bg-falcons-red text-white'
                : 'bg-bg-card text-falcons-silver hover:text-white'
            }`}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Quick Call Buttons */}
      <div className="px-4 mb-6">
        <div className="card p-4">
          <h2 className="font-semibold text-white mb-3">Quick Help</h2>
          <div className="flex flex-col gap-3">
            <a
              href="tel:211"
              className="btn-call"
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
        </div>
      </div>

      {/* Resources List */}
      <div className="space-y-4 px-4 pb-4">
        {filteredResources.length === 0 ? (
          <div className="text-center py-8 text-falcons-silver">
            No resources found for this category.
          </div>
        ) : (
          filteredResources.map((resource) => (
            <ResourceCard
              key={resource.id}
              resource={resource as Resource & { distance?: number }}
              userLocation={location}
            />
          ))
        )}
      </div>
    </div>
  );
}
