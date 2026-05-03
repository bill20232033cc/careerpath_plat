'use client';

import { useState, useCallback } from 'react';
import { Search } from 'lucide-react';

interface JobSearchProps {
  onSearch: (term: string) => void;
}

export function JobSearch({ onSearch }: JobSearchProps) {
  const [value, setValue] = useState('');

  const debouncedSearch = useCallback(
    (term: string) => {
      const timer = setTimeout(() => {
        onSearch(term);
      }, 300);
      return () => clearTimeout(timer);
    },
    [onSearch]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setValue(term);
    debouncedSearch(term);
  };

  return (
    <div className="flex-1 relative">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
      <input
        type="text"
        placeholder="搜索岗位、公司或技能..."
        value={value}
        onChange={handleChange}
        className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
      />
    </div>
  );
}
