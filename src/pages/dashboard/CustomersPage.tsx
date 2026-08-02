import React from "react";
import { useEffect, useState } from 'react';
import { db } from '../../lib/db';
import { supabase } from '../../lib/supabase';
import { usePermissions } from '../../hooks/usePermissions';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Search, Plus, Trash2, MessageSquare } from 'lucide-react';
import { formatNaira } from '../../lib/utils';

export default function CustomersPage() {
  const { session } = usePermissions();
  const [customers, setCustomers] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', whatsapp: '' });

  const loadData = async () => {
    const c = await db.customers.toArray();
    setCustomers(c);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) return;
    
    const id = crypto.randomUUID();
    const customer = {
      id,
      admin_id: session.admin_id,
      ...formData,
      total_debt: 0,
      points: 0,
      created_at: new Date().toISOString(),
      synced: false
    };

    await db.customers.put(customer);
    if (navigator.onLine) {
      const { synced, ...supabaseCustomer } = customer;
      const { error } = await supabase.from('customers').upsert(supabaseCustomer);
      if (!error) await db.customers.update(id, { synced: true });
    }
    
    setShowModal(false);
    setFormData({ name: '', phone: '', whatsapp: '' });
    loadData();
  };

  const filtered = customers.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold">Customers</h1>
        <Button onClick={() => setShowModal(true)}>
          <Plus className="h-4 w-4 mr-2" /> Add Customer
        </Button>
      </div>

      <Card>
        <div className="p-4 border-b border-[var(--color-muted)]/10">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--color-muted)]" />
            <Input 
              placeholder="Search customers..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9 bg-[var(--color-background)]"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[var(--color-muted)]/10 text-[var(--color-muted)] text-sm">
                <th className="p-4 font-medium">Name</th>
                <th className="p-4 font-medium">Phone</th>
                <th className="p-4 font-medium">WhatsApp</th>
                <th className="p-4 font-medium">Loyalty Points</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-muted)]/10">
              {filtered.map(c => (
                <tr key={c.id} className="hover:bg-[var(--color-background)]/50 transition-colors">
                  <td className="p-4 font-medium">{c.name}</td>
                  <td className="p-4 text-[var(--color-muted)]">{c.phone || '—'}</td>
                  <td className="p-4 text-[var(--color-muted)]">{c.whatsapp || '—'}</td>
                  <td className="p-4 font-medium text-[var(--color-accent)]">{c.points || 0} pts</td>
                  <td className="p-4 text-right">
                    {c.whatsapp && (
                      <Button variant="ghost" size="sm" className="text-[var(--color-success)] hover:text-[var(--color-success)] hover:bg-[var(--color-success)]/10 mr-2">
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                    )}
                    <Button variant="ghost" size="sm" className="text-[var(--color-danger)] hover:text-[var(--color-danger)]" onClick={async () => {
                      if(confirm('Delete customer?')) {
                        await db.customers.delete(c.id);
                        if(navigator.onLine) await supabase.from('customers').delete().eq('id', c.id);
                        loadData();
                      }
                    }}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-[var(--color-muted)]">No customers found.</td>
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
              <h2 className="text-xl font-bold mb-4">Add Customer</h2>
              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-[var(--color-muted)] mb-1 block">Name</label>
                  <Input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
                <div>
                  <label className="text-sm font-medium text-[var(--color-muted)] mb-1 block">Phone</label>
                  <Input value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                </div>
                <div>
                  <label className="text-sm font-medium text-[var(--color-muted)] mb-1 block">WhatsApp Number</label>
                  <Input value={formData.whatsapp} onChange={e => setFormData({...formData, whatsapp: e.target.value})} />
                </div>
                <div className="flex space-x-3 pt-4">
                  <Button type="button" variant="outline" className="flex-1" onClick={() => setShowModal(false)}>Cancel</Button>
                  <Button type="submit" className="flex-1">Save Customer</Button>
                </div>
              </form>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
