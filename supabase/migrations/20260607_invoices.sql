-- Stores the Google Drive link to each order's PDF invoice.
alter table orders
  add column if not exists invoice_url text,
  add column if not exists invoice_issued_at timestamptz;
