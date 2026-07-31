import { formatNaira, formatDate, generateWhatsAppReceipt } from '../../lib/utils';
import { Button } from '../ui/Button';
import { Printer, Share2, X } from 'lucide-react';
import { Card } from '../ui/Card';
import { QRCodeSVG } from 'qrcode.react';

export default function ReceiptModal({ sale, session, onClose }: any) {
  if (!sale) return null;
  
  const items = JSON.parse(sale.items);

  const handlePrint = () => {
    window.print();
  };

  const handleWhatsApp = () => {
    const text = generateWhatsAppReceipt(sale, {
      business_name: session.business_name,
      business_address: session.business_address || '',
      business_phone: session.business_phone || '',
    });
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const qrPayload = `Receipt: ${sale.receipt_number}\nTotal: ${formatNaira(sale.total)}\nDate: ${formatDate(sale.created_at)}\nStore: ${session.business_name}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 print:static print:bg-transparent print:p-0 print:block">
      <Card className="w-full max-w-sm bg-[var(--color-surface)] relative max-h-[90vh] flex flex-col print-card print:border-none print:shadow-none print:static print:max-h-none print:max-w-none print:block">
        <button onClick={onClose} className="absolute right-4 top-4 text-[var(--color-muted)] hover:text-white no-print z-10">
          <X className="h-5 w-5" />
        </button>
        
        <div className="flex-1 overflow-y-auto p-6 print:overflow-visible print:p-0 print:w-[80mm] print:absolute print:top-0 print:left-0" id="printable-receipt">
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-print">{session.business_name}</h2>
            {session.business_address && <p className="text-sm mt-1 text-print">{session.business_address}</p>}
            {session.business_phone && <p className="text-sm text-print">{session.business_phone}</p>}
          </div>
          
          <div className="border-b border-t border-dashed border-[var(--color-muted)]/30 py-3 mb-4 space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-print">Receipt:</span>
              <span className="text-print">{sale.receipt_number}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-print">Date:</span>
              <span className="text-print">{formatDate(sale.created_at)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-print">Cashier:</span>
              <span className="text-print">{sale.served_by}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-print">Customer:</span>
              <span className="text-print">{sale.customer_name}</span>
            </div>
          </div>

          <div className="space-y-3 mb-4">
            <div className="flex justify-between font-bold text-sm border-b border-[var(--color-muted)]/30 pb-2">
              <span className="text-print">Item</span>
              <span className="text-print">Total</span>
            </div>
            {items.map((item: any, idx: number) => (
              <div key={idx} className="text-sm flex justify-between">
                <div>
                  <p className="text-print">{item.name}</p>
                  <p className="text-xs text-[var(--color-muted)] text-print-muted">{item.quantity} x {formatNaira(item.selling_price)}</p>
                </div>
                <p className="text-print">{formatNaira(item.selling_price * item.quantity)}</p>
              </div>
            ))}
          </div>

          <div className="border-t border-dashed border-[var(--color-muted)]/30 pt-3 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-print">Subtotal:</span>
              <span className="text-print">{formatNaira(sale.subtotal)}</span>
            </div>
            {sale.discount > 0 && (
              <div className="flex justify-between">
                <span className="text-print">Discount:</span>
                <span className="text-print">-{formatNaira(sale.discount)}</span>
              </div>
            )}
            {sale.tax_amount > 0 && (
              <div className="flex justify-between">
                <span className="text-print">Tax:</span>
                <span className="text-print">+{formatNaira(sale.tax_amount)}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-lg pt-2 border-t border-[var(--color-muted)]/30">
              <span className="text-print">Total:</span>
              <span className="text-print">{formatNaira(sale.total)}</span>
            </div>
            
            {sale.payment_method === 'split' && sale.split_payments ? (
              <div className="pt-2 border-t border-[var(--color-muted)]/10 space-y-1">
                <span className="text-print font-semibold text-xs uppercase mb-1 block">Split Payments:</span>
                {JSON.parse(sale.split_payments).map((sp: any, i: number) => (
                  <div key={i} className="flex justify-between text-xs">
                    <span className="text-print uppercase">{sp.method}</span>
                    <span className="text-print">{formatNaira(sp.amount)}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex justify-between">
                <span className="text-print">Paid ({sale.payment_method.toUpperCase()}):</span>
                <span className="text-print">{formatNaira(sale.amount_paid)}</span>
              </div>
            )}

            {sale.payment_method === 'split' && (
              <div className="flex justify-between font-medium">
                <span className="text-print">Total Paid:</span>
                <span className="text-print">{formatNaira(sale.amount_paid)}</span>
              </div>
            )}
            
            {sale.debt_amount > 0 ? (
              <div className="flex justify-between text-[var(--color-danger)] font-medium text-print">
                <span>Balance Owed:</span>
                <span>{formatNaira(sale.debt_amount)}</span>
              </div>
            ) : (
              <div className="flex justify-between text-[var(--color-success)] font-medium text-print">
                <span>Change:</span>
                <span>{formatNaira(Math.max(0, sale.amount_paid - sale.total))}</span>
              </div>
            )}
          </div>
          
          <div className="flex flex-col items-center justify-center mt-6 pt-4 border-t border-[var(--color-muted)]/30">
            <div className="bg-white p-2 rounded-lg">
              <QRCodeSVG value={qrPayload} size={96} level="L" includeMargin={false} />
            </div>
            <p className="text-xs text-[var(--color-muted)] mt-2 text-print-muted text-center">Scan to save digital receipt</p>
          </div>
          
          <div className="text-center mt-4 text-sm italic text-print">
            Thank you for your patronage!
          </div>
        </div>

        <div className="p-4 border-t border-[var(--color-muted)]/10 grid grid-cols-2 gap-3 no-print">
          <Button variant="outline" onClick={handlePrint} className="flex items-center justify-center border-[var(--color-muted)]/30 hover:bg-[var(--color-muted)]/10 hover:text-[var(--color-text)]">
            <Printer className="w-4 h-4 mr-2" /> Print
          </Button>
          <Button onClick={handleWhatsApp} className="flex items-center justify-center bg-[#25D366] hover:bg-[#20bd5a] text-white border-none">
            <Share2 className="w-4 h-4 mr-2" /> Share
          </Button>
        </div>
      </Card>
    </div>
  );
}
