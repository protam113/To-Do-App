// 'use client';

// import { useState, useRef, useEffect } from 'react';
// import { Search, ChevronDown, Loader2 } from 'lucide-react';
// import { Input } from '@/components/ui';
// import { logDebug } from '../../utils/logger';
// import { TeamMemberList } from '../../libs/responses/teamLib';

// interface UserSelectProps {
//   value?: string;
//   onValueChange: (userId: string) => void;
//   placeholder?: string;
//   teamSlug: string;
// }

// export function UserTeamSelect({
//   value,
//   onValueChange,
//   teamSlug,
// }: UserSelectProps) {
//   const [isOpen, setIsOpen] = useState(false);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [actualSearchQuery, setActualSearchQuery] = useState('');
//   const [allUsers, setAllUsers] = useState<any[]>([]);
//   const dropdownRef = useRef<HTMLDivElement>(null);

//   const params = {
//     search: actualSearchQuery || undefined,
//     page_size: 10,
//   };

//   const {
//     members: users,
//     isLoading,
//     pagination,
//   } = TeamMemberList(currentPage, teamSlug, params, 0);

//   // Accumulate users when loading more
//   useEffect(() => {
//     if (users && currentPage === 1) {
//       setAllUsers(users);
//     } else if (users && currentPage > 1) {
//       setAllUsers((prev) => [...prev, ...users]);
//     }
//   }, [users, currentPage]);

//   // Close dropdown when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (
//         dropdownRef.current &&
//         !dropdownRef.current.contains(event.target as Node)
//       ) {
//         setIsOpen(false);
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, []);

//   const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
//     if (e.key === 'Enter') {
//       e.preventDefault();
//       setActualSearchQuery(searchQuery.trim());
//       setCurrentPage(1);
//     }
//   };

//   const handleClearSearch = () => {
//     setSearchQuery('');
//     setActualSearchQuery('');
//     setCurrentPage(1);
//   };

//   const handleLoadMore = () => {
//     if (currentPage < pagination.total_page) {
//       setCurrentPage((prev) => prev + 1);
//     }
//   };

//   const handleSelectUser = (userId: string, userName: string) => {
//     onValueChange(userId);
//     logDebug('..', userName);
//     setIsOpen(false);
//   };
//   const selectedUser = allUsers.find((u) => u.id === value);
//   const displayValue =
//     value === 'all' || !value
//       ? placeholder
//       : selectedUser
//       ? selectedUser.firstName && selectedUser.lastName
//         ? `${selectedUser.firstName} ${selectedUser.lastName}`
//         : selectedUser.username
//       : placeholder;

//   return (
//        <Popover
//                         open={openMemberSelect}
//                         onOpenChange={setOpenMemberSelect}
//                       >
//                         <PopoverTrigger asChild>
//                           <FormControl>
//                             <Button
//                               variant="outline"
//                               role="combobox"
//                               aria-expanded={openMemberSelect}
//                               className={cn(
//                                 'w-full h-14  justify-between',
//                                 !field.value && 'text-muted-foreground'
//                               )}
//                             >
//                               {field.value
//                                 ? members?.find(
//                                     (member) => member.id === field.value
//                                   )?.user.username
//                                 : 'Select member...'}
//                               <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
//                             </Button>
//                           </FormControl>
//                         </PopoverTrigger>
//                         <PopoverContent
//                           className="w-[--radix-popover-trigger-width] p-0"
//                           align="start"
//                         >
//                           <Command>
//                             <CommandInput
//                               placeholder="Search member..."
//                               value={searchQuery}
//                               onValueChange={setSearchQuery}
//                             />
//                             <CommandEmpty>
//                               {isTeamMembersLoading
//                                 ? 'Loading...'
//                                 : 'No member found.'}
//                             </CommandEmpty>
//                             <CommandGroup className="max-h-64 overflow-auto">
//                               {members?.map((member) => (
//                                 <CommandItem
//                                   key={member.id}
//                                   value={member.user.username}
//                                   onSelect={() => {
//                                     field.onChange(member.user.id);
//                                     setOpenMemberSelect(false);
//                                   }}
//                                 >
//                                   <Check
//                                     className={cn(
//                                       'mr-2 h-4 w-4',
//                                       field.value === member.user.id
//                                         ? 'opacity-100'
//                                         : 'opacity-0'
//                                     )}
//                                   />
//                                   <div className="flex flex-col">
//                                     <span className="font-medium">
//                                       {member.user.firstName}{' '}
//                                       {member.user.lastName}
//                                     </span>
//                                     {member.user.username && (
//                                       <span className="text-xs text-muted-foreground">
//                                         @{member.user.username}
//                                       </span>
//                                     )}
//                                   </div>
//                                 </CommandItem>
//                               ))}
//                               {currentPage < pagination.total_page && (
//                                 <div className="p-2 border-t">
//                                   <Button
//                                     type="button"
//                                     variant="ghost"
//                                     size="sm"
//                                     className="w-full"
//                                     onClick={(e) => {
//                                       e.preventDefault();
//                                       e.stopPropagation();
//                                       handlePageChange(currentPage + 1);
//                                     }}
//                                     disabled={isTeamMembersLoading}
//                                   >
//                                     {isTeamMembersLoading
//                                       ? 'Loading...'
//                                       : `Load more (${currentPage}/${pagination.total_page})`}
//                                   </Button>
//                                 </div>
//                               )}
//                             </CommandGroup>
//                           </Command>
//                         </PopoverContent>
//                       </Popover>
//   );
// }
