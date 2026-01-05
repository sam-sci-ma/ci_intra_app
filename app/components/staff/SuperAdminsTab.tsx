"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';

type PendingUser = {
  id?: number;
  email: string;
  full_name?: string;
  created_at?: string;
  status?: string;
};

export default function SuperAdminsTab() {
  const { user } = useAuth();
  const [pending, setPending] = useState<PendingUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    fetchPending();
  }, [user]);

  async function fetchPending() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/superadmins/pending');
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || 'Failed');
      setPending(data || []);
    } catch (err: any) {
      setError(err.message || 'Error fetching');
    } finally {
      setLoading(false);
    }
  }

  async function acceptUser(id?: number) {
    if (!id) return;
    if (!confirm('Accept this user into the system?')) return;
    try {
      const res = await fetch('/api/superadmins/accept', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || 'Accept failed');
      // remove accepted from list
      setPending(p => p.filter(u => u.id !== id));
      alert('User accepted');
    } catch (err: any) {
      alert(err.message || 'Error');
    }
  }

  if (!user) {
    return <div className="p-6">Please log in to view this page.</div>;
  }

  if (user.role !== 'super_admin') {
    return <div className="p-6">Not authorized.</div>;
  }

  return (
    <div>
      <h3 className="text-lg font-medium mb-4">Pending User Approvals</h3>
      {loading && <div>Loading...</div>}
      {error && <div className="text-red-600">{error}</div>}
      {!loading && pending.length === 0 && <div className="text-gray-600">No pending users.</div>}

      <div className="space-y-4">
        {pending.map(u => (
          <div key={u.id} className="p-4 border rounded flex justify-between items-center">
            <div>
              <div className="font-medium">{u.full_name || u.email}</div>
              <div className="text-sm text-gray-500">{u.email}</div>
              <div className="text-xs text-gray-400">{u.created_at}</div>
            </div>
            <div className="flex gap-2">
              <button
                className="px-3 py-1 bg-green-600 text-white rounded"
                onClick={() => acceptUser(u.id)}
              >
                Accept
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
