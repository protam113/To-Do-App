// import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
// import { endpoints, handleAPI } from '../../apis';
// import type { FetchTagListResponse, Filters } from '@/types';
// import { buildQueryParams } from '../../utils';
// import { CreateTypeBySlugDTO } from '@/types';
// import { Message } from '@libs/logs-config';

// const fetchStatusList = async (
//   pageParam = 1,
//   slug: string,
//   filters: Filters
// ): Promise<FetchTagListResponse> => {
//   try {
//     const queryString = buildQueryParams(filters, pageParam);

//     if (!endpoints.tags) {
//       throw new Error(Message.ENPOINT_ERROR);
//     }

//     const response = await handleAPI(
//       `${endpoints.tags.replace(':slug', slug)}${
//         queryString ? `?${queryString}` : ''
//       }`,
//       'GET'
//     );
//     return response.data;
//   } catch (error) {
//     console.error('Error fetching teams list:', error);
//     throw error;
//   }
// };

// const useStatusList = (
//   page: number,
//   slug: string,
//   filters: Filters = {},
//   refreshKey: number
// ) => {
//   return useQuery<FetchTagListResponse, Error>({
//     queryKey: ['status', 'list', page, slug, filters, refreshKey],
//     queryFn: () => fetchStatusList(page, slug, filters),
//     enabled: page > 0,
//     staleTime: 60000,
//   });
// };

// const CreateStatus = async (newStatus: CreateTypeBySlugDTO, slug: string) => {
//   if (!endpoints.tags) {
//     throw new Error(Message.ENPOINT_ERROR);
//   }
//   try {
//     const response = await handleAPI(
//       `${endpoints.tags.replace(':slug', slug)}`,
//       'POST',
//       newStatus
//     );

//     return response;
//   } catch (error: any) {
//     console.error('Error creating project:', error.response?.data);
//     throw new Error(error.response?.data?.message || 'Failed to create type');
//   }
// };

// const useCreateStatus = (slug: string) => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: async (newStatus: CreateTypeBySlugDTO) => {
//       return CreateStatus(newStatus, slug);
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({
//         queryKey: ['status'],
//       });
//     },
//   });
// };

// export { useStatusList, useCreateStatus };
