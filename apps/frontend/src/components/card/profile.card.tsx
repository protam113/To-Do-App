'use client';

import {
  Card,
  CardContent,
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui';

interface TeamMemberCardProps {
  name: string;
  userId: string;
  role: string;
  avatarUrl?: string;
  initials?: string;
  username: string;
}

export function ProfileCard({
  name,
  role,
  avatarUrl,
  initials,
  username,
}: TeamMemberCardProps) {
  return (
    <Card className="border-border rounded-md bg-card transition-shadow hover:shadow-lg">
      <CardContent className="flex flex-col items-center p-6">
        <Avatar
          className={`mb-4 h-24 w-24 ring-offset-4 ring-offset-background`}
        >
          {avatarUrl && (
            <AvatarImage src={avatarUrl || '/imgs/logo_c.jpg'} alt={name} />
          )}
          <AvatarFallback className="bg-muted text-lg font-semibold text-muted-foreground">
            {initials ||
              name
                .split(' ')
                .map((n) => n[0])
                .join('')}
          </AvatarFallback>
        </Avatar>

        <h3 className="mb-1 text-center text-base font-semibold">{name}</h3>
        <p className="mb-4 text-center text-sm text-muted-foreground">{role}</p>

        <h3 className="mb-1 text-center text-xs font-semibold">{username}</h3>
      </CardContent>
    </Card>
  );
}
