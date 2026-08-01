const fs = require('fs');
let code = fs.readFileSync('src/lib/db.ts', 'utf8');

const target1 = `export interface StockAuditLog {`;
const replacement1 = `export interface LocalPasskey {
  id: string;
  admin_id: string;
  name: string;
  email: string;
  created_at: string;
}

export interface StockAuditLog {`;

code = code.replace(target1, replacement1);

const target2 = `  stock_audit_logs!: Table<StockAuditLog>;`;
const replacement2 = `  stock_audit_logs!: Table<StockAuditLog>;
  passkeys!: Table<LocalPasskey>;`;

code = code.replace(target2, replacement2);

const target3 = `    this.version(4).stores({`;
const replacement3 = `    this.version(5).stores({
      passkeys: 'id, admin_id, email',
    });
    this.version(4).stores({`;

code = code.replace(target3, replacement3);

fs.writeFileSync('src/lib/db.ts', code);
