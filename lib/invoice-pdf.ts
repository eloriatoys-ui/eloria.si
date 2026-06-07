import "server-only";
import fs from "node:fs";
import path from "node:path";
import { PDFDocument, rgb, type PDFFont, type PDFPage } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import { company } from "@/lib/company";

export type InvoiceData = {
  invoice_number: string;
  issued_at?: Date;
  customer: { name?: string; lines: string[]; email?: string };
  items: Array<{ product_name: string; quantity: number; unit_price: number; total: number }>;
  total: number;
  payment_method?: string | null;
  reference?: string | null; // bank-transfer payment reference
};

const ORANGE = rgb(0.82, 0.41, 0.12);
const INK = rgb(0.17, 0.17, 0.17);
const MUTED = rgb(0.45, 0.45, 0.45);
const LINE = rgb(0.85, 0.83, 0.8);

function fontPath(file: string) {
  return path.join(process.cwd(), "lib", "assets", file);
}

function eur(n: number) {
  return `${n.toFixed(2)} €`;
}

function dmy(d: Date) {
  const p = (x: number) => String(x).padStart(2, "0");
  return `${p(d.getDate())}.${p(d.getMonth() + 1)}.${d.getFullYear()}`;
}

function paymentLabel(m?: string | null) {
  if (m === "bank_transfer") return "Bančno nakazilo (UPN)";
  if (m === "cod") return "Po povzetju";
  return "Kartica";
}

export async function generateInvoicePdf(data: InvoiceData): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  doc.registerFontkit(fontkit);
  const font = await doc.embedFont(fs.readFileSync(fontPath("DejaVuSans.ttf")), { subset: true });
  const bold = await doc.embedFont(fs.readFileSync(fontPath("DejaVuSans-Bold.ttf")), { subset: true });

  const page = doc.addPage([595.28, 841.89]); // A4
  const W = 595.28;
  const M = 48; // margin
  let y = 792;

  const text = (
    p: PDFPage,
    s: string,
    x: number,
    yy: number,
    size: number,
    f: PDFFont = font,
    color = INK,
  ) => p.drawText(s, { x, y: yy, size, font: f, color });

  const right = (s: string, xRight: number, yy: number, size: number, f: PDFFont = font, color = INK) => {
    const w = f.widthOfTextAtSize(s, size);
    text(page, s, xRight - w, yy, size, f, color);
  };

  // ── Header: issuer (left) + RAČUN (right) ──
  text(page, company.name, M, y, 16, bold, ORANGE);
  right("RAČUN", W - M, y, 22, bold, INK);
  y -= 18;
  text(page, company.address, M, y, 9, font, MUTED);
  right(`Št.: ${data.invoice_number}`, W - M, y, 10, font, INK);
  y -= 12;
  text(page, company.city, M, y, 9, font, MUTED);
  right(`Datum: ${dmy(data.issued_at ?? new Date())}`, W - M, y, 10, font, INK);
  y -= 12;
  text(page, company.country, M, y, 9, font, MUTED);
  y -= 12;
  if (company.vatId) text(page, `ID za DDV: ${company.vatId}`, M, y, 9, font, MUTED);
  else text(page, "ID za DDV: (ni vnesen)", M, y, 9, font, rgb(0.8, 0.2, 0.2));

  // ── Bill to ──
  y -= 34;
  text(page, "KUPEC", M, y, 9, bold, MUTED);
  y -= 15;
  if (data.customer.name) { text(page, data.customer.name, M, y, 11, bold); y -= 13; }
  for (const l of data.customer.lines) { if (l) { text(page, l, M, y, 10, font); y -= 12; } }
  if (data.customer.email) { text(page, data.customer.email, M, y, 9, font, MUTED); y -= 12; }

  // ── Items table ──
  y -= 18;
  const colQty = 320, colPrice = 410, colSum = W - M;
  text(page, "Artikel", M, y, 9, bold, MUTED);
  right("Kol.", colQty + 20, y, 9, bold, MUTED);
  right("Cena", colPrice + 20, y, 9, bold, MUTED);
  right("Skupaj", colSum, y, 9, bold, MUTED);
  y -= 8;
  page.drawLine({ start: { x: M, y }, end: { x: W - M, y }, thickness: 1, color: LINE });
  y -= 16;
  for (const it of data.items) {
    text(page, it.product_name.slice(0, 48), M, y, 10, font);
    right(String(it.quantity), colQty + 20, y, 10);
    right(eur(it.unit_price), colPrice + 20, y, 10);
    right(eur(it.total), colSum, y, 10);
    y -= 16;
  }

  // ── Totals (prices are gross / VAT-inclusive) ──
  y -= 6;
  page.drawLine({ start: { x: 320, y }, end: { x: W - M, y }, thickness: 1, color: LINE });
  y -= 18;
  const rate = company.vatRate;
  const net = rate > 0 ? data.total / (1 + rate / 100) : data.total;
  const vat = data.total - net;
  const label = (s: string, v: string, f: PDFFont = font, color = INK, size = 10) => {
    text(page, s, 320, y, size, f, color);
    right(v, colSum, y, size, f, color);
    y -= 16;
  };
  label("Osnova (brez DDV)", eur(net), font, MUTED);
  label(`DDV ${rate}%`, eur(vat), font, MUTED);
  y -= 2;
  page.drawLine({ start: { x: 320, y: y + 8 }, end: { x: W - M, y: y + 8 }, thickness: 1, color: LINE });
  label("Za plačilo", eur(data.total), bold, INK, 12);

  // ── Payment info ──
  y -= 16;
  text(page, `Način plačila: ${paymentLabel(data.payment_method)}`, M, y, 9, font, MUTED);
  if (data.payment_method === "bank_transfer" && company.iban) {
    y -= 12;
    text(page, `IBAN: ${company.iban}   BIC: ${company.bic}`, M, y, 9, font, MUTED);
    if (data.reference) { y -= 12; text(page, `Sklic: ${data.reference}`, M, y, 9, font, MUTED); }
  }

  // ── Footer ──
  text(page, `${company.name} · ${company.email}`, M, 40, 8, font, MUTED);
  if (!company.vatId) {
    text(page, "Opomba: za davčno skladnost je potrebno davčno potrjevanje računa (FURS).", M, 28, 7, font, rgb(0.7, 0.3, 0.3));
  }

  return doc.save();
}
