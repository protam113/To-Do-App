'use client';

import '../../assets/styles/tiptap.css';
import { EditorContent, type Extension, useEditor } from '@tiptap/react';

// Extensions
import Highlight from '@tiptap/extension-highlight';
import Link from '@tiptap/extension-link';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import TextAlign from '@tiptap/extension-text-align';
import { TextStyle } from '@tiptap/extension-text-style';
import Typography from '@tiptap/extension-typography';
import Underline from '@tiptap/extension-underline';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table';
import { TableHeader } from '@tiptap/extension-table';
import { TableCell } from '@tiptap/extension-table';

// Custom Extensions
import { EditorToolbar } from './toolbars/editor-toolbar';
import { cn} from '@/utils';
import { content } from '../../libs/content';
import SearchAndReplace from './extensions/search-and-replace';
import { FloatingToolbar } from './extensions/floating-toolbar';
import { TipTapFloatingMenu } from './extensions/floating-menu';
import { RichTextEditorProps } from '@/types';
import { useEffect } from 'react';
import { ImageExtension } from './extensions/image';
import { ImagePlaceholder } from './extensions/image-placeholder';

const extensions = [
  StarterKit.configure({
    orderedList: {
      HTMLAttributes: {
        class: 'list-decimal',
      },
    },
    bulletList: {
      HTMLAttributes: {
        class: 'list-disc',
      },
    },
    heading: {
      levels: [1, 2, 3, 4],
    },
  }),
  Placeholder.configure({
    emptyNodeClass: 'is-editor-empty',
    placeholder: ({ node }: { node: any }) => {
      switch (node.type.name) {
        case 'heading':
          return `Heading ${node.attrs.level}`;
        case 'detailsSummary':
          return 'Section title';
        case 'codeBlock':
          // never show the placeholder when editing code
          return '';
        default:
          return "Write, type '/' for commands";
      }
    },
    includeChildren: false,
  }),
  TextAlign.configure({
    types: ['heading', 'paragraph'],
  }),
  TextStyle,
  Subscript,
  Superscript,
  Underline,
  Link,
  Highlight.configure({
    multicolor: true,
  }),
  Table.configure({
    resizable: true,
    HTMLAttributes: {
      class: 'tiptap-table',
    },
  }),
  TableRow,
  TableHeader,
  TableCell,
  ImageExtension,
  ImagePlaceholder,
  SearchAndReplace,
  Typography,
];

export function RichTextEditor({
  className,
  initialContent,
  onContentChange,
  onChange,
}: RichTextEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: extensions as Extension[],
    content: initialContent || content,
    editorProps: {
      attributes: {
        class: 'max-w-full focus:outline-none',
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      const text = editor.getText();
      const json = editor.getJSON();

      // Gọi callback để truyền data ra component cha
      onContentChange?.(html, text);
      onChange?.({ html, text, json });
    },
  });

  // Method để component cha có thể lấy content bất kỳ lúc nào
  const getContent = () => {
    if (!editor) return { html: '', text: '', json: null };

    return {
      html: editor.getHTML(),
      text: editor.getText(),
      json: editor.getJSON(),
    };
  };

  // Expose getContent method thông qua useImperativeHandle nếu cần
  useEffect(() => {
    if (editor && (window as any).editorRef) {
      (window as any).editorRef.current = { getContent };
    }
  }, [editor]);

  if (!editor) return null;

  return (
    <div
      className={cn(
        'relative max-h-[600px] w-full overflow-y-auto border pb-[60px] sm:pb-0',
        className
      )}
    >
      <EditorToolbar editor={editor} />
      <FloatingToolbar editor={editor} />
      <TipTapFloatingMenu editor={editor} />
      <EditorContent
        editor={editor}
        className="min-h-[600px] w-full min-w-full cursor-text sm:p-6"
      />
    </div>
  );
}
