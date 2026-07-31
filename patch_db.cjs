const fs = require('fs');
let code = fs.readFileSync('src/lib/db.ts', 'utf8');

// Update interfaces
code = code.replace(
  "export interface Session {\n  id: number;",
  "export interface Session {\n  id: number;\n  branch_id?: string;\n  branch_name?: string;\n  parent_admin_id?: string;"
);

code = code.replace(
  "export interface LocalProduct {\n  id: string;",
  "export interface LocalProduct {\n  id: string;\n  branch_id?: string;"
);

code = code.replace(
  "export interface LocalSale {\n  id: string;",
  "export interface LocalSale {\n  id: string;\n  branch_id?: string;"
);

code = code.replace(
  "export interface LocalStaff {\n  id: string;",
  "export interface LocalStaff {\n  id: string;\n  branch_id?: string;"
);

const localBranch = `
export interface LocalBranch {
  id: string;
  admin_id: string;
  name: string;
  location?: string;
  created_at: string;
  synced: boolean;
}
`;

code = code.replace(
  "export interface DraftOrder {",
  localBranch + "\nexport interface DraftOrder {"
);

code = code.replace(
  "sync_queue!: Table<SyncQueueItem>;",
  "sync_queue!: Table<SyncQueueItem>;\n  branches!: Table<LocalBranch>;"
);

code = code.replace(
  "this.version(3).stores({",
  "this.version(4).stores({\n      branches: 'id, admin_id, name, synced',\n      products: 'id, admin_id, branch_id, name, category_id, sku, synced',\n      sales: 'id, admin_id, branch_id, created_at, synced',\n      staff: 'id, admin_id, branch_id, synced',\n    });\n    this.version(3).stores({"
);

fs.writeFileSync('src/lib/db.ts', code);
