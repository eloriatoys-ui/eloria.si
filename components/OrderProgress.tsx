// Customer-facing order progress timeline. Driven purely by order fields, so
// it works for manual fulfillment (no GLS dependency). Steps:
//   Naročilo prejeto → Plačilo potrjeno → Oddano za dostavo → Dostavljeno
// For COD the "payment" step is satisfied on delivery, so we fold it in.

type OrderLike = {
  created_at?: string | null;
  paid_at?: string | null;
  shipped_at?: string | null;
  in_transit_at?: string | null;
  delivered_at?: string | null;
  payment_status?: string | null;
  shipping_status?: string | null;
  payment_method?: string | null;
};

function fmt(d: string | null | undefined): string | null {
  if (!d) return null;
  try {
    return new Date(d).toLocaleString("sl-SI", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return null;
  }
}

export default function OrderProgress({ order }: { order: OrderLike }) {
  const isCod = order.payment_method === "cod";
  const isPaid = order.payment_status === "paid";
  const ss = order.shipping_status;
  // Lifecycle: pending → shipped → in_transit → delivered (each implies the prior).
  const sentToCourier = ss === "shipped" || ss === "in_transit" || ss === "delivered";
  const onTheWay = ss === "in_transit" || ss === "delivered";
  const isDelivered = ss === "delivered";

  const steps = [
    {
      label: "Naročilo prejeto",
      done: true,
      at: fmt(order.created_at),
    },
    {
      label: isCod ? "Naročilo potrjeno" : "Plačilo potrjeno",
      done: isCod ? true : isPaid,
      at: fmt(order.paid_at),
    },
    {
      label: "Poslano kurirju (GLS)",
      done: sentToCourier,
      at: fmt(order.shipped_at),
    },
    {
      label: "Na poti",
      done: onTheWay,
      at: fmt(order.in_transit_at),
    },
    {
      label: "Dostavljeno",
      done: isDelivered,
      at: fmt(order.delivered_at),
    },
  ];

  return (
    <section className="rounded-2xl border border-orange-dark/15 bg-pearl p-6">
      <h2 className="text-[13px] font-bold uppercase tracking-wider text-ink/70">
        Stanje naročila
      </h2>
      <ol className="mt-5 space-y-0">
        {steps.map((s, i) => {
          const isLast = i === steps.length - 1;
          return (
            <li key={s.label} className="flex gap-4">
              {/* marker + connector */}
              <div className="flex flex-col items-center">
                <span
                  className={`grid h-8 w-8 shrink-0 place-items-center rounded-full border-2 ${
                    s.done
                      ? "border-orange bg-orange text-pearl"
                      : "border-orange-dark/20 bg-cream text-ink/30"
                  }`}
                  aria-hidden
                >
                  {s.done ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  ) : (
                    <span className="h-2 w-2 rounded-full bg-current" />
                  )}
                </span>
                {!isLast && (
                  <span
                    className={`my-1 w-0.5 flex-1 ${
                      steps[i + 1].done ? "bg-orange" : "bg-orange-dark/15"
                    }`}
                    style={{ minHeight: 28 }}
                  />
                )}
              </div>
              {/* text */}
              <div className={`pb-6 ${isLast ? "pb-0" : ""}`}>
                <p className={`text-[15px] font-bold ${s.done ? "text-ink" : "text-ink/40"}`}>
                  {s.label}
                </p>
                {s.at && <p className="mt-0.5 text-[12px] text-ink/55">{s.at}</p>}
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
