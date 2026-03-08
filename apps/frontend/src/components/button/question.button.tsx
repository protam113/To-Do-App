'use client';

import React from 'react';
import type { QuestionButtonProps } from '@/types';
import { CircleHelp } from 'lucide-react';
import { cn } from '@/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export const QuestionButton: React.FC<QuestionButtonProps> = ({
  description,
  className,
}) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          className={cn(
            'group flex items-center gap-3 rounded-full p-1 pr-6 transition-all',
            className
          )}
        >
          <CircleHelp
            className="h-6 w-6 text-main/70 hover:text-main-400"
            strokeWidth={2.5}
          />
        </button>
      </TooltipTrigger>
      <TooltipContent side="bottom" sideOffset={8}>
        {description}
      </TooltipContent>
    </Tooltip>
  );
};
