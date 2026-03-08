// 'use client';

// import { createContext, useContext } from 'react';
// import type { ReactNode } from 'react';
// import { useCheckTeam } from '../hooks/team/useUserTeam';

// export interface TeamAccessContextProps {
//   isMember: boolean;
//   role: 'owner' | 'manager' | 'member' | null;
//   isLoading: boolean;
//   isError: boolean;
// }

// const TeamAccessContext = createContext<TeamAccessContextProps | undefined>(
//   undefined
// );

// interface TeamAccessProviderProps {
//   children: ReactNode;
//   teamSlug: string;
// }

// export function TeamAccessProvider({
//   children,
//   teamSlug,
// }: TeamAccessProviderProps) {
//   const { data, isLoading, isError } = useCheckTeam(teamSlug, 0);

//   const isMember = data?.isMember ?? false;
//   const role = data?.role ?? null;

//   // Redirect is handled by TeamAccessDenied component in layout

//   const contextValue: TeamAccessContextProps = {
//     isMember,
//     role,
//     isLoading,
//     isError,
//   };

//   return (
//     <TeamAccessContext.Provider value={contextValue}>
//       {children}
//     </TeamAccessContext.Provider>
//   );
// }

// export function useTeamAccess(): TeamAccessContextProps {
//   const context = useContext(TeamAccessContext);
//   if (context === undefined) {
//     throw new Error('useTeamAccess must be used within a TeamAccessProvider');
//   }
//   return context;
// }

// export { TeamAccessContext };
