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

interface CartStore {
  items: CartItem[];
  discountValue: number;
  discountType: 'percentage' | 'flat';
  taxRate: number;
  customerName: string;
  customerId: string;
  paymentMethod: string;
  amountPaid: number;
  splitPayments: { method: string; amount: number }[];
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

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  discountValue: 0,
  discountType: 'flat',
  taxRate: 0,
  customerName: '',
  customerId: '',
  paymentMethod: 'cash',
  amountPaid: 0,
  splitPayments: [],

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

  setDiscount: (val, type) => set({ discountValue: val, discountType: type }),
  setTaxRate: (rate) => set({ taxRate: rate }),
  setCustomerName: (n) => set({ customerName: n }),
  setCustomerId: (id) => set({ customerId: id }),
  setPaymentMethod: (m) => set({ paymentMethod: m }),
  setAmountPaid: (a) => set({ amountPaid: a }),
  setSplitPayments: (splits) => set({ splitPayments: splits }),

  clearCart: () => {
    set({
      items: [],
      discountValue: 0,
      discountType: 'flat',
      taxRate: 0,
      customerName: '',
      customerId: '',
      paymentMethod: 'cash',
      amountPaid: 0,
      splitPayments: [],
    });
    db.draft_orders.delete('current');
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
  await db.draft_orders.put({
    id: 'current',
    admin_id: session.admin_id,
    items: JSON.stringify(state.items),
    total: state.total(),
    updated_at: new Date().toISOString(),
  });
}
