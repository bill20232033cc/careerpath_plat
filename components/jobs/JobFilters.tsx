'use client';

import { useState } from 'react';
import { Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface JobFilterValues {
  source?: string;
  jobType?: string;
  location?: string;
}

interface JobFiltersProps {
  onFilter: (filters: JobFilterValues) => void;
}

const SOURCE_OPTIONS = [
  { value: '', label: '全部平台' },
  { value: 'boss', label: 'Boss直聘' },
  { value: 'lagou', label: '拉勾' },
  { value: 'zhilian', label: '智联招聘' },
  { value: '51job', label: '前程无忧' },
];

const TYPE_OPTIONS = [
  { value: '', label: '全部类型' },
  { value: 'full-time', label: '全职' },
  { value: 'part-time', label: '兼职' },
  { value: 'intern', label: '实习' },
];

const LOCATION_OPTIONS = [
  { value: '', label: '全部城市' },
  { value: '北京', label: '北京' },
  { value: '上海', label: '上海' },
  { value: '深圳', label: '深圳' },
  { value: '杭州', label: '杭州' },
  { value: '广州', label: '广州' },
];

export function JobFilters({ onFilter }: JobFiltersProps) {
  const [filters, setFilters] = useState<JobFilterValues>({});
  const [isOpen, setIsOpen] = useState(false);

  const handleChange = (key: keyof JobFilterValues, value: string) => {
    const newFilters = { ...filters, [key]: value || undefined };
    setFilters(newFilters);
    onFilter(newFilters);
  };

  return (
    <div className="relative">
      <Button
        variant="outline"
        className="gap-2"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Filter className="w-4 h-4" />
        筛选
      </Button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl border shadow-lg p-4 z-10">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                招聘平台
              </label>
              <select
                value={filters.source || ''}
                onChange={(e) => handleChange('source', e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none text-sm"
              >
                {SOURCE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                工作类型
              </label>
              <select
                value={filters.jobType || ''}
                onChange={(e) => handleChange('jobType', e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none text-sm"
              >
                {TYPE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                城市
              </label>
              <select
                value={filters.location || ''}
                onChange={(e) => handleChange('location', e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none text-sm"
              >
                {LOCATION_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
