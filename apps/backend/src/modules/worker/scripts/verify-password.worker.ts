/**
 * Verify Password Worker
 *
 * This worker thread handles Argon2 password verification operations
 * off the main event loop to prevent blocking during login requests.
 *
 * Requirements: 2.1, 2.2
 */

import { parentPort } from 'worker_threads';
import * as argon2 from 'argon2';

interface WorkerMessage {
  type: 'TASK' | 'SHUTDOWN';
  taskId?: string;
  payload?: {
    hash: string;
    password: string;
  };
}

interface WorkerResponse {
  type: 'READY' | 'RESULT' | 'ERROR';
  taskId?: string;
  payload?: boolean;
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

    if (!taskId || !payload?.hash || !payload?.password) {
      port.postMessage({
        type: 'ERROR',
        taskId,
        error: {
          message: 'Invalid payload: hash and password are required',
        },
      } as WorkerResponse);
      return;
    }

    try {
      // Execute Argon2 verify operation
      const isValid = await argon2.verify(payload.hash, payload.password);

      port.postMessage({
        type: 'RESULT',
        taskId,
        payload: isValid,
      } as WorkerResponse);
    } catch (error) {
      const err = error as Error;
      port.postMessage({
        type: 'ERROR',
        taskId,
        error: {
          message: err.message || 'Failed to verify password',
          stack: err.stack,
        },
      } as WorkerResponse);
    }
  }
});
