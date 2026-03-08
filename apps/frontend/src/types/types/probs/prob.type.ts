import type { ReactNode } from 'react';

export interface ContainerProps {
  children: ReactNode;
  className?: string;
}

export interface LoaderProps {
  onLoadingComplete?: () => void;
}

export interface LayoutProps {
  children: ReactNode;
}

export interface HeaderProps {
  title: string;
  className?: string;
}

export interface PaginationProps {
  currentPage: number;
  totalPage: number;
  onPageChange: (page: number) => void;
}

export interface NoResultsFoundProps {
  title?: string;
  message?: string;
}

export interface RefreshButtonProps {
  onClick: () => void;
  className?: string;
}

export interface LoadingProps {
  size?: number;
  message?: string;
  className?: string;
}

export interface PushButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  href: string;
  label?: string;
  className?: string;
}
export interface QuestionButtonProps {
  description?: string;
  className?: string;
}
interface Step {
  id: number;
  name: string;
}

export interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
}

export interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  question: string;
  description: string;
  onConfirm: () => void;
}

export interface RichTextEditorProps {
  className?: string;
  initialContent?: string;
  onContentChange?: (html: string, text: string) => void;
  onChange?: (content: { html: string; text: string; json: any }) => void;
}
