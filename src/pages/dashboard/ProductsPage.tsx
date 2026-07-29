import React from "react";
import { useEffect, useState } from 'react';
import { db } from '../../lib/db';
import { supabase } from '../../lib/supabase';
import { usePermissions } from '../../hooks/usePermissions';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { formatNaira, formatDateOnly, formatTimeOnly } from '../../lib/utils';
import { Search, Plus, Edit2, Trash2, AlertTriangle, ArrowUpDown, History } from 'lucide-react';

export default function ProductsPage() {
  const { session } = usePermissions();
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAdjustStockModal, setShowAdjustStockModal] = useState(false);
  const [showAuditLogsModal, setShowAuditLogsModal] = useState(false);
  const [adjustProductId, setAdjustProductId] = useState<string | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    category_id: '',
    cost_price: 0,
    selling_price: 0,
    quantity: 0,
    low_stock_alert: 5,
    unit: 'piece',
    sku: '',
    expiry_date: '',
  });

  const [adjustData, setAdjustData] = useState({
    type: 'add',
    amount: '',
    reason: 'restock',
  });

  const loadData = async () => {
    const p = await db.products.toArray();
    const c = await db.categories.toArray();
    const logs = await db.stock_audit_logs.toArray();
    setProducts(p);
    setCategories(c);
    setAuditLogs(logs.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) return;
    
    const id = editingId || crypto.randomUUID();
    const isNew = !editingId;
    const oldProduct = isNew ? null : products.find(p => p.id === id);
    
    const product = {
      id,
      admin_id: session.admin_id,
      ...formData,
      cost_price: Number(formData.cost_price),
      selling_price: Number(formData.selling_price),
      quantity: Number(formData.quantity),
      low_stock_alert: Number(formData.low_stock_alert),
      expiry_date: formData.expiry_date || undefined,
      created_at: oldProduct ? oldProduct.created_at : new Date().toISOString(),
      updated_at: new Date().toISOString(),
      synced: false
    };

    await db.products.put(product);
    
    // Log stock change if quantity changed during edit or creation
    const oldQuantity = oldProduct ? oldProduct.quantity : 0;
    const newQuantity = product.quantity;
    if (oldQuantity !== newQuantity) {
      const log = {
        id: crypto.randomUUID(),
        admin_id: session.admin_id,
        product_id: product.id,
        product_name: product.name,
        user_id: session.id.toString(), // Using session id as user id
        user_name: session.name,
        old_quantity: oldQuantity,
        new_quantity: newQuantity,
        change_amount: newQuantity - oldQuantity,
        reason: isNew ? 'initial_stock' : 'manual_edit',
        created_at: new Date().toISOString(),
        synced: false
      };
      await db.stock_audit_logs.put(log);
    }
    
    if (navigator.onLine) {
      const { synced, ...supabaseProduct } = product;
      const { error } = await supabase.from('products').upsert(supabaseProduct);
      if (!error) {
        await db.products.update(id, { synced: true });
      }
    }
    
    setShowModal(false);
    setEditingId(null);
    setFormData({ name: '', category_id: '', cost_price: 0, selling_price: 0, quantity: 0, low_stock_alert: 5, unit: 'piece', sku: '', expiry_date: '' });
    loadData();
  };

  const handleAdjustStock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session || !adjustProductId) return;
    
    const product = products.find(p => p.id === adjustProductId);
    if (!product) return;
    
    const amount = Number(adjustData.amount);
    if (isNaN(amount) || amount < 0) return;
    
    let newQuantity = product.quantity;
    if (adjustData.type === 'add') newQuantity += amount;
    else if (adjustData.type === 'subtract') newQuantity = Math.max(0, newQuantity - amount);
    else if (adjustData.type === 'set') newQuantity = amount;

    if (newQuantity === product.quantity) {
      setShowAdjustStockModal(false);
      return;
    }

    const updatedProduct = {
      ...product,
      quantity: newQuantity,
      updated_at: new Date().toISOString(),
      synced: false
    };

    await db.products.put(updatedProduct);

    const log = {
      id: crypto.randomUUID(),
      admin_id: session.admin_id,
      product_id: product.id,
      product_name: product.name,
      user_id: session.id.toString(),
      user_name: session.name,
      old_quantity: product.quantity,
      new_quantity: newQuantity,
      change_amount: newQuantity - product.quantity,
      reason: adjustData.reason,
      created_at: new Date().toISOString(),
      synced: false
    };
    await db.stock_audit_logs.put(log);

    if (navigator.onLine) {
      const { synced, ...supabaseProduct } = updatedProduct;
      const { error } = await supabase.from('products').upsert(supabaseProduct);
      if (!error) {
        await db.products.update(product.id, { synced: true });
      }
    }

    setShowAdjustStockModal(false);
    setAdjustProductId(null);
    setAdjustData({ type: 'add', amount: '', reason: 'restock' });
    loadData();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    await db.products.delete(id);
    if (navigator.onLine) {
      await supabase.from('products').delete().eq('id', id);
    } else {
      await db.sync_queue.add({ table_name: 'products', record_id: id, action: 'delete', data: '', created_at: new Date().toISOString() });
    }
    loadData();
  };

  const filtered = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
  const lowStockProducts = products.filter(p => p.quantity <= p.low_stock_alert);

  const handleAddProductClick = () => {
    if (session?.plan === 'free' && products.length >= 20) {
      alert("You have reached the 20 products limit on the Free Plan. Please upgrade to add more products.");
      return;
    }
    setShowModal(true);
  };

  const handleAuditLogsClick = () => {
    if (session?.plan !== 'pro' && session?.plan !== 'lifetime') {
      alert("Stock Audit Logs are only available on the Pro (₦6,999/mo) and Lifetime (₦10,000) plans. Please upgrade to view stock history.");
      return;
    }
    setShowAuditLogsModal(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold">Products</h1>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button variant="outline" onClick={handleAuditLogsClick}>
            <History className="h-4 w-4 mr-2" /> Audit Logs
          </Button>
          <Button onClick={handleAddProductClick}>
            <Plus className="h-4 w-4 mr-2" /> Add Product
          </Button>
        </div>
      </div>

      {lowStockProducts.length > 0 && (
        <Card className="border-[var(--color-warning)]/50 bg-[var(--color-warning)]/5">
          <div className="p-4 flex items-start gap-4">
            <div className="bg-[var(--color-warning)]/10 p-2 rounded-full mt-0.5">
              <AlertTriangle className="h-5 w-5 text-[var(--color-warning)]" />
            </div>
            <div>
              <h3 className="font-semibold text-[var(--color-warning)] mb-1">Low Stock Alert</h3>
              <p className="text-sm text-[var(--color-text)]/80">
                You have {lowStockProducts.length} product{lowStockProducts.length > 1 ? 's' : ''} running low on stock. 
                Please restock soon to avoid running out.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {lowStockProducts.slice(0, 5).map(p => (
                  <span key={p.id} className="text-xs font-medium bg-[var(--color-surface)] border border-[var(--color-warning)]/30 text-[var(--color-text)] px-2 py-1 rounded">
                    {p.name} ({p.quantity} left)
                  </span>
                ))}
                {lowStockProducts.length > 5 && (
                  <span className="text-xs font-medium bg-[var(--color-surface)] border border-[var(--color-warning)]/30 text-[var(--color-text)] px-2 py-1 rounded">
                    +{lowStockProducts.length - 5} more
                  </span>
                )}
              </div>
            </div>
          </div>
        </Card>
      )}

      <Card>
        <div className="p-4 border-b border-[var(--color-muted)]/10">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--color-muted)]" />
            <Input 
              placeholder="Search products..." 
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
                <th className="p-4 font-medium">SKU</th>
                <th className="p-4 font-medium">Category</th>
                <th className="p-4 font-medium">Price</th>
                <th className="p-4 font-medium">Stock</th>
                <th className="p-4 font-medium">Expiry Date</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-muted)]/10">
              {filtered.map(p => {
                const cat = categories.find(c => c.id === p.category_id);
                return (
                  <tr key={p.id} className="hover:bg-[var(--color-background)]/50 transition-colors">
                    <td className="p-4 font-medium">{p.name}</td>
                    <td className="p-4 text-[var(--color-muted)]">{p.sku || '—'}</td>
                    <td className="p-4 text-[var(--color-muted)]">{cat ? cat.name : '—'}</td>
                    <td className="p-4 font-medium text-[var(--color-accent)]">{formatNaira(p.selling_price)}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${p.quantity <= 0 ? 'bg-[var(--color-danger)]/10 text-[var(--color-danger)]' : p.quantity <= p.low_stock_alert ? 'bg-[var(--color-warning)]/10 text-[var(--color-warning)]' : 'bg-[var(--color-success)]/10 text-[var(--color-success)]'}`}>
                        {p.quantity} {p.unit}
                      </span>
                    </td>
                    <td className="p-4 text-[var(--color-muted)] text-sm">
                      {p.expiry_date ? formatDateOnly(p.expiry_date) : '—'}
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => {
                        setAdjustProductId(p.id);
                        setShowAdjustStockModal(true);
                      }} title="Adjust Stock">
                        <ArrowUpDown className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => {
                        setEditingId(p.id);
                        setFormData({ name: p.name, category_id: p.category_id || '', cost_price: p.cost_price, selling_price: p.selling_price, quantity: p.quantity, low_stock_alert: p.low_stock_alert, unit: p.unit, sku: p.sku || '', expiry_date: p.expiry_date || '' });
                        setShowModal(true);
                      }} title="Edit">
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-[var(--color-danger)] hover:text-[var(--color-danger)]" onClick={() => handleDelete(p.id)} title="Delete">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-[var(--color-muted)]">No products found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">{editingId ? 'Edit Product' : 'Add Product'}</h2>
              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-[var(--color-muted)] mb-1 block">Name</label>
                  <Input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
                <div>
                  <label className="text-sm font-medium text-[var(--color-muted)] mb-1 block">SKU / Barcode</label>
                  <Input value={formData.sku} onChange={e => setFormData({...formData, sku: e.target.value})} placeholder="Scan or type barcode" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-[var(--color-muted)] mb-1 block">Selling Price (₦)</label>
                    <Input required type="number" min="0" value={formData.selling_price || ''} onChange={e => setFormData({...formData, selling_price: Number(e.target.value)})} />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-[var(--color-muted)] mb-1 block">Cost Price (₦)</label>
                    <Input type="number" min="0" value={formData.cost_price || ''} onChange={e => setFormData({...formData, cost_price: Number(e.target.value)})} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-[var(--color-muted)] mb-1 block">Quantity</label>
                    <Input required type="number" value={formData.quantity || ''} onChange={e => setFormData({...formData, quantity: Number(e.target.value)})} disabled={!!editingId} title={editingId ? "Use Adjust Stock instead" : ""} />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-[var(--color-muted)] mb-1 block">Unit</label>
                    <select className="flex h-10 w-full rounded-md border border-[var(--color-muted)]/30 bg-[var(--color-background)] px-3 py-2 text-sm text-[var(--color-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]" value={formData.unit} onChange={e => setFormData({...formData, unit: e.target.value})}>
                      <option value="piece">Piece</option>
                      <option value="carton">Carton</option>
                      <option value="pack">Pack</option>
                      <option value="kg">Kg</option>
                      <option value="litre">Litre</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-[var(--color-muted)] mb-1 block">Low Stock Alert Level</label>
                    <Input type="number" min="0" value={formData.low_stock_alert || ''} onChange={e => setFormData({...formData, low_stock_alert: Number(e.target.value)})} />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-[var(--color-muted)] mb-1 block">Expiry Date (Optional)</label>
                    <Input type="date" value={formData.expiry_date || ''} onChange={e => setFormData({...formData, expiry_date: e.target.value})} />
                  </div>
                </div>
                <div className="flex space-x-3 pt-4">
                  <Button type="button" variant="outline" className="flex-1" onClick={() => setShowModal(false)}>Cancel</Button>
                  <Button type="submit" className="flex-1">Save Product</Button>
                </div>
              </form>
            </div>
          </Card>
        </div>
      )}

      {/* Adjust Stock Modal */}
      {showAdjustStockModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-1">Adjust Stock</h2>
              <p className="text-sm text-[var(--color-muted)] mb-4">
                {products.find(p => p.id === adjustProductId)?.name} (Current: {products.find(p => p.id === adjustProductId)?.quantity})
              </p>
              
              <form onSubmit={handleAdjustStock} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-[var(--color-muted)] mb-1 block">Action</label>
                    <select className="flex h-10 w-full rounded-md border border-[var(--color-muted)]/30 bg-[var(--color-background)] px-3 py-2 text-sm text-[var(--color-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]" value={adjustData.type} onChange={e => setAdjustData({...adjustData, type: e.target.value})}>
                      <option value="add">Add (+)</option>
                      <option value="subtract">Subtract (-)</option>
                      <option value="set">Set Exact (=)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-[var(--color-muted)] mb-1 block">Amount</label>
                    <Input required type="number" min="0" value={adjustData.amount} onChange={e => setAdjustData({...adjustData, amount: e.target.value})} />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-[var(--color-muted)] mb-1 block">Reason</label>
                  <select className="flex h-10 w-full rounded-md border border-[var(--color-muted)]/30 bg-[var(--color-background)] px-3 py-2 text-sm text-[var(--color-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]" value={adjustData.reason} onChange={e => setAdjustData({...adjustData, reason: e.target.value})}>
                    <option value="restock">New Stock Arrival</option>
                    <option value="damage">Damage/Spoilage</option>
                    <option value="loss">Loss/Theft</option>
                    <option value="correction">Inventory Correction</option>
                    <option value="return">Customer Return</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div className="flex space-x-3 pt-4">
                  <Button type="button" variant="outline" className="flex-1" onClick={() => setShowAdjustStockModal(false)}>Cancel</Button>
                  <Button type="submit" className="flex-1">Update Stock</Button>
                </div>
              </form>
            </div>
          </Card>
        </div>
      )}

      {/* Audit Logs Modal */}
      {showAuditLogsModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-4xl max-h-[90vh] flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between border-b border-[var(--color-muted)]/10 pb-4">
              <CardTitle>Stock Audit Logs</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setShowAuditLogsModal(false)}>Close</Button>
            </CardHeader>
            <CardContent className="flex-1 overflow-auto p-0">
              <table className="w-full text-left border-collapse">
                <thead className="sticky top-0 bg-[var(--color-surface)] z-10">
                  <tr className="border-b border-[var(--color-muted)]/10 text-[var(--color-muted)] text-sm">
                    <th className="p-4 font-medium">Date & Time</th>
                    <th className="p-4 font-medium">Product</th>
                    <th className="p-4 font-medium">User</th>
                    <th className="p-4 font-medium">Action</th>
                    <th className="p-4 font-medium">Qty Change</th>
                    <th className="p-4 font-medium">Reason</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-muted)]/10">
                  {auditLogs.map(log => (
                    <tr key={log.id} className="hover:bg-[var(--color-background)]/50">
                      <td className="p-4">
                        <div className="text-sm font-medium">{formatDateOnly(log.created_at)}</div>
                        <div className="text-xs text-[var(--color-muted)]">{formatTimeOnly(log.created_at)}</div>
                      </td>
                      <td className="p-4 font-medium">{log.product_name}</td>
                      <td className="p-4 text-[var(--color-muted)]">{log.user_name}</td>
                      <td className="p-4">
                        <span className={`text-xs font-medium px-2 py-1 rounded ${log.change_amount > 0 ? 'bg-[var(--color-success)]/10 text-[var(--color-success)]' : log.change_amount < 0 ? 'bg-[var(--color-danger)]/10 text-[var(--color-danger)]' : 'bg-[var(--color-muted)]/10 text-[var(--color-muted)]'}`}>
                          {log.change_amount > 0 ? 'INCREASE' : log.change_amount < 0 ? 'DECREASE' : 'UNCHANGED'}
                        </span>
                      </td>
                      <td className="p-4 text-sm font-mono">
                        {log.old_quantity} → {log.new_quantity}
                        <span className="text-[var(--color-muted)] ml-2">({log.change_amount > 0 ? '+' : ''}{log.change_amount})</span>
                      </td>
                      <td className="p-4">
                        <span className="capitalize text-sm bg-[var(--color-background)] px-2 py-1 rounded border border-[var(--color-muted)]/20">
                          {log.reason.replace('_', ' ')}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {auditLogs.length === 0 && (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-[var(--color-muted)]">No audit logs found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
