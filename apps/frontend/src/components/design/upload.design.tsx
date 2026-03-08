'use client';

import React, { useState, useRef } from 'react';
import { Card, CardContent } from '@/components/ui';
import { UploadCloud, FileIcon, CheckCircle } from 'lucide-react';
import { usePresignMedia, useSubmitMedia, useUploadFile } from '@/hooks';

type UploadStatus = 'idle' | 'preview' | 'uploading' | 'uploaded' | 'success';

interface FileUploadProps {
  onUploadSuccess?: (file: File, mediaData?: any) => void;
  onUploadError?: (error: string) => void;
  onComplete?: () => void; // Callback to close dialog
  acceptedFileTypes?: string[];
  maxFileSize?: number;
}

export default function UpdateFile({
  onUploadSuccess,
  onUploadError,
  acceptedFileTypes = ['image/jpeg', 'image/png', 'image/gif'],
  maxFileSize = 10 * 1024 * 1024,
}: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<UploadStatus>('idle');
  const [progress, setProgress] = useState(0);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [_mediaUrl, setMediaUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { mutate: presignMedia, isPending: isPresigning } = usePresignMedia();
  const { mutate: uploadFile, isPending: isUploading } = useUploadFile();
  const { mutate: submitMedia, isPending: isSubmitting } = useSubmitMedia();

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const validateFile = (selectedFile: File): boolean => {
    if (!acceptedFileTypes.includes(selectedFile.type)) {
      onUploadError?.(
        `Invalid file type. Accepted: ${acceptedFileTypes
          .map((t) => t.split('/')[1])
          .join(', ')}`
      );
      return false;
    }
    if (selectedFile.size > maxFileSize) {
      onUploadError?.(`File size exceeds ${formatBytes(maxFileSize)}`);
      return false;
    }
    return true;
  };

  const handleFileSelect = (selectedFile: File) => {
    if (!validateFile(selectedFile)) return;

    setFile(selectedFile);
    setStatus('preview');
    setProgress(0);
    setMediaUrl(null);

    // Create preview for images
    if (selectedFile.type.startsWith('image/')) {
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
    }
  };

  const handleUploadToMedia = () => {
    if (!file) return;

    setStatus('uploading');
    setProgress(10);

    // Step 1: Presign
    presignMedia(
      {
        originalName: file.name,
        size: file.size,
      },
      {
        onSuccess: (presignResponse) => {
          setProgress(30);

          // Step 2: Upload file
          uploadFile(
            {
              uploadUrl: presignResponse.uploadUrl,
              file: file,
            },
            {
              onSuccess: () => {
                setProgress(70);

                // Step 3: Submit/Confirm to get final URL
                submitMedia(
                  { id: presignResponse.id },
                  {
                    onSuccess: (submitResponse) => {
                      setProgress(100);
                      setStatus('uploaded');
                      setMediaUrl(submitResponse.url);

                      // Call success callback with media data
                      onUploadSuccess?.(file, submitResponse);
                    },
                    onError: (error) => {
                      onUploadError?.(
                        error.message || 'Failed to confirm upload'
                      );
                      setStatus('preview');
                    },
                  }
                );
              },
              onError: (error) => {
                onUploadError?.(error.message || 'Failed to upload file');
                setStatus('preview');
              },
            }
          );
        },
        onError: (error) => {
          onUploadError?.(error.message || 'Failed to get upload URL');
          setStatus('preview');
        },
      }
    );
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      handleFileSelect(selectedFile);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      handleFileSelect(droppedFile);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const resetUpload = () => {
    setFile(null);
    setStatus('idle');
    setProgress(0);
    setMediaUrl(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

  return (
    <Card className="w-full bg-white h-72 rounded-md max-w-2xl mx-auto">
      <CardContent className="p-6">
        {status === 'idle' && (
          <div
            className="border-2 border-dashed border-gray-300 p-8 text-center cursor-pointer hover:border-blue-600 transition-colors"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={triggerFileInput}
          >
            <UploadCloud className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="text-sm text-gray-600 mb-2">
              <span className="font-semibold text-blue-600">
                Click to upload
              </span>{' '}
              or drag and drop
            </p>
            <p className="text-xs text-gray-500">
              {acceptedFileTypes
                .map((t) => t.split('/')[1])
                .join(', ')
                .toUpperCase()}{' '}
              (Max {formatBytes(maxFileSize)})
            </p>
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={handleFileInputChange}
              accept={acceptedFileTypes.join(',')}
            />
          </div>
        )}

        {status === 'uploading' && file && (
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 relative">
              <svg
                className="w-full h-full transform -rotate-90"
                viewBox="0 0 36 36"
              >
                <circle
                  cx="18"
                  cy="18"
                  r="16"
                  fill="none"
                  className="stroke-current text-gray-200"
                  strokeWidth="3"
                />
                <circle
                  cx="18"
                  cy="18"
                  r="16"
                  fill="none"
                  className="stroke-current text-blue-600"
                  strokeWidth="3"
                  strokeDasharray="100"
                  strokeDashoffset={100 - progress}
                  style={{ transition: 'stroke-dashoffset 0.3s ease' }}
                />
              </svg>
              <FileIcon className="w-8 h-8 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-blue-600" />
            </div>
            <p className="text-sm font-medium text-gray-900 mb-1 truncate">
              {file.name}
            </p>
            <p className="text-xs text-gray-500">
              {progress < 30 && 'Getting upload URL...'}
              {progress >= 30 && progress < 70 && 'Uploading file...'}
              {progress >= 70 && progress < 90 && 'Confirming upload...'}
              {progress >= 90 && progress < 100 && 'Updating avatar...'}
              {progress === 100 && 'Complete!'} {Math.round(progress)}%
            </p>
          </div>
        )}

        {status === 'preview' && file && (
          <div className="text-center">
            {previewUrl && (
              <div className="w-32 h-32 mx-auto mb-4 overflow-hidden">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <p className="text-sm text-gray-600 mb-4 truncate">
              {file.name} ({formatBytes(file.size)})
            </p>

            <div className="flex gap-2 justify-center">
              <button
                onClick={handleUploadToMedia}
                disabled={isPresigning || isUploading || isSubmitting}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 transition-colors rounded-md"
              >
                Upload
              </button>
              <button
                onClick={resetUpload}
                className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 border border-red-200 hover:border-red-300 transition-colors rounded-md"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {status === 'uploaded' && file && (
          <div className="text-center">
            {previewUrl && (
              <div className="w-32 h-32 mx-auto mb-4  overflow-hidden">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <p className="text-sm text-gray-600 mb-2 truncate">
              {file.name} ({formatBytes(file.size)})
            </p>
          </div>
        )}

        {status === 'success' && file && (
          <div className="text-center">
            <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-500" />
            <p className="text-lg font-medium text-green-600 mb-2">
              Avatar Updated!
            </p>
            <p className="text-sm text-gray-500">Closing in a moment...</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
