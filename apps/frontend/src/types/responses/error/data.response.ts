export interface ErrorResponse {
  id: string;
  name: string;
  slug: string;
  isActive: boolean;
  metadata?: Record<string, any>;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}
