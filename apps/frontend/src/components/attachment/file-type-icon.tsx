import {
  FileText,
  FileImage,
  File,
  FileVideo,
  FileAudio,
  Archive,
  FileSpreadsheet,
  FileCode,
} from 'lucide-react';
import { FaFilePdf } from 'react-icons/fa';

interface FileTypeIconProps {
  mimeType?: string;
  fileType?: string;
  className?: string;
}

export function FileTypeIcon({
  mimeType,
  fileType,
  className = 'w-5 h-5',
}: FileTypeIconProps) {
  const type = (mimeType || fileType || '').toLowerCase();

  // Images
  if (type.includes('image/')) {
    return <FileImage className={`${className} text-blue-500`} />;
  }

  // Videos
  if (type.includes('video/')) {
    return <FileVideo className={`${className} text-purple-500`} />;
  }

  // Audio
  if (type.includes('audio/')) {
    return <FileAudio className={`${className} text-green-500`} />;
  }

  // PDF
  if (type.includes('pdf')) {
    return <FaFilePdf className={`${className} text-red-500`} />;
  }

  // Spreadsheets
  if (
    type.includes('sheet') ||
    type.includes('excel') ||
    type.includes('csv')
  ) {
    return <FileSpreadsheet className={`${className} text-green-600`} />;
  }

  // Code files
  if (
    type.includes('javascript') ||
    type.includes('typescript') ||
    type.includes('json') ||
    type.includes('xml') ||
    type.includes('html') ||
    type.includes('css') ||
    type.includes('python') ||
    type.includes('java')
  ) {
    return <FileCode className={`${className} text-indigo-500`} />;
  }

  // Archives
  if (
    type.includes('zip') ||
    type.includes('rar') ||
    type.includes('7z') ||
    type.includes('tar') ||
    type.includes('gz')
  ) {
    return <Archive className={`${className} text-orange-500`} />;
  }

  // Text files
  if (
    type.includes('text') ||
    type.includes('document') ||
    type.includes('word')
  ) {
    return <FileText className={`${className} text-gray-600`} />;
  }

  // Default
  return <File className={`${className} text-gray-400`} />;
}
