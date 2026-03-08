export interface LogInOutput {
  id: string;
  accessToken: string;
  refreshToken?: string;
}

export interface LogInResponse {
  success: boolean;
  code: number;
  message: string;
  data: {
    id: string;
    accessToken: string;
  } | null;
}
