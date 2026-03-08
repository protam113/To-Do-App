// import { useState } from 'react';
// import {
//   SidebarGroupLabel,
//   SidebarMenu,
//   SidebarMenuButton,
//   SidebarMenuItem,
// } from '../../ui/sidebar';
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuLabel,
//   DropdownMenuTrigger,
//   DropdownMenuSeparator,
// } from '@/components/ui';
// import { ChevronDown, Check, Loader } from 'lucide-react';
// import { DropdownMenuItem } from '@radix-ui/react-dropdown-menu';
// import { UserTeamList } from '@/libs/responses/teamLib';
// import Link from 'next/link';

// export function WorkspaceSwitcher() {
//   const [workspaceId, setWorkspaceId] = useState<string | null>(null);

//   const params = {
//     page_size: 10,
//   };

//   const { teams, isLoading } = UserTeamList(1, params, 0);

//   const workspaces = teams || [];
//   const activeWorkspace =
//     workspaces.find((w) => w.team?.id === workspaceId) || workspaces[0];
//   const isMobile = false;

//   const onSelect = (workspace: (typeof workspaces)[0]) => {
//     if (workspace.team?.id) {
//       setWorkspaceId(workspace.team.id);
//     }
//   };

//   return (
//     <>
//       <SidebarGroupLabel className="w-full pr-0">
//         <span className="text-main-300">Workspaces</span>
//       </SidebarGroupLabel>
//       <SidebarMenu>
//         <SidebarMenuItem>
//           <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//               <SidebarMenuButton
//                 size="lg"
//                 className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground border-main-700 border bg-gray-10"
//               >
//                 {activeWorkspace?.team ? (
//                   <>
//                     <div className="flex aspect-square size-8 items-center font-semibold justify-center   bg-sidebar-primary text-sidebar-primary-foreground">
//                       {activeWorkspace.team.name?.split(' ')?.[0]?.charAt(0)}
//                     </div>
//                     <div className="grid flex-1 text-left text-sm leading-tight">
//                       <span className="truncate font-semibold">
//                         {activeWorkspace.team.name}
//                       </span>
//                       {/* <span className="truncate text-xs">Free</span> */}
//                     </div>
//                   </>
//                 ) : (
//                   <div className="grid flex-1 text-left text-sm leading-tight">
//                     <span className="truncate font-semibold">
//                       No Workspace selected
//                     </span>
//                   </div>
//                 )}
//                 <ChevronDown className="ml-auto" />
//               </SidebarMenuButton>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent
//               className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-md border border-main-200 bg-white "
//               align="start"
//               side={isMobile ? 'bottom' : 'right'}
//               sideOffset={4}
//             >
//               <DropdownMenuLabel className="text-xs text-black">
//                 Workspaces
//               </DropdownMenuLabel>

//               {isLoading && (
//                 <div className="flex items-center justify-center p-2">
//                   <Loader className="w-5 h-5 animate-spin" />
//                 </div>
//               )}

//               {workspaces?.map((workspace) => (
//                 <DropdownMenuItem
//                   key={workspace.team?.id || workspace.id}
//                   onClick={() => onSelect(workspace)}
//                   className=" items-center cursor-pointer! rounded-md text-main hover:bg-main hover:text-white  "
//                 >
//                   <Link
//                     href={`/team/${workspace.team?.slug}`}
//                     className="flex gap-2 p-2 "
//                   >
//                     <div className="flex aspect-square size-6 items-center font-semibold justify-center    border">
//                       {workspace.team?.name?.split(' ')?.[0]?.charAt(0)}
//                     </div>
//                     <span className="flex-1 truncate ">
//                       {workspace.team?.name}
//                     </span>
//                     {workspace.team?.id === workspaceId && (
//                       <Check className="w-4 h-4 ml-auto" />
//                     )}
//                   </Link>
//                 </DropdownMenuItem>
//               ))}
//               <DropdownMenuSeparator />
//             </DropdownMenuContent>
//           </DropdownMenu>
//         </SidebarMenuItem>
//       </SidebarMenu>
//     </>
//   );
// }
