interface Media {
  id: string;
  url: string;
  fileName?: string;
  originalName?: string;
  mimeType?: string;
  fileType?: string;
}

export interface IssueResponse {
  id: string;
  createBy: string;
  name: string;
  expiresAt: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  isExpired: boolean;
  medias: Media[];
  valid?: boolean;
  message?: string;
}
