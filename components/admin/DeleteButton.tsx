"use client";

import { IconTrash } from "@/components/admin/icons";

type Props = {
  action: () => Promise<void>;
  label?: string;
  confirmMessage?: string;
};

export default function DeleteButton({
  action,
  label,
  confirmMessage = "Delete this? This can't be undone.",
}: Props) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!confirm(confirmMessage)) e.preventDefault();
      }}
    >
      <button
        type="submit"
        className="inline-flex items-center gap-1.5 rounded-md border border-red-200 bg-white px-3 py-1.5 text-[12px] font-bold text-red-600 transition-colors hover:border-red-600 hover:bg-red-600 hover:text-white"
        aria-label={label ?? "Delete"}
      >
        <IconTrash size={13} />
        {label ?? "Delete"}
      </button>
    </form>
  );
}
