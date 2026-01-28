'use client';

import { useEffect, useState } from 'react';
import { Action, db } from '@/lib/db';
import { PRIORITY_ACTIONS, ACTIONS_VERSION } from '@/lib/actions';
import ActionCard from './ActionCard';

const ACTIONS_VERSION_KEY = 'jennifer_actions_version';

export default function ActionList() {
  const [actions, setActions] = useState<Action[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'done'>('pending');
  const [loading, setLoading] = useState(true);

  // Load actions from DB or initialize from defaults
  useEffect(() => {
    async function loadActions() {
      try {
        const storedVersion = localStorage.getItem(ACTIONS_VERSION_KEY);
        const currentVersion = ACTIONS_VERSION.toString();
        let storedActions = await db.actions.toArray();

        // Check if we need to update actions (new version or no actions)
        if (storedActions.length === 0 || storedVersion !== currentVersion) {
          // Preserve completion status of existing actions
          const existingStatus = new Map<string, { status: Action['status']; completedAt?: Date; notes?: string }>();
          storedActions.forEach(a => {
            existingStatus.set(a.id, { status: a.status, completedAt: a.completedAt, notes: a.notes });
          });

          // Clear and re-add with preserved status
          await db.actions.clear();
          const updatedActions = PRIORITY_ACTIONS.map(action => {
            const existing = existingStatus.get(action.id);
            if (existing) {
              return { ...action, ...existing };
            }
            return action;
          });
          await db.actions.bulkAdd(updatedActions);
          localStorage.setItem(ACTIONS_VERSION_KEY, currentVersion);
          storedActions = await db.actions.toArray();
        }

        setActions(storedActions.sort((a, b) => a.priority - b.priority));
      } catch (error) {
        console.error('Error loading actions:', error);
        setActions(PRIORITY_ACTIONS);
      } finally {
        setLoading(false);
      }
    }

    loadActions();
  }, []);

  // Handle status change
  const handleStatusChange = async (id: string, status: 'done' | 'skipped' | 'pending') => {
    try {
      // If marking as pending (undo), reset status
      const newStatus = status === 'done' && actions.find(a => a.id === id)?.status === 'done'
        ? 'pending'
        : status;

      await db.actions.update(id, {
        status: newStatus,
        completedAt: newStatus === 'done' ? new Date() : undefined,
      });

      setActions(prev =>
        prev.map(a =>
          a.id === id
            ? { ...a, status: newStatus, completedAt: newStatus === 'done' ? new Date() : undefined }
            : a
        )
      );
    } catch (error) {
      console.error('Error updating action:', error);
    }
  };

  // Filter actions
  const filteredActions = actions.filter(a => {
    if (filter === 'all') return true;
    if (filter === 'pending') return a.status === 'pending';
    if (filter === 'done') return a.status === 'done' || a.status === 'skipped';
    return true;
  });

  // Progress stats
  const doneCount = actions.filter(a => a.status === 'done').length;
  const skippedCount = actions.filter(a => a.status === 'skipped').length;
  const pendingCount = actions.filter(a => a.status === 'pending').length;
  const totalCount = actions.length;
  const progressPercent = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12 animate-fade-in">
        <div className="text-secondary">Loading your actions...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Stats Cards (Fantasy Football style) */}
      <div className="grid grid-cols-3 gap-3 px-4 pt-4">
        <div className="stat-card">
          <div className="stat-value">{pendingCount}</div>
          <div className="stat-label">To Do</div>
        </div>
        <div className="stat-card">
          <div className="stat-value text-success">{doneCount}</div>
          <div className="stat-label">Done</div>
        </div>
        <div className="stat-card">
          <div className="stat-value text-secondary">{skippedCount}</div>
          <div className="stat-label">Skipped</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="px-4">
        <div className="card p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-secondary">Overall Progress</span>
            <span className="text-lg font-display font-bold text-falcons-red">
              {progressPercent}%
            </span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progressPercent}%` }} />
          </div>
          <p className="text-xs text-muted mt-2 text-center">
            {doneCount === totalCount
              ? "You've completed everything! Rise Up! 🏈"
              : `${totalCount - doneCount - skippedCount} actions remaining`}
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 px-4 overflow-x-auto scrollbar-hide py-1">
        {(['pending', 'done', 'all'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 whitespace-nowrap ${
              filter === f
                ? 'text-white shadow-glow-sm'
                : 'text-secondary hover:text-primary'
            }`}
            style={{
              background: filter === f
                ? 'linear-gradient(135deg, var(--falcons-red) 0%, var(--falcons-red-dark) 100%)'
                : 'var(--bg-surface)',
            }}
          >
            {f === 'pending' ? `To Do (${pendingCount})` : f === 'done' ? `Done (${doneCount})` : `All (${totalCount})`}
          </button>
        ))}
      </div>

      {/* Actions List */}
      <div className="space-y-3 px-4 pb-4">
        {filteredActions.length === 0 ? (
          <div className="card-elevated p-8 text-center animate-fade-in">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center bg-success/20">
              <span className="text-3xl">🏈</span>
            </div>
            <p className="text-secondary">
              {filter === 'pending'
                ? "You've completed all your actions! Rise Up!"
                : filter === 'done'
                ? 'No completed actions yet. Keep going!'
                : 'No actions found.'}
            </p>
          </div>
        ) : (
          filteredActions.map((action, index) => (
            <div
              key={action.id}
              className="animate-slide-up"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <ActionCard
                action={action}
                onStatusChange={handleStatusChange}
                isExpanded={index === 0 && filter === 'pending'}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
