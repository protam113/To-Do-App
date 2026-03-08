'use client';

import { type Editor } from '@tiptap/react';
import { useEffect, useRef } from 'react';
import { useMediaQuery } from '../../../hooks/use-media-query';
import { createPortal } from 'react-dom';
import { BoldToolbar } from '../toolbars/bold';
import { ItalicToolbar } from '../toolbars/italic';
import { UnderlineToolbar } from '../toolbars/underline';
import { LinkToolbar } from '../toolbars/link';
import { ToolbarProvider } from '../toolbars/toolbar-provider';
import { TooltipProvider, ScrollArea, ScrollBar, Separator } from '@/components/ui';
import { HeadingsToolbar } from '../toolbars/headings';
import { BulletListToolbar } from '../toolbars/bullet-list';
import { OrderedListToolbar } from '../toolbars/ordered-list';
import { AlignmentTooolbar } from '../toolbars/alignment';
import { BlockquoteToolbar } from '../toolbars/blockquote';
import { ImagePlaceholderToolbar } from '../toolbars/image-placeholder-toolbar';

export function FloatingToolbar({ editor }: { editor: Editor | null }) {
  const isMobile = useMediaQuery('(max-width: 640px)');
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isMobile || !editor) return;

    const raw = editor.options.element;
    const el =
      raw instanceof HTMLElement
        ? raw
        : raw && typeof raw === 'object' && 'mount' in raw
        ? raw.mount
        : null;

    if (!el) return;

    const handleContextMenu = (e: Event) => e.preventDefault();
    el.addEventListener('contextmenu', handleContextMenu);

    return () => el.removeEventListener('contextmenu', handleContextMenu);
  }, [editor, isMobile]);

  useEffect(() => {
    if (!editor || !isMobile || !menuRef.current) return;

    const updatePosition = () => {
      const { from, to } = editor.state.selection;
      const start = editor.view.coordsAtPos(from);
      const end = editor.view.coordsAtPos(to);

      if (!menuRef.current) return;

      const menu = menuRef.current;
      const left = (start.left + end.left) / 2 - menu.offsetWidth / 2;
      const top = end.bottom + 10;

      menu.style.left = `${left}px`;
      menu.style.top = `${top}px`;
    };

    const handleUpdate = () => {
      if (
        editor.isEditable &&
        editor.isFocused &&
        !editor.state.selection.empty
      ) {
        updatePosition();
        if (menuRef.current) {
          menuRef.current.style.display = 'block';
        }
      } else {
        if (menuRef.current) {
          menuRef.current.style.display = 'none';
        }
      }
    };

    editor.on('selectionUpdate', handleUpdate);
    editor.on('update', handleUpdate);
    editor.on('focus', handleUpdate);
    editor.on('blur', handleUpdate);

    return () => {
      editor.off('selectionUpdate', handleUpdate);
      editor.off('update', handleUpdate);
      editor.off('focus', handleUpdate);
      editor.off('blur', handleUpdate);
    };
  }, [editor, isMobile]);

  if (!editor || !isMobile) return null;

  return createPortal(
    <div
      ref={menuRef}
      style={{
        position: 'fixed',
        zIndex: 50,
        display: 'none',
      }}
      className="w-full max-w-md mx-auto shadow-lg border   bg-background"
    >
      <TooltipProvider>
        <ToolbarProvider editor={editor}>
          <ScrollArea className="h-fit py-0.5 w-full">
            <div className="flex items-center px-2 gap-0.5">
              <div className="flex items-center gap-0.5 p-1">
                <BoldToolbar />
                <ItalicToolbar />
                <UnderlineToolbar />
                <Separator orientation="vertical" className="h-6 mx-1" />

                <HeadingsToolbar />
                <BulletListToolbar />
                <OrderedListToolbar />
                <Separator orientation="vertical" className="h-6 mx-1" />

                <LinkToolbar />
                <ImagePlaceholderToolbar />
                <Separator orientation="vertical" className="h-6 mx-1" />

                <AlignmentTooolbar />
                <BlockquoteToolbar />
              </div>
            </div>
            <ScrollBar className="h-0.5" orientation="horizontal" />
          </ScrollArea>
        </ToolbarProvider>
      </TooltipProvider>
    </div>,
    document.body
  );
}
