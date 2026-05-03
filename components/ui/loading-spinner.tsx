import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  text?: string;
  className?: string;
}

export function LoadingSpinner({ text = '加载中...', className = '' }: LoadingSpinnerProps) {
  return (
    <div className={`flex flex-col items-center justify-center py-12 ${className}`}>
      <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-2" />
      <span className="text-sm text-gray-500">{text}</span>
    </div>
  );
}
