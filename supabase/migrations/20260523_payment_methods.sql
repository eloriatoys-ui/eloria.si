-- Add payment-method tracking + new statuses for bank transfer / COD
-- Apply via Supabase Dashboard → SQL Editor → Run.

alter table orders
  add column if not exists payment_method text not null default 'card',
  add column if not exists cod_surcharge numeric(10,2) not null default 0,
  add column if not exists paid_at timestamptz;

-- payment_method values: 'card' | 'bank_transfer' | 'cod'
-- payment_status now also supports: 'awaiting_payment' (bank transfer pending) | 'cod_pending' (COD pending delivery)
create index if not exists orders_payment_method_idx on orders(payment_method);
create index if not exists orders_payment_status_idx on orders(payment_status);
