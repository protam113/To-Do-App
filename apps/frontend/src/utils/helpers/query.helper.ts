// utils/query.ts

import { Filters } from '@/types';

export const buildQueryParams = (
  filters: Filters,
  page: number,
  pageSize = 20
): string => {
  const validFilters = Object.fromEntries(
    Object.entries(filters).filter(
      ([, value]) =>
        value !== undefined &&
        value !== '' &&
        !(Array.isArray(value) && value.length === 0)
    )
  );

  const params = new URLSearchParams({
    page: page.toString(),
    page_size: pageSize.toString(),
    ...Object.entries(validFilters).reduce((acc, [key, value]) => {
      acc[key] = String(value);
      return acc;
    }, {} as Record<string, string>),
  });

  return params.toString();
};

export const buildQueryParamsNoPage = (filters: Filters): string => {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (
      value === undefined ||
      value === '' ||
      (Array.isArray(value) && value.length === 0)
    ) {
      return;
    }

    if (Array.isArray(value)) {
      value.forEach((v) => {
        params.append(key, String(v));
      });
    } else {
      params.append(key, String(value));
    }
  });

  return params.toString();
};
