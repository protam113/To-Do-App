// 'use client';

// import React from 'react';
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from '@/components/ui';
// import { UserProjectExtendedResponse } from '@/types';
// import Link from 'next/link';
// import { truncateHtmlToText } from '../../utils';

// interface ProjectCardProps {
//   project: UserProjectExtendedResponse;
//   teamSlug?: string;
// }

// export const UserProjectCard = ({ project, teamSlug }: ProjectCardProps) => {
//   return (
//     <Link
//       href={`/team/${teamSlug}/project/${project.slug}`}
//       className="col-span-1 "
//     >
//       <Card className="group relative  bg-white h-full rounded-md transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 will-change-transform overflow-hidden">
//         <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
//           <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.05)_1px,transparent_1px)] bg-size" />
//         </div>

//         <CardHeader className="relative p-4 pb-2">
//           <div className="flex items-center justify-between">
//             <CardTitle className="text-lg font-semibold text-gray-800 ">
//               {project?.name}
//             </CardTitle>
//           </div>
//         </CardHeader>

//         <CardContent className="relative space-y-2 p-4 pt-0">
//           <CardDescription className="text-sm text-gray-400  leading-snug line-clamp-2">
//             {truncateHtmlToText(
//               project?.description || 'No description available',
//               100
//             )}
//           </CardDescription>
//         </CardContent>

//         <CardFooter className="relative p-4 pt-0">
//           <div className="flex items-center gap-2">
//             <div className="w-8 h-8   flex items-center justify-center bg-white/70 font-semibold text-sm">
//               {project?.team?.name?.charAt(0).toUpperCase() || 'T'}
//             </div>
//             <span className="text-sm text-gray-600 ">
//               {project?.team?.name || 'Team'}
//             </span>
//           </div>
//         </CardFooter>

//         <div className="absolute inset-0 -z-10 rounded-md p-px bg-linear-to-br  from-transparent via-gray-300/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
//       </Card>
//     </Link>
//   );
// };
