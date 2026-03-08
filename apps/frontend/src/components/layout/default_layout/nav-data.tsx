// 'use client';

// import {
//   SidebarGroup,
//   SidebarGroupLabel,
//   SidebarMenu,
//   SidebarMenuButton,
//   SidebarMenuItem,
// } from '../../ui/sidebar';
// import { Collapsible, CollapsibleTrigger } from '@/components/ui';
// // import { UserProjectList } from '@/libs/responses/projectLib';
// import Link from 'next/link';
// import { LoadingSpin } from '../../loading/spin';

// export function NavData() {
//   const params = {
//     page_size: 10,
//   };

//   // const { projects, isLoading, isError } = UserProjectList(1, params, 0);

//   if (isLoading) {
//     return (
//       <SidebarGroup>
//         <SidebarGroupLabel className="text-lg mb-2">Projects</SidebarGroupLabel>
//         <SidebarMenu>
//           <SidebarMenuItem>
//             <LoadingSpin />
//           </SidebarMenuItem>
//         </SidebarMenu>
//       </SidebarGroup>
//     );
//   }

//   if (isError) {
//     return (
//       <SidebarGroup>
//         <SidebarGroupLabel className="text-lg xs-2">Projects</SidebarGroupLabel>
//         <SidebarMenu>
//           <SidebarMenuItem>
//             <div className="px-2 py-2 text-sm text-destructive">
//               Failed to load projects
//             </div>
//           </SidebarMenuItem>
//         </SidebarMenu>
//       </SidebarGroup>
//     );
//   }

//   return (
//     <SidebarGroup>
//       <SidebarGroupLabel className="text-xs mb-2">Projects</SidebarGroupLabel>
//       <div className="max-h-[280px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
//         <SidebarMenu>
//           {projects?.map((project) => (
//             <Collapsible key={project.id} asChild className="group/collapsible">
//               <SidebarMenuItem>
//                 <CollapsibleTrigger asChild>
//                   <Link
//                     href={`/team/${project?.team?.slug}/project/${project?.slug}`}
//                   >
//                     <SidebarMenuButton tooltip={project?.name}>
//                       <div className="flex aspect-square size-6 items-center font-semibold justify-center border bg-sidebar-primary text-sidebar-primary-foreground shrink-0">
//                         {project?.name?.split(' ')?.[0]?.charAt(0)}
//                       </div>
//                       <span className="truncate text-xs">{project?.name}</span>
//                     </SidebarMenuButton>
//                   </Link>
//                 </CollapsibleTrigger>
//               </SidebarMenuItem>
//             </Collapsible>
//           ))}
//         </SidebarMenu>
//       </div>
//     </SidebarGroup>
//   );
// }
