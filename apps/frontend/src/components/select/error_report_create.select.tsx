'use client';

import { useState, useRef, useEffect } from 'react';
import {
  Search,
  ChevronDown,
  Loader2,
  Check,
  Plus,
  Edit2,
  Trash2,
  X,
  Save,
} from 'lucide-react';
import { Input, Button } from '@/components/ui';
import { ErrorList } from '../../libs/responses/errorLib';
import {
  useCreateError,
  useUpdateError,
  useDeleteError,
} from '@/hooks/error/useError';
import { CreateTypeBySlugDTO, UpdateTypeBySlugDTO } from '@/types';
import { toast } from 'sonner';

interface ErrorSelectForCreateProps {
  value: string[];
  onValueChange: (errorIds: string[]) => void;
  placeholder?: string;
}

export function ErrorSelectForCreate({
  value = [],
  onValueChange,
  placeholder = 'Select errors...',
}: ErrorSelectForCreateProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [actualSearchQuery, setActualSearchQuery] = useState('');
  const [allErrors, setAllErrors] = useState<any[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);

  // CRUD states
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingError, setEditingError] = useState<any>(null);
  const [newErrorName, setNewErrorName] = useState('');
  const [editErrorName, setEditErrorName] = useState('');

  const dropdownRef = useRef<HTMLDivElement>(null);

  const params = {
    search: actualSearchQuery || undefined,
    page_size: 10,
  };

  const { errors, isLoading, pagination } = ErrorList(
    currentPage,
    params,
    refreshKey
  );

  // CRUD hooks
  const createErrorMutation = useCreateError();
  const updateErrorMutation = useUpdateError(editingError?.id || '');
  const deleteErrorMutation = useDeleteError(editingError?.id || '');

  // Accumulate errors when loading more
  useEffect(() => {
    if (errors && currentPage === 1) {
      setAllErrors(errors);
    } else if (errors && currentPage > 1) {
      setAllErrors((prev) => {
        const existingIds = new Set(prev.map((e) => e.id));
        const newErrors = errors.filter((e: any) => !existingIds.has(e.id));
        return [...prev, ...newErrors];
      });
    }
  }, [errors, currentPage]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      setActualSearchQuery(searchQuery.trim());
      setCurrentPage(1);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setActualSearchQuery('');
    setCurrentPage(1);
  };

  const handleLoadMore = () => {
    if (currentPage < pagination.total_page) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handleToggleError = (errorId: string) => {
    const newValue = value.includes(errorId)
      ? value.filter((id) => id !== errorId)
      : [...value, errorId];
    onValueChange(newValue);
  };

  // CRUD handlers
  const handleCreateError = async () => {
    if (!newErrorName.trim()) {
      toast.error('Error name is required');
      return;
    }

    const createData: CreateTypeBySlugDTO = {
      name: newErrorName.trim(),
    };

    try {
      await createErrorMutation.mutateAsync(createData);
      toast.success('Error created successfully');
      setNewErrorName('');
      setShowAddForm(false);
      setRefreshKey((prev) => prev + 1);
      setCurrentPage(1);
    } catch (error: any) {
      toast.error(error.message || 'Failed to create error');
    }
  };

  const handleUpdateError = async () => {
    if (!editErrorName.trim()) {
      toast.error('Error name is required');
      return;
    }

    const updateData: UpdateTypeBySlugDTO = {
      name: editErrorName.trim(),
    };

    try {
      await updateErrorMutation.mutateAsync(updateData);
      toast.success('Error updated successfully');
      setEditingError(null);
      setEditErrorName('');
      setRefreshKey((prev) => prev + 1);
    } catch (error: any) {
      toast.error(error.message || 'Failed to update error');
    }
  };

  const handleDeleteError = async (errorId: string, errorName: string) => {
    if (!confirm(`Are you sure you want to delete "${errorName}"?`)) {
      return;
    }

    try {
      setEditingError({ id: errorId });
      await deleteErrorMutation.mutateAsync();
      toast.success('Error deleted successfully');

      // Remove from selected values if it was selected
      if (value.includes(errorId)) {
        onValueChange(value.filter((id) => id !== errorId));
      }

      setRefreshKey((prev) => prev + 1);
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete error');
    } finally {
      setEditingError(null);
    }
  };

  const handleStartEdit = (error: any) => {
    setEditingError(error);
    setEditErrorName(error.name);
    setShowAddForm(false);
  };

  const handleCancelEdit = () => {
    setEditingError(null);
    setEditErrorName('');
  };

  const handleCancelAdd = () => {
    setShowAddForm(false);
    setNewErrorName('');
  };

  const selectedErrors = allErrors.filter((e) => value.includes(e.id));

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full h-12 px-3 bg-white border border-input rounded-md flex items-center justify-between hover:bg-gray-50"
      >
        <div className="flex-1 overflow-hidden">
          {selectedErrors.length > 0 ? (
            <span className="text-sm truncate block">
              {selectedErrors.length} error(s) selected
            </span>
          ) : (
            <span className="text-sm text-muted-foreground">{placeholder}</span>
          )}
        </div>
        <ChevronDown className="h-4 w-4 text-gray-500 ml-2 shrink-0" />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
          {/* Search Input */}
          <div className="p-2 border-b">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search errors... (Press Enter)"
                className="pl-8 pr-8 h-8 text-sm rounded-md"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearchKeyDown}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Add New Error Section */}
          <div className="p-2 border-b bg-gray-50">
            {!showAddForm ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setShowAddForm(true);
                  setEditingError(null);
                }}
                className="w-full h-8 text-sm border-dashed border-gray-300 hover:border-blue-400 hover:text-blue-600"
              >
                <Plus className="h-3 w-3 mr-1" />
                Add New Error
              </Button>
            ) : (
              <div className="space-y-2">
                <Input
                  placeholder="Enter error name"
                  value={newErrorName}
                  onChange={(e) => setNewErrorName(e.target.value)}
                  className="h-8 text-sm"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleCreateError();
                    } else if (e.key === 'Escape') {
                      handleCancelAdd();
                    }
                  }}
                  autoFocus
                />
                <div className="flex gap-1">
                  <Button
                    type="button"
                    size="sm"
                    onClick={handleCreateError}
                    disabled={
                      createErrorMutation.isPending || !newErrorName.trim()
                    }
                    className="h-7 text-xs bg-blue-600 hover:bg-blue-700"
                  >
                    {createErrorMutation.isPending ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <Save className="h-3 w-3" />
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleCancelAdd}
                    className="h-7 text-xs"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Error List */}
          <div className="max-h-[300px] overflow-y-auto">
            {isLoading && currentPage === 1 ? (
              <div className="px-3 py-4 text-sm text-gray-500 flex items-center justify-center">
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Loading...
              </div>
            ) : allErrors.length === 0 ? (
              <div className="px-3 py-4 text-sm text-gray-500 text-center">
                No errors found
              </div>
            ) : (
              allErrors.map((error) => (
                <div
                  key={error.id}
                  className="px-3 py-2 text-sm hover:bg-gray-100 flex items-center gap-2"
                >
                  {editingError?.id === error.id ? (
                    // Edit mode
                    <div className="flex-1 flex items-center gap-2">
                      <div
                        className={`w-4 h-4 border rounded flex items-center justify-center ${
                          value.includes(error.id)
                            ? 'bg-blue-500 border-blue-500'
                            : 'border-gray-300'
                        }`}
                      >
                        {value.includes(error.id) && (
                          <Check className="h-3 w-3 text-white" />
                        )}
                      </div>
                      <Input
                        value={editErrorName}
                        onChange={(e) => setEditErrorName(e.target.value)}
                        className="h-7 text-sm flex-1"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleUpdateError();
                          } else if (e.key === 'Escape') {
                            handleCancelEdit();
                          }
                        }}
                        autoFocus
                      />
                      <Button
                        type="button"
                        size="sm"
                        onClick={handleUpdateError}
                        disabled={
                          updateErrorMutation.isPending || !editErrorName.trim()
                        }
                        className="h-6 w-6 p-0 bg-green-600 hover:bg-green-700"
                      >
                        {updateErrorMutation.isPending ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          <Save className="h-3 w-3" />
                        )}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleCancelEdit}
                        className="h-6 w-6 p-0"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ) : (
                    // View mode
                    <>
                      <div
                        className={`w-4 h-4 border rounded flex items-center justify-center cursor-pointer ${
                          value.includes(error.id)
                            ? 'bg-blue-500 border-blue-500'
                            : 'border-gray-300'
                        }`}
                        onClick={() => handleToggleError(error.id)}
                      >
                        {value.includes(error.id) && (
                          <Check className="h-3 w-3 text-white" />
                        )}
                      </div>
                      <span
                        className="flex-1 cursor-pointer"
                        onClick={() => handleToggleError(error.id)}
                      >
                        {error.name}
                      </span>
                      <div className="flex gap-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStartEdit(error);
                          }}
                          className="h-6 w-6 p-0 hover:bg-blue-100 hover:text-blue-600"
                        >
                          <Edit2 className="h-3 w-3" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteError(error.id, error.name);
                          }}
                          disabled={deleteErrorMutation.isPending}
                          className="h-6 w-6 p-0 hover:bg-red-100 hover:text-red-600"
                        >
                          {deleteErrorMutation.isPending &&
                          editingError?.id === error.id ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            <Trash2 className="h-3 w-3" />
                          )}
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              ))
            )}

            {/* Load More Button */}
            {currentPage < pagination.total_page && (
              <div className="p-2 border-t">
                <button
                  type="button"
                  onClick={handleLoadMore}
                  disabled={isLoading}
                  className="w-full py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-md disabled:opacity-50"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Loading...
                    </span>
                  ) : (
                    `Load More (${
                      pagination.total - allErrors.length
                    } remaining)`
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
