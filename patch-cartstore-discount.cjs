const fs = require('fs');
let code = fs.readFileSync('src/store/cartStore.ts', 'utf8');

code = code.replace(/discountType: 'percentage' \| 'flat';/g, "discountType: 'percentage' | 'flat' | 'points';");
code = code.replace(/discountType: 'percentage' \\| 'flat';/g, "discountType: 'percentage' | 'flat' | 'points';");

// Inside discountAmount function
const targetDiscount = `  discountAmount: () => {
    const sub = get().subtotal();
    const type = get().discountType;
    const val = get().discountValue;
    if (type === 'percentage') {
      return sub * (val / 100);
    }
    return val;
  },`;
const replacementDiscount = `  discountAmount: () => {
    const sub = get().subtotal();
    const type = get().discountType;
    const val = get().discountValue;
    if (type === 'percentage') {
      return sub * (val / 100);
    }
    // For 'points', we assume 1 point = 1 Naira discount (or whatever conversion)
    if (type === 'points') {
      return val;
    }
    return val;
  },`;

code = code.replace(targetDiscount, replacementDiscount);

fs.writeFileSync('src/store/cartStore.ts', code);
