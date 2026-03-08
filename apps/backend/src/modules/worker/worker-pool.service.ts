import {
  Injectable,
  Logger,
  OnModuleInit,
  OnModuleDestroy,
  Inject,
} from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { Worker } from 'worker_threads';
import * as path from 'path';
import * as crypto from 'crypto';
import  { WorkerPoolConfig } from '../../configs';
import workerConfig from '../../configs/worker.config';

// ============ Enums ============

export enum WorkerTaskType {
  HASH_PASSWORD = 'HASH_PASSWORD',
  VERIFY_PASSWORD = 'VERIFY_PASSWORD',
  HASH_TOKEN = 'HASH_TOKEN',
  VERIFY_TOKEN = 'VERIFY_TOKEN',
  DATA_TRANSFORM = 'DATA_TRANSFORM',
}

export enum WorkerErrorCode {
  WORKER_CRASHED = 'WORKER_CRASHED',
  TASK_TIMEOUT = 'TASK_TIMEOUT',
  SERIALIZATION_ERROR = 'SERIALIZATION_ERROR',
  INVALID_PAYLOAD = 'INVALID_PAYLOAD',
  ARGON2_ERROR = 'ARGON2_ERROR',
  TRANSFORM_ERROR = 'TRANSFORM_ERROR',
}

// ============ Interfaces ============

export interface WorkerMessage {
  type: 'TASK' | 'RESULT' | 'ERROR' | 'READY' | 'SHUTDOWN';
  taskId?: string;
  payload?: any;
  error?: {
    message: string;
    stack?: string;
  };
}

export interface QueuedTask {
  id: string;
  type: WorkerTaskType;
  payload: any;
  resolve: (value: any) => void;
  reject: (error: Error) => void;
  timeout: NodeJS.Timeout;
  createdAt: Date;
}

interface WorkerInfo {
  worker: Worker;
  id: string;
  type: WorkerTaskType;
  ready: boolean;
  scriptPath: string;
}

// ============ Error Class ============

export class WorkerError extends Error {
  constructor(
    public code: WorkerErrorCode,
    message: string,
    public taskId?: string,
    public originalError?: Error
  ) {
    super(message);
    this.name = 'WorkerError';
  }
}

// ============ Service ============

