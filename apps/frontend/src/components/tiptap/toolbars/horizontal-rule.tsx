'use client';

import { SeparatorHorizontal } from 'lucide-react';
import React from 'react';

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  Button,
  type ButtonProps,

} from '@/components/ui';
import { useToolbar } from './toolbar-provider';
import { cn } from '@/utils';

const HorizontalRuleToolbar = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, onClick, children, ...props }, ref) => {
    const { editor } = useToolbar();
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className={cn('h-8 w-8 p-0 sm:h-9 sm:w-9', className)}
            onClick={(e) => {
              editor?.chain().focus().setHorizontalRule().run();
              onClick?.(e);
            }}
            ref={ref}
            {...props}
          >
            {children ?? <SeparatorHorizontal className="h-4 w-4" />}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <span>Horizontal Rule</span>
        </TooltipContent>
      </Tooltip>
    );
  }
);

HorizontalRuleToolbar.displayName = 'HorizontalRuleToolbar';

export { HorizontalRuleToolbar };
