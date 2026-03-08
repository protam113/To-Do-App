/**
 * Hash Password Worker
 *
 * This worker thread handles Argon2 password hashing operations
 * off the main event loop to prevent blocking during high-concurrency scenarios.
 *
 * Requirements: 1.1, 1.2
 */

import { parentPort } from 'worker_threads';
import * as argon2 from 'argon2';

interface WorkerMessage {
  type: 'TASK' | 'SHUTDOWN';
  taskId?: string;
  payload?: {
    password: string;
  };
}

interface WorkerResponse {
  type: 'READY' | 'RESULT' | 'ERROR';
  taskId?: string;
  payload?: string;
  error?: {
    message: string;
    stack?: string;
  };
}

if (!parentPort) {
  throw new Error('This script must be run as a worker thread');
}

const port = parentPort;

// Signal that the worker is ready
port.postMessage({ type: 'READY' } as WorkerResponse);

// Listen for messages from the main thread
port.on('message', async (message: WorkerMessage) => {
  if (message.type === 'SHUTDOWN') {
    process.exit(0);
  }

  if (message.type === 'TASK') {
    const { taskId, payload } = message;

    if (!taskId || !payload?.password) {
      port.postMessage({
        type: 'ERROR',
        taskId,
        error: {
          message: 'Invalid payload: password is required',
        },
      } as WorkerResponse);
      return;
    }

    try {
      // Execute Argon2 hash operation with optimized parameters
      // timeCost: 2 (iterations), memoryCost: 19456 (19MB), parallelism: 1
      // This provides good security while being ~3-4x faster than defaults
      const hash = await argon2.hash(payload.password, {
        type: argon2.argon2id,
        timeCost: 2,
        memoryCost: 19456, // 19 MB
        parallelism: 1,
      });

      port.postMessage({
        type: 'RESULT',
        taskId,
        payload: hash,
      } as WorkerResponse);
    } catch (error) {
      const err = error as Error;
      port.postMessage({
        type: 'ERROR',
        taskId,
        error: {
          message: err.message || 'Failed to hash password',
          stack: err.stack,
        },
      } as WorkerResponse);
    }
  }
});
