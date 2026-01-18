'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';

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
    <div className="flex flex-col">
      {/* Hero Section */}
      <div className="relative h-52 w-full overflow-hidden">
        <Image
          src="/images/falcons/michael-vick.jpg"
          alt="Michael Vick"
          fill
          className="object-cover object-top"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/70" />
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h1 className="font-display text-2xl font-bold text-white drop-shadow-lg">
            My Info
          </h1>
          <p className="text-white/90 text-sm drop-shadow">
            Track medications, appointments, and contacts
          </p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 px-4 py-4 overflow-x-auto scrollbar-hide">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-5 py-3 rounded-card text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
              activeTab === tab.key
                ? 'text-white shadow-glow-sm'
                : 'text-secondary hover:text-primary'
            }`}
            style={{
              background: activeTab === tab.key
                ? 'linear-gradient(135deg, var(--falcons-red) 0%, var(--falcons-red-dark) 100%)'
                : 'var(--bg-surface)',
            }}
          >
            <span className="text-lg">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Falcons Fan Card */}
      <div className="px-4 mb-4">
        <div className="card-elevated overflow-hidden">
          <div className="relative h-20">
            <Image
              src="/images/falcons/drake-london.webp"
              alt="Drake London"
              fill
              className="object-cover"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent" />
            <div className="absolute inset-0 flex items-center p-4">
              <p className="text-white font-display">Stay organized, stay strong!</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="px-4 pb-8 animate-fade-in" key={activeTab}>
        {activeTab === 'meds' && <MedicationTracker />}
        {activeTab === 'appointments' && <AppointmentList />}
        {activeTab === 'contacts' && <ContactList />}
        {activeTab === 'cases' && <CaseNumbers />}
      </div>
    </div>
  );
}
