const fs = require('fs');
let code = fs.readFileSync('src/components/pos/QuickSaleModal.tsx', 'utf8');

const targetState = `  const [quantity, setQuantity] = useState(1);
  const [processing, setProcessing] = useState(false);`;
const replacementState = `  const [quantity, setQuantity] = useState(1);
  const [processing, setProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'cash'|'transfer'|'split'>('cash');
  const [splitCash, setSplitCash] = useState(0);
  const [splitTransfer, setSplitTransfer] = useState(0);`;

code = code.replace(targetState, replacementState);

const targetHandle = `        total: matchedProduct.selling_price * quantity,
        payment_method: 'cash',
        payment_status: 'paid',`;
const replacementHandle = `        total: matchedProduct.selling_price * quantity,
        payment_method: paymentMethod,
        payment_status: 'paid',`;
code = code.replace(targetHandle, replacementHandle);

const targetButton = `            <Button 
              type="submit" 
              className="w-full h-12 text-lg" 
              disabled={!matchedProduct || quantity <= 0 || quantity > matchedProduct.quantity || processing}
            >
              {processing ? 'Processing...' : 'Complete Sale (Cash)'}
            </Button>`;
const replacementButton = `
            {matchedProduct && (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-[var(--color-muted)] mb-2 block">Payment Method</label>
                  <div className="grid grid-cols-3 gap-2">
                    <button type="button" onClick={() => setPaymentMethod('cash')} className={\`py-2 rounded-lg border \${paymentMethod === 'cash' ? 'border-[var(--color-accent)] bg-[var(--color-accent)]/10 text-[var(--color-accent)]' : 'border-[var(--color-muted)]/30 text-[var(--color-muted)] hover:border-[var(--color-muted)]'}\`}>
                      Cash
                    </button>
                    <button type="button" onClick={() => setPaymentMethod('transfer')} className={\`py-2 rounded-lg border \${paymentMethod === 'transfer' ? 'border-[var(--color-accent)] bg-[var(--color-accent)]/10 text-[var(--color-accent)]' : 'border-[var(--color-muted)]/30 text-[var(--color-muted)] hover:border-[var(--color-muted)]'}\`}>
                      Transfer
                    </button>
                    <button type="button" onClick={() => setPaymentMethod('split')} className={\`py-2 rounded-lg border \${paymentMethod === 'split' ? 'border-[var(--color-accent)] bg-[var(--color-accent)]/10 text-[var(--color-accent)]' : 'border-[var(--color-muted)]/30 text-[var(--color-muted)] hover:border-[var(--color-muted)]'}\`}>
                      Split
                    </button>
                  </div>
                </div>

                {paymentMethod === 'split' && (
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
                )}
              </div>
            )}
            
            <Button 
              type="submit" 
              className="w-full h-12 text-lg" 
              disabled={
                !matchedProduct || quantity <= 0 || quantity > matchedProduct.quantity || processing ||
                (paymentMethod === 'split' && (splitCash + splitTransfer !== matchedProduct.selling_price * quantity))
              }
            >
              {processing ? 'Processing...' : \`Complete Sale (\${paymentMethod === 'split' ? 'Split' : paymentMethod === 'transfer' ? 'Transfer' : 'Cash'})\`}
            </Button>`;
code = code.replace(targetButton, replacementButton);

fs.writeFileSync('src/components/pos/QuickSaleModal.tsx', code);
