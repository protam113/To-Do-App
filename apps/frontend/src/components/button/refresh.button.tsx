// components/button/RefreshButton.tsx

import { Button } from '@/components/ui';
import { Icons } from '@/assets';
import { RefreshButtonProps } from '@/types';

export const RefreshButton: React.FC<RefreshButtonProps> = ({
  onClick,
  className = '',
}) => {
  return (
    <Button
      onClick={onClick}
      className={`group ml-2 text-xs bg-background text-main-900 border-2 border-gray-300 hover:bg-main-300 rounded-md transition-all duration-300 ${className}`}
    >
      <Icons.RefreshCcwDot className="mr-2 transition-transform duration-300 group-hover:rotate-180" />
      Refresh
    </Button>
  );
};
