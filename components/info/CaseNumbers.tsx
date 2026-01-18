'use client';

import { useEffect, useState } from 'react';
import { db, CaseNumber } from '@/lib/db';
import Card, { CardHeader, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function CaseNumbers() {
  const [caseNumbers, setCaseNumbers] = useState<CaseNumber[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [newCase, setNewCase] = useState({ type: '', number: '', notes: '' });

  useEffect(() => {
    loadCaseNumbers();
  }, []);

  async function loadCaseNumbers() {
    const cases = await db.caseNumbers.toArray();
    setCaseNumbers(cases);
  }

  async function addCaseNumber() {
    if (!newCase.type.trim() || !newCase.number.trim()) return;

    await db.caseNumbers.add({
      type: newCase.type,
      number: newCase.number,
      notes: newCase.notes,
    });

    setNewCase({ type: '', number: '', notes: '' });
    setShowForm(false);
    loadCaseNumbers();
  }

  async function deleteCaseNumber(id: number) {
    await db.caseNumbers.delete(id);
    loadCaseNumbers();
  }

  const suggestedTypes = ['SSI Case', 'SNAP Case', 'Grady Card', 'Medicaid', 'Housing', 'Other'];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>My Case Numbers</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="text-falcons-red font-semibold text-sm"
        >
          {showForm ? 'Cancel' : '+ Add'}
        </button>
      </div>

      {showForm && (
        <Card>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                Type of Case
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {suggestedTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => setNewCase({ ...newCase, type })}
                    className="px-3 py-2 rounded-card text-sm"
                    style={{
                      backgroundColor: newCase.type === type ? 'var(--falcons-red)' : 'var(--bg-surface)',
                      color: newCase.type === type ? 'white' : 'var(--text-secondary)',
                    }}
                  >
                    {type}
                  </button>
                ))}
              </div>
              <Input
                placeholder="Or type your own"
                value={newCase.type}
                onChange={(e) => setNewCase({ ...newCase, type: e.target.value })}
              />
            </div>
            <Input
              label="Case Number / Reference"
              placeholder="Enter the number"
              value={newCase.number}
              onChange={(e) => setNewCase({ ...newCase, number: e.target.value })}
            />
            <Input
              label="Notes (optional)"
              placeholder="Any notes"
              value={newCase.notes}
              onChange={(e) => setNewCase({ ...newCase, notes: e.target.value })}
            />
            <Button onClick={addCaseNumber}>Save Case Number</Button>
          </CardContent>
        </Card>
      )}

      {caseNumbers.length === 0 && !showForm ? (
        <Card>
          <CardContent className="text-center py-4">
            <p>No case numbers saved.</p>
            <p className="text-sm mt-1">Save important reference numbers here.</p>
          </CardContent>
        </Card>
      ) : (
        caseNumbers.map((caseNum) => (
          <Card key={caseNum.id}>
            <CardHeader
              title={caseNum.type}
              subtitle={caseNum.number}
              icon={<span className="text-xl">📋</span>}
            />
            {caseNum.notes && (
              <CardContent>
                <p className="text-sm">
                  <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>Notes:</span> {caseNum.notes}
                </p>
              </CardContent>
            )}
            <div className="px-5 pb-5">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(caseNum.number);
                  alert('Copied to clipboard!');
                }}
                className="text-falcons-red text-sm font-semibold mr-4"
              >
                Copy Number
              </button>
              <button
                onClick={() => caseNum.id && deleteCaseNumber(caseNum.id)}
                className="text-sm underline"
                style={{ color: 'var(--text-muted)' }}
              >
                Remove
              </button>
            </div>
          </Card>
        ))
      )}
    </div>
  );
}
