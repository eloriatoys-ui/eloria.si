type Props = {
  size?: number;
  showWordmark?: boolean;
  tone?: "ink" | "pearl";
};

export default function Logo({
  size = 32,
  showWordmark = true,
  tone = "ink",
}: Props) {
  const fg = tone === "pearl" ? "#FFFFFF" : "#1C1917";
  return (
    <span className="inline-flex items-center gap-2.5">
      <svg
        width={size}
        height={size}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <rect width="40" height="40" rx="10" fill="#F97316" />
        <rect width="40" height="40" rx="10" fill="url(#elo-grad)" fillOpacity="0.4" />
        <path
          d="M20 9c-1.6 0-3.2.5-4.5 1.4 1.5 1.5 2.5 3.5 2.5 5.6h0c0 2.1-.9 4-2.5 5.5 1.3 1 2.9 1.5 4.5 1.5s3.2-.5 4.5-1.5c-1.5-1.5-2.5-3.5-2.5-5.5h0c0-2.1 1-4.1 2.5-5.6A8 8 0 0 0 20 9Z"
          fill="#FFFFFF"
        />
        <circle cx="13" cy="28" r="3.5" fill="#FFFFFF" />
        <circle cx="27" cy="28" r="3.5" fill="#FFFFFF" />
        <defs>
          <linearGradient id="elo-grad" x1="0" y1="0" x2="40" y2="40">
            <stop stopColor="#FED7AA" />
            <stop offset="1" stopColor="#C2410C" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
      {showWordmark && (
        <span
          className="text-[20px] font-extrabold tracking-tight"
          style={{ color: fg, letterSpacing: "-0.02em" }}
        >
          Eloria
        </span>
      )}
    </span>
  );
}
