export interface RefreshTokenSession {
    token: string;
    deviceId: string;
    deviceName: string;
    ipAddress?: string;
    lastUsed: Date;
    createdAt: Date;
}