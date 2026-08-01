import { useState, useEffect, useRef } from 'react';
import { X, Search, ShoppingBag } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { db } from '../../lib/db';
import { formatNaira, getNextReceiptNumber } from '../../lib/utils';

export default function QuickSaleModal({ session, onClose, onSaleComplete }: any) {
  const [search, setSearch] = useState('');
  const [matchedProduct, setMatchedProduct] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [processing, setProcessing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    async function searchProduct() {
      if (search.length < 2) {
        setMatchedProduct(null);
        return;
      }
      
      const searchLower = search.toLowerCase();
      // Prioritize exact SKU match
      let exact = await db.products.where('sku').equals(search).first();
      if (exact) {
        setMatchedProduct(exact);
        return;
      }
      
      const products = await db.products.toCollection().limit(20).toArray();
      const match = products.find(p => 
        p.name.toLowerCase().includes(searchLower) || 
        (p.sku && p.sku.toLowerCase().includes(searchLower))
      );
      setMatchedProduct(match || null);
    }
    const timer = setTimeout(searchProduct, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!matchedProduct || quantity <= 0) return;
    
    setProcessing(true);
    try {
      const receipt_number = await getNextReceiptNumber(session.admin_id);
      
      const sale = {
        id: crypto.randomUUID(),
        admin_id: session.admin_id,
        branch_id: session.branch_id,
        customer_name: 'Walk-in Customer',
        items: JSON.stringify([{ ...matchedProduct, quantity }]),
        subtotal: matchedProduct.selling_price * quantity,
        discount: 0,
        tax_amount: 0,
        total: matchedProduct.selling_price * quantity,
        payment_method: 'cash',
        payment_status: 'paid',
        amount_paid: matchedProduct.selling_price * quantity,
        debt_amount: 0,
        served_by: session.name,
        staff_id: session.staff_id,
        receipt_number,
        created_at: new Date().toISOString(),
        synced: false
      };

      await db.sales.put(sale);

      await db.products.update(matchedProduct.id, {
        quantity: matchedProduct.quantity - quantity,
        updated_at: new Date().toISOString(),
        synced: false
      });

      onSaleComplete(sale);
    } catch (error) {
      console.error(error);
      alert('Failed to process sale');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <Card className="w-full max-w-md bg-[var(--color-surface)] relative max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b border-[var(--color-muted)]/10">
          <h3 className="font-semibold text-lg flex items-center">
            <ShoppingBag className="w-5 h-5 mr-2 text-[var(--color-accent)]" />
            Quick Sale
          </h3>
          <button onClick={onClose} className="text-[var(--color-muted)] hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="p-6">
          <form onSubmit={handleCheckout} className="space-y-6">
            <div>
              <label className="text-sm font-medium text-[var(--color-muted)] mb-1 block">Search SKU or Name</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[var(--color-muted)]" />
                <Input 
                  ref={inputRef}
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Scan barcode or type name..."
                  className="pl-10 h-12"
                />
              </div>
            </div>

            {matchedProduct ? (
              <div className="bg-[var(--color-background)] p-4 rounded-lg border border-[var(--color-accent)]/30">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="font-medium text-lg">{matchedProduct.name}</h4>
                    <p className="text-sm text-[var(--color-muted)]">Stock: {matchedProduct.quantity}</p>
                  </div>
                  <p className="font-bold text-lg text-[var(--color-accent)]">{formatNaira(matchedProduct.selling_price)}</p>
                </div>
                
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Quantity:</label>
                  <Input 
                    type="number" 
                    min="1" 
                    max={matchedProduct.quantity}
                    value={quantity}
                    onChange={e => setQuantity(Number(e.target.value))}
                    className="w-24 text-center h-10"
                    required
                  />
                </div>
                
                <div className="mt-4 pt-4 border-t border-[var(--color-muted)]/10 flex justify-between font-bold text-xl">
                  <span>Total:</span>
                  <span>{formatNaira(matchedProduct.selling_price * quantity)}</span>
                </div>
              </div>
            ) : (
              search.length >= 2 && (
                <div className="text-center py-8 text-[var(--color-muted)] bg-[var(--color-background)] rounded-lg">
                  No product found matching "{search}"
                </div>
              )
            )}

            <Button 
              type="submit" 
              className="w-full h-12 text-lg" 
              disabled={!matchedProduct || quantity <= 0 || quantity > matchedProduct.quantity || processing}
            >
              {processing ? 'Processing...' : 'Complete Sale (Cash)'}
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
}
