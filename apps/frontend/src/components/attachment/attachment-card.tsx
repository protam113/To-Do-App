'use client';

import { useState } from 'react';
import { Download, Trash2, Eye } from 'lucide-react';
import { Button } from '@/components/ui';
import { ImagePreviewModal } from '@/components/modal/image-preview.modal';
import { FileTypeIcon } from './file-type-icon';
import { truncateText } from '@/utils';

interface AttachmentCardProps {
  attachment: {
    id: string;
    url: string;
    originalName?: string;
    fileName?: string;
    mimeType?: string;
    fileType?: string;
  };
  onDelete?: (id: string) => void;
  onDownload?: (url: string) => void;
  showDeleteButton?: boolean;
}

export function AttachmentCard({
  attachment,
  onDelete,
  onDownload,
  showDeleteButton = true,
}: AttachmentCardProps) {
  const [showPreview, setShowPreview] = useState(false);

  const isImage =
    attachment.mimeType?.startsWith('image/') ||
    attachment.fileType?.startsWith('image/');

  const fileName =
    attachment.originalName || attachment.fileName || 'Unknown file';

  const handleDownload = () => {
    if (onDownload) {
      onDownload(attachment.url);
    } else {
      window.open(attachment.url, '_blank');
    }
  };

  const handlePreview = () => {
    if (isImage) {
      setShowPreview(true);
    } else {
      handleDownload();
    }
  };

  return (
    <>
      <div className="group relative bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200 hover:border-blue-300">
        {/* File Icon & Thumbnail */}
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            {isImage ? (
              <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 border">
                <img
                  src={attachment.url}
                  alt={fileName}
                  className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform"
                  onClick={handlePreview}
                  onError={(e) => {
                    // Fallback to icon if image fails to load
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    target.nextElementSibling?.classList.remove('hidden');
                  }}
                />
                <div className="hidden absolute inset-0 flex items-center justify-center bg-gray-100">
                  <FileTypeIcon
                    mimeType={attachment.mimeType}
                    fileType={attachment.fileType}
                    className="w-5 h-5"
                  />
                </div>
              </div>
            ) : (
              <div className="w-12 h-12 rounded-lg bg-gray-50 border flex items-center justify-center">
                <FileTypeIcon
                  mimeType={attachment.mimeType}
                  fileType={attachment.fileType}
                  className="w-5 h-5"
                />
              </div>
            )}
          </div>

          {/* File Info */}
          <div className="flex-1 min-w-0">
            <h4
              className="text-sm font-medium text-gray-900 truncate"
              title={fileName}
            >
              {truncateText(fileName, 30)}
            </h4>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                {attachment.mimeType?.split('/')[1]?.toUpperCase() || 'FILE'}
              </span>
              {/* You can add file size here if available */}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {isImage && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handlePreview}
                className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-600"
                title="Preview image"
              >
                <Eye className="h-4 w-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDownload}
              className="h-8 w-8 p-0 hover:bg-green-50 hover:text-green-600"
              title="Download file"
            >
              <Download className="h-4 w-4" />
            </Button>
            {showDeleteButton && onDelete && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(attachment.id)}
                className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
                title="Delete attachment"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Preview Badge for Images */}
        {isImage && (
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
              <Eye className="h-3 w-3" />
              Preview
            </div>
          </div>
        )}
      </div>

      {/* Image Preview Modal */}
      {isImage && (
        <ImagePreviewModal
          isOpen={showPreview}
          onClose={() => setShowPreview(false)}
          imageUrl={attachment.url}
          imageName={fileName}
          onDownload={handleDownload}
        />
      )}
    </>
  );
}
