'use client';

import { useEffect, useState } from 'react';
import { db, Appointment } from '@/lib/db';
import { formatDate } from '@/lib/utils';
import Card, { CardHeader, CardContent, CardFooter } from '@/components/ui/Card';
import Button, { CallButton, DirectionsButton } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function AppointmentList() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [newAppt, setNewAppt] = useState({
    title: '',
    date: '',
    time: '',
    location: '',
    phone: '',
    notes: '',
  });

  useEffect(() => {
    loadAppointments();
  }, []);

  async function loadAppointments() {
    const appts = await db.appointments.orderBy('date').toArray();
    setAppointments(appts);
  }

  async function addAppointment() {
    if (!newAppt.title.trim() || !newAppt.date) return;

    await db.appointments.add({
      title: newAppt.title,
      date: new Date(newAppt.date),
      time: newAppt.time,
      location: newAppt.location,
      phone: newAppt.phone,
      notes: newAppt.notes,
    });

    setNewAppt({ title: '', date: '', time: '', location: '', phone: '', notes: '' });
    setShowForm(false);
    loadAppointments();
  }

  async function deleteAppointment(id: number) {
    await db.appointments.delete(id);
    loadAppointments();
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg font-semibold text-white">My Appointments</h2>
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
              label="What is this appointment for?"
              placeholder="e.g., SSI Interview, Doctor"
              value={newAppt.title}
              onChange={(e) => setNewAppt({ ...newAppt, title: e.target.value })}
            />
            <Input
              label="Date"
              type="date"
              value={newAppt.date}
              onChange={(e) => setNewAppt({ ...newAppt, date: e.target.value })}
            />
            <Input
              label="Time"
              placeholder="e.g., 10:00 AM"
              value={newAppt.time}
              onChange={(e) => setNewAppt({ ...newAppt, time: e.target.value })}
            />
            <Input
              label="Location"
              placeholder="Address or building name"
              value={newAppt.location}
              onChange={(e) => setNewAppt({ ...newAppt, location: e.target.value })}
            />
            <Input
              label="Phone (optional)"
              placeholder="Phone number"
              value={newAppt.phone}
              onChange={(e) => setNewAppt({ ...newAppt, phone: e.target.value })}
            />
            <Input
              label="Notes (optional)"
              placeholder="What to bring, etc."
              value={newAppt.notes}
              onChange={(e) => setNewAppt({ ...newAppt, notes: e.target.value })}
            />
            <Button onClick={addAppointment}>Save Appointment</Button>
          </CardContent>
        </Card>
      )}

      {appointments.length === 0 && !showForm ? (
        <Card>
          <CardContent className="text-center py-4">
            <p>No appointments scheduled.</p>
            <p className="text-sm mt-1">Tap &quot;+ Add&quot; when you have an appointment.</p>
          </CardContent>
        </Card>
      ) : (
        appointments.map((appt) => (
          <Card key={appt.id}>
            <CardHeader
              title={appt.title}
              subtitle={`${formatDate(new Date(appt.date))}${appt.time ? ` at ${appt.time}` : ''}`}
              icon={<span className="text-xl">📅</span>}
            />
            <CardContent>
              {appt.location && (
                <p className="text-sm">
                  <span className="font-semibold text-white">Where:</span> {appt.location}
                </p>
              )}
              {appt.notes && (
                <p className="text-sm mt-1">
                  <span className="font-semibold text-white">Notes:</span> {appt.notes}
                </p>
              )}
            </CardContent>
            <CardFooter>
              <div className="flex flex-col gap-3">
                {appt.phone && <CallButton phone={appt.phone} />}
                {appt.location && <DirectionsButton address={appt.location} />}
                <button
                  onClick={() => appt.id && deleteAppointment(appt.id)}
                  className="text-falcons-silver text-sm underline"
                >
                  Remove
                </button>
              </div>
            </CardFooter>
          </Card>
        ))
      )}
    </div>
  );
}
