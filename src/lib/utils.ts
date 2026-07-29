import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatNaira(amount: number) {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateString: string) {
  return new Date(dateString).toLocaleString(
    'en-NG',
    {
      timeZone: 'Africa/Lagos',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }
  );
}

export function formatDateOnly(
  dateString: string
) {
  return new Date(dateString).toLocaleDateString(
    'en-NG',
    {
      timeZone: 'Africa/Lagos',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }
  );
}

export function formatTimeOnly(
  dateString: string
) {
  return new Date(dateString).toLocaleTimeString(
    'en-NG',
    {
      timeZone: 'Africa/Lagos',
      hour: '2-digit',
      minute: '2-digit',
    }
  );
}

export async function getNextReceiptNumber(
  db: any
) {
  const count = await db.sales.count();
  return `RCP-${String(count + 1).padStart(4, '0')}`;
}

export function generateWhatsAppReceipt(
  sale: any,
  business: any
): string {
  const items = JSON.parse(sale.items);
  const itemsList = items
    .map(
      (i: any) =>
        `  ${i.name} x${i.quantity} — ${formatNaira(i.selling_price * i.quantity)}`
    )
    .join('\n');

  return encodeURIComponent(
    `🧾 *${business.business_name}*
${business.business_address || ''}
${business.business_phone || ''}

Receipt: ${sale.receipt_number}
Date: ${formatDate(sale.created_at)}
Served by: ${sale.served_by}

*Items:*
${itemsList}

Subtotal: ${formatNaira(sale.subtotal)}
${sale.discount > 0 ? `Discount: -${formatNaira(sale.discount)}\n` : ''}*Total: ${formatNaira(sale.total)}*
Payment: ${sale.payment_method}
${sale.debt_amount > 0 ? `Balance owed: ${formatNaira(sale.debt_amount)}` : 'Fully paid ✅'}

Thank you for shopping with us! 🙏`
  );
}
