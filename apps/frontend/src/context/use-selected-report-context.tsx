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

export interface SelectedReportContextProps {
  reportId: string | null;
  setReportId: Dispatch<SetStateAction<string | null>>;

  clearInvalidReport: () => void;
}

const SelectedReportContext = createContext<
  SelectedReportContextProps | undefined
>(undefined);

const SELECTED_REPORT_PARAM = 'selectedReport';

interface SelectedReportProviderProps {
  children: ReactNode;
}

export function SelectedReportProvider({
  children,
}: SelectedReportProviderProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  // Initialize from URL
  const initialReportId = searchParams.get(SELECTED_REPORT_PARAM);
  const [reportId, setReportId] = useState<string | null>(initialReportId);

  const isUpdatingUrl = useRef(false);

  // Sync URL to state when URL changes externally (e.g., browser back/forward)
  useEffect(() => {
    if (isUpdatingUrl.current) {
      isUpdatingUrl.current = false;
      return;
    }

    const urlReportId = searchParams.get(SELECTED_REPORT_PARAM);
    if (urlReportId !== reportId) {
      setReportId(urlReportId);
    }
  }, [searchParams, reportId]);

  // Custom setReportId that also updates URL
  const setReportIdWithUrl = useCallback(
    (newReportId: SetStateAction<string | null>) => {
      const nextValue =
        typeof newReportId === 'function' ? newReportId(reportId) : newReportId;

      // Skip if same value
      if (nextValue === reportId) return;

      setReportId(nextValue);

      // Update URL after state update
      const params = new URLSearchParams(searchParams.toString());
      if (nextValue) {
        params.set(SELECTED_REPORT_PARAM, nextValue);
      } else {
        params.delete(SELECTED_REPORT_PARAM);
      }

      const newUrl = params.toString()
        ? `${pathname}?${params.toString()}`
        : pathname;

      isUpdatingUrl.current = true;
      router.replace(newUrl, { scroll: false });
    },
    [pathname, router, searchParams, reportId]
  );

  const clearInvalidReport = useCallback(() => {
    setReportIdWithUrl(null);
  }, [setReportIdWithUrl]);

  const contextValue: SelectedReportContextProps = {
    reportId,
    setReportId: setReportIdWithUrl,
    clearInvalidReport,
  };

  return (
    <SelectedReportContext.Provider value={contextValue}>
      {children}
    </SelectedReportContext.Provider>
  );
}

export function useSelectedReportContext(): SelectedReportContextProps {
  const context = useContext(SelectedReportContext);

  if (context === undefined) {
    throw new Error(
      'useSelectedReportContext must be used within a SelectedReportProvider'
    );
  }

  return context;
}
export { SelectedReportContext };
