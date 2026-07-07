// Issuer details printed on every invoice. Defaults match JENIX GROUP d.o.o.;
// override via env. DDV (VAT) number must be set for a valid invoice.
export const company = {
  name: process.env.INVOICE_COMPANY_NAME ?? "JENIX GROUP d.o.o.",
  address: process.env.INVOICE_COMPANY_ADDRESS ?? "Dvorje 82A",
  city: process.env.INVOICE_COMPANY_CITY ?? "4207 Cerklje na Gorenjskem",
  country: process.env.INVOICE_COMPANY_COUNTRY ?? "Slovenija",
  // e.g. "SI12345678" — must be filled for a compliant invoice.
  vatId: process.env.INVOICE_VAT_ID ?? "",
  iban: process.env.ELORIA_BANK_IBAN ?? "",
  bic: process.env.ELORIA_BANK_BIC ?? "",
  email: process.env.GLS_SENDER_CONTACT_EMAIL ?? "eloriatoys@gmail.com",
  // VAT rate applied to gross prices (Slovenia standard = 22%).
  vatRate: Number(process.env.INVOICE_VAT_RATE ?? "22"),
};
