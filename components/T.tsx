"use client";

import { useLang } from "./LangProvider";

/**
 * Drop-in translation island. Server components can render <T id="..."
 * fallback="..." /> without converting to client components themselves —
 * only this small component runs on the client.
 */
export default function T({
  id,
  fallback,
}: {
  id: string;
  fallback?: string;
}) {
  const { t } = useLang();
  const value = t(id);
  if (value === id && fallback !== undefined) return <>{fallback}</>;
  return <>{value}</>;
}
