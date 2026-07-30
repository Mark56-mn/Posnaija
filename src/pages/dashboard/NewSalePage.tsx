import { useEffect, useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { useCartStore } from '../../store/cartStore';
import { db } from '../../lib/db';
import { supabase } from '../../lib/supabase';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { formatNaira, getNextReceiptNumber } from '../../lib/utils';
import { Search, Plus, Minus, Trash2, ShoppingBag, ScanLine } from 'lucide-react';
import { usePermissions } from '../../hooks/usePermissions';
import ReceiptModal from '../../components/pos/ReceiptModal';
import BarcodeScannerModal from '../../components/pos/BarcodeScannerModal';

export default function NewSalePage() {
  const { session } = usePermissions();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [completedSale, setCompletedSale] = useState<any>(null);
  const [showReceipt, setShowReceipt] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const cart = useCartStore();

  const categories = useLiveQuery(() => db.categories.toArray()) || [];
  
  const filteredProducts = useLiveQuery(
    async () => {
      const searchLower = search.toLowerCase();
      let query: any = db.products.toCollection();

      if (activeCategory !== 'all') {
        query = db.products.where('category_id').equals(activeCategory);
      }

      if (searchLower) {
        return await query.filter((p: any) => p.name.toLowerCase().includes(searchLower) || (p.sku && p.sku.toLowerCase().includes(searchLower))).limit(50).toArray();
      }

      return await query.limit(100).toArray();
    },
    [search, activeCategory]
  ) || [];

  useEffect(() => {
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
  }, []);

  // Barcode Scanner Listener
  useEffect(() => {
    let barcodeBuffer = '';
    let lastKeyTime = Date.now();

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in an input field (scanner will act as keyboard input there anyway)
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      const currentTime = Date.now();
      
      // If time between keystrokes > 50ms, it's human typing, not a scanner
      if (currentTime - lastKeyTime > 50) {
        barcodeBuffer = '';
      }
      
      lastKeyTime = currentTime;

      if (e.key === 'Enter') {
        if (barcodeBuffer.length > 0) {
          db.products.where('sku').equals(barcodeBuffer).first().then(scannedProduct => {
            if (scannedProduct) {
               if (scannedProduct.quantity > 0) {
                 cart.addItem(scannedProduct);
               } else {
                 alert(`Product "${scannedProduct.name}" is out of stock!`);
               }
            }
          });
          barcodeBuffer = '';
        }
      } else if (e.key.length === 1) {
        barcodeBuffer += e.key;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [cart]);

  const handleCompleteSale = async () => {
    if (!session) return;
    if (cart.items.length === 0) return;

    const saleId = crypto.randomUUID();
    const receiptNum = await getNextReceiptNumber(db);
    
    const sale = {
      id: saleId,
      admin_id: session.admin_id,
      customer_name: cart.customerName || 'Walk-in',
      customer_id: cart.customerId || undefined,
      items: JSON.stringify(cart.items),
      subtotal: cart.subtotal(),
      discount: cart.discountAmount(),
      tax_amount: cart.taxAmount(),
      total: cart.total(),
      payment_method: cart.paymentMethod,
      split_payments: cart.paymentMethod === 'split' ? JSON.stringify(cart.splitPayments.filter(p => p.amount > 0)) : null,
      payment_status: cart.debtAmount() > 0 ? 'partial' : 'paid',
      amount_paid: cart.amountPaid,
      debt_amount: cart.debtAmount(),
      served_by: session.name,
      staff_id: session.staff_id,
      receipt_number: receiptNum,
      created_at: new Date().toISOString(),
      synced: false,
    };

    await db.sales.put(sale);

    for (const item of cart.items) {
      const product = await db.products.get(item.id);
      if (product) {
        await db.products.update(item.id, {
          quantity: product.quantity - item.quantity,
          synced: false,
          updated_at: new Date().toISOString(),
        });
      }
    }

    if (cart.debtAmount() > 0) {
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
    }

    if (navigator.onLine) {
      const { synced, ...supabaseSale } = sale;
      const { error } = await supabase.from('sales').upsert(supabaseSale);
      if (!error) await db.sales.update(saleId, { synced: true });
    }

    cart.clearCart();
    setCompletedSale(sale);
    setShowReceipt(true);
  };

  return (
    <div className="flex flex-col lg:flex-row h-full gap-6">
      {/* LEFT: Products */}
      <div className="flex-1 flex flex-col min-h-0 bg-[var(--color-surface)] rounded-xl border border-[var(--color-muted)]/10 overflow-hidden">
        <div className="p-4 border-b border-[var(--color-muted)]/10 space-y-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[var(--color-muted)]" />
              <Input 
                placeholder="Search products or scan barcode..." 
                value={search} 
                onChange={e => setSearch(e.target.value)}
                onKeyDown={async e => {
                  if (e.key === 'Enter' && search) {
                    const searchLower = search.toLowerCase();
                    const matched = await db.products.filter(p => p.sku === search || p.name.toLowerCase() === searchLower).first();
                    if (matched) {
                      if (matched.quantity > 0) {
                        cart.addItem(matched);
                        setSearch('');
                      } else {
                        alert(`Product "${matched.name}" is out of stock!`);
                      }
                    }
                  }
                }}
                className="pl-10 h-12 text-lg bg-[var(--color-background)]"
              />
            </div>
            <Button variant="outline" className="h-12 w-12 p-0 flex items-center justify-center border-[var(--color-muted)]/20 hover:border-[var(--color-accent)]/50" onClick={() => setShowScanner(true)}>
              <ScanLine className="h-5 w-5" />
            </Button>
          </div>
          <div className="flex overflow-x-auto pb-2 space-x-2 scrollbar-hide">
            <Button 
              variant={activeCategory === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveCategory('all')}
              className="whitespace-nowrap rounded-full"
            >
              All
            </Button>
            {categories.map(c => (
              <Button 
                key={c.id}
                variant={activeCategory === c.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveCategory(c.id)}
                className="whitespace-nowrap rounded-full"
              >
                {c.name}
              </Button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredProducts.map(p => {
              const outOfStock = p.quantity <= 0;
              return (
                <button
                  key={p.id}
                  disabled={outOfStock}
                  onClick={() => cart.addItem(p)}
                  className={`text-left p-4 rounded-xl border transition-all ${outOfStock ? 'opacity-50 cursor-not-allowed border-[var(--color-muted)]/10 bg-[var(--color-background)]' : 'border-[var(--color-muted)]/20 bg-[var(--color-background)] hover:border-[var(--color-accent)] hover:shadow-lg'}`}
                >
                  <p className="font-medium text-[var(--color-text)] truncate">{p.name}</p>
                  <p className="text-[var(--color-accent)] font-bold mt-1">{formatNaira(p.selling_price)}</p>
                  <p className="text-xs text-[var(--color-muted)] mt-2">Stock: {p.quantity} {p.unit}</p>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* RIGHT: Cart */}
      <div className="w-full lg:w-96 flex flex-col bg-[var(--color-surface)] rounded-xl border border-[var(--color-muted)]/10 overflow-hidden shrink-0">
        <div className="p-4 border-b border-[var(--color-muted)]/10 bg-[var(--color-primary)]">
          <h2 className="font-semibold text-lg flex items-center">
            <ShoppingBag className="mr-2 h-5 w-5 text-[var(--color-accent)]" />
            Current Order
          </h2>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {cart.items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-[var(--color-muted)]">
              <ShoppingBag className="h-12 w-12 mb-2 opacity-20" />
              <p>Cart is empty</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.items.map(item => (
                <div key={item.id} className="flex justify-between items-start border-b border-[var(--color-muted)]/10 pb-4">
                  <div className="flex-1">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-[var(--color-accent)]">{formatNaira(item.selling_price)}</p>
                    <div className="flex items-center space-x-3 mt-2">
                      <button onClick={() => cart.updateQty(item.id, item.quantity - 1)} className="p-1 rounded bg-[var(--color-background)] text-[var(--color-text)] hover:bg-[var(--color-muted)]/20">
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-6 text-center">{item.quantity}</span>
                      <button onClick={() => cart.updateQty(item.id, item.quantity + 1)} className="p-1 rounded bg-[var(--color-background)] text-[var(--color-text)] hover:bg-[var(--color-muted)]/20">
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <div className="text-right flex flex-col items-end">
                    <p className="font-semibold">{formatNaira(item.selling_price * item.quantity)}</p>
                    <button onClick={() => cart.removeItem(item.id)} className="p-1 mt-2 text-[var(--color-danger)] hover:bg-[var(--color-danger)]/10 rounded">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-4 bg-[var(--color-background)] border-t border-[var(--color-muted)]/10 space-y-4">
          <Input 
            placeholder="Customer Name (Optional)" 
            value={cart.customerName}
            onChange={(e) => cart.setCustomerName(e.target.value)}
            className="bg-[var(--color-surface)]"
          />
          
          <div className="grid grid-cols-4 gap-2">
            {['cash', 'transfer', 'pos', 'split'].map(m => (
              <button 
                key={m}
                onClick={() => {
                  cart.setPaymentMethod(m);
                  if (m !== 'split') {
                    cart.setAmountPaid(cart.total());
                  } else {
                    cart.setAmountPaid(0);
                    cart.setSplitPayments([]);
                  }
                }}
                className={`py-2 text-xs uppercase rounded font-medium transition-colors ${cart.paymentMethod === m ? 'bg-[var(--color-accent)] text-[var(--color-primary)]' : 'bg-[var(--color-surface)] text-[var(--color-muted)] hover:text-[var(--color-text)]'}`}
              >
                {m}
              </button>
            ))}
          </div>

          {cart.paymentMethod === 'split' ? (
            <div className="space-y-2 pt-2 border-t border-[var(--color-muted)]/10">
               {['cash', 'transfer', 'pos'].map(method => (
                 <div key={method} className="flex items-center gap-2">
                    <span className="text-[var(--color-muted)] w-20 capitalize text-sm">{method}</span>
                    <Input
                       type="number"
                       placeholder="Amount"
                       value={cart.splitPayments.find(p => p.method === method)?.amount || ''}
                       onChange={e => {
                         const val = Number(e.target.value);
                         let newSplits = [...cart.splitPayments];
                         const idx = newSplits.findIndex(p => p.method === method);
                         if (idx >= 0) newSplits[idx].amount = val;
                         else newSplits.push({ method, amount: val });
                         cart.setSplitPayments(newSplits);
                         const sum = newSplits.reduce((acc, p) => acc + (p.amount || 0), 0);
                         cart.setAmountPaid(sum);
                       }}
                       className="bg-[var(--color-surface)] h-9"
                    />
                 </div>
               ))}
            </div>
          ) : (
            <div className="flex items-center gap-2 pt-2 border-t border-[var(--color-muted)]/10">
               <span className="text-[var(--color-muted)] w-20 text-sm">Amt Paid</span>
               <Input
                  type="number"
                  placeholder="Amount Paid"
                  value={cart.amountPaid || ''}
                  onChange={e => cart.setAmountPaid(Number(e.target.value))}
                  className="bg-[var(--color-surface)] h-9 flex-1"
               />
               <Button variant="outline" size="sm" onClick={() => cart.setAmountPaid(cart.total())}>
                 Exact
               </Button>
            </div>
          )}

          <div className="space-y-2 text-sm pt-2">
            <div className="flex justify-between">
              <span className="text-[var(--color-muted)]">Subtotal</span>
              <span>{formatNaira(cart.subtotal())}</span>
            </div>

            <div className="flex items-center gap-2 py-2">
               <Input 
                 type="number"
                 placeholder="Discount"
                 value={cart.discountValue || ''}
                 onChange={e => cart.setDiscount(Number(e.target.value), cart.discountType)}
                 className="h-9 flex-1 bg-[var(--color-surface)]"
                 min="0"
               />
               <div className="flex items-center bg-[var(--color-surface)] border border-[var(--color-muted)]/20 rounded p-1">
                 <button 
                   onClick={() => cart.setDiscount(cart.discountValue, 'flat')}
                   className={`px-3 py-1 rounded text-xs font-bold transition-colors ${cart.discountType === 'flat' ? 'bg-[var(--color-accent)] text-[var(--color-primary)]' : 'text-[var(--color-muted)] hover:text-[var(--color-text)]'}`}
                 >
                   ₦
                 </button>
                 <button 
                   onClick={() => cart.setDiscount(cart.discountValue, 'percentage')}
                   className={`px-3 py-1 rounded text-xs font-bold transition-colors ${cart.discountType === 'percentage' ? 'bg-[var(--color-accent)] text-[var(--color-primary)]' : 'text-[var(--color-muted)] hover:text-[var(--color-text)]'}`}
                 >
                   %
                 </button>
               </div>
            </div>
            
            <div className="flex items-center gap-2 py-2">
               <span className="text-[var(--color-muted)] w-20">Tax Rate:</span>
               <div className="relative flex-1">
                 <Input 
                   type="number"
                   placeholder="Tax Rate"
                   value={cart.taxRate || ''}
                   onChange={e => cart.setTaxRate(Number(e.target.value))}
                   className="h-9 w-full bg-[var(--color-surface)] pr-8"
                   min="0"
                 />
                 <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)]">%</span>
               </div>
            </div>

            {cart.discountAmount() > 0 && (
              <div className="flex justify-between text-[var(--color-danger)]">
                <span>Discount</span>
                <span>-{formatNaira(cart.discountAmount())}</span>
              </div>
            )}

            {cart.taxAmount() > 0 && (
              <div className="flex justify-between text-[var(--color-warning)]">
                <span>Tax</span>
                <span>+{formatNaira(cart.taxAmount())}</span>
              </div>
            )}
            
            <div className="flex justify-between text-xl font-bold text-[var(--color-accent)] pt-2 border-t border-[var(--color-muted)]/10">
              <span>Total</span>
              <span>{formatNaira(cart.total())}</span>
            </div>

            {cart.amountPaid > 0 && (
              <div className="flex justify-between pt-2 border-t border-[var(--color-muted)]/10">
                <span className="text-[var(--color-muted)]">Amount Paid</span>
                <span>{formatNaira(cart.amountPaid)}</span>
              </div>
            )}
            
            {cart.change() > 0 && (
              <div className="flex justify-between text-[var(--color-success)] font-medium">
                <span>Change</span>
                <span>{formatNaira(cart.change())}</span>
              </div>
            )}
            
            {cart.debtAmount() > 0 && (
              <div className="flex justify-between text-[var(--color-danger)] font-medium">
                <span>Balance Due</span>
                <span>{formatNaira(cart.debtAmount())}</span>
              </div>
            )}
          </div>

          <Button 
            size="lg" 
            className="w-full h-14 text-lg" 
            disabled={cart.items.length === 0}
            onClick={handleCompleteSale}
          >
            Complete Sale
          </Button>
        </div>
      </div>
      
      {showReceipt && completedSale && (
        <ReceiptModal 
          sale={completedSale} 
          session={session} 
          onClose={() => {
            setShowReceipt(false);
            setCompletedSale(null);
          }} 
        />
      )}

      {showScanner && (
        <BarcodeScannerModal
          onScan={(decodedText) => {
            setShowScanner(false);
            const matched = products.find(p => p.sku === decodedText);
            if (matched) {
              if (matched.quantity > 0) {
                cart.addItem(matched);
              } else {
                alert(`Product "${matched.name}" is out of stock!`);
              }
            } else {
              alert(`No product found for barcode: ${decodedText}`);
            }
          }}
          onClose={() => setShowScanner(false)}
        />
      )}
    </div>
  );
}
