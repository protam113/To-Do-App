import { Injectable, Logger } from '@nestjs/common';
import { Model, Document } from 'mongoose';

/**
 * Result type for bulk write operations
 */
export interface BulkWriteResult {
  insertedCount: number;
  matchedCount: number;
  modifiedCount: number;
  deletedCount: number;
  upsertedCount: number;
}

/**
 * Bulk write operation types
 */
export type BulkWriteOperation<T> =
  | { insertOne: { document: Partial<T> } }
  | {
      updateOne: {
        filter: Record<string, any>;
        update: Record<string, any>;
        upsert?: boolean;
      };
    }
  | {
      updateMany: {
        filter: Record<string, any>;
        update: Record<string, any>;
        upsert?: boolean;
      };
    }
  | { deleteOne: { filter: Record<string, any> } }
  | { deleteMany: { filter: Record<string, any> } };

/**
 * IOOptimizerService provides IO-bound optimizations for database operations.
 *
 * This service is stateless - no request-specific state is stored between requests.
 * All operations are designed for horizontal scalability.
 *
 * Requirements: 7.1, 7.2, 7.3, 7.4
 */
@Injectable()
export class IOOptimizerService {
  private readonly logger = new Logger(IOOptimizerService.name);

  /**
   * Execute multiple independent queries in parallel using Promise.all.
   *
   * Stateless: No state stored between calls.
   *
   * Requirements: 7.1 - Execute independent queries in parallel
   *
   * @param queries - Array of query functions to execute in parallel
   * @returns Promise resolving to tuple of results in same order as input
   */
  async executeParallel<T extends readonly unknown[]>(queries: {
    [K in keyof T]: () => Promise<T[K]>;
  }): Promise<T> {
    const startTime = Date.now();

    try {
      const results = await Promise.all(queries.map((queryFn) => queryFn()));

      const duration = Date.now() - startTime;
      this.logger.debug(
        `Parallel execution completed: ${queries.length} queries in ${duration}ms`
      );

      return results as unknown as T;
    } catch (error) {
      const duration = Date.now() - startTime;
      this.logger.error(
        `Parallel execution failed after ${duration}ms: ${error.message}`
      );
      throw error;
    }
  }

  /**
   * Execute queries with graceful degradation using Promise.allSettled.
   * Returns partial results if some queries fail, logging failures.
   *
   * Stateless: No state stored between calls.
   *
   * Requirements: 7.4 - Return successful results and log failures without blocking
   *
   * @param queries - Array of query functions to execute
   * @returns Array of results (null for failed queries)
   */
  async executeParallelSettled<T>(
    queries: Array<() => Promise<T>>
  ): Promise<Array<T | null>> {
    const startTime = Date.now();

    const settledResults = await Promise.allSettled(
      queries.map((queryFn) => queryFn())
    );

    const results: Array<T | null> = [];
    let failedCount = 0;

    settledResults.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        results.push(result.value);
      } else {
        results.push(null);
        failedCount++;
        this.logger.warn(
          `Parallel query ${index} failed: ${
            result.reason?.message || 'Unknown error'
          }`
        );
      }
    });

    const duration = Date.now() - startTime;

    if (failedCount > 0) {
      this.logger.warn(
        `Parallel settled execution: ${queries.length - failedCount}/${
          queries.length
        } succeeded in ${duration}ms`
      );
    } else {
      this.logger.debug(
        `Parallel settled execution completed: ${queries.length} queries in ${duration}ms`
      );
    }

    return results;
  }

  /**
   * Stream large result sets using MongoDB cursor with async iteration.
   * Memory efficient for large datasets.
   *
   * Stateless: No state stored between calls.
   *
   * Requirements: 7.2 - Use cursor streaming with configurable batch size
   *
   * @param model - Mongoose model to query
   * @param pipeline - Aggregation pipeline
   * @param batchSize - Number of documents per batch (default: 100)
   * @returns AsyncIterable of documents
   */
  async *streamResults<T extends Document>(
    model: Model<T>,
    pipeline: any[],
    batchSize = 100
  ): AsyncIterable<T> {
    const cursor = model.aggregate(pipeline).cursor({ batchSize });

    try {
      for await (const doc of cursor) {
        yield doc as T;
      }
    } finally {
      await cursor.close();
    }
  }

  /**
   * Batch multiple write operations into a single bulk operation.
   * Reduces database round trips.
   *
   * Stateless: No state stored between calls.
   *
   * Requirements: 7.3 - Batch writes into bulk operations
   *
   * @param model - Mongoose model to perform operations on
   * @param operations - Array of bulk write operations
   * @returns BulkWriteResult with operation counts
   */
  async bulkWrite<T extends Document>(
    model: Model<T>,
    operations: BulkWriteOperation<T>[]
  ): Promise<BulkWriteResult> {
    if (operations.length === 0) {
      return {
        insertedCount: 0,
        matchedCount: 0,
        modifiedCount: 0,
        deletedCount: 0,
        upsertedCount: 0,
      };
    }

    const startTime = Date.now();

    try {
      const result = await model.bulkWrite(operations as any, {
        ordered: false,
      });

      const duration = Date.now() - startTime;
      this.logger.debug(
        `Bulk write completed: ${operations.length} operations in ${duration}ms`
      );

      return {
        insertedCount: result.insertedCount || 0,
        matchedCount: result.matchedCount || 0,
        modifiedCount: result.modifiedCount || 0,
        deletedCount: result.deletedCount || 0,
        upsertedCount: result.upsertedCount || 0,
      };
    } catch (error) {
      const duration = Date.now() - startTime;
      this.logger.error(
        `Bulk write failed after ${duration}ms: ${error.message}`
      );
      throw error;
    }
  }
}
