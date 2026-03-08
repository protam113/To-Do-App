// components/Error.tsx
import { Container } from '../wrappers/container';
import { Icons } from '../../assets/icons';
import { LoadingProps } from '@/types';

export const ErrorLoading: React.FC<LoadingProps> = ({
  size = 32,
  message = 'Unable to load data. Please try again later.',
  className = '',
}) => {
  return (
    <Container
      className={`min-h-screen flex flex-col items-center justify-center gap-2 p-4 ${className}`}
    >
      <div className="col-span-full flex justify-center items-center py-10 text-red-500">
        <Icons.AlertTriangle className="h-5 w-5 mr-2" size={size} />
        <span>{message}</span>
      </div>
    </Container>
  );
};
