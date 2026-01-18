'use client';

import { useEffect, useState } from 'react';
import { db, Contact } from '@/lib/db';
import Card, { CardHeader, CardContent, CardFooter } from '@/components/ui/Card';
import Button, { CallButton } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function ContactList() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [newContact, setNewContact] = useState({
    name: '',
    role: '',
    phone: '',
    organization: '',
    notes: '',
  });

  useEffect(() => {
    loadContacts();
  }, []);

  async function loadContacts() {
    const contactList = await db.contacts.toArray();
    setContacts(contactList);
  }

  async function addContact() {
    if (!newContact.name.trim() || !newContact.phone.trim()) return;

    await db.contacts.add({
      name: newContact.name,
      role: newContact.role,
      phone: newContact.phone,
      organization: newContact.organization,
      notes: newContact.notes,
    });

    setNewContact({ name: '', role: '', phone: '', organization: '', notes: '' });
    setShowForm(false);
    loadContacts();
  }

  async function deleteContact(id: number) {
    await db.contacts.delete(id);
    loadContacts();
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg font-semibold text-white">My Contacts</h2>
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
              label="Name"
              placeholder="e.g., Mary Johnson"
              value={newContact.name}
              onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
            />
            <Input
              label="Role"
              placeholder="e.g., SOAR Worker, Doctor"
              value={newContact.role}
              onChange={(e) => setNewContact({ ...newContact, role: e.target.value })}
            />
            <Input
              label="Phone"
              type="tel"
              placeholder="Phone number"
              value={newContact.phone}
              onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
            />
            <Input
              label="Organization (optional)"
              placeholder="e.g., Mercy Care, DFCS"
              value={newContact.organization}
              onChange={(e) => setNewContact({ ...newContact, organization: e.target.value })}
            />
            <Input
              label="Notes (optional)"
              placeholder="Any notes about this contact"
              value={newContact.notes}
              onChange={(e) => setNewContact({ ...newContact, notes: e.target.value })}
            />
            <Button onClick={addContact}>Save Contact</Button>
          </CardContent>
        </Card>
      )}

      {contacts.length === 0 && !showForm ? (
        <Card>
          <CardContent className="text-center py-4">
            <p>No contacts saved yet.</p>
            <p className="text-sm mt-1">Save important contacts like case workers here.</p>
          </CardContent>
        </Card>
      ) : (
        contacts.map((contact) => (
          <Card key={contact.id}>
            <CardHeader
              title={contact.name}
              subtitle={contact.role}
              icon={<span className="text-xl">👤</span>}
            />
            <CardContent>
              {contact.organization && (
                <p className="text-sm">
                  <span className="font-semibold text-white">Organization:</span>{' '}
                  {contact.organization}
                </p>
              )}
              {contact.notes && (
                <p className="text-sm mt-1">
                  <span className="font-semibold text-white">Notes:</span> {contact.notes}
                </p>
              )}
            </CardContent>
            <CardFooter>
              <CallButton phone={contact.phone} />
              <button
                onClick={() => contact.id && deleteContact(contact.id)}
                className="text-falcons-silver text-sm underline"
              >
                Remove
              </button>
            </CardFooter>
          </Card>
        ))
      )}
    </div>
  );
}
