-- When an order is paid/committed we auto-email the shop a "ready to ship"
-- notice (order + address) and stamp this column. Drives the customer
-- timeline's "Oddano kurirju (GLS)" step.
alter table orders
  add column if not exists courier_notified_at timestamptz;
