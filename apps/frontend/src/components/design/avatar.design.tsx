import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui';
import React from 'react';

interface UserAvatarProps {
  url: string;
  username?: string;
}

export const UserAvatar = ({ url, username }: UserAvatarProps) => {
  const avatar = (
    <Avatar className="h-8 w-8">
      <AvatarImage src={url} alt={username || 'User avatar'} />
      <AvatarFallback>
        <AvatarImage src="/imgs/logo_c.jpg" alt="User avatar" />
      </AvatarFallback>
    </Avatar>
  );

  if (!username) return avatar;

  return (
    <Tooltip>
      <TooltipTrigger asChild>{avatar}</TooltipTrigger>
      <TooltipContent side="bottom" className="bg-white">
        {username}
      </TooltipContent>
    </Tooltip>
  );
};
