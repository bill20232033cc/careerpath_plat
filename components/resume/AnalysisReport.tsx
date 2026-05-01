'use client';

import { AnalysisReport as AnalysisReportType } from '@/lib/types';
import { CheckCircle, AlertCircle, TrendingUp, Lightbulb } from 'lucide-react';

interface AnalysisReportProps {
  report: AnalysisReportType;
}

export function AnalysisReport({ report }: AnalysisReportProps) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 border">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-green-600" />
          核心竞争力
        </h2>
        <div className="flex flex-wrap gap-2">
          {report.strengths.map((item, i) => (
            <span
              key={i}
              className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm"
            >
              {item}
            </span>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 border">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-amber-600" />
          待提升领域
        </h2>
        <div className="flex flex-wrap gap-2">
          {report.weaknesses.map((item, i) => (
            <span
              key={i}
              className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm"
            >
              {item}
            </span>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 border">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-blue-600" />
          岗位匹配度
        </h2>
        <div className="space-y-4">
          {Object.entries(report.matchScores).map(([title, score]) => (
            <div key={title}>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">{title}</span>
                <span className="text-sm text-gray-600">{score}%</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    score >= 80
                      ? 'bg-green-500'
                      : score >= 60
                      ? 'bg-yellow-500'
                      : 'bg-gray-400'
                  }`}
                  style={{ width: `${score}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 border">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-purple-600" />
          优化建议
        </h2>
        <ul className="space-y-2">
          {report.suggestions.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-gray-600">
              <span className="text-blue-600 mt-1">•</span>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
