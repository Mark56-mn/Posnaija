import { create } from 'zustand';
import { db } from '../lib/db';

interface CartItem {
  id: string;
  name: string;
  selling_price: number;
  cost_price: number;
  quantity: number;
  unit: string;
}

interface CartState {
  items: CartItem[];
  discountValue: number;
  discountType: 'percentage' | 'flat';
  taxRate: number;
  customerName: string;
  customerId: string;
  paymentMethod: string;
  amountPaid: number;
  splitPayments: { method: string; amount: number }[];
}

interface CartStore extends CartState {
  activeTable: number;
  setActiveTable: (tableId: number) => Promise<void>;
  addItem: (product: any) => void;
  removeItem: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  setDiscount: (val: number, type: 'percentage' | 'flat') => void;
  setTaxRate: (rate: number) => void;
  setCustomerName: (n: string) => void;
  setCustomerId: (id: string) => void;
  setPaymentMethod: (m: string) => void;
  setAmountPaid: (a: number) => void;
  setSplitPayments: (splits: { method: string; amount: number }[]) => void;
  clearCart: () => void;
  subtotal: () => number;
  discountAmount: () => number;
  taxAmount: () => number;
  total: () => number;
  change: () => number;
  debtAmount: () => number;
}

const initialState: CartState = {
  items: [],
  discountValue: 0,
  discountType: 'flat',
  taxRate: 0,
  customerName: '',
  customerId: '',
  paymentMethod: 'cash',
  amountPaid: 0,
  splitPayments: [],
};

export const useCartStore = create<CartStore>((set, get) => ({
  ...initialState,
  activeTable: 1,
  
  setActiveTable: async (tableId: number) => {
    if (get().activeTable === tableId) return;
    
    // Save current table
    await saveDraft(get());
    
    // Load new table
    try {
      const draft = await db.draft_orders.get(`table_${tableId}`);
      if (draft && draft.items) {
        const parsed = JSON.parse(draft.items);
        set({
          activeTable: tableId,
          items: parsed.items || [],
          discountValue: parsed.discountValue || 0,
          discountType: parsed.discountType || 'flat',
          taxRate: parsed.taxRate || 0,
          customerName: parsed.customerName || '',
          customerId: parsed.customerId || '',
          paymentMethod: parsed.paymentMethod || 'cash',
          amountPaid: parsed.amountPaid || 0,
          splitPayments: parsed.splitPayments || [],
        });
      } else {
        set({ ...initialState, activeTable: tableId });
      }
    } catch (e) {
      set({ ...initialState, activeTable: tableId });
    }
  },

  addItem: (product) => {
    const existing = get().items.find(i => i.id === product.id);
    if (existing) {
      set(state => ({
        items: state.items.map(i =>
          i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
        ),
      }));
    } else {
      set(state => ({
        items: [...state.items, { ...product, quantity: 1 }],
      }));
    }
    saveDraft(get());
  },
  removeItem: (id) => {
    set(state => ({
      items: state.items.filter(i => i.id !== id),
    }));
    saveDraft(get());
  },
  updateQty: (id, qty) => {
    if (qty <= 0) {
      get().removeItem(id);
      return;
    }
    set(state => ({
      items: state.items.map(i => (i.id === id ? { ...i, quantity: qty } : i)),
    }));
    saveDraft(get());
  },
  setDiscount: (val, type) => { set({ discountValue: val, discountType: type }); saveDraft(get()); },
  setTaxRate: (rate) => { set({ taxRate: rate }); saveDraft(get()); },
  setCustomerName: (n) => { set({ customerName: n }); saveDraft(get()); },
  setCustomerId: (id) => { set({ customerId: id }); saveDraft(get()); },
  setPaymentMethod: (m) => { set({ paymentMethod: m }); saveDraft(get()); },
  setAmountPaid: (a) => { set({ amountPaid: a }); saveDraft(get()); },
  setSplitPayments: (splits) => { set({ splitPayments: splits }); saveDraft(get()); },
  clearCart: () => {
    set(initialState);
    db.draft_orders.delete(`table_${get().activeTable}`);
  },
  subtotal: () => get().items.reduce((sum, i) => sum + i.selling_price * i.quantity, 0),
  discountAmount: () => {
    const sub = get().subtotal();
    const type = get().discountType;
    const val = get().discountValue;
    if (type === 'percentage') {
      return sub * (val / 100);
    }
    return val;
  },
  taxAmount: () => {
    const taxableAmount = Math.max(0, get().subtotal() - get().discountAmount());
    return taxableAmount * (get().taxRate / 100);
  },
  total: () => Math.max(0, get().subtotal() - get().discountAmount() + get().taxAmount()),
  change: () => {
    const ch = get().amountPaid - get().total();
    return ch > 0 ? ch : 0;
  },
  debtAmount: () => {
    const debt = get().total() - get().amountPaid;
    return debt > 0 ? debt : 0;
  },
}));

async function saveDraft(state: any) {
  const session = await db.session.get(1);
  if (!session) return;
  
  const stateToSave = {
    items: state.items,
    discountValue: state.discountValue,
    discountType: state.discountType,
    taxRate: state.taxRate,
    customerName: state.customerName,
    customerId: state.customerId,
    paymentMethod: state.paymentMethod,
    amountPaid: state.amountPaid,
    splitPayments: state.splitPayments,
  };
  
  await db.draft_orders.put({
    id: `table_${state.activeTable}`,
    admin_id: session.admin_id,
    items: JSON.stringify(stateToSave),
    total: state.total(),
    updated_at: new Date().toISOString(),
  });
}
