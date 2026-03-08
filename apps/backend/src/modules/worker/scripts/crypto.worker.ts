/**
 * Crypto Worker
 *
 * This worker thread handles token hashing and verification operations
 * using Argon2 off the main event loop to prevent blocking during
 * session management operations.
 *
 * Requirements: 3.1, 3.2
 */

import { parentPort } from 'worker_threads';
import * as argon2 from 'argon2';

interface WorkerMessage {
  type: 'TASK' | 'SHUTDOWN';
  taskId?: string;
  payload?: {
    operation: 'hash' | 'verify';
    data: string;
    hash?: string;
  };
}

interface WorkerResponse {
  type: 'READY' | 'RESULT' | 'ERROR';
  taskId?: string;
  payload?: string | boolean;
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

    if (!taskId || !payload?.data) {
      port.postMessage({
        type: 'ERROR',
        taskId,
        error: {
          message: 'Invalid payload: data is required',
        },
      } as WorkerResponse);
      return;
    }

    try {
      if (payload.operation === 'hash') {
        // Hash the token using Argon2 with optimized parameters
        const hash = await argon2.hash(payload.data, {
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
      } else if (payload.operation === 'verify') {
        if (!payload.hash) {
          port.postMessage({
            type: 'ERROR',
            taskId,
            error: {
              message: 'Invalid payload: hash is required for verify operation',
            },
          } as WorkerResponse);
          return;
        }
        // Verify the token against the hash using Argon2
        const isValid = await argon2.verify(payload.hash, payload.data);
        port.postMessage({
          type: 'RESULT',
          taskId,
          payload: isValid,
        } as WorkerResponse);
      } else {
        port.postMessage({
          type: 'ERROR',
          taskId,
          error: {
            message: `Unknown operation: ${payload.operation}`,
          },
        } as WorkerResponse);
      }
    } catch (error) {
      const err = error as Error;
      port.postMessage({
        type: 'ERROR',
        taskId,
        error: {
          message: err.message || 'Crypto operation failed',
          stack: err.stack,
        },
      } as WorkerResponse);
    }
  }
});
