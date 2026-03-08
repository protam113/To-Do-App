'use client';

import { Button } from '@/components/ui';
import { Heading } from '@/components/design';
import { useParams } from 'next/navigation';
import MemberList from '@/components/pages/team/member.list';
import { useAuthStore } from '@/store';
import { useState } from 'react';
import AddMembers from '@/components/pages/team/member.add';
import { useTeamMemberList } from '@/hooks/team/useUserTeam';

export default function Page() {
  const { userInfo } = useAuthStore();

  const params = useParams();
  const teamSlug = Array.isArray(params['team-slug'])
    ? params['team-slug'][0]
    : params['team-slug'] || '';
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const { data: teamMembersData } = useTeamMemberList(teamSlug, 1, {}, 0);
  const currentUserTeamRole = teamMembersData?.results?.find(
    (member: any) => member.user?.id === userInfo?.id
  )?.role;

  // Check if user can add members
  const canAddMembers =
    ['admin', 'manager'].includes(userInfo?.role || '') ||
    ['owner', 'manager'].includes(currentUserTeamRole || '');

  return (
    <>
      <div>
        <section className="mt-8 space-y-4">
          <div className="flex items-center justify-between">
            <Heading name="Team Members" />
            {canAddMembers && (
              <Button
                variant="ghost"
                className="bg-main-200 hover:bg-main-500 hover:text-white"
                onClick={() => setIsCreateDialogOpen(!isCreateDialogOpen)}
              >
                {isCreateDialogOpen ? 'Cancel' : 'Add Member'}
              </Button>
            )}
          </div>

          {isCreateDialogOpen && (
            <div className="bg-white border-2 border-main p-6 shadow-lg animate-in fade-in slide-in-from-top-4 duration-300">
              <AddMembers
                teamSlug={teamSlug}
                onSuccess={() => setIsCreateDialogOpen(false)}
              />
            </div>
          )}

          {!isCreateDialogOpen && (
            <>
              <div className=" min-w-0">
                <MemberList teamSlug={teamSlug} />
              </div>
            </>
          )}
        </section>
      </div>
    </>
  );
}
