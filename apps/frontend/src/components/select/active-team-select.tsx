// 'use client';

// import React from 'react';
// import {
//   Select,
//   SelectTrigger,
//   SelectContent,
//   SelectItem,
//   SelectValue,
// } from '@/components/ui';
// import { useActivateTeam } from '../../hooks/team/useTeam';

// const ActiveTeamSelect = ({
//   isActive,
//   teamId,
// }: {
//   isActive: boolean;
//   teamId: string;
// }) => {
//   const { mutate: activateTeam, isPending } = useActivateTeam(teamId);

//   const handleChange = (value: string) => {
//     const newStatus = value === 'true';
//     if (newStatus !== isActive) {
//       activateTeam();
//     }
//   };

//   // Nếu đã active thì hiện badge xanh, không cho sửa
//   if (isActive) {
//     return (
//       <span className="px-3 py-1 text-sm font-medium text-green-700 bg-green-100 rounded">
//         Active
//       </span>
//     );
//   }

//   // Nếu inactive thì hiện select với nền đỏ
//   return (
//     <Select
//       onValueChange={handleChange}
//       defaultValue={String(isActive)}
//       disabled={isPending}
//     >
//       <SelectTrigger className="w-[120px] rounded px-4 bg-red-100 border-red-300 text-red-700 font-medium">
//         <SelectValue />
//       </SelectTrigger>
//       <SelectContent className="rounded bg-white min-w-[120px]" align="start">
//         <SelectItem value="true" className="rounded-md">
//           Active
//         </SelectItem>
//         <SelectItem value="false" className="rounded-md">
//           Inactive
//         </SelectItem>
//       </SelectContent>
//     </Select>
//   );
// };

// export default ActiveTeamSelect;
