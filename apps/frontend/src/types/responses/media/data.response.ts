export interface MediaResponse {
  id: string;
  uploadUrl?: string;
  url?: string;
  fileName: string;
  originalName?: string;
  mimeType?: string;
  size?: number;
  fileType?: string;
  metadata?: Record<string, any>;
  createdAt?: Date;
  expiresIn?: number;
}
