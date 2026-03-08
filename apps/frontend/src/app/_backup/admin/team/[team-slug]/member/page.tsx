'use client';

import { Button } from '@/components/ui';
import { Heading } from '@/components/design';
import { useParams } from 'next/navigation';
import MemberList from '@/components/pages/team/member.list';
import { useState } from 'react';
import AddMembers from '@/components/pages/team/member.add';
import { TeamMemberList } from '@/libs/responses/teamLib';

export default function Page() {
  const params = useParams();
  const teamSlug = Array.isArray(params['team-slug'])
    ? params['team-slug'][0]
    : params['team-slug'] || '';
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // Lấy tất cả members để exclude trong AddMembers
  const { members } = TeamMemberList(
    1,
    teamSlug,
    { page_size: 1000 },
    refreshKey
  );
  const existingMemberIds = members.map((m) => m.user.id);

  return (
    <>
      <div className="min-h-screen">
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <Heading name="Team Members" />
            <div className="space-x-2 flex">
              <Button
                variant="ghost"
                className="bg-white border-b border-b-main hover:bg-main-600 hover:text-white"
                onClick={() => setIsCreateDialogOpen(!isCreateDialogOpen)}
              >
                {isCreateDialogOpen ? 'Cancel' : 'Change Owner'}
              </Button>
              <Button
                variant="ghost"
                className="bg-main-200 hover:bg-main-600 hover:text-white"
                onClick={() => setIsCreateDialogOpen(!isCreateDialogOpen)}
              >
                {isCreateDialogOpen ? 'Cancel' : 'Add Member'}
              </Button>
            </div>
          </div>

          {isCreateDialogOpen && (
            <div className="bg-white border-2 border-main   p-6 shadow-lg animate-in fade-in slide-in-from-top-4 duration-300">
              <AddMembers
                teamSlug={teamSlug}
                excludeUserIds={existingMemberIds}
                onSuccess={() => {
                  setIsCreateDialogOpen(false);
                  setRefreshKey((prev) => prev + 1);
                }}
              />
            </div>
          )}

          {!isCreateDialogOpen && (
            <>
              <div className="  min-w-0">
                <MemberList teamSlug={teamSlug} refreshKey={refreshKey} />
              </div>
            </>
          )}
        </section>
      </div>
    </>
  );
}
