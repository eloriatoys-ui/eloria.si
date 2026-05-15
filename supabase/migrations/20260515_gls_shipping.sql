-- Add GLS Slovenia shipping fields to orders
-- Apply via Supabase Dashboard → SQL Editor → Run.

alter table orders
  add column if not exists gls_parcel_id bigint,
  add column if not exists gls_label_pdf text,
  add column if not exists gls_error text,
  add column if not exists gls_created_at timestamptz;

create index if not exists orders_gls_parcel_id_idx on orders(gls_parcel_id);
create index if not exists orders_tracking_number_idx on orders(tracking_number);
