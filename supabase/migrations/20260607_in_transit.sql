-- Adds an "on the way / in transit" stage between shipped and delivered.
-- shipping_status lifecycle: pending → shipped → in_transit → delivered
alter table orders
  add column if not exists in_transit_at timestamptz;
