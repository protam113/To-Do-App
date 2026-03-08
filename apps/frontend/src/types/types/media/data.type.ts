/**
 * ==========================
 *  @MEDIA
 * ==========================
 */

export interface PresignItem {
  originalName: string;
  mimeType?: string;
  size: number;
  fileType?: 'image' | 'video';
  metadata?: Record<string, any>;
  expiresIn?: number;
}

export interface DeleteMedia {
  ids: string[];
}
