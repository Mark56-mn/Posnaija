const fs = require('fs');
let code = fs.readFileSync('src/lib/db.ts', 'utf8');

const targetCustomer = `export interface LocalCustomer {
  id: string;
  admin_id: string;
  name: string;
  phone?: string;
  whatsapp?: string;
  total_debt: number;
  created_at: string;
  synced: boolean;
}`;
const replacementCustomer = `export interface LocalCustomer {
  id: string;
  admin_id: string;
  name: string;
  phone?: string;
  whatsapp?: string;
  total_debt: number;
  points?: number;
  created_at: string;
  synced: boolean;
}`;
code = code.replace(targetCustomer, replacementCustomer);

fs.writeFileSync('src/lib/db.ts', code);
