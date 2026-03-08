import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { Connection } from 'mongoose';

export interface SlowQueryLog {
  collection: string;
  operation: string;
  executionTimeMs: number;
  query: any;
  timestamp: Date;
}

/**
 * Statistics for slow queries
 */
export interface SlowQueryStats {
  totalSlowQueries: number;
  averageExecutionTimeMs: number;
  slowestQueryMs: number;
  byCollection: Record<string, number>;
  byOperation: Record<string, number>;
}

@Injectable()
export class QueryMonitorService implements OnModuleInit {
  private readonly logger = new Logger(QueryMonitorService.name);
  private readonly slowQueryThresholdMs: number;
  private readonly isDevelopment: boolean;

  constructor(
    @InjectConnection() private readonly connection: Connection,
    private readonly configService: ConfigService
  ) {
    // Default threshold is 100ms as per requirements
    this.slowQueryThresholdMs =
      this.configService.get<number>('SLOW_QUERY_THRESHOLD_MS') || 100;
    this.isDevelopment =
      this.configService.get<string>('NODE_ENV') !== 'production';
  }

  async onModuleInit(): Promise<void> {
    if (this.isDevelopment) {
      await this.enableProfiling();
    }

    this.logger.log(
      `QueryMonitorService initialized with ${this.slowQueryThresholdMs}ms threshold`
    );
  }

  private async enableProfiling(): Promise<void> {
    try {
      const db = this.connection.db;
      if (!db) {
        this.logger.warn('Database connection not available for profiling');
        return;
      }

      // Set profiling level to 1 (slow operations only) with threshold
      await db.command({
        profile: 1,
        slowms: this.slowQueryThresholdMs,
      });

      this.logger.log(
        `MongoDB profiling enabled (level 1, slowms: ${this.slowQueryThresholdMs}ms)`
      );
    } catch (error) {
      this.logger.warn(
        `Failed to enable MongoDB profiling: ${error.message}. ` +
          'This may require admin privileges.'
      );
    }
  }

  logSlowQuery(log: SlowQueryLog): void {
    if (log.executionTimeMs >= this.slowQueryThresholdMs) {
      this.logger.warn(
        `Slow query detected: ${log.collection}.${log.operation} ` +
          `took ${log.executionTimeMs}ms`,
        {
          collection: log.collection,
          operation: log.operation,
          executionTimeMs: log.executionTimeMs,
          query: this.sanitizeQuery(log.query),
          timestamp: log.timestamp.toISOString(),
        }
      );
    }
  }

  /**
   * Check if a query execution time exceeds the slow query threshold
   *
   * @param executionTimeMs - Query execution time in milliseconds
   * @returns true if the query is considered slow
   */
  isSlowQuery(executionTimeMs: number): boolean {
    return executionTimeMs >= this.slowQueryThresholdMs;
  }

  /**
   * Get the configured slow query threshold
   *
   * @returns Threshold in milliseconds
   */
  getThreshold(): number {
    return this.slowQueryThresholdMs;
  }

  /**
   * Create a timing wrapper for database operations
   *
   * Usage:
   * ```typescript
   * const result = await this.queryMonitor.timeQuery(
   *   'tasks',
   *   'find',
   *   { projectId: '...' },
   *   () => this.taskModel.find(query).exec()
   * );
   * ```
   *
   * @param collection - Collection name
   * @param operation - Operation type (find, aggregate, update, etc.)
   * @param query - Query object for logging
   * @param queryFn - Function that executes the query
   * @returns Query result
   */
  async timeQuery<T>(
    collection: string,
    operation: string,
    query: any,
    queryFn: () => Promise<T>
  ): Promise<T> {
    const startTime = Date.now();

    try {
      const result = await queryFn();
      const executionTimeMs = Date.now() - startTime;

      if (this.isSlowQuery(executionTimeMs)) {
        this.logSlowQuery({
          collection,
          operation,
          executionTimeMs,
          query,
          timestamp: new Date(),
        });
      }

      return result;
    } catch (error) {
      const executionTimeMs = Date.now() - startTime;

      // Log slow queries even if they fail
      if (this.isSlowQuery(executionTimeMs)) {
        this.logSlowQuery({
          collection,
          operation,
          executionTimeMs,
          query: { ...query, error: error.message },
          timestamp: new Date(),
        });
      }

      throw error;
    }
  }

  /**
   * Get slow query statistics from MongoDB profiler
   *
   * @returns Slow query statistics
   */
  async getSlowQueryStats(): Promise<SlowQueryStats> {
    const stats: SlowQueryStats = {
      totalSlowQueries: 0,
      averageExecutionTimeMs: 0,
      slowestQueryMs: 0,
      byCollection: {},
      byOperation: {},
    };

    try {
      const db = this.connection.db;
      if (!db) {
        return stats;
      }

      // Query the system.profile collection for slow queries
      const profileCollection = db.collection('system.profile');
      const slowQueries = await profileCollection
        .find({
          millis: { $gte: this.slowQueryThresholdMs },
        })
        .sort({ ts: -1 })
        .limit(1000)
        .toArray();

      if (slowQueries.length === 0) {
        return stats;
      }

      let totalTime = 0;

      for (const query of slowQueries) {
        stats.totalSlowQueries++;
        totalTime += query.millis || 0;

        if ((query.millis || 0) > stats.slowestQueryMs) {
          stats.slowestQueryMs = query.millis || 0;
        }

        // Count by collection
        const ns = query.ns || 'unknown';
        const collection = ns.split('.').pop() || 'unknown';
        stats.byCollection[collection] =
          (stats.byCollection[collection] || 0) + 1;

        // Count by operation
        const op = query.op || 'unknown';
        stats.byOperation[op] = (stats.byOperation[op] || 0) + 1;
      }

      stats.averageExecutionTimeMs = Math.round(
        totalTime / stats.totalSlowQueries
      );

      return stats;
    } catch (error) {
      this.logger.warn(`Failed to get slow query stats: ${error.message}`);
      return stats;
    }
  }

  /**
   * Sanitize query object for logging (remove sensitive data)
   *
   * @param query - Query object
   * @returns Sanitized query object
   */
  private sanitizeQuery(query: any): any {
    if (!query || typeof query !== 'object') {
      return query;
    }

    const sanitized = { ...query };

    // Remove potentially sensitive fields
    const sensitiveFields = ['password', 'token', 'secret', 'apiKey', 'key'];

    for (const field of sensitiveFields) {
      if (field in sanitized) {
        sanitized[field] = '[REDACTED]';
      }
    }

    return sanitized;
  }
}
