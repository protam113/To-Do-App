/**
 * Response when generating access code
 */
export interface AccessCodeResponse {
  accessCode: string; // 6-character alphanumeric code
  monitorId: string; // ID of the monitor this code is for
  expiresAt: Date; // Expiration timestamp
  ttlSeconds: number; // Remaining TTL in seconds
}

/**
 * Details stored in Redis
 */
export interface AccessCodeDetails {
  userId: string; // Admin who created the code
  monitorId: string; // Monitor this code grants access to
  createdAt: Date; // Creation timestamp
}

/**
 * List item for admin view
 */
export interface AccessCodeListItem {
  code: string;
  monitorId: string; // Monitor this code is for
  createdBy: string; // userId
  createdAt: Date;
  expiresAt: Date;
  remainingTtl: number; // Seconds remaining
}
