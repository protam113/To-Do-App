import { endpoints, handleAPI } from '@/apis';
import { useQuery } from '@tanstack/react-query';

// Types based on API response
interface ServiceHealth {
  name: string;
  status: 'healthy' | 'unhealthy' | 'unknown';
  responseTime?: number;
  components?: Record<string, { status: string }>;
  error?: string;
}

interface SystemHealth {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  uptime: number;
  services: ServiceHealth[];
  summary: {
    total: number;
    healthy: number;
    unhealthy: number;
  };
}

interface DetailedHealth extends SystemHealth {
  gateway: {
    status: string;
    memory: {
      heapUsed: number;
      heapTotal: number;
      rss: number;
      external: number;
      unit: string;
    };
    cpu: {
      user: number;
      system: number;
      unit: string;
    };
    nodeVersion: string;
    platform: string;
    pid: number;
  };
}

// Fetch all services health
const fetchServicesHealth = async (): Promise<SystemHealth> => {
  const response = await handleAPI(`${endpoints.health}`, 'GET');
  return response;
};

// Fetch detailed health with gateway info
const fetchDetailedHealth = async (): Promise<DetailedHealth> => {
  const response = await handleAPI(`${endpoints.health_detailed}`, 'GET');
  return response;
};

export const useServicesHealth = (refreshKey: number) => {
  return useQuery<SystemHealth, Error>({
    queryKey: ['servicesHealth', refreshKey],
    queryFn: fetchServicesHealth,
    staleTime: 10000,
    refetchInterval: 30000, // Auto refresh every 30s
  });
};

export const useDetailedHealth = (refreshKey: number) => {
  return useQuery<DetailedHealth, Error>({
    queryKey: ['detailedHealth', refreshKey],
    queryFn: fetchDetailedHealth,
    staleTime: 10000,
    refetchInterval: 30000,
  });
};

export type { ServiceHealth, SystemHealth, DetailedHealth };
