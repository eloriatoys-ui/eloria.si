-- Manual fulfillment timestamps. Lets us show a customer-facing progress
-- timeline (received → paid → shipped → delivered) without depending on GLS.
alter table orders
  add column if not exists shipped_at timestamptz,
  add column if not exists delivered_at timestamptz;
