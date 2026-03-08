'use client';

import { Container } from '@/components';
import AdminTeamHeader from '@/components/pages/team/admin-team-header';
import { useTeamDetail } from '@/hooks/team/useTeam';
import { useParams } from 'next/navigation';

function TeamLayoutContent({
  children,
  teamSlug,
}: {
  children: React.ReactNode;
  teamSlug: string;
}) {
  const { data: team, isLoading, isError } = useTeamDetail(teamSlug, 0);

  return (
    <main>
      <AdminTeamHeader
        team={team}
        isLoading={isLoading}
        isError={isError}
        teamSlug={teamSlug}
      />
      <Container>{children}</Container>
    </main>
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

  return <TeamLayoutContent teamSlug={teamSlug}>{children}</TeamLayoutContent>;
}
