"use client";

import CharacterCount from "@tiptap/extension-character-count";
import Highlight from "@tiptap/extension-highlight";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import { TextStyle } from "@tiptap/extension-text-style";
import Underline from "@tiptap/extension-underline";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
    AlignCenter,
    AlignJustify,
    AlignLeft,
    AlignRight,
    Bold,
    Code,
    Heading1,
    Heading2,
    Heading3,
    Highlighter,
    Image as ImageIcon,
    Italic,
    Link as LinkIcon,
    List,
    ListOrdered,
    Minus,
    Quote,
    Redo,
    Strikethrough,
    Underline as UnderlineIcon,
    Undo,
    Unlink,
} from "lucide-react";
import React, { useCallback, useEffect } from "react";

interface RichTextEditorProps {
    value?: string;
    onChange?: (value: string) => void;
    placeholder?: string;
    label?: string;
    error?: string;
    maxCharacters?: number;
}

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    active?: boolean;
    title?: string;
};

const ToolbarButton: React.FC<ButtonProps> = ({
    active,
    children,
    title,
    ...props
}) => (
    <button
        type="button"
        title={title}
        {...props}
        className={`
      flex items-center justify-center w-8 h-8 rounded-md text-sm transition-all duration-150
      ${active
                ? "bg-primary text-text-inverse shadow-inner"
                : "text-text-secondary hover:bg-primary-soft hover:text-primary"
            }
      disabled:opacity-30 disabled:cursor-not-allowed
    `}
    >
        {children}
    </button>
);

const Divider = () => (
    <div className="w-px h-6 bg-border mx-1" />
);

