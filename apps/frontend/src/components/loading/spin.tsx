// components/Loading.tsx
import type { LoadingProps } from '@/types';
import { Icons } from '../../assets/icons';
import { string } from 'zod';

export const LoadingSpin: React.FC<LoadingProps> = ({
  size = 32,
  message = 'Loading...',
  className = string,
}) => {
  return (
    <div>
      <Icons.Loader2 className={`animate-spin ${className}`} size={size} />
      <span className="text-sm text-gray-500">{message}</span>
    </div>
  );
};
