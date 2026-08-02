import Dexie, { Table } from 'dexie';

export interface Session {
  id: number;
  branch_id?: string;
  branch_name?: string;
  parent_admin_id?: string;
  admin_id: string;
  staff_id?: string;
  name: string;
  email?: string;
  role: 'admin' | 'manager' | 'staff';
  business_name: string;
  business_address?: string;
  business_phone?: string;
  whatsapp_number?: string;
  business_logo?: string;
  is_staff: boolean;
  onboarding_completed: boolean;
  plan: 'free' | 'basic' | 'pro' | 'lifetime';
  created_at?: string;
  offline_pin?: string;
  custom_theme_primary?: string;
  custom_theme_accent?: string;
  custom_theme_background?: string;
  custom_theme_surface?: string;
  custom_theme_brand_name?: string;
}

export interface LocalProduct {
  id: string;
  branch_id?: string;
  admin_id: string;
  name: string;
  category_id?: string;
  cost_price: number;
  selling_price: number;
  quantity: number;
  low_stock_alert: number;
  unit: string;
  sku?: string;
  expiry_date?: string;
  image_url?: string;
  created_at: string;
  updated_at: string;
  synced: boolean;
}

export interface LocalSale {
  id: string;
  branch_id?: string;
  admin_id: string;
  customer_id?: string;
  customer_name: string;
  items: string;
  subtotal: number;
  discount: number;
  total: number;
  payment_method: string;
  payment_status: string;
  amount_paid: number;
  debt_amount: number;
  served_by: string;
  staff_id?: string;
  receipt_number: string;
  notes?: string;
  created_at: string;
  synced: boolean;
}

export interface LocalCustomer {
  id: string;
  admin_id: string;
  name: string;
  phone?: string;
  whatsapp?: string;
  total_debt: number;
  points?: number;
  created_at: string;
  synced: boolean;
}

export interface LocalCategory {
  id: string;
  admin_id: string;
  name: string;
  created_at: string;
  synced: boolean;
}

export interface LocalDebt {
  id: string;
  admin_id: string;
  customer_id?: string;
  customer_name: string;
  sale_id?: string;
  amount: number;
  amount_paid: number;
  balance: number;
  status: string;
  due_date?: string;
  created_at: string;
  synced: boolean;
}

export interface LocalStaff {
  id: string;
  branch_id?: string;
  admin_id: string;
  name: string;
  role: string;
  pin: string;
  created_at: string;
  synced: boolean;
}


export interface LocalBranch {
  id: string;
  admin_id: string;
  name: string;
  location?: string;
  created_at: string;
  synced: boolean;
}

export interface DraftOrder {
  id: string;
  admin_id: string;
  items: string;
  total: number;
  updated_at: string;
}

export interface SyncQueueItem {
  id?: number;
  table_name: string;
  record_id: string;
  action: 'insert' | 'update' | 'delete';
  data: string;
  created_at: string;
}

export interface LocalPasskey {
  id: string;
  admin_id: string;
  name: string;
  email: string;
  created_at: string;
}

export interface StockAuditLog {
  id: string;
  admin_id: string;
  product_id: string;
  product_name: string;
  user_id: string;
  user_name: string;
  old_quantity: number;
  new_quantity: number;
  change_amount: number;
  reason: string;
  created_at: string;
  synced: boolean;
}

class POSDatabase extends Dexie {
  session!: Table<Session>;
  products!: Table<LocalProduct>;
  sales!: Table<LocalSale>;
  customers!: Table<LocalCustomer>;
  categories!: Table<LocalCategory>;
  debts!: Table<LocalDebt>;
  staff!: Table<LocalStaff>;
  draft_orders!: Table<DraftOrder>;
  sync_queue!: Table<SyncQueueItem>;
  branches!: Table<LocalBranch>;
  stock_audit_logs!: Table<StockAuditLog>;
  passkeys!: Table<LocalPasskey>;

  constructor() {
    super('POSNaijaDB');
    this.version(2).stores({
      session: 'id',
      products: 'id, admin_id, name, category_id, synced',
      sales: 'id, admin_id, created_at, synced',
      customers: 'id, admin_id, name, synced',
      categories: 'id, admin_id, name, synced',
      debts: 'id, admin_id, customer_id, synced',
      staff: 'id, admin_id, synced',
      draft_orders: 'id, admin_id',
      sync_queue: '++id, table_name, record_id, action',
      stock_audit_logs: 'id, admin_id, product_id, created_at, synced',
    });
    this.version(6).stores({
      passkeys: 'id, admin_id, email',
    });
    this.version(4).stores({
      branches: 'id, admin_id, name, synced',
      products: 'id, admin_id, branch_id, name, category_id, sku, synced',
      sales: 'id, admin_id, branch_id, created_at, synced',
      staff: 'id, admin_id, branch_id, synced',
    });
    this.version(3).stores({
      products: 'id, admin_id, name, category_id, sku, synced',
    });
  }
}

export const db = new POSDatabase();
