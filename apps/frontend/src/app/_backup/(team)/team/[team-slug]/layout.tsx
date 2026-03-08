'use client';

import { Container } from '@/components';
import TeamHeader from '@/components/pages/team/team-header';
import { TeamAccessDenied } from '@/components/pages/team/team-access-denied';
import { useTeamDetail } from '@/hooks/team/useTeam';
import {
  TeamAccessProvider,
  useTeamAccess,
} from '../../../../../../context/team-access-context';
import { SelectedTaskProvider } from '@/context/use-selected-task-context';
import { useParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';

function TeamLayoutContent({
  children,
  teamSlug,
}: {
  children: React.ReactNode;
  teamSlug: string;
}) {
  const { isMember, isLoading: isCheckingAccess } = useTeamAccess();
  const { data: team, isLoading, isError } = useTeamDetail(teamSlug, 0);

  // Show loading while checking access
  if (isCheckingAccess) {
    return (
      <main className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </main>
    );
  }

  // If not a member, show access denied with countdown
  if (!isMember) {
    return <TeamAccessDenied />;
  }

  return (
    <SelectedTaskProvider>
      <main>
        <TeamHeader
          team={team}
          isLoading={isLoading}
          isError={isError}
          teamSlug={teamSlug}
          ownerId={team?.owner?.id}
        />
        <Container>{children}</Container>
      </main>
    </SelectedTaskProvider>
  );
}

export default function TeamLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const params = useParams();
  const teamSlug = Array.isArray(params['team-slug'])
    ? params['team-slug'][0]
    : params['team-slug'] || '';

  return (
    <TeamAccessProvider teamSlug={teamSlug}>
      <TeamLayoutContent teamSlug={teamSlug}>{children}</TeamLayoutContent>
    </TeamAccessProvider>
  );
}
