import { SessionResponse } from './session.type';

export interface UserSessionProps {
  sessions: SessionResponse[];
  isLoading: boolean;
  isError: boolean;
}
