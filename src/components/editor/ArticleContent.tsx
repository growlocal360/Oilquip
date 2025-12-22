"use client";

import { useEditor, EditorContent, type JSONContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";

interface ArticleContentProps {
  content: JSONContent;
}

export default function ArticleContent({ content }: ArticleContentProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: "rounded-lg max-w-full my-6",
        },
      }),
      Link.configure({
        openOnClick: true,
        HTMLAttributes: {
          class: "text-accent-400 hover:text-accent-300 underline",
          target: "_blank",
          rel: "noopener noreferrer",
        },
      }),
      Underline,
    ],
    content,
    editable: false,
    editorProps: {
      attributes: {
        class: "prose prose-invert prose-lg max-w-none",
      },
    },
  });

  return <EditorContent editor={editor} />;
}
