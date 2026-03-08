'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  type ReactNode,
  type Dispatch,
  type SetStateAction,
} from 'react';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';

export interface SelectedTaskContextProps {
  taskId: string | null;
  setTaskId: Dispatch<SetStateAction<string | null>>;

  clearInvalidTask: () => void;
}

const SelectedTaskContext = createContext<SelectedTaskContextProps | undefined>(
  undefined
);

const SELECTED_TASK_PARAM = 'selectedTask';

interface SelectedTaskProviderProps {
  children: ReactNode;
}

export function SelectedTaskProvider({ children }: SelectedTaskProviderProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  // Initialize from URL
  const initialTaskId = searchParams.get(SELECTED_TASK_PARAM);
  const [taskId, setTaskId] = useState<string | null>(initialTaskId);

  const isUpdatingUrl = useRef(false);

  // Sync URL to state when URL changes externally (e.g., browser back/forward)
  useEffect(() => {
    if (isUpdatingUrl.current) {
      isUpdatingUrl.current = false;
      return;
    }

    const urlTaskId = searchParams.get(SELECTED_TASK_PARAM);
    if (urlTaskId !== taskId) {
      setTaskId(urlTaskId);
    }
  }, [searchParams, taskId]);

  // Custom setTaskId that also updates URL
  const setTaskIdWithUrl = useCallback(
    (newTaskId: SetStateAction<string | null>) => {
      const nextValue =
        typeof newTaskId === 'function' ? newTaskId(taskId) : newTaskId;

      // Skip if same value
      if (nextValue === taskId) return;

      setTaskId(nextValue);

      // Update URL after state update
      const params = new URLSearchParams(searchParams.toString());
      if (nextValue) {
        params.set(SELECTED_TASK_PARAM, nextValue);
      } else {
        params.delete(SELECTED_TASK_PARAM);
      }

      const newUrl = params.toString()
        ? `${pathname}?${params.toString()}`
        : pathname;

      isUpdatingUrl.current = true;
      router.replace(newUrl, { scroll: false });
    },
    [pathname, router, searchParams, taskId]
  );

  const clearInvalidTask = useCallback(() => {
    setTaskIdWithUrl(null);
  }, [setTaskIdWithUrl]);

  const contextValue: SelectedTaskContextProps = {
    taskId,
    setTaskId: setTaskIdWithUrl,
    clearInvalidTask,
  };

  return (
    <SelectedTaskContext.Provider value={contextValue}>
      {children}
    </SelectedTaskContext.Provider>
  );
}

export function useSelectedTaskContext(): SelectedTaskContextProps {
  const context = useContext(SelectedTaskContext);

  if (context === undefined) {
    throw new Error(
      'useSelectedTaskContext must be used within a SelectedTaskProvider'
    );
  }

  return context;
}
export { SelectedTaskContext };
