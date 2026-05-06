"use client";

import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import { useEffect, useState } from "react";

type Props = {
  name: string;
  defaultValue?: string;
  placeholder?: string;
  minHeight?: number;
};

export default function RichTextEditor({
  name,
  defaultValue = "",
  placeholder,
  minHeight = 220,
}: Props) {
  const [html, setHtml] = useState(defaultValue);
  const [mounted, setMounted] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        HTMLAttributes: { rel: "noopener noreferrer", target: "_blank" },
      }),
    ],
    content: defaultValue,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "prose prose-sm max-w-none focus:outline-none p-4 min-h-[var(--rte-min)]",
        style: `--rte-min: ${minHeight}px`,
      },
    },
    onUpdate: ({ editor }) => setHtml(editor.getHTML()),
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="rounded-lg border border-orange-dark/20 bg-cream focus-within:border-orange focus-within:ring-2 focus-within:ring-orange/30">
      {editor && <Toolbar editor={editor} />}
      {!mounted ? (
        <div
          className="border-t border-orange-dark/15 p-4 text-sm text-ink/40"
          style={{ minHeight }}
        >
          Loading editor…
        </div>
      ) : (
        <EditorContent editor={editor} placeholder={placeholder} />
      )}
      <input type="hidden" name={name} value={html} />
    </div>
  );
}

function Toolbar({ editor }: { editor: Editor }) {
  const setLink = () => {
    const previous = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Link URL (leave blank to remove)", previous ?? "");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  return (
    <div className="flex flex-wrap items-center gap-1 border-b border-orange-dark/15 bg-pearl px-2 py-1.5">
      <Btn
        active={editor.isActive("bold")}
        onClick={() => editor.chain().focus().toggleBold().run()}
        label="Bold"
      >
        <span className="font-bold">B</span>
      </Btn>
      <Btn
        active={editor.isActive("italic")}
        onClick={() => editor.chain().focus().toggleItalic().run()}
        label="Italic"
      >
        <span className="italic">I</span>
      </Btn>
      <Btn
        active={editor.isActive("strike")}
        onClick={() => editor.chain().focus().toggleStrike().run()}
        label="Strikethrough"
      >
        <span className="line-through">S</span>
      </Btn>
      <Sep />
      <Btn
        active={editor.isActive("heading", { level: 2 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        label="Heading"
      >
        H2
      </Btn>
      <Btn
        active={editor.isActive("heading", { level: 3 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        label="Subheading"
      >
        H3
      </Btn>
      <Sep />
      <Btn
        active={editor.isActive("bulletList")}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        label="Bullet list"
      >
        ◦
      </Btn>
      <Btn
        active={editor.isActive("orderedList")}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        label="Numbered list"
      >
        1.
      </Btn>
      <Btn
        active={editor.isActive("blockquote")}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        label="Quote"
      >
        ❝
      </Btn>
      <Sep />
      <Btn
        active={editor.isActive("link")}
        onClick={setLink}
        label="Link"
      >
        🔗
      </Btn>
      <Sep />
      <Btn
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
        label="Undo"
      >
        ↶
      </Btn>
      <Btn
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
        label="Redo"
      >
        ↷
      </Btn>
      <span className="ml-auto text-[10px] font-bold uppercase tracking-wider text-ink/40">
        Just type
      </span>
    </div>
  );
}

function Btn({
  children,
  onClick,
  active,
  disabled,
  label,
}: {
  children: React.ReactNode;
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={label}
      aria-label={label}
      className={`grid h-8 min-w-[32px] place-items-center rounded-md px-2 text-[12px] font-bold transition-colors disabled:opacity-30 ${
        active
          ? "bg-ink text-pearl"
          : "text-ink hover:bg-orange/10 hover:text-orange-dark"
      }`}
    >
      {children}
    </button>
  );
}

function Sep() {
  return <span className="mx-1 h-5 w-px bg-orange-dark/15" aria-hidden />;
}
