import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import workerConfig from '../../configs/worker.config';
import { WorkerPoolService } from './worker-pool.service';

@Global()
@Module({
  imports: [ConfigModule.forFeature(workerConfig)],
  providers: [WorkerPoolService],
  exports: [WorkerPoolService],
})
export class WorkerModule { }
