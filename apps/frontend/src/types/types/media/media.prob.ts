/**
 * ==========================
 *  @MEDIA PROPS
 *  @DESCRIPTION : This file exports all the media props used in the application.
 *  @VERSION 1.0.0
 * ==========================
 */

export interface ImagePlaceholderOptions {
  HTMLAttributes: Record<string, any>;
  onUpload?: (url: string) => void;
  onError?: (error: string) => void;
}

export interface ImageUploadPreviewProps {
  onImageUploaded?: (imageUrl: string, imageId: string) => void;
  type?: string;
}
