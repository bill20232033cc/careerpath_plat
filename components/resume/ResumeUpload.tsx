'use client';

import { useState, useRef } from 'react';
import { FileText, Loader2, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ResumeUploadProps {
  onUpload: (text: string) => void;
}

export function ResumeUpload({ onUpload }: ResumeUploadProps) {
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = () => {
    if (content.trim()) {
      setIsLoading(true);
      onUpload(content.trim());
    }
  };

  const handleFileUpload = async (uploadedFile: File) => {
    setFile(uploadedFile);
    setIsParsing(true);

    const formData = new FormData();
    formData.append('file', uploadedFile);

    try {
      const res = await fetch('/api/resume/parse-file', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success && data.data?.text) {
        setContent(data.data.text);
      } else {
        console.error('[文件解析失败]', data.error);
      }
    } catch (e) {
      console.error('[文件解析失败]', e);
    } finally {
      setIsParsing(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile && (droppedFile.type === 'application/pdf' || droppedFile.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')) {
      handleFileUpload(droppedFile);
    }
  };

  const clearFile = () => {
    setFile(null);
    setContent('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      {/* 文件上传区域 */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
          dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-500'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          id="file-input"
          type="file"
          accept=".pdf,.docx"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
        />
        {isParsing ? (
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <p className="text-sm text-gray-600">正在解析文件...</p>
          </div>
        ) : file ? (
          <div className="flex items-center justify-center gap-2">
            <FileText className="w-6 h-6 text-blue-600" />
            <span className="text-sm text-gray-700">{file.name}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                clearFile();
              }}
              className="p-1 hover:bg-gray-200 rounded"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        ) : (
          <>
            <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
            <p className="text-sm text-gray-600">拖拽或点击上传 PDF / Word 简历</p>
            <p className="text-xs text-gray-400 mt-1">支持 .pdf, .docx 格式</p>
          </>
        )}
      </div>

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
