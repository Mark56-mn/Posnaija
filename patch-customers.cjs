const fs = require('fs');
let code = fs.readFileSync('src/pages/dashboard/CustomersPage.tsx', 'utf8');

const targetCustomer = `    const customer = {
      id,
      admin_id: session.admin_id,
      ...formData,
      total_debt: 0,
      created_at: new Date().toISOString(),
      synced: false
    };`;
const replacementCustomer = `    const customer = {
      id,
      admin_id: session.admin_id,
      ...formData,
      total_debt: 0,
      points: 0,
      created_at: new Date().toISOString(),
      synced: false
    };`;
code = code.replace(targetCustomer, replacementCustomer);

const targetHeader = `<th className="p-4 font-medium">WhatsApp</th>
                <th className="p-4 font-medium text-right">Actions</th>`;
const replacementHeader = `<th className="p-4 font-medium">WhatsApp</th>
                <th className="p-4 font-medium">Loyalty Points</th>
                <th className="p-4 font-medium text-right">Actions</th>`;
code = code.replace(targetHeader, replacementHeader);

const targetRow = `<td className="p-4 text-[var(--color-muted)]">{c.whatsapp || '—'}</td>
                  <td className="p-4 text-right">`;
const replacementRow = `<td className="p-4 text-[var(--color-muted)]">{c.whatsapp || '—'}</td>
                  <td className="p-4 font-medium text-[var(--color-accent)]">{c.points || 0} pts</td>
                  <td className="p-4 text-right">`;
code = code.replace(targetRow, replacementRow);

const targetColspan = `<td colSpan={4} className="p-8 text-center text-[var(--color-muted)]">No customers found.</td>`;
const replacementColspan = `<td colSpan={5} className="p-8 text-center text-[var(--color-muted)]">No customers found.</td>`;
code = code.replace(targetColspan, replacementColspan);

fs.writeFileSync('src/pages/dashboard/CustomersPage.tsx', code);
