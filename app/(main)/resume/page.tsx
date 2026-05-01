'use client';

import { useState } from 'react';
import { ArrowLeft, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { ResumeUpload } from '@/components/resume/ResumeUpload';
import { AnalysisReport } from '@/components/resume/AnalysisReport';
import { AnalysisReport as AnalysisReportType } from '@/lib/types';
import { Button } from '@/components/ui/button';

export default function ResumePage() {
  const [analysisResult, setAnalysisResult] = useState<AnalysisReportType | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = async (text: string) => {
    setIsAnalyzing(true);

    try {
      const res = await fetch('/api/resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeText: text }),
      });

      const data = await res.json();

      if (res.ok && data.report) {
        setAnalysisResult(data.report);
      } else {
        alert(data.error || '分析失败，请重试');
      }
    } catch (error) {
      console.error('Analysis error:', error);
      alert('网络错误，请重试');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setAnalysisResult(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">简历分析</h1>
            <p className="text-gray-600">上传简历，获取 AI 智能分析</p>
          </div>
        </div>

        {analysisResult ? (
          <div>
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl p-6 mb-6">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-5 h-5" />
                <span className="font-semibold">分析完成！</span>
              </div>
              <p className="text-blue-100 text-sm">
                我们识别出 {analysisResult.strengths.length} 个核心竞争力和 {analysisResult.weaknesses.length} 个待提升领域
              </p>
            </div>

            <AnalysisReport report={analysisResult} />

            <div className="mt-6 flex gap-4">
              <Button onClick={handleReset} variant="outline" className="flex-1">
                重新分析
              </Button>
              <Link href="/jobs" className="flex-1">
                <Button className="w-full">
                  查看匹配岗位
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl p-6 border">
            <h2 className="text-lg font-semibold mb-4">上传你的简历</h2>
            <ResumeUpload onUpload={handleAnalyze} />
            {isAnalyzing && (
              <div className="mt-4 text-center text-gray-500">
                正在分析简历，请稍候...
              </div>
            )}
          </div>
        )}

        <div className="mt-8 bg-blue-50 rounded-xl p-6 border border-blue-100">
          <h3 className="font-semibold text-blue-900 mb-2">简历分析包含：</h3>
          <ul className="space-y-1 text-sm text-blue-700">
            <li>• 关键技能识别与提取</li>
            <li>• 核心竞争力分析</li>
            <li>• 待提升领域建议</li>
            <li>• 与主流岗位的匹配度评估</li>
            <li>• 个性化优化建议</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
