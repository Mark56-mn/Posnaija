const fs = require('fs');
let code = fs.readFileSync('src/pages/dashboard/NewSalePage.tsx', 'utf8');

const targetUseLiveQuery = `  const categories = useLiveQuery(() => db.categories.toArray()) || [];`;
const replacementUseLiveQuery = `  const categories = useLiveQuery(() => db.categories.toArray()) || [];
  const allCustomers = useLiveQuery(() => db.customers.toArray()) || [];`;
code = code.replace(targetUseLiveQuery, replacementUseLiveQuery);

const targetCustomerInput = `          <Input 
            placeholder="Customer Name (Optional)" 
            value={cart.customerName}
            onChange={(e) => cart.setCustomerName(e.target.value)}
            className="bg-[var(--color-surface)]"
          />`;

const replacementCustomerInput = `          <div className="space-y-2">
            <div className="relative">
              <Input 
                list="customer-list"
                placeholder="Customer Name (Optional)" 
                value={cart.customerName}
                onChange={(e) => {
                  cart.setCustomerName(e.target.value);
                  const matched = allCustomers.find(c => c.name.toLowerCase() === e.target.value.toLowerCase());
                  if (matched) {
                    cart.setCustomerId(matched.id);
                  } else {
                    cart.setCustomerId('');
                    if (cart.discountType === 'points') {
                      cart.setDiscount(0, 'flat');
                    }
                  }
                }}
                className="bg-[var(--color-surface)]"
              />
              <datalist id="customer-list">
                {allCustomers.map(c => (
                  <option key={c.id} value={c.name} />
                ))}
              </datalist>
            </div>
            
            {cart.customerId && (
              <div className="flex items-center justify-between text-sm bg-[var(--color-surface)] p-2 rounded border border-[var(--color-accent)]/30">
                <span className="text-[var(--color-muted)]">Loyalty Points:</span>
                <span className="font-bold text-[var(--color-accent)]">
                  {allCustomers.find(c => c.id === cart.customerId)?.points || 0} pts
                </span>
                {(allCustomers.find(c => c.id === cart.customerId)?.points || 0) > 0 && (
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="h-7 text-xs"
                    onClick={() => {
                      const pts = allCustomers.find(c => c.id === cart.customerId)?.points || 0;
                      // 1 point = 1 discount
                      if (cart.discountType === 'points' && cart.discountValue > 0) {
                        cart.setDiscount(0, 'flat'); // remove points discount
                      } else {
                        // limit points to max total so we don't get negative total
                        const maxPointsToUse = Math.min(pts, cart.subtotal());
                        cart.setDiscount(maxPointsToUse, 'points');
                      }
                    }}
                  >
                    {cart.discountType === 'points' && cart.discountValue > 0 ? 'Remove Points' : 'Use Points'}
                  </Button>
                )}
              </div>
            )}
          </div>`;

code = code.replace(targetCustomerInput, replacementCustomerInput);

fs.writeFileSync('src/pages/dashboard/NewSalePage.tsx', code);
