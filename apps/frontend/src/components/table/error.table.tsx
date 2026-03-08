'use client';

import type React from 'react';
//UI components

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Skeleton,
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  Input,
} from '@/components/ui';

import { ErrorColumns, ErrorTableProps } from '@/types';
import NoResultsFound from '../design/no_result.design';
import { Icons } from '../../assets/icons';
import { useState } from 'react';
import { useDeleteError, useUpdateError } from '../../hooks/error/useError';

export const ErrorTable: React.FC<ErrorTableProps> = ({
  errors,
  isLoading,
  isError,
  onRefresh,
}) => {
  const [selectedErrorId, setSelectedErrorId] = useState<string>('');
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editName, setEditName] = useState('');

  const { mutate: deleteType } = useDeleteError(selectedErrorId);
  const { mutate: updateType, isPending: isUpdating } =
    useUpdateError(selectedErrorId);

  const handleDelteClick = (errorId: string) => {
    if (window.confirm('Are you sure you want to delete this error?')) {
      setSelectedErrorId(errorId);
      deleteType(undefined, {
        onSuccess: () => {
          onRefresh?.();
        },
      });
    }
  };

  const handleEditClick = (errorId: string, currentName: string) => {
    setSelectedErrorId(errorId);
    setEditName(currentName);
    setIsEditDialogOpen(true);
  };

  const handleUpdateSubmit = () => {
    if (!editName.trim()) return;
    updateType(
      { name: editName.trim() },
      {
        onSuccess: () => {
          setIsEditDialogOpen(false);
          setEditName('');
          setSelectedErrorId('');
          onRefresh?.();
        },
      }
    );
  };

  return (
    <>
      <div className="border">
        <Table>
          <TableHeader className="bg-table-header text-gray-700 font-bold">
            <TableRow>
              {ErrorColumns.map((col) => (
                <TableHead key={col.key} className={col.className}>
                  {col.label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody className="bg-row">
            {isError ? (
              <TableRow>
                <TableCell
                  colSpan={ErrorColumns.length + 1}
                  className="text-center"
                >
                  <NoResultsFound />
                </TableCell>
              </TableRow>
            ) : isLoading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Skeleton className="h-4 w-4 rounded" />
                  </TableCell>
                  {ErrorColumns.map((col) => (
                    <TableCell key={col.key} className={col.className}>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : errors && errors.length > 0 ? (
              errors.map((error) => (
                <TableRow key={error.id}>
                  {ErrorColumns.map((col) => {
                    let cellContent: React.ReactNode = null;

                    if (col.key === 'id') {
                      cellContent = error.id.substring(0, 8) + '...';
                    } else if (col.key === 'name') {
                      cellContent = error.name ? (
                        <div className="flex flex-col">
                          {error.name && (
                            <span className="font-bold">{error.name}</span>
                          )}
                        </div>
                      ) : (
                        ''
                      );
                    } else if (col.key === 'action') {
                      cellContent = (
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="flex items-center gap-1 text-sm text-blue-500 hover:bg-blue-200 hover:underline"
                            onClick={() =>
                              handleEditClick(error.id, error.name)
                            }
                          >
                            <Icons.PencilIcon className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="flex items-center gap-1 text-sm text-red-500 hover:bg-red-200 hover:underline"
                            onClick={() => handleDelteClick(error.id)}
                          >
                            <Icons.Trash className="w-4 h-4" />
                          </Button>
                        </div>
                      );
                    }
                    return (
                      <TableCell key={col.key} className={col.className}>
                        {cellContent}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={ErrorColumns.length + 1}
                  className="text-center text-gray-500"
                >
                  <NoResultsFound />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Error Name</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              placeholder="Enter error name"
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleUpdateSubmit();
              }}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdateSubmit}
              disabled={isUpdating || !editName.trim()}
            >
              {isUpdating ? 'Saving...' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
