interface WorkerPoolData {
  total: number;
  ready: number;
}

interface WorkerPools {
  hash: WorkerPoolData;
  verify: WorkerPoolData;
  crypto: WorkerPoolData;
  transform: WorkerPoolData;
}

interface Workers {
  total: number;
  ready: number;
  pools: WorkerPools;
}

interface TaskQueue {
  pending: number;
}

interface Metrics {
  totalTasksProcessed: number;
  totalTasksFailed: number;
  totalWorkerRestarts: number;
  totalWorkerCrashes: number;
}

interface HealthData {
  status: string;
  timestamp: Date | string;
  workers: Workers;
  taskQueue: TaskQueue;
  metrics: Metrics;
}

export interface FetchHealthData {
  result: HealthData;
}

interface ComponentStatus {
  status: string;
}

interface AppHealthComponents {
  database: ComponentStatus;
  redis: ComponentStatus;
  worker_pool: ComponentStatus;
}

export interface AppHealthData {
  status: string;
  timestamp: string;
  components: AppHealthComponents;
}

export interface FetchAppHealthData {
  result: AppHealthData;
}
