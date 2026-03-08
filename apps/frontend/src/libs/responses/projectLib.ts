// import { Filters } from '@/types';
// import {
//   useTeamProjectList,
//   useUserProjectList,
// } from '../../hooks/project/useTeamProject';
// import {
//   useProjectAdminList,
//   useProjectDetail,
// } from '../../hooks/project/useProject';

// export const AdminProjectList = (
//   currentPage: number,
//   filters: Filters,
//   refreshKey: number
// ) => {
//   const { data, isLoading, isError } = useProjectAdminList(
//     currentPage,
//     filters,
//     refreshKey
//   );

//   const pagination = data?.pagination ?? {
//     page: 1,
//     total_page: 1,
//     total: 0,
//   };

//   const projects = data?.results ?? [];

//   return {
//     projects,
//     isLoading,
//     isError,
//     pagination,
//   };
// };

// export const TeamProjectList = (
//   currentPage: number,
//   slug: string,
//   filters: Filters,
//   refreshKey: number
// ) => {
//   const { data, isLoading, isError } = useTeamProjectList(
//     currentPage,
//     slug,
//     filters,
//     refreshKey
//   );

//   const pagination = data?.pagination ?? {
//     page: 1,
//     total_page: 1,
//     total: 0,
//   };

//   const projects = data?.results ?? [];

//   return {
//     projects,
//     isLoading,
//     isError,
//     pagination,
//   };
// };

// export const ProjectDetail = (slug: string, refreshKey: number) => {
//   const { data, isLoading, isError } = useProjectDetail(slug, refreshKey);

//   const project = data ?? [];

//   return {
//     project,
//     isLoading,
//     isError,
//   };
// };

// export const UserProjectList = (
//   currentPage: number,
//   filters: Filters,
//   refreshKey: number
// ) => {
//   const { data, isLoading, isError } = useUserProjectList(
//     currentPage,
//     filters,
//     refreshKey
//   );

//   const pagination = data?.pagination ?? {
//     page: 1,
//     total_page: 1,
//     total: 0,
//   };

//   const projects = data?.results ?? [];

//   return {
//     projects,
//     isLoading,
//     isError,
//     pagination,
//   };
// };
