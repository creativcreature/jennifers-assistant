import Dexie, { type EntityTable } from 'dexie';

// Types
export interface Message {
  id?: number;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  synced: boolean;
}

export interface Action {
  id: string;
  title: string;
  description: string;
  phone?: string;
  script?: string;
  bringList?: string[];
  status: 'pending' | 'done' | 'skipped';
  completedAt?: Date;
  notes?: string;
  priority: number;
}

export interface Medication {
  id?: number;
  name: string;
  dose: string;
  frequency: string;
  notes?: string;
}

export interface Appointment {
  id?: number;
  title: string;
  date: Date;
  time: string;
  location: string;
  phone?: string;
  bringList?: string[];
  notes?: string;
}

export interface Contact {
  id?: number;
  name: string;
  role: string;
  phone: string;
  organization?: string;
  notes?: string;
}

export interface CaseNumber {
  id?: number;
  type: string;
  number: string;
  notes?: string;
}

export interface UserProfile {
  id: number;
  name: string;
  onboardingComplete: boolean;
  hasSOARWorker: boolean | null;
  hasAppliedSSI: boolean | null;
  hasGradyCard: boolean | null;
  hasSNAP: boolean | null;
  documents: {
    id: boolean;
    ssnCard: boolean;
    birthCert: boolean;
    shelterLetter: boolean;
  };
}

// Database class
class JennifersAssistantDB extends Dexie {
  messages!: EntityTable<Message, 'id'>;
  actions!: EntityTable<Action, 'id'>;
  medications!: EntityTable<Medication, 'id'>;
  appointments!: EntityTable<Appointment, 'id'>;
  contacts!: EntityTable<Contact, 'id'>;
  caseNumbers!: EntityTable<CaseNumber, 'id'>;
  profile!: EntityTable<UserProfile, 'id'>;

  constructor() {
    super('JennifersAssistantDB');

    this.version(1).stores({
      messages: '++id, role, timestamp, synced',
      actions: 'id, status, completedAt, priority',
      medications: '++id, name',
      appointments: '++id, date',
      contacts: '++id, name, role',
      caseNumbers: '++id, type',
      profile: 'id'
    });
  }
}

export const db = new JennifersAssistantDB();

// Initialize profile if not exists
export async function initializeProfile(): Promise<UserProfile> {
  let profile = await db.profile.get(1);

  if (!profile) {
    profile = {
      id: 1,
      name: 'Jennifer',
      onboardingComplete: false,
      hasSOARWorker: null,
      hasAppliedSSI: null,
      hasGradyCard: null,
      hasSNAP: null,
      documents: {
        id: false,
        ssnCard: false,
        birthCert: false,
        shelterLetter: false,
      }
    };
    await db.profile.add(profile);
  }

  return profile;
}

// Helper to update profile
export async function updateProfile(updates: Partial<UserProfile>): Promise<void> {
  await db.profile.update(1, updates);
}

// Helper to add message
export async function addMessage(role: 'user' | 'assistant', content: string): Promise<number | undefined> {
  return await db.messages.add({
    role,
    content,
    timestamp: new Date(),
    synced: false,
  });
}

// Helper to get recent messages
export async function getRecentMessages(limit: number = 50): Promise<Message[]> {
  return await db.messages
    .orderBy('timestamp')
    .reverse()
    .limit(limit)
    .toArray()
    .then(msgs => msgs.reverse());
}

// Helper to update action status
export async function updateActionStatus(
  id: string,
  status: 'pending' | 'done' | 'skipped',
  notes?: string
): Promise<void> {
  await db.actions.update(id, {
    status,
    completedAt: status === 'done' ? new Date() : undefined,
    notes,
  });
}

// Get pending actions count
export async function getPendingActionsCount(): Promise<number> {
  return await db.actions.where('status').equals('pending').count();
}

// Get completed actions count
export async function getCompletedActionsCount(): Promise<number> {
  return await db.actions.where('status').equals('done').count();
}
