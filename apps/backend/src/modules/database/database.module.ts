import { Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { IOOptimizerService } from './io-optimizer.service';
import { AggregationBuilderService } from './aggregation-builder.service';
import { QueryMonitorService } from './query-monitor.service';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (
        configService: ConfigService,
      ) => {
        const uri = configService.get<string>('AUTH_DATABASE_URL');
        Logger.debug('DB url:', uri);
        return {
          uri,
          connectionFactory: (connection) => {
            Logger.debug(
              '[SUCCESS] MongoDB connection successful!',
              'Mongoose'
            );
            Logger.debug(
              `[SUCCESS]  Connected to DB: ${connection.db.databaseName}`,
              'Mongoose'
            );


            connection.on('error', (err: any) => {
              Logger.error(
                `[ERROR]  MongoDB connection error: ${err}`,
                '',
                'Mongoose'
              );
            });

            connection.on('disconnected', () => {
              Logger.warn('[WARNNING]  MongoDB disconnected', 'Mongoose');
            });

            connection.on('reconnected', () => {
              Logger.log('[RELOAD]  MongoDB reconnected', 'Mongoose');
            });

            return connection;
          },
        };
      },
    }),
  ],
  providers: [
    IOOptimizerService,
    AggregationBuilderService,
    QueryMonitorService,
  ],
  exports: [IOOptimizerService, AggregationBuilderService, QueryMonitorService],
})
export class DatabaseModule { }

export { IOOptimizerService, AggregationBuilderService, QueryMonitorService };
