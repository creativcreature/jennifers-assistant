'use client';

import { useState } from 'react';
import { Action } from '@/lib/db';
import { formatPhone, formatPhoneLink } from '@/lib/utils';
import Card, { CardHeader, CardContent, CardFooter } from '@/components/ui/Card';
import Button, { CallButton } from '@/components/ui/Button';

interface ActionCardProps {
  action: Action;
  onStatusChange: (id: string, status: 'done' | 'skipped') => void;
  isExpanded?: boolean;
}

export default function ActionCard({ action, onStatusChange, isExpanded = false }: ActionCardProps) {
  const [expanded, setExpanded] = useState(isExpanded);
  const [showScript, setShowScript] = useState(false);

  const statusBadge = () => {
    switch (action.status) {
      case 'done':
        return <span className="badge-success">Done</span>;
      case 'skipped':
        return <span className="badge-warning">Skipped</span>;
      default:
        return <span className="badge-pending">To Do</span>;
    }
  };

  return (
    <Card elevated={action.status === 'pending'}>
      <CardHeader
        title={action.title}
        subtitle={`Priority ${action.priority}`}
        badge={statusBadge()}
        icon={
          <span className="text-xl">
            {action.status === 'done' ? '✓' : action.priority}
          </span>
        }
      />

      <CardContent>
        <p>{action.description}</p>

        {expanded && (
          <div className="mt-4 space-y-4">
            {/* What to bring */}
            {action.bringList && action.bringList.length > 0 && (
              <div>
                <h4 className="font-semibold text-white mb-2">What to bring:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  {action.bringList.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Script */}
            {action.script && (
              <div>
                <button
                  onClick={() => setShowScript(!showScript)}
                  className="flex items-center gap-2 text-falcons-red font-semibold"
                >
                  <svg
                    className={`w-5 h-5 transition-transform ${showScript ? 'rotate-90' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                  {showScript ? 'Hide' : 'Show'} what to say
                </button>

                {showScript && (
                  <div className="mt-3 p-4 bg-bg-dark rounded-lg border border-falcons-silver/10">
                    <pre className="whitespace-pre-wrap text-sm font-body leading-relaxed">
                      {action.script}
                    </pre>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </CardContent>

      <CardFooter>
        {/* Expand/Collapse */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-falcons-silver text-sm underline"
        >
          {expanded ? 'Show less' : 'Show more details'}
        </button>

        {/* Action buttons */}
        {action.status === 'pending' && (
          <div className="flex flex-col gap-3">
            {action.phone && (
              <CallButton phone={action.phone} label={`Call ${formatPhone(action.phone)}`} />
            )}

            <div className="flex gap-3">
              <Button
                variant="primary"
                onClick={() => onStatusChange(action.id, 'done')}
                className="flex-1"
              >
                Mark Done
              </Button>
              <Button
                variant="secondary"
                onClick={() => onStatusChange(action.id, 'skipped')}
                className="flex-1"
              >
                Skip
              </Button>
            </div>
          </div>
        )}

        {action.status !== 'pending' && (
          <Button
            variant="secondary"
            onClick={() => onStatusChange(action.id, 'done')}
          >
            Undo - Mark as To Do
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
