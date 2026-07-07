// Carrier-agnostic tracking. The shop creates parcels in the courier's own
// portal (e.g. Express One i-net) and pastes the tracking number into admin.
// Express One has no public deep-link (its portal needs a login), so we point
// customers at 17track, which resolves any carrier from the number alone.

export const DEFAULT_CARRIER = "Express One";

export function getTrackingUrl(
  carrier?: string | null,
  trackingNumber?: string | null,
): string | null {
  if (!trackingNumber) return null;
  const n = encodeURIComponent(String(trackingNumber));
  const c = (carrier ?? "").toLowerCase();
  if (c.includes("gls")) {
    return `https://gls-group.eu/SI/sl/sledenje-posiljk?match=${n}`;
  }
  // Express One + any other carrier → universal tracker (no login needed).
  return `https://www.17track.net/en/track?nums=${n}`;
}
