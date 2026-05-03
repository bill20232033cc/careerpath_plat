'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ResumePreviewProps {
  content: string;
}

export function ResumePreview({ content }: ResumePreviewProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const shouldCollapse = content.length > 500;
  const displayContent = isExpanded || !shouldCollapse
    ? content
    : content.slice(0, 500) + '...';

  return (
    <div className="bg-white rounded-xl border p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-gray-900">已上传内容预览</h3>
        <span className="text-xs text-gray-500">
          共 {content.length} 字符
        </span>
      </div>

      <pre className="text-sm text-gray-700 bg-gray-50 rounded-lg p-4 overflow-x-auto whitespace-pre-wrap break-words font-mono leading-relaxed">
        {displayContent}
      </pre>

      {shouldCollapse && (
        <div className="mt-3 flex justify-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-blue-600 hover:text-blue-700"
          >
            {isExpanded ? (
              <>
                收起
                <ChevronUp className="w-4 h-4 ml-1" />
              </>
            ) : (
              <>
                展开
                <ChevronDown className="w-4 h-4 ml-1" />
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
