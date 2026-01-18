'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';

const MedicationTracker = dynamic(() => import('@/components/info/MedicationTracker'), {
  ssr: false,
});
const AppointmentList = dynamic(() => import('@/components/info/AppointmentList'), {
  ssr: false,
});
const ContactList = dynamic(() => import('@/components/info/ContactList'), {
  ssr: false,
});
const CaseNumbers = dynamic(() => import('@/components/info/CaseNumbers'), {
  ssr: false,
});

type Tab = 'meds' | 'appointments' | 'contacts' | 'cases';

export default function InfoPage() {
  const [activeTab, setActiveTab] = useState<Tab>('meds');

  const tabs: { key: Tab; label: string; icon: string }[] = [
    { key: 'meds', label: 'Meds', icon: '💊' },
    { key: 'appointments', label: 'Appts', icon: '📅' },
    { key: 'contacts', label: 'People', icon: '👤' },
    { key: 'cases', label: 'Cases', icon: '📋' },
  ];

  return (
    <div className="py-4">
      <div className="px-4 mb-6">
        <h1 className="font-display text-2xl font-bold text-white">My Info</h1>
        <p className="text-sm text-falcons-silver mt-1">
          Track your medications, appointments, and contacts
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 px-4 mb-6 overflow-x-auto scrollbar-hide">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-4 py-3 rounded-card text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === tab.key
                ? 'bg-falcons-red text-white'
                : 'bg-bg-card text-falcons-silver hover:text-white'
            }`}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="px-4 pb-4">
        {activeTab === 'meds' && <MedicationTracker />}
        {activeTab === 'appointments' && <AppointmentList />}
        {activeTab === 'contacts' && <ContactList />}
        {activeTab === 'cases' && <CaseNumbers />}
      </div>
    </div>
  );
}
