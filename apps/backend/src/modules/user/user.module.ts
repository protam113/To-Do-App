// DONE

import { forwardRef, Module, OnModuleInit } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserEntity, UserSchema, setWorkerPoolService } from '../../entities';
import { UserService } from './user.service';
import { JwtModule } from '@nestjs/jwt';
import jwtConfig from '../../configs/jwt.config';
import { ConfigModule } from '@nestjs/config';
import refreshJwtConfig from '../../configs/refresh-jwt.config';
import { SessionModule } from '../session/session.module';
import { UserController } from './user.controller';
import { WorkerPoolService } from '../worker/worker-pool.service';
import { AuditModule } from '../audit/audit.module';
import { RedisCacheModule } from '../cache/redis.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserEntity.name, schema: UserSchema },
      // { name: UserTeamEntity.name, schema: UserTeamSchema },
    ]),
    JwtModule.registerAsync(jwtConfig.asProvider()),
    ConfigModule.forFeature(refreshJwtConfig),
    ConfigModule.forFeature(jwtConfig),
    forwardRef(() => SessionModule),
    AuditModule,
    RedisCacheModule.register()
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule implements OnModuleInit {
  constructor(private readonly workerPoolService: WorkerPoolService) { }
  onModuleInit() {
    setWorkerPoolService(this.workerPoolService);
  }
}
