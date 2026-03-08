'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { ClipboardCopy, Check } from 'lucide-react';

export interface CopyLinkButtonProps {
  url?: string;
}

export const CopyLinkButton = ({ url }: CopyLinkButtonProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      let fullUrl: string;

      if (!url) {
        // No url prop - copy current full URL
        fullUrl = window.location.href;
      } else {
        // url prop provided - combine with current domain
        const origin = window.location.origin;
        fullUrl = url.startsWith('/') ? `${origin}${url}` : `${origin}/${url}`;
      }

      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Cannot copy link!');
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={`flex items-center gap-2 px-3 py-2  transition
        ${copied ? 'text-green-500 ' : ' text-green-500 hover:bg-green-300'}`}
    >
      {copied ? <Check size={16} /> : <ClipboardCopy size={16} />}
    </button>
  );
};
