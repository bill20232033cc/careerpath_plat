'use client';

import { useState, useCallback } from 'react';
import { Upload, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ResumeUploadProps {
  onUpload: (text: string) => void;
}

export function ResumeUpload({ onUpload }: ResumeUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFile(file);
    }
  }, []);

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      setContent(text);
    };
    reader.readAsText(file);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleSubmit = () => {
    if (content) {
      setIsLoading(true);
      onUpload(content);
      setTimeout(() => setIsLoading(false), 1000);
    }
  };

  const handleTextInput = () => {
    const text = prompt('请粘贴简历内容:');
    if (text) {
      setContent(text);
    }
  };

  return (
    <div className="space-y-6">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors cursor-pointer ${
          isDragging
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onClick={handleTextInput}
      >
        <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
        <p className="text-gray-600 mb-2">拖拽简历文件到这里，或点击输入</p>
        <p className="text-sm text-gray-400">支持 .txt, .md 格式，也支持直接粘贴内容</p>
        <input
          type="file"
          accept=".txt,.md"
          onChange={handleFileInput}
          className="hidden"
          id="file-upload"
        />
        <label htmlFor="file-upload" onClick={(e) => e.stopPropagation()}>
          <Button variant="outline" className="mt-4 cursor-pointer">
            选择文件
          </Button>
        </label>
      </div>

      {content && (
        <div className="bg-white rounded-xl p-6 border">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="w-5 h-5 text-blue-600" />
            <span className="font-medium">已上传内容预览</span>
          </div>
          <pre className="whitespace-pre-wrap text-sm text-gray-600 max-h-60 overflow-y-auto bg-gray-50 p-4 rounded-lg font-sans">
            {content.slice(0, 1000)}
            {content.length > 1000 && '\n\n... (内容已截断)'}
          </pre>
          <div className="text-sm text-gray-500 mt-2">
            共 {content.length} 个字符
          </div>
          <Button
            onClick={handleSubmit}
            className="w-full mt-4"
            disabled={isLoading}
          >
            {isLoading ? '分析中...' : '开始分析'}
          </Button>
        </div>
      )}
    </div>
  );
}
