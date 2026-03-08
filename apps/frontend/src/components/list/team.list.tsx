// 'use client';

// import { Button } from '@/components/ui';
// import type React from 'react';
// import { Heading } from '../design/heading.design';
// import { useRouter } from 'next/navigation';
// import { AdminTeamList } from '../../libs/responses/teamLib';
// import { TeamListResponse } from '@/types';
// import { truncateText } from '../../utils';
// import { ErrorLoading } from '../loading/error';
// import { LoadingSpin } from '../loading/spin';
// import Link from 'next/link';

// export function FeatureCardsGrid() {
//   const router = useRouter();
//   const params = {
//     page_size: 8,
//   };

//   const { teams, isLoading, isError } = AdminTeamList(1, params, 0);
//   return (
//     <div className="p-2">
//       {/* Header */}
//       <div className="flex items-center justify-between ">
//         <Heading name="Recent team" />
//         <Button
//           variant="ghost"
//           className="rounded-md bg-white text-gray-800 hover:text-black"
//           onClick={() => router.push('/admin/team')}
//         >
//           View All
//         </Button>
//       </div>

//       {/* Features Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2  gap-2">
//         {isError ? (
//           <ErrorLoading />
//         ) : isLoading ? (
//           <LoadingSpin />
//         ) : (
//           teams.map((team) => <FeatureCard key={team.id} team={team} />)
//         )}
//       </div>
//     </div>
//   );
// }

// function FeatureCard({ team }: { team: TeamListResponse }) {
//   return (
//     <Link
//       href={`/admin/team/${team.slug}`}
//       className="p-4 bg-white border border-border hover:shadow-md transition-shadow duration-200 cursor-pointer"
//     >
//       <div className="flex items-start gap-3">
//         {/* Icon Container */}
//         <div className="flex aspect-square size-8 items-center font-semibold justify-center rounded-full bg-main text-white border">
//           {team.name?.split(' ')?.[0]?.charAt(0)}
//         </div>

//         {/* Content */}
//         <div className="flex-1 min-w-0">
//           <h3 className="text-sm font-semibold text-foreground truncate">
//             {team.name}
//           </h3>
//           <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
//             {truncateText(team.description || 'Unknow', 50)}
//           </p>
//         </div>
//       </div>
//     </Link>
//   );
// }
