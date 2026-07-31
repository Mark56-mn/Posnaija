import { supabase } from './supabase';
import { db } from './db';

export async function syncDown(adminId: string) {
  if (!navigator.onLine) return;
  
  try {
    const [
      products, sales, customers,
      categories, debts, staff
    ] = await Promise.all([
      supabase.from('products').select('*').eq('admin_id', adminId),
      supabase.from('sales').select('*').eq('admin_id', adminId),
      supabase.from('customers').select('*').eq('admin_id', adminId),
      supabase.from('categories').select('*').eq('admin_id', adminId),
      supabase.from('debts').select('*').eq('admin_id', adminId),
      supabase.from('staff').select('*').eq('admin_id', adminId),
    ]);

    await Promise.all([
      db.products.bulkPut((products.data || []).map(r => ({...r, synced: true}))),
      db.sales.bulkPut((sales.data || []).map(r => ({...r, synced: true}))),
      db.customers.bulkPut((customers.data || []).map(r => ({...r, synced: true}))),
      db.categories.bulkPut((categories.data || []).map(r => ({...r, synced: true}))),
      db.debts.bulkPut((debts.data || []).map(r => ({...r, synced: true}))),
      db.staff.bulkPut((staff.data || []).map(r => ({...r, synced: true}))),
    ]);
  } catch (error) {
    console.error('syncDown error:', error);
  }
}

export async function syncUp() {
  if (!navigator.onLine) return;

  const tables = [
    'products', 'sales', 'customers',
    'categories', 'debts', 'staff', 'branches', 'stock_audit_logs'
  ] as const;

  for (const table of tables) {
    const unsynced = await (db[table] as any).where('synced').equals(0).toArray();

    if (unsynced.length > 0) {
      const recordsToUpsert = unsynced.map(({ synced, ...r }: any) => r);
      const { error } = await supabase.from(table).upsert(recordsToUpsert);

      if (!error) {
        await Promise.all(
          unsynced.map((r: any) =>
            (db[table] as any).update(r.id, { synced: true })
          )
        );
      }
    }
  }
}

export function initConnectionWatcher() {
  if (typeof window === 'undefined') return;
  window.addEventListener('online', syncUp);
}
