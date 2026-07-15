-- Meta Conversions API idempotency.
-- Timestamp set the moment a server-side Purchase event is sent for an order,
-- so a retried/duplicate Stripe webhook can never send it twice.
alter table orders
  add column if not exists meta_purchase_sent_at timestamptz;
