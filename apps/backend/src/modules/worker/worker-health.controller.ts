import { Controller, Get, UseGuards, Version, Optional } from '@nestjs/common';
import { WorkerPoolService } from './worker-pool.service';
import { JwtAuthGuard } from '../../common';
import { HealthComponent, HealthMetricsService } from '../../matrics';

@Controller({ path: 'health', version: '1' })
export class WorkerHealthController {
  constructor(
    private readonly workerPoolService: WorkerPoolService,
    @Optional() private readonly healthMetricsService?: HealthMetricsService
  ) {}

  @Get('workers')
  @Version('1')
  @UseGuards(JwtAuthGuard)
  getWorkerHealth() {
    const status = this.workerPoolService.getPoolStatus();

    // Calculate overall health
    const totalWorkers =
      status.hashWorkers +
      status.verifyWorkers +
      status.cryptoWorkers +
      status.transformWorkers;

    const totalReadyWorkers =
      status.readyWorkers.hash +
      status.readyWorkers.verify +
      status.readyWorkers.crypto +
      status.readyWorkers.transform;

    const isHealthy = totalReadyWorkers === totalWorkers && totalWorkers > 0;

    // Update health metrics when health endpoint is called
    // Requirements: 9.1 - WHEN the health check runs THEN update health_check_status
    if (this.healthMetricsService) {
      this.healthMetricsService.setComponentHealth(
        HealthComponent.WORKER_POOL,
        isHealthy
      );
    }

    return {
      success: false,
      code: 0,
      message: 'Get health success',
      data: {
        result: {
          status: isHealthy ? 'healthy' : 'degraded',
          timestamp: new Date().toISOString(),
          workers: {
            total: totalWorkers,
            ready: totalReadyWorkers,
            pools: {
              hash: {
                total: status.hashWorkers,
                ready: status.readyWorkers.hash,
              },
              verify: {
                total: status.verifyWorkers,
                ready: status.readyWorkers.verify,
              },
              crypto: {
                total: status.cryptoWorkers,
                ready: status.readyWorkers.crypto,
              },
              transform: {
                total: status.transformWorkers,
                ready: status.readyWorkers.transform,
              },
            },
          },
          taskQueue: {
            pending: status.pendingTasks,
          },
          metrics: {
            totalTasksProcessed: status.metrics.totalTasksProcessed,
            totalTasksFailed: status.metrics.totalTasksFailed,
            totalWorkerRestarts: status.metrics.totalWorkerRestarts,
            totalWorkerCrashes: status.metrics.totalWorkerCrashes,
          },
        },
      },
    };
  }
}
