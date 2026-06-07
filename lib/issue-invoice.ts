import "server-only";
import { supabaseAdmin } from "@/lib/supabase/server";
import { generateInvoicePdf } from "@/lib/invoice-pdf";
import { uploadInvoiceToDrive } from "@/lib/gdrive";
import { buildReference } from "@/lib/upn-qr";
import type { OrderEmailData } from "@/lib/email";

// Generates the PDF invoice for an order, uploads it to Google Drive, and saves
// the link on the order. Best-effort and idempotent: skips if already issued.
export async function issueInvoice(orderId: string, order: OrderEmailData): Promise<void> {
  try {
    const { data: existing } = await supabaseAdmin
      .from("orders")
      .select("invoice_url, invoice_issued_at")
      .eq("id", orderId)
      .maybeSingle();
    if (existing?.invoice_url) return; // already issued

    const a = order.shipping_address ?? {};
    const bytes = await generateInvoicePdf({
      invoice_number: order.order_number,
      customer: {
        name: a.name ?? undefined,
        lines: [a.line1, a.line2, [a.postal_code, a.city].filter(Boolean).join(" "), a.country]
          .filter((l): l is string => Boolean(l)),
        email: order.email,
      },
      items: order.items,
      total: order.total,
      payment_method: order.payment_method,
      reference: order.payment_method === "bank_transfer" ? buildReference(order.order_number) : null,
    });

    const fileName = `Racun-${order.order_number}.pdf`;
    const url = await uploadInvoiceToDrive(fileName, bytes);

    await supabaseAdmin
      .from("orders")
      .update({ invoice_url: url, invoice_issued_at: new Date().toISOString() })
      .eq("id", orderId);
  } catch (err) {
    console.error("[issue-invoice] failed for", order.order_number, err);
  }
}
