"use client"

import { useEffect } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Typography from '@tiptap/extension-typography'
import Placeholder from '@tiptap/extension-placeholder'

export const Editor = ({ content, editable = false }: { content: string, editable?: boolean }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Typography,
      Placeholder.configure({
        placeholder: 'Commencez à écrire...',
      }),
    ],
    content,
    editable,
    editorProps: {
      attributes: {
        class: 'prose prose-stone dark:prose-invert prose-justified max-w-none focus:outline-none min-h-[500px] prose-p:text-[12px] prose-p:leading-relaxed prose-headings:font-bold prose-h1:text-[16px] prose-h2:text-[14px] prose-h3:text-[14px] prose-p:my-2 prose-headings:my-3 prose-headings:mb-2',
      },
    },
    immediatelyRender: false,
  })

  // Sync editor content when prop changes (e.g. from Realtime update)
  useEffect(() => {
    if (editor && content) {
      const currentContent = editor.getHTML();
      // Only update if content is actually different to avoid cursor jumps or loops
      // Simple length check or exact match
      if (content !== currentContent) {
           // We use emitUpdate: false to prevent triggering an onUpdate loop if we had one
          editor.commands.setContent(content, false) 
      }
    }
  }, [content, editor])

  if (!editor) {
    return null
  }

  return (
    <div className="bg-transparent min-h-[500px]">
      <EditorContent editor={editor} />
    </div>
  )
}
