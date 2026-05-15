import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } },
) {
  const { data: order } = await supabaseAdmin
    .from("orders")
    .select("order_number, gls_label_pdf")
    .eq("id", params.id)
    .maybeSingle();

  if (!order?.gls_label_pdf) {
    return NextResponse.json({ error: "No label available" }, { status: 404 });
  }

  const buf = Buffer.from(order.gls_label_pdf, "base64");
  return new NextResponse(buf, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="gls-label-${order.order_number}.pdf"`,
    },
  });
}
