import { ConfigService, registerAs } from '@nestjs/config';
import * as os from 'os';

export interface WorkerPoolConfig {
  hashWorkerCount: number;
  verifyWorkerCount: number;
  cryptoWorkerCount: number;
  transformWorkerCount: number;
  taskTimeout: number;
  fallbackEnabled: boolean;
}

export default registerAs('worker', (): WorkerPoolConfig => {
  const configService = new ConfigService();
  const cpuCores = os.cpus().length;
  const isTest = process.env.NODE_ENV === 'test' || process.env.JEST_WORKER_ID;

  // Use fewer workers in test environment to avoid resource exhaustion
  const defaultWorkerCount = isTest ? 1 : Math.max(1, cpuCores - 1);

  return {
    hashWorkerCount: parseInt(
      configService.get<string>('HASH_WORKER_COUNT') ||
        String(defaultWorkerCount),
      10
    ),
    verifyWorkerCount: parseInt(
      configService.get<string>('VERIFY_WORKER_COUNT') || (isTest ? '1' : '2'),
      10
    ),
    cryptoWorkerCount: parseInt(
      configService.get<string>('CRYPTO_WORKER_COUNT') || '1',
      10
    ),
    transformWorkerCount: parseInt(
      configService.get<string>('TRANSFORM_WORKER_COUNT') || '1',
      10
    ),
    taskTimeout: parseInt(
      configService.get<string>('WORKER_TASK_TIMEOUT') || '30000',
      10
    ),
    fallbackEnabled:
      configService.get<string>('WORKER_FALLBACK_ENABLED') === 'true',
  };
});
