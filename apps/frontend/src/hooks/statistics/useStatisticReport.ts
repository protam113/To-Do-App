import { endpoints, handleAPI } from '@/apis';
import { useQuery } from '@tanstack/react-query';
import type {
  Filters,
  ReportDailyStat,
  ReportSumaryStat,
  ReportTrendStat,
} from '@/types';
import { buildQueryParamsNoPage } from '../../utils';

const fetchReportDailyStatis = async (
  filters: Filters
): Promise<ReportDailyStat> => {
  const queryString = buildQueryParamsNoPage(filters);

  try {
    const response = await handleAPI(
      `${endpoints.report_daily}${queryString ? `?${queryString}` : ''}`,
      'GET'
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching report daily statistics:', error);
    throw error;
  }
};

const useReportDailyStatis = (filters: Filters = {}, refreshKey: number) => {
  return useQuery<ReportDailyStat, Error>({
    queryKey: ['statisReportDaily', refreshKey],
    queryFn: () => fetchReportDailyStatis(filters),
    enabled: true,
    staleTime: 60000,
  });
};

const fetchReportSummaryStatis = async (
  filters: Filters
): Promise<ReportSumaryStat> => {
  const queryString = buildQueryParamsNoPage(filters);

  try {
    const response = await handleAPI(
      `${endpoints.report_sumary}${queryString ? `?${queryString}` : ''}`,
      'GET'
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching report summary statistics:', error);
    throw error;
  }
};

const useReportSumaryStatis = (filters: Filters = {}, refreshKey: number) => {
  return useQuery<ReportSumaryStat, Error>({
    queryKey: ['statisReportSumary', filters, refreshKey],
    queryFn: () => fetchReportSummaryStatis(filters),
    enabled: true,
    staleTime: 60000,
  });
};

const fetchReportTrendStatis = async (
  filters: Filters
): Promise<ReportTrendStat[]> => {
  const queryString = buildQueryParamsNoPage(filters);

  try {
    const response = await handleAPI(
      `${endpoints.report_trend}${queryString ? `?${queryString}` : ''}`,
      'GET'
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching report trend statistics:', error);
    throw error;
  }
};

const useReportTrendStatis = (filters: Filters = {}, refreshKey: number) => {
  return useQuery<ReportTrendStat[], Error>({
    queryKey: ['statisReportTrend', filters, refreshKey],
    queryFn: () => fetchReportTrendStatis(filters),
    enabled: true,
    staleTime: 60000,
  });
};
export { useReportDailyStatis, useReportSumaryStatis, useReportTrendStatis };
