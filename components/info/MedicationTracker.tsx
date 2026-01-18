'use client';

import { useEffect, useState } from 'react';
import { db, Medication } from '@/lib/db';
import Card, { CardHeader, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function MedicationTracker() {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [newMed, setNewMed] = useState({ name: '', dose: '', frequency: '', notes: '' });

  useEffect(() => {
    loadMedications();
  }, []);

  async function loadMedications() {
    const meds = await db.medications.toArray();
    setMedications(meds);
  }

  async function addMedication() {
    if (!newMed.name.trim()) return;

    await db.medications.add({
      name: newMed.name,
      dose: newMed.dose,
      frequency: newMed.frequency,
      notes: newMed.notes,
    });

    setNewMed({ name: '', dose: '', frequency: '', notes: '' });
    setShowForm(false);
    loadMedications();
  }

  async function deleteMedication(id: number) {
    await db.medications.delete(id);
    loadMedications();
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>My Medications</h2>
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
            <Input
              label="Medication Name"
              placeholder="e.g., Metformin"
              value={newMed.name}
              onChange={(e) => setNewMed({ ...newMed, name: e.target.value })}
            />
            <Input
              label="Dose"
              placeholder="e.g., 500mg"
              value={newMed.dose}
              onChange={(e) => setNewMed({ ...newMed, dose: e.target.value })}
            />
            <Input
              label="When to Take"
              placeholder="e.g., Morning with food"
              value={newMed.frequency}
              onChange={(e) => setNewMed({ ...newMed, frequency: e.target.value })}
            />
            <Input
              label="Notes (optional)"
              placeholder="Any special instructions"
              value={newMed.notes}
              onChange={(e) => setNewMed({ ...newMed, notes: e.target.value })}
            />
            <Button onClick={addMedication}>Save Medication</Button>
          </CardContent>
        </Card>
      )}

      {medications.length === 0 && !showForm ? (
        <Card>
          <CardContent className="text-center py-4">
            <p>No medications added yet.</p>
            <p className="text-sm mt-1">Tap &quot;+ Add&quot; to track your medications.</p>
          </CardContent>
        </Card>
      ) : (
        medications.map((med) => (
          <Card key={med.id}>
            <CardHeader
              title={med.name}
              subtitle={med.dose}
              icon={<span className="text-xl">💊</span>}
            />
            <CardContent>
              <p className="text-sm">
                <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>When:</span> {med.frequency}
              </p>
              {med.notes && (
                <p className="text-sm mt-1">
                  <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>Notes:</span> {med.notes}
                </p>
              )}
              <button
                onClick={() => med.id && deleteMedication(med.id)}
                className="text-sm mt-3 underline"
                style={{ color: 'var(--text-muted)' }}
              >
                Remove
              </button>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
