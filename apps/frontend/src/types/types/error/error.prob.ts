import { ErrorResponse } from '../../responses/error/data.response';

export interface ErrorTableProps {
  errors: ErrorResponse[];
  isLoading: boolean;
  isError: boolean;
  onRefresh?: () => void;
}