@Injectable()
export class WorkerPoolService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(WorkerPoolService.name);

  private hashWorkers: WorkerInfo[] = [];
  private verifyWorkers: WorkerInfo[] = [];
  private cryptoWorkers: WorkerInfo[] = [];
  private transformWorkers: WorkerInfo[] = [];

  private taskQueue: Map<string, QueuedTask> = new Map();
  private roundRobinIndex: Map<WorkerTaskType, number> = new Map();

  private config: WorkerPoolConfig;
  private isShuttingDown = false;

  // Metrics tracking
  private metricsInterval: NodeJS.Timeout | null = null;
  private workerMetrics = {
    totalTasksProcessed: 0,
    totalTasksFailed: 0,
    totalWorkerRestarts: 0,
    totalWorkerCrashes: 0,
  };

  constructor(
    @Inject(workerConfig.KEY)
    workerConfigService: ConfigType<typeof workerConfig>
  ) {
    this.config = workerConfigService;
    // Initialize round-robin indices
    Object.values(WorkerTaskType).forEach((type) => {
      this.roundRobinIndex.set(type, 0);
    });
  }

  // ============ Lifecycle Methods ============

  async onModuleInit(): Promise<void> {
    this.logger.log('Initializing Worker Thread Pool...');

    try {
      // Spawn hash password workers
      for (let i = 0; i < this.config.hashWorkerCount; i++) {
        const workerInfo = await this.spawnWorker(
          WorkerTaskType.HASH_PASSWORD,
          'hash-password.worker.js'
        );
        this.hashWorkers.push(workerInfo);
      }

      // Spawn verify password workers
      for (let i = 0; i < this.config.verifyWorkerCount; i++) {
        const workerInfo = await this.spawnWorker(
          WorkerTaskType.VERIFY_PASSWORD,
          'verify-password.worker.js'
        );
        this.verifyWorkers.push(workerInfo);
      }

      // Spawn crypto workers
      for (let i = 0; i < this.config.cryptoWorkerCount; i++) {
        const workerInfo = await this.spawnWorker(
          WorkerTaskType.HASH_TOKEN,
          'crypto.worker.js'
        );
        this.cryptoWorkers.push(workerInfo);
      }

      // Spawn data transform workers
      for (let i = 0; i < this.config.transformWorkerCount; i++) {
        const workerInfo = await this.spawnWorker(
          WorkerTaskType.DATA_TRANSFORM,
          'data-transform.worker.js'
        );
        this.transformWorkers.push(workerInfo);
      }

      this.logger.log(
        `Worker Pool initialized: ${this.hashWorkers.length} hash, ` +
        `${this.verifyWorkers.length} verify, ${this.cryptoWorkers.length} crypto, ` +
        `${this.transformWorkers.length} transform workers`
      );

      // Start periodic metrics logging (every 60 seconds)
      this.startMetricsLogging();
    } catch (error) {
      this.logger.error('Failed to initialize worker pool', error);
      throw error;
    }
  }

  /**
   * Start periodic logging of task queue metrics
   * Requirements: 5.3
   */
  private startMetricsLogging(): void {
    // Log metrics every 60 seconds
    this.metricsInterval = setInterval(() => {
      this.logMetrics();
    }, 60000);

    // Ensure the interval doesn't prevent process exit
    this.metricsInterval.unref();
  }

  /**
   * Log current worker pool metrics
   * Requirements: 5.3
   */
  private logMetrics(): void {
    const status = this.getPoolStatus();
    this.logger.log(
      `Worker Pool Metrics - ` +
      `Pending tasks: ${status.pendingTasks}, ` +
      `Ready workers: ${status.readyWorkers.hash}/${status.hashWorkers} hash, ` +
      `${status.readyWorkers.verify}/${status.verifyWorkers} verify, ` +
      `${status.readyWorkers.crypto}/${status.cryptoWorkers} crypto, ` +
      `${status.readyWorkers.transform}/${status.transformWorkers} transform | ` +
      `Total processed: ${this.workerMetrics.totalTasksProcessed}, ` +
      `Failed: ${this.workerMetrics.totalTasksFailed}, ` +
      `Worker restarts: ${this.workerMetrics.totalWorkerRestarts}, ` +
      `Crashes: ${this.workerMetrics.totalWorkerCrashes}`
    );
  }

  async onModuleDestroy(): Promise<void> {
    this.logger.log('Shutting down Worker Thread Pool...');
    this.isShuttingDown = true;

    // Stop metrics logging
    if (this.metricsInterval) {
      clearInterval(this.metricsInterval);
      this.metricsInterval = null;
    }

    // Log final metrics before shutdown
    this.logger.log(
      `Final Worker Pool Metrics - ` +
      `Total processed: ${this.workerMetrics.totalTasksProcessed}, ` +
      `Failed: ${this.workerMetrics.totalTasksFailed}, ` +
      `Worker restarts: ${this.workerMetrics.totalWorkerRestarts}, ` +
      `Crashes: ${this.workerMetrics.totalWorkerCrashes}`
    );

    // Clear all pending tasks with rejection
    for (const [taskId, task] of this.taskQueue) {
      clearTimeout(task.timeout);
      task.reject(
        new WorkerError(
          WorkerErrorCode.WORKER_CRASHED,
          'Worker pool is shutting down',
          taskId
        )
      );
    }
    this.taskQueue.clear();

    // Terminate all workers gracefully
    const allWorkers = [
      ...this.hashWorkers,
      ...this.verifyWorkers,
      ...this.cryptoWorkers,
      ...this.transformWorkers,
    ];

    const terminationPromises = allWorkers.map((workerInfo) =>
      this.terminateWorker(workerInfo)
    );

    await Promise.allSettled(terminationPromises);

    this.hashWorkers = [];
    this.verifyWorkers = [];
    this.cryptoWorkers = [];
    this.transformWorkers = [];

    this.logger.log('Worker Thread Pool shut down complete');
  }

  // ============ Worker Spawn and Management ============

  private async spawnWorker(
    type: WorkerTaskType,
    scriptName: string
  ): Promise<WorkerInfo> {
    // Determine the correct script path based on environment
    // In test/dev with ts-node/ts-jest, use .ts files; in production use .js
    const isTypeScript = __filename.endsWith('.ts');
    const actualScriptName = isTypeScript
      ? scriptName.replace('.js', '.ts')
      : scriptName;

    // When bundled with webpack, __dirname points to dist/modules/worker folder
    // Worker scripts are at dist/modules/worker/scripts/
    // In dev mode (ts files), use relative path from current file
    const scriptPath = isTypeScript
      ? path.join(__dirname, 'scripts', actualScriptName)
      : path.join(__dirname, 'scripts', actualScriptName);
    const workerId = `${type}-${crypto.randomUUID().slice(0, 8)}`;

    this.logger.log(
      `Spawning worker ${workerId} of type ${type} from ${actualScriptName}`
    );

    return new Promise((resolve, reject) => {
      try {
        // For TypeScript files, use ts-node to execute
        const workerOptions = isTypeScript
          ? {
            execArgv: [
              '--require',
              'ts-node/register',
              '--require',
              'tsconfig-paths/register',
            ],
          }
          : {};
        const worker = new Worker(scriptPath, workerOptions);
        const workerInfo: WorkerInfo = {
          worker,
          id: workerId,
          type,
          ready: false,
          scriptPath,
        };

        // Set up message handler
        worker.on('message', (message: WorkerMessage) => {
          this.handleWorkerMessage(workerInfo, message);
        });

        // Set up error handler
        worker.on('error', (error: Error) => {
          this.handleWorkerError(workerInfo, error);
        });

        // Set up exit handler
        worker.on('exit', (code: number) => {
          this.handleWorkerExit(workerInfo, code);
        });

        // Wait for READY message with timeout
        const readyTimeout = setTimeout(() => {
          if (!workerInfo.ready) {
            worker.terminate();
            reject(new Error(`Worker ${workerId} failed to become ready`));
          }
        }, 10000);

        // Listen for ready message
        const onReady = (message: WorkerMessage) => {
          if (message.type === 'READY') {
            clearTimeout(readyTimeout);
            workerInfo.ready = true;
            this.logger.debug(`Worker ${workerId} is ready`);
            resolve(workerInfo);
          }
        };

        worker.once('message', onReady);
      } catch (error) {
        reject(error);
      }
    });
  }

  private async terminateWorker(workerInfo: WorkerInfo): Promise<void> {
    return new Promise((resolve) => {
      const timeout = setTimeout(() => {
        workerInfo.worker.terminate();
        resolve();
      }, 5000);

      workerInfo.worker.postMessage({ type: 'SHUTDOWN' } as WorkerMessage);

      workerInfo.worker.once('exit', () => {
        clearTimeout(timeout);
        resolve();
      });
    });
  }

  private async restartWorker(workerInfo: WorkerInfo): Promise<void> {
    if (this.isShuttingDown) return;

    this.workerMetrics.totalWorkerRestarts++;
    this.logger.warn(
      `Restarting worker ${workerInfo.id} (type: ${workerInfo.type}) - ` +
      `Total restarts: ${this.workerMetrics.totalWorkerRestarts}`
    );

    try {
      // Terminate the old worker
      await workerInfo.worker.terminate();
      this.logger.debug(`Worker ${workerInfo.id} terminated successfully`);

      // Spawn a new worker
      const scriptName = path.basename(workerInfo.scriptPath);
      const newWorkerInfo = await this.spawnWorker(workerInfo.type, scriptName);

      // Replace in the appropriate array
      const workerArray = this.getWorkerArray(workerInfo.type);
      const index = workerArray.findIndex((w) => w.id === workerInfo.id);
      if (index !== -1) {
        workerArray[index] = newWorkerInfo;
      }

      this.logger.log(
        `Worker ${workerInfo.id} successfully restarted as ${newWorkerInfo.id}`
      );
    } catch (error) {
      this.logger.error(
        `Failed to restart worker ${workerInfo.id}: ${error.message}`,
        error.stack
      );
    }
  }

  private getWorkerArray(type: WorkerTaskType): WorkerInfo[] {
    switch (type) {
      case WorkerTaskType.HASH_PASSWORD:
        return this.hashWorkers;
      case WorkerTaskType.VERIFY_PASSWORD:
        return this.verifyWorkers;
      case WorkerTaskType.HASH_TOKEN:
      case WorkerTaskType.VERIFY_TOKEN:
        return this.cryptoWorkers;
      case WorkerTaskType.DATA_TRANSFORM:
        return this.transformWorkers;
      default:
        return [];
    }
  }

  // ============ Message Handling ============

  private handleWorkerMessage(
    workerInfo: WorkerInfo,
    message: WorkerMessage
  ): void {
    switch (message.type) {
      case 'READY':
        workerInfo.ready = true;
        this.logger.debug(`Worker ${workerInfo.id} reported ready`);
        break;

      case 'RESULT':
        this.handleTaskResult(message);
        break;

      case 'ERROR':
        this.handleTaskError(message);
        break;

      default:
        this.logger.warn(
          `Unknown message type from worker ${workerInfo.id}: ${message.type}`
        );
    }
  }

  private handleTaskResult(message: WorkerMessage): void {
    const { taskId, payload } = message;
    if (!taskId) return;

    const task = this.taskQueue.get(taskId);
    if (task) {
      clearTimeout(task.timeout);
      this.taskQueue.delete(taskId);
      this.workerMetrics.totalTasksProcessed++;
      task.resolve(payload);
    }
  }

  private handleTaskError(message: WorkerMessage): void {
    const { taskId, error } = message;
    if (!taskId) return;

    const task = this.taskQueue.get(taskId);
    if (task) {
      clearTimeout(task.timeout);
      this.taskQueue.delete(taskId);
      this.workerMetrics.totalTasksFailed++;

      this.logger.warn(
        `Task ${taskId} (type: ${task.type}) failed: ${error?.message || 'Unknown error'
        }`
      );

      // Record error in Prometheus metrics
      const errorCode = this.mapErrorCode(task.type);
      this.recordTaskError(errorCode);

      const workerError = new WorkerError(
        errorCode,
        error?.message || 'Unknown worker error',
        taskId
      );
      task.reject(workerError);
    }
  }

  private mapErrorCode(type: WorkerTaskType): WorkerErrorCode {
    switch (type) {
      case WorkerTaskType.HASH_PASSWORD:
      case WorkerTaskType.VERIFY_PASSWORD:
      case WorkerTaskType.HASH_TOKEN:
      case WorkerTaskType.VERIFY_TOKEN:
        return WorkerErrorCode.ARGON2_ERROR;
      case WorkerTaskType.DATA_TRANSFORM:
        return WorkerErrorCode.TRANSFORM_ERROR;
      default:
        return WorkerErrorCode.WORKER_CRASHED;
    }
  }

  private handleWorkerError(workerInfo: WorkerInfo, error: Error): void {
    this.workerMetrics.totalWorkerCrashes++;
    this.logger.error(
      `Worker ${workerInfo.id} (type: ${workerInfo.type}) crashed: ${error.message} - ` +
      `Total crashes: ${this.workerMetrics.totalWorkerCrashes}`,
      error.stack
    );

    // Count and reject all pending tasks for this worker type
    let rejectedTasks = 0;
    for (const [taskId, task] of this.taskQueue) {
      if (task.type === workerInfo.type) {
        clearTimeout(task.timeout);
        this.taskQueue.delete(taskId);
        this.workerMetrics.totalTasksFailed++;
        rejectedTasks++;

        // Record error in Prometheus metrics for each rejected task
        this.recordTaskError(WorkerErrorCode.WORKER_CRASHED);

        task.reject(
          new WorkerError(
            WorkerErrorCode.WORKER_CRASHED,
            `Worker crashed: ${error.message}`,
            taskId,
            error
          )
        );
      }
    }

    if (rejectedTasks > 0) {
      this.logger.warn(
        `Rejected ${rejectedTasks} pending tasks due to worker ${workerInfo.id} crash`
      );
    }

    // Restart the worker
    this.restartWorker(workerInfo);
  }

  private handleWorkerExit(workerInfo: WorkerInfo, code: number): void {
    if (this.isShuttingDown) {
      this.logger.debug(
        `Worker ${workerInfo.id} exited with code ${code} during shutdown`
      );
      return;
    }

    if (code !== 0) {
      this.workerMetrics.totalWorkerCrashes++;
      this.logger.warn(
        `Worker ${workerInfo.id} (type: ${workerInfo.type}) exited unexpectedly with code ${code} - ` +
        `Total crashes: ${this.workerMetrics.totalWorkerCrashes}, restarting...`
      );
      this.restartWorker(workerInfo);
    } else {
      this.logger.debug(
        `Worker ${workerInfo.id} exited gracefully with code ${code}`
      );
    }
  }

  // ============ Task Queue and Distribution ============

  private getNextWorker(type: WorkerTaskType): WorkerInfo | null {
    const workers = this.getWorkerArray(type);
    const readyWorkers = workers.filter((w) => w.ready);

    if (readyWorkers.length === 0) {
      return null;
    }

    // Round-robin selection
    const currentIndex = this.roundRobinIndex.get(type) || 0;
    const nextIndex = currentIndex % readyWorkers.length;
    this.roundRobinIndex.set(type, nextIndex + 1);

    return readyWorkers[nextIndex];
  }

  private executeTask<T>(type: WorkerTaskType, payload: any): Promise<T> {
    const startTime = Date.now();

    return new Promise((resolve, reject) => {
      const taskId = crypto.randomUUID();

      // Set up timeout
      const timeout = setTimeout(() => {
        const task = this.taskQueue.get(taskId);
        if (task) {
          this.taskQueue.delete(taskId);
          // Record timeout error in metrics
          this.recordTaskError(WorkerErrorCode.TASK_TIMEOUT);
          task.reject(
            new WorkerError(
              WorkerErrorCode.TASK_TIMEOUT,
              `Task ${taskId} timed out after ${this.config.taskTimeout}ms`,
              taskId
            )
          );
        }
      }, this.config.taskTimeout);

      // Create queued task with metrics tracking
      const queuedTask: QueuedTask = {
        id: taskId,
        type,
        payload,
        resolve: (value: any) => {
          // Record task duration on success
          const duration = Date.now() - startTime;
          this.recordTaskDuration(type, duration);
          resolve(value);
        },
        reject: (error: Error) => {
          // Record task duration on failure
          const duration = Date.now() - startTime;
          this.recordTaskDuration(type, duration);
          reject(error);
        },
        timeout,
        createdAt: new Date(),
      };

      // Add to queue
      this.taskQueue.set(taskId, queuedTask);

      // Get next available worker
      const workerInfo = this.getNextWorker(type);

      if (!workerInfo) {
        clearTimeout(timeout);
        this.taskQueue.delete(taskId);

        if (this.config.fallbackEnabled) {
          this.logger.warn(
            `No workers available for ${type}, fallback not implemented yet`
          );
        }

        // Record error in metrics
        this.recordTaskError(WorkerErrorCode.WORKER_CRASHED);

        reject(
          new WorkerError(
            WorkerErrorCode.WORKER_CRASHED,
            `No workers available for task type: ${type}`,
            taskId
          )
        );
        return;
      }

      // Send task to worker
      const message: WorkerMessage = {
        type: 'TASK',
        taskId,
        payload,
      };

      workerInfo.worker.postMessage(message);
    });
  }

  // ============ Metrics Methods ============

  /**
   * Record task duration in Prometheus metrics
   * Requirements: 5.3 - Track worker task duration
   * Note: Metrics are now tracked by WorkerMetricsService
   */
  private recordTaskDuration(
    taskType: WorkerTaskType,
    durationMs: number
  ): void {
    // Metrics tracking moved to WorkerMetricsService to avoid circular dependency
  }

  /**
   * Record task error in Prometheus metrics
   * Requirements: 5.4 - Track worker task errors
   * Note: Metrics are now tracked by WorkerMetricsService
   */
  private recordTaskError(errorType: string): void {
    // Metrics tracking moved to WorkerMetricsService to avoid circular dependency
  }

  // ============ Public API ============

  async hashPassword(password: string): Promise<string> {
    if (!password || typeof password !== 'string') {
      throw new WorkerError(
        WorkerErrorCode.INVALID_PAYLOAD,
        'Password must be a non-empty string'
      );
    }

    return this.executeTask<string>(WorkerTaskType.HASH_PASSWORD, { password });
  }

  async verifyPassword(hash: string, password: string): Promise<boolean> {
    if (!hash || typeof hash !== 'string') {
      throw new WorkerError(
        WorkerErrorCode.INVALID_PAYLOAD,
        'Hash must be a non-empty string'
      );
    }
    if (!password || typeof password !== 'string') {
      throw new WorkerError(
        WorkerErrorCode.INVALID_PAYLOAD,
        'Password must be a non-empty string'
      );
    }

    return this.executeTask<boolean>(WorkerTaskType.VERIFY_PASSWORD, {
      hash,
      password,
    });
  }

  async hashToken(token: string): Promise<string> {
    if (!token || typeof token !== 'string') {
      throw new WorkerError(
        WorkerErrorCode.INVALID_PAYLOAD,
        'Token must be a non-empty string'
      );
    }

    return this.executeTask<string>(WorkerTaskType.HASH_TOKEN, {
      operation: 'hash',
      data: token,
    });
  }

  async verifyToken(hash: string, token: string): Promise<boolean> {
    if (!hash || typeof hash !== 'string') {
      throw new WorkerError(
        WorkerErrorCode.INVALID_PAYLOAD,
        'Hash must be a non-empty string'
      );
    }
    if (!token || typeof token !== 'string') {
      throw new WorkerError(
        WorkerErrorCode.INVALID_PAYLOAD,
        'Token must be a non-empty string'
      );
    }

    return this.executeTask<boolean>(WorkerTaskType.VERIFY_TOKEN, {
      operation: 'verify',
      data: token,
      hash,
    });
  }

  /**
   * Transform data using map operation in a worker thread
   * Requirements: 4.2, 6.1, 6.2
   */
  async transformMap<T, R>(
    data: T[],
    mapFn: (item: T, index: number, array: T[]) => R
  ): Promise<R[]> {
    if (!Array.isArray(data)) {
      throw new WorkerError(
        WorkerErrorCode.INVALID_PAYLOAD,
        'Data must be an array'
      );
    }

    return this.executeTask<R[]>(WorkerTaskType.DATA_TRANSFORM, {
      data,
      operation: 'map',
      functionString: mapFn.toString(),
    });
  }

  /**
   * Transform data using filter operation in a worker thread
   * Requirements: 4.2, 6.1, 6.2
   */
  async transformFilter<T>(
    data: T[],
    filterFn: (item: T, index: number, array: T[]) => boolean
  ): Promise<T[]> {
    if (!Array.isArray(data)) {
      throw new WorkerError(
        WorkerErrorCode.INVALID_PAYLOAD,
        'Data must be an array'
      );
    }

    return this.executeTask<T[]>(WorkerTaskType.DATA_TRANSFORM, {
      data,
      operation: 'filter',
      functionString: filterFn.toString(),
    });
  }

  /**
   * Transform data using reduce operation in a worker thread
   * Requirements: 4.2, 6.1, 6.2
   */
  async transformReduce<T, R>(
    data: T[],
    reduceFn: (accumulator: R, item: T, index: number, array: T[]) => R,
    initialValue: R
  ): Promise<R> {
    if (!Array.isArray(data)) {
      throw new WorkerError(
        WorkerErrorCode.INVALID_PAYLOAD,
        'Data must be an array'
      );
    }

    return this.executeTask<R>(WorkerTaskType.DATA_TRANSFORM, {
      data,
      operation: 'reduce',
      functionString: reduceFn.toString(),
      initialValue,
    });
  }

  /**
   * Generic transform data method supporting map, filter, reduce operations
   * Requirements: 4.2, 6.1, 6.2
   */
  async transformData<T, R>(
    data: T[],
    operation: 'map' | 'filter' | 'reduce',
    transformFn: (item: T, index?: number, array?: T[]) => R,
    initialValue?: R
  ): Promise<R[] | R> {
    if (!Array.isArray(data)) {
      throw new WorkerError(
        WorkerErrorCode.INVALID_PAYLOAD,
        'Data must be an array'
      );
    }

    return this.executeTask<R[] | R>(WorkerTaskType.DATA_TRANSFORM, {
      data,
      operation,
      functionString: transformFn.toString(),
      initialValue,
    });
  }

  // ============ Health Check ============

  getPoolStatus(): {
    hashWorkers: number;
    verifyWorkers: number;
    cryptoWorkers: number;
    transformWorkers: number;
    pendingTasks: number;
    readyWorkers: {
      hash: number;
      verify: number;
      crypto: number;
      transform: number;
    };
    metrics: {
      totalTasksProcessed: number;
      totalTasksFailed: number;
      totalWorkerRestarts: number;
      totalWorkerCrashes: number;
    };
  } {
    return {
      hashWorkers: this.hashWorkers.length,
      verifyWorkers: this.verifyWorkers.length,
      cryptoWorkers: this.cryptoWorkers.length,
      transformWorkers: this.transformWorkers.length,
      pendingTasks: this.taskQueue.size,
      readyWorkers: {
        hash: this.hashWorkers.filter((w) => w.ready).length,
        verify: this.verifyWorkers.filter((w) => w.ready).length,
        crypto: this.cryptoWorkers.filter((w) => w.ready).length,
        transform: this.transformWorkers.filter((w) => w.ready).length,
      },
      metrics: { ...this.workerMetrics },
    };
  }
}
