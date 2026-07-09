-- Product sizes (pick-a-size variants)
-- Apply by pasting into Supabase Dashboard → SQL Editor → Run.
--
-- `products.sizes` is an ordered list of the sizes a product is offered in
-- (e.g. '{80,90,100,110}' or '{EU22,EU23}'). Empty = no size picker shown.
-- `order_items.size` records which size the customer chose, for packing.

alter table products    add column if not exists sizes text[] not null default '{}';
alter table order_items add column if not exists size  text;
