'use client';

import { useState } from 'react';
import { FileText, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ResumeUploadProps {
  onUpload: (text: string) => void;
}

export function ResumeUpload({ onUpload }: ResumeUploadProps) {
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = () => {
    if (content.trim()) {
      setIsLoading(true);
      onUpload(content.trim());
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <FileText className="w-5 h-5 text-blue-600" />
        <span className="font-medium">粘贴简历内容</span>
      </div>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={`请在此粘贴你的简历内容，例如：

张三 | 前端开发工程师

工作经验：
- ABC科技有限公司 | 前端开发 | 2022.06 - 至今
  负责公司核心产品前端开发，使用 React + TypeScript

教育背景：
- XX大学 | 计算机科学与技术 | 本科 | 2018 - 2022

技能：
JavaScript, TypeScript, React, Vue, Node.js, CSS, Git`}
        maxLength={50000}
        className="w-full h-80 p-4 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm leading-relaxed"
      />
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-500">{content.length} 字符</span>
        <Button
          onClick={handleSubmit}
          disabled={!content.trim() || isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              分析中...
            </>
          ) : '开始 AI 分析'}
        </Button>
      </div>
    </div>
  );
}
