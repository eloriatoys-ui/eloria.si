import { WHATSAPP_NUMBER } from "@/lib/data";

export default function WhatsAppFab() {
  return (
    <a
      href={`https://wa.me/${WHATSAPP_NUMBER}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Klepet na WhatsApp"
      className="fixed bottom-5 right-5 z-50 grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-toy-lg ring-4 ring-white/40 transition-transform hover:scale-110 md:bottom-7 md:right-7 md:h-16 md:w-16"
    >
      <svg
        viewBox="0 0 32 32"
        className="h-7 w-7 md:h-8 md:w-8"
        fill="currentColor"
        aria-hidden
      >
        <path d="M19.11 17.21c-.27-.14-1.62-.8-1.87-.89-.25-.09-.43-.14-.61.14-.18.27-.7.89-.86 1.07-.16.18-.32.2-.59.07-.27-.14-1.15-.42-2.19-1.35-.81-.72-1.36-1.62-1.52-1.89-.16-.27-.02-.42.12-.55.13-.13.27-.34.41-.5.14-.16.18-.27.27-.45.09-.18.05-.34-.02-.48-.07-.14-.61-1.47-.84-2.01-.22-.53-.45-.46-.61-.47l-.52-.01c-.18 0-.48.07-.73.34-.25.27-.96.94-.96 2.29 0 1.35.98 2.66 1.12 2.84.14.18 1.93 2.95 4.69 4.13.66.28 1.17.45 1.57.58.66.21 1.26.18 1.74.11.53-.08 1.62-.66 1.85-1.3.23-.64.23-1.18.16-1.3-.07-.12-.25-.18-.52-.32zM16 4C9.37 4 4 9.37 4 16c0 2.12.55 4.11 1.51 5.83L4 28l6.34-1.66A11.95 11.95 0 0 0 16 28c6.63 0 12-5.37 12-12S22.63 4 16 4zm0 21.81c-1.86 0-3.59-.55-5.04-1.49l-.36-.23-3.76.99 1.01-3.66-.24-.38A9.78 9.78 0 0 1 6.19 16c0-5.41 4.4-9.81 9.81-9.81S25.81 10.59 25.81 16 21.41 25.81 16 25.81z" />
      </svg>
    </a>
  );
}
