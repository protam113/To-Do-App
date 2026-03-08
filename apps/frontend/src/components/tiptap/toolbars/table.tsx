'use client';

import { Editor } from '@tiptap/react';
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui';
import {
  Table,
  TableCellsMerge,
  TableCellsSplit,
  Columns3,
  Rows3,
  Trash2,
} from 'lucide-react';

interface TableToolbarProps {
  editor: Editor;
}

export function TableToolbar({ editor }: TableToolbarProps) {
  if (!editor) return null;

  const isInTable = editor.isActive('table');

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button type="button" variant="ghost" size="sm" className="h-8 gap-1">
          <Table className="h-4 w-4" />
          <span className="hidden sm:inline">Table</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-48">
        <DropdownMenuItem
          onClick={() =>
            editor.chain().focus().insertTable({ rows: 3, cols: 3 }).run()
          }
          disabled={isInTable}
        >
          <Table className="mr-2 h-4 w-4" />
          Insert Table (3x3)
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => editor.chain().focus().addColumnBefore().run()}
          disabled={!isInTable}
        >
          <Columns3 className="mr-2 h-4 w-4" />
          Add Column Before
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => editor.chain().focus().addColumnAfter().run()}
          disabled={!isInTable}
        >
          <Columns3 className="mr-2 h-4 w-4" />
          Add Column After
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => editor.chain().focus().deleteColumn().run()}
          disabled={!isInTable}
        >
          <Columns3 className="mr-2 h-4 w-4" />
          Delete Column
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => editor.chain().focus().addRowBefore().run()}
          disabled={!isInTable}
        >
          <Rows3 className="mr-2 h-4 w-4" />
          Add Row Before
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => editor.chain().focus().addRowAfter().run()}
          disabled={!isInTable}
        >
          <Rows3 className="mr-2 h-4 w-4" />
          Add Row After
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => editor.chain().focus().deleteRow().run()}
          disabled={!isInTable}
        >
          <Rows3 className="mr-2 h-4 w-4" />
          Delete Row
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => editor.chain().focus().mergeCells().run()}
          disabled={!isInTable}
        >
          <TableCellsMerge className="mr-2 h-4 w-4" />
          Merge Cells
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => editor.chain().focus().splitCell().run()}
          disabled={!isInTable}
        >
          <TableCellsSplit className="mr-2 h-4 w-4" />
          Split Cell
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => editor.chain().focus().toggleHeaderRow().run()}
          disabled={!isInTable}
        >
          <Rows3 className="mr-2 h-4 w-4" />
          Toggle Header Row
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => editor.chain().focus().toggleHeaderColumn().run()}
          disabled={!isInTable}
        >
          <Columns3 className="mr-2 h-4 w-4" />
          Toggle Header Column
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => editor.chain().focus().deleteTable().run()}
          disabled={!isInTable}
          className="text-destructive"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete Table
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
