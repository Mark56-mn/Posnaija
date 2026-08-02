const fs = require('fs');
let code = fs.readFileSync('src/pages/dashboard/NewSalePage.tsx', 'utf8');

const targetDebt = `    if (cart.debtAmount() > 0) {
      const debt = {
        id: crypto.randomUUID(),
        admin_id: session.admin_id,
        customer_id: cart.customerId || undefined,
        customer_name: cart.customerName || 'Walk-in',
        sale_id: saleId,
        amount: cart.debtAmount(),
        amount_paid: 0,
        balance: cart.debtAmount(),
        status: 'unpaid',
        created_at: new Date().toISOString(),
        synced: false,
      };
      await db.debts.put(debt);
    }`;

const replacementDebt = targetDebt + `

    // Loyalty Points Logic
    if (cart.customerId) {
      const c = await db.customers.get(cart.customerId);
      if (c) {
        // Earn 1 point per 100 spent
        const earnedPoints = Math.floor(cart.total() / 100);
        
        // If points were used for discount, subtract them
        // Let's assume cart.discountType === 'points', then we used discountValue points
        // Or if we just have a general discount, we might want a specific field for points used.
        // For simplicity, let's just add earned points right now. We can handle redemption separately.
        const usedPoints = (cart.discountType as any) === 'points' ? cart.discountValue : 0;
        
        await db.customers.update(cart.customerId, {
          points: (c.points || 0) + earnedPoints - usedPoints,
          synced: false
        });
      }
    }`;

code = code.replace(targetDebt, replacementDebt);
fs.writeFileSync('src/pages/dashboard/NewSalePage.tsx', code);
