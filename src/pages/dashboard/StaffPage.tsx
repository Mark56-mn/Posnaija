import React from "react";
import { useEffect, useState } from 'react';
import { db } from '../../lib/db';
import { supabase } from '../../lib/supabase';
import { usePermissions } from '../../hooks/usePermissions';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Plus, Trash2 } from 'lucide-react';
import { formatDate } from '../../lib/utils';

export default function StaffPage() {
  const { session } = usePermissions();
  const [staffList, setStaffList] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    role: 'staff',
    pin: ''
  });

  const loadData = async () => {
    const s = await db.staff.toArray();
    setStaffList(s);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) return;
    
    const id = crypto.randomUUID();
    const staff = {
      id,
      admin_id: session.admin_id,
      ...formData,
      created_at: new Date().toISOString(),
      synced: false
    };

    await db.staff.put(staff);
    
    if (navigator.onLine) {
      const { synced, ...supabaseStaff } = staff;
      const { error } = await supabase.from('staff').upsert(supabaseStaff);
      if (!error) {
        await db.staff.update(id, { synced: true });
      }
    }
    
    setShowModal(false);
    setFormData({ name: '', role: 'staff', pin: '' });
    loadData();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this staff member?')) return;
    await db.staff.delete(id);
    if (navigator.onLine) {
      await supabase.from('staff').delete().eq('id', id);
    }
    loadData();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Staff Management</h1>
        <Button onClick={() => setShowModal(true)}>
          <Plus className="h-4 w-4 mr-2" /> Add Staff
        </Button>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[var(--color-muted)]/10 text-[var(--color-muted)] text-sm">
                <th className="p-4 font-medium">Name</th>
                <th className="p-4 font-medium">Role</th>
                <th className="p-4 font-medium">Added On</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-muted)]/10">
              {staffList.map(s => (
                <tr key={s.id} className="hover:bg-[var(--color-background)]/50 transition-colors">
                  <td className="p-4 font-medium">{s.name}</td>
                  <td className="p-4 uppercase text-xs">
                    <span className={`px-2 py-1 rounded ${s.role === 'manager' ? 'bg-blue-500/10 text-blue-400' : 'bg-[var(--color-muted)]/10 text-[var(--color-muted)]'}`}>
                      {s.role}
                    </span>
                  </td>
                  <td className="p-4 text-[var(--color-muted)]">{formatDate(s.created_at)}</td>
                  <td className="p-4 text-right">
                    <Button variant="ghost" size="sm" className="text-[var(--color-danger)] hover:text-[var(--color-danger)]" onClick={() => handleDelete(s.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
              {staffList.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-[var(--color-muted)]">No staff members found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">Add Staff Member</h2>
              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-[var(--color-muted)] mb-1 block">Full Name</label>
                  <Input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
                <div>
                  <label className="text-sm font-medium text-[var(--color-muted)] mb-1 block">Role</label>
                  <select className="flex h-10 w-full rounded-md border border-[var(--color-muted)]/30 bg-[var(--color-background)] px-3 py-2 text-sm text-[var(--color-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}>
                    <option value="staff">Staff</option>
                    <option value="manager">Manager</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-[var(--color-muted)] mb-1 block">Login PIN (4-6 digits)</label>
                  <Input required type="password" minLength={4} maxLength={6} value={formData.pin} onChange={e => setFormData({...formData, pin: e.target.value})} className="tracking-[0.5em] text-lg" />
                </div>
                <div className="flex space-x-3 pt-4">
                  <Button type="button" variant="outline" className="flex-1" onClick={() => setShowModal(false)}>Cancel</Button>
                  <Button type="submit" className="flex-1">Add Staff</Button>
                </div>
              </form>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
