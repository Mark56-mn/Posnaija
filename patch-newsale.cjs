const fs = require('fs');
let code = fs.readFileSync('src/pages/dashboard/NewSalePage.tsx', 'utf8');

// 1. Remove old loadData from useEffect
const targetUseEffect = `  useEffect(() => {
    async function loadData() {
      const draft = await db.draft_orders.get('current');
      if (draft && draft.items) {
        // Simple restore (in a real app we'd prompt)
        const parsed = JSON.parse(draft.items);
        if (parsed.length > 0 && cart.items.length === 0) {
           // restoring omitted for simplicity
        }
      }
    }
    loadData();
  }, []);`;
const replacementUseEffect = `  useEffect(() => {
    cart.setActiveTable(cart.activeTable || 1);
  }, []);`;
code = code.replace(targetUseEffect, replacementUseEffect);

// 2. Modify Cart Header to include Tables
const targetCartHeader = `        <div className="p-4 border-b border-[var(--color-muted)]/10 bg-[var(--color-primary)]">
          <h2 className="font-semibold text-lg flex items-center">
            <ShoppingBag className="mr-2 h-5 w-5 text-[var(--color-accent)]" />
            Current Order
          </h2>
        </div>`;
const replacementCartHeader = `        <div className="p-4 border-b border-[var(--color-muted)]/10 bg-[var(--color-primary)]">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-lg flex items-center">
              <ShoppingBag className="mr-2 h-5 w-5 text-[var(--color-accent)]" />
              Current Order
            </h2>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {Array.from({ length: 10 }, (_, i) => i + 1).map(tableNum => (
              <button
                key={tableNum}
                onClick={() => cart.setActiveTable(tableNum)}
                className={\`px-3 py-1.5 whitespace-nowrap text-sm font-medium rounded-md border transition-colors \${cart.activeTable === tableNum ? 'bg-[var(--color-accent)]/10 border-[var(--color-accent)] text-[var(--color-accent)]' : 'border-[var(--color-muted)]/20 text-[var(--color-muted)] hover:border-[var(--color-muted)]'}\`}
              >
                Table {tableNum}
              </button>
            ))}
          </div>
        </div>`;
code = code.replace(targetCartHeader, replacementCartHeader);

fs.writeFileSync('src/pages/dashboard/NewSalePage.tsx', code);
