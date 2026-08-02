const fs = require('fs');
let code = fs.readFileSync('src/components/pos/QuickSaleModal.tsx', 'utf8');

code = code.replace(
  `const [paymentMethod, setPaymentMethod] = useState<'cash'|'transfer'|'split'>('cash');`,
  `const [paymentMethod, setPaymentMethod] = useState<'cash'|'transfer'|'pos'|'split'>('cash');`
);

code = code.replace(
  `  const [splitTransfer, setSplitTransfer] = useState(0);`,
  `  const [splitTransfer, setSplitTransfer] = useState(0);
  const [splitPos, setSplitPos] = useState(0);`
);

const targetButtons = `<div className="grid grid-cols-3 gap-2">
                    <button type="button" onClick={() => setPaymentMethod('cash')} className={\`py-2 rounded-lg border \${paymentMethod === 'cash' ? 'border-[var(--color-accent)] bg-[var(--color-accent)]/10 text-[var(--color-accent)]' : 'border-[var(--color-muted)]/30 text-[var(--color-muted)] hover:border-[var(--color-muted)]'}\`}>
                      Cash
                    </button>
                    <button type="button" onClick={() => setPaymentMethod('transfer')} className={\`py-2 rounded-lg border \${paymentMethod === 'transfer' ? 'border-[var(--color-accent)] bg-[var(--color-accent)]/10 text-[var(--color-accent)]' : 'border-[var(--color-muted)]/30 text-[var(--color-muted)] hover:border-[var(--color-muted)]'}\`}>
                      Transfer
                    </button>
                    <button type="button" onClick={() => setPaymentMethod('split')} className={\`py-2 rounded-lg border \${paymentMethod === 'split' ? 'border-[var(--color-accent)] bg-[var(--color-accent)]/10 text-[var(--color-accent)]' : 'border-[var(--color-muted)]/30 text-[var(--color-muted)] hover:border-[var(--color-muted)]'}\`}>
                      Split
                    </button>
                  </div>`;
const replacementButtons = `<div className="grid grid-cols-4 gap-2">
                    {['cash', 'transfer', 'pos', 'split'].map(method => (
                      <button key={method} type="button" onClick={() => setPaymentMethod(method as any)} className={\`py-2 rounded-lg border capitalize \${paymentMethod === method ? 'border-[var(--color-accent)] bg-[var(--color-accent)]/10 text-[var(--color-accent)]' : 'border-[var(--color-muted)]/30 text-[var(--color-muted)] hover:border-[var(--color-muted)]'}\`}>
                        {method}
                      </button>
                    ))}
                  </div>`;
code = code.replace(targetButtons, replacementButtons);

const targetSplit = `{paymentMethod === 'split' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-[var(--color-muted)] mb-1 block">Cash Amount</label>
                      <Input type="number" min="0" value={splitCash} onChange={e => {
                        const val = Number(e.target.value);
                        setSplitCash(val);
                        setSplitTransfer(Math.max(0, (matchedProduct.selling_price * quantity) - val));
                      }} />
                    </div>
                    <div>
                      <label className="text-xs text-[var(--color-muted)] mb-1 block">Transfer Amount</label>
                      <Input type="number" min="0" value={splitTransfer} onChange={e => {
                        const val = Number(e.target.value);
                        setSplitTransfer(val);
                        setSplitCash(Math.max(0, (matchedProduct.selling_price * quantity) - val));
                      }} />
                    </div>
                  </div>
                )}`;
const replacementSplit = `{paymentMethod === 'split' && (
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    <div>
                      <label className="text-xs text-[var(--color-muted)] mb-1 block">Cash</label>
                      <Input type="number" min="0" value={splitCash || ''} onChange={e => setSplitCash(Number(e.target.value))} className="h-9" />
                    </div>
                    <div>
                      <label className="text-xs text-[var(--color-muted)] mb-1 block">Transfer</label>
                      <Input type="number" min="0" value={splitTransfer || ''} onChange={e => setSplitTransfer(Number(e.target.value))} className="h-9" />
                    </div>
                    <div>
                      <label className="text-xs text-[var(--color-muted)] mb-1 block">POS</label>
                      <Input type="number" min="0" value={splitPos || ''} onChange={e => setSplitPos(Number(e.target.value))} className="h-9" />
                    </div>
                  </div>
                )}`;
code = code.replace(targetSplit, replacementSplit);

const targetDisabled = `              disabled={
                !matchedProduct || quantity <= 0 || quantity > matchedProduct.quantity || processing ||
                (paymentMethod === 'split' && (splitCash + splitTransfer !== matchedProduct.selling_price * quantity))
              }`;
const replacementDisabled = `              disabled={
                !matchedProduct || quantity <= 0 || quantity > matchedProduct.quantity || processing ||
                (paymentMethod === 'split' && (splitCash + splitTransfer + splitPos !== matchedProduct.selling_price * quantity))
              }`;
code = code.replace(targetDisabled, replacementDisabled);

const targetCompleteSaleText = `{processing ? 'Processing...' : \`Complete Sale (\${paymentMethod === 'split' ? 'Split' : paymentMethod === 'transfer' ? 'Transfer' : 'Cash'})\`}`;
const replacementCompleteSaleText = `{processing ? 'Processing...' : \`Complete Sale (\${paymentMethod.charAt(0).toUpperCase() + paymentMethod.slice(1)})\`}`;
code = code.replace(targetCompleteSaleText, replacementCompleteSaleText);

const targetHandleCheckoutTotal = `        total: matchedProduct.selling_price * quantity,
        payment_method: paymentMethod,
        payment_status: 'paid',`;
const replacementHandleCheckoutTotal = `        total: matchedProduct.selling_price * quantity,
        payment_method: paymentMethod,
        split_payments: paymentMethod === 'split' ? JSON.stringify([
          ...(splitCash > 0 ? [{ method: 'cash', amount: splitCash }] : []),
          ...(splitTransfer > 0 ? [{ method: 'transfer', amount: splitTransfer }] : []),
          ...(splitPos > 0 ? [{ method: 'pos', amount: splitPos }] : [])
        ]) : null,
        payment_status: 'paid',`;
code = code.replace(targetHandleCheckoutTotal, replacementHandleCheckoutTotal);

fs.writeFileSync('src/components/pos/QuickSaleModal.tsx', code);
