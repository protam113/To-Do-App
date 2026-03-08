/**
 * Data Transform Worker
 *
 * This worker thread handles CPU-intensive data transformation operations
 * like map, filter, reduce on large datasets off the main event loop.
 *
 * Requirements: 4.1, 4.4
 */

import { parentPort } from 'worker_threads';

interface WorkerMessage {
  type: 'TASK' | 'SHUTDOWN';
  taskId?: string;
  payload?: {
    data: any[];
    operation: 'map' | 'filter' | 'reduce';
    functionString: string;
    initialValue?: any;
  };
}

interface WorkerResponse {
  type: 'READY' | 'RESULT' | 'ERROR';
  taskId?: string;
  payload?: any;
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

    if (!taskId || !payload?.data || !payload?.functionString) {
      port.postMessage({
        type: 'ERROR',
        taskId,
        error: {
          message: 'Invalid payload: data and functionString are required',
        },
      } as WorkerResponse);
      return;
    }

    if (!Array.isArray(payload.data)) {
      port.postMessage({
        type: 'ERROR',
        taskId,
        error: {
          message: 'Invalid payload: data must be an array',
        },
      } as WorkerResponse);
      return;
    }

    try {
      // Reconstruct the function from string
      // Note: This uses Function constructor which has security implications
      // Only use with trusted function strings from your own codebase

      const transformFn = new Function('return ' + payload.functionString)();

      let result: any;

      switch (payload.operation) {
        case 'map':
          result = payload.data.map(transformFn);
          break;
        case 'filter':
          result = payload.data.filter(transformFn);
          break;
        case 'reduce':
          // Handle reduce with optional initial value
          if (payload.initialValue !== undefined) {
            result = payload.data.reduce(transformFn, payload.initialValue);
          } else {
            result = payload.data.reduce(transformFn);
          }
          break;
        default:
          throw new Error(`Unknown operation: ${payload.operation}`);
      }

      port.postMessage({
        type: 'RESULT',
        taskId,
        payload: result,
      } as WorkerResponse);
    } catch (error) {
      const err = error as Error;
      port.postMessage({
        type: 'ERROR',
        taskId,
        error: {
          message: err.message || 'Transform operation failed',
          stack: err.stack,
        },
      } as WorkerResponse);
    }
  }
});
