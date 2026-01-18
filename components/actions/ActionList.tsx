'use client';

import { useEffect, useState } from 'react';
import { Action, db } from '@/lib/db';
import { PRIORITY_ACTIONS } from '@/lib/actions';
import ActionCard from './ActionCard';

export default function ActionList() {
  const [actions, setActions] = useState<Action[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'done'>('pending');
  const [loading, setLoading] = useState(true);

  // Load actions from DB or initialize from defaults
  useEffect(() => {
    async function loadActions() {
      try {
        let storedActions = await db.actions.toArray();

        // Initialize with default actions if none exist
        if (storedActions.length === 0) {
          await db.actions.bulkAdd(PRIORITY_ACTIONS);
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
  const totalCount = actions.length;
  const progressPercent = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-falcons-silver">Loading your actions...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress Bar */}
      <div className="px-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-falcons-silver">Your Progress</span>
          <span className="text-sm font-semibold text-white">
            {doneCount} of {totalCount} done
          </span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progressPercent}%` }} />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 px-4">
        {(['pending', 'done', 'all'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              filter === f
                ? 'bg-falcons-red text-white'
                : 'bg-bg-card text-falcons-silver hover:text-white'
            }`}
          >
            {f === 'pending' ? 'To Do' : f === 'done' ? 'Completed' : 'All'}
          </button>
        ))}
      </div>

      {/* Actions List */}
      <div className="space-y-4 px-4 pb-4">
        {filteredActions.length === 0 ? (
          <div className="text-center py-8 text-falcons-silver">
            {filter === 'pending'
              ? "You've completed all your actions! 🎉"
              : filter === 'done'
              ? 'No completed actions yet. Keep going!'
              : 'No actions found.'}
          </div>
        ) : (
          filteredActions.map((action, index) => (
            <ActionCard
              key={action.id}
              action={action}
              onStatusChange={handleStatusChange}
              isExpanded={index === 0 && filter === 'pending'}
            />
          ))
        )}
      </div>
    </div>
  );
}