const RichTextEditor: React.FC<RichTextEditorProps> = ({
    value = "",
    onChange,
    placeholder = "Start writing your product description...",
    label,
    error,
    maxCharacters = 5000,
}) => {
    const extensions = React.useMemo(() => [
        StarterKit.configure({
            heading: { levels: [1, 2, 3] },
            bulletList: { keepMarks: true, keepAttributes: false },
            orderedList: { keepMarks: true, keepAttributes: false },
        }),
        Underline,
        TextStyle,
        Highlight.configure({ multicolor: false }),
        Link.configure({
            openOnClick: false,
            HTMLAttributes: { class: "tiptap-link" },
        }),
        Image.configure({ inline: false }),
        TextAlign.configure({ types: ["heading", "paragraph"] }),
        Placeholder.configure({ placeholder }),
        CharacterCount.configure({ limit: maxCharacters }),
    ], [placeholder, maxCharacters]);

    const editor = useEditor({
        immediatelyRender: false,
        extensions,
        content: value,
        editorProps: {
            attributes: {
                class:
                    "prose prose-sm dark:prose-invert max-w-none focus:outline-none min-h-[220px] px-4 py-3 text-text-primary",
            },
        },
        onUpdate: ({ editor }) => {
            onChange?.(editor.getHTML());
        },
    });

    // Sync external value changes (e.g. when pre-filling from API)
    useEffect(() => {
        if (editor && value !== editor.getHTML()) {
            editor.commands.setContent(value);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);

    const setLink = useCallback(() => {
        const previousUrl = editor?.getAttributes("link").href;
        const url = window.prompt("Enter URL:", previousUrl ?? "https://");
        if (url === null) return;
        if (url === "") {
            editor?.chain().focus().unsetLink().run();
            return;
        }
        editor?.chain().focus().setLink({ href: url }).run();
    }, [editor]);

    const addImage = useCallback(() => {
        const url = window.prompt("Enter image URL:");
        if (url) editor?.chain().focus().setImage({ src: url }).run();
    }, [editor]);

    if (!editor) return null;

    const charCount = editor.storage.characterCount.characters();
    const charPercent = Math.round((charCount / maxCharacters) * 100);

    return (
        <div className="rich-editor-wrapper w-full">
            {label && (
                <label
                    className="block text-sm font-medium text-text-secondary"
                >
                    {label}
                </label>
            )}

            <div
                className={`
        border rounded-xl overflow-hidden transition-all duration-200
        ${error
                        ? "border-error ring-1 ring-error"
                        : "border-border focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10 dark:focus-within:ring-primary/30"
                    }
        bg-bg-card
      `}
            >
                {/* ── Toolbar ── */}
                <div className="flex flex-wrap items-center gap-0.5 px-2 py-2 border-b border-border bg-bg-elevated">
                    {/* Undo / Redo */}
                    <ToolbarButton
                        title="Undo"
                        onClick={() => editor.chain().focus().undo().run()}
                        disabled={!editor.can().undo()}
                    >
                        <Undo size={14} />
                    </ToolbarButton>
                    <ToolbarButton
                        title="Redo"
                        onClick={() => editor.chain().focus().redo().run()}
                        disabled={!editor.can().redo()}
                    >
                        <Redo size={14} />
                    </ToolbarButton>

                    <Divider />

                    {/* Headings */}
                    <ToolbarButton
                        title="Heading 1"
                        active={editor.isActive("heading", { level: 1 })}
                        onClick={() =>
                            editor.chain().focus().toggleHeading({ level: 1 }).run()
                        }
                    >
                        <Heading1 size={14} />
                    </ToolbarButton>
                    <ToolbarButton
                        title="Heading 2"
                        active={editor.isActive("heading", { level: 2 })}
                        onClick={() =>
                            editor.chain().focus().toggleHeading({ level: 2 }).run()
                        }
                    >
                        <Heading2 size={14} />
                    </ToolbarButton>
                    <ToolbarButton
                        title="Heading 3"
                        active={editor.isActive("heading", { level: 3 })}
                        onClick={() =>
                            editor.chain().focus().toggleHeading({ level: 3 }).run()
                        }
                    >
                        <Heading3 size={14} />
                    </ToolbarButton>

                    <Divider />

                    {/* Text Formatting */}
                    <ToolbarButton
                        title="Bold"
                        active={editor.isActive("bold")}
                        onClick={() => editor.chain().focus().toggleBold().run()}
                    >
                        <Bold size={14} />
                    </ToolbarButton>
                    <ToolbarButton
                        title="Italic"
                        active={editor.isActive("italic")}
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                    >
                        <Italic size={14} />
                    </ToolbarButton>
                    <ToolbarButton
                        title="Underline"
                        active={editor.isActive("underline")}
                        onClick={() => editor.chain().focus().toggleUnderline().run()}
                    >
                        <UnderlineIcon size={14} />
                    </ToolbarButton>
                    <ToolbarButton
                        title="Strikethrough"
                        active={editor.isActive("strike")}
                        onClick={() => editor.chain().focus().toggleStrike().run()}
                    >
                        <Strikethrough size={14} />
                    </ToolbarButton>
                    <ToolbarButton
                        title="Highlight"
                        active={editor.isActive("highlight")}
                        onClick={() => editor.chain().focus().toggleHighlight().run()}
                    >
                        <Highlighter size={14} />
                    </ToolbarButton>
                    <ToolbarButton
                        title="Inline Code"
                        active={editor.isActive("code")}
                        onClick={() => editor.chain().focus().toggleCode().run()}
                    >
                        <Code size={14} />
                    </ToolbarButton>

                    <Divider />

                    {/* Lists */}
                    <ToolbarButton
                        title="Bullet List"
                        active={editor.isActive("bulletList")}
                        onClick={() => editor.chain().focus().toggleBulletList().run()}
                    >
                        <List size={14} />
                    </ToolbarButton>
                    <ToolbarButton
                        title="Ordered List"
                        active={editor.isActive("orderedList")}
                        onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    >
                        <ListOrdered size={14} />
                    </ToolbarButton>
                    <ToolbarButton
                        title="Blockquote"
                        active={editor.isActive("blockquote")}
                        onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    >
                        <Quote size={14} />
                    </ToolbarButton>
                    <ToolbarButton
                        title="Horizontal Rule"
                        onClick={() => editor.chain().focus().setHorizontalRule().run()}
                    >
                        <Minus size={14} />
                    </ToolbarButton>

                    <Divider />

                    {/* Alignment */}
                    <ToolbarButton
                        title="Align Left"
                        active={editor.isActive({ textAlign: "left" })}
                        onClick={() => editor.chain().focus().setTextAlign("left").run()}
                    >
                        <AlignLeft size={14} />
                    </ToolbarButton>
                    <ToolbarButton
                        title="Align Center"
                        active={editor.isActive({ textAlign: "center" })}
                        onClick={() => editor.chain().focus().setTextAlign("center").run()}
                    >
                        <AlignCenter size={14} />
                    </ToolbarButton>
                    <ToolbarButton
                        title="Align Right"
                        active={editor.isActive({ textAlign: "right" })}
                        onClick={() => editor.chain().focus().setTextAlign("right").run()}
                    >
                        <AlignRight size={14} />
                    </ToolbarButton>
                    <ToolbarButton
                        title="Justify"
                        active={editor.isActive({ textAlign: "justify" })}
                        onClick={() =>
                            editor.chain().focus().setTextAlign("justify").run()
                        }
                    >
                        <AlignJustify size={14} />
                    </ToolbarButton>

                    <Divider />

                    {/* Link / Image */}
                    <ToolbarButton
                        title="Add Link"
                        active={editor.isActive("link")}
                        onClick={setLink}
                    >
                        <LinkIcon size={14} />
                    </ToolbarButton>
                    <ToolbarButton
                        title="Remove Link"
                        onClick={() => editor.chain().focus().unsetLink().run()}
                        disabled={!editor.isActive("link")}
                    >
                        <Unlink size={14} />
                    </ToolbarButton>
                    <ToolbarButton title="Insert Image" onClick={addImage}>
                        <ImageIcon size={14} />
                    </ToolbarButton>
                </div>

                {/* ── Editor Area ── */}
                <EditorContent editor={editor} />

                {/* ── Footer: char count ── */}
                <div className="flex items-center justify-between px-4 py-1.5 border-t border-border bg-bg-elevated">
                    <span className="text-xs text-text-muted">
                        {editor.isActive("bold") && (
                            <span className="mr-1 font-bold text-primary">B</span>
                        )}
                        {editor.isActive("italic") && (
                            <span className="mr-1 italic text-primary">I</span>
                        )}
                        {editor.isActive("link") && (
                            <span className="mr-1 text-primary">🔗 Link</span>
                        )}
                    </span>
                    <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 rounded-full bg-border overflow-hidden">
                            <div
                                className={`h-full rounded-full transition-all duration-300 ${charPercent > 90
                                    ? "bg-error"
                                    : charPercent > 70
                                        ? "bg-warning"
                                        : "bg-primary"
                                    }`}
                                style={{ width: `${Math.min(charPercent, 100)}%` }}
                            />
                        </div>
                        <span
                            className={`text-xs tabular-nums ${charPercent > 90
                                ? "text-error"
                                : "text-text-muted"
                                }`}
                        >
                            {charCount}/{maxCharacters}
                        </span>
                    </div>
                </div>
            </div>

            {error && <p className="text-error text-xs mt-1.5">{error}</p>}

            {/* Prose styles injected via a style tag to avoid Tailwind purge issues */}
            <style>{`
        .tiptap-link {
          color: var(--color-primary);
          text-decoration: underline;
          cursor: pointer;
        }
        .ProseMirror p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: #adb5bd;
          pointer-events: none;
          height: 0;
        }
        .ProseMirror {
          outline: none;
        }
        .ProseMirror h1 { font-size: 1.75rem; font-weight: 700; margin-bottom: 0.5rem; }
        .ProseMirror h2 { font-size: 1.4rem; font-weight: 600; margin-bottom: 0.4rem; }
        .ProseMirror h3 { font-size: 1.15rem; font-weight: 600; margin-bottom: 0.3rem; }
        .ProseMirror ul { list-style: disc; padding-left: 1.4rem; }
        .ProseMirror ol { list-style: decimal; padding-left: 1.4rem; }
        .ProseMirror blockquote {
          border-left: 3px solid var(--color-primary);
          padding-left: 1rem;
          color: #6b7280;
          font-style: italic;
          margin: 0.5rem 0;
        }
        .ProseMirror code {
          background: #f3f4f6;
          border-radius: 4px;
          padding: 2px 6px;
          font-family: monospace;
          font-size: 0.85em;
          color: var(--color-primary-active);
        }
        .dark .ProseMirror code {
          background: #1e293b;
          color: var(--color-primary);
        }
        .ProseMirror hr {
          border: none;
          border-top: 2px solid var(--color-border);
          margin: 1rem 0;
        }
        .ProseMirror mark {
          background-color: #fef08a;
          border-radius: 2px;
          padding: 0 2px;
        }
        .ProseMirror img {
          max-width: 100%;
          border-radius: 8px;
          margin: 0.5rem 0;
        }
      `}</style>
        </div>
    );
};

export default RichTextEditor;
