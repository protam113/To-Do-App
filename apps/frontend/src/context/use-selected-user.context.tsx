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

export interface SelectedUserContextProps {
  userId: string | null;
  setUserId: Dispatch<SetStateAction<string | null>>;
  clearSelectedUser: () => void;
}

const SelectedUserContext = createContext<SelectedUserContextProps | undefined>(
  undefined
);

const SELECTED_USER_PARAM = 'selectedUser';

interface SelectedUserProviderProps {
  children: ReactNode;
}

export function SelectedUserProvider({ children }: SelectedUserProviderProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  // Initialize from URL param
  const initialUserId = searchParams.get(SELECTED_USER_PARAM);
  const [userId, setUserId] = useState<string | null>(initialUserId);

  const isFirstRender = useRef(true);

  // Sync state to URL
  const searchParamsString = searchParams.toString();

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const params = new URLSearchParams(searchParamsString);
    const currentUrlUserId = params.get(SELECTED_USER_PARAM);

    if (userId === currentUrlUserId) {
      return;
    }

    if (userId) {
      params.set(SELECTED_USER_PARAM, userId);
    } else {
      params.delete(SELECTED_USER_PARAM);
    }

    const newUrl = params.toString()
      ? `${pathname}?${params.toString()}`
      : pathname;

    router.replace(newUrl, { scroll: false });
  }, [userId, pathname, router, searchParamsString]);

  const clearSelectedUser = useCallback(() => {
    setUserId(null);
  }, []);

  const contextValue: SelectedUserContextProps = {
    userId,
    setUserId,
    clearSelectedUser,
  };

  return (
    <SelectedUserContext.Provider value={contextValue}>
      {children}
    </SelectedUserContext.Provider>
  );
}

export function useSelectedUserContext(): SelectedUserContextProps {
  const context = useContext(SelectedUserContext);

  if (context === undefined) {
    throw new Error(
      'useSelectedUserContext must be used within a SelectedUserProvider'
    );
  }

  return context;
}

export { SelectedUserContext };
