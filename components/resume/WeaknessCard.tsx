'use client';

import { AlertCircle } from 'lucide-react';

interface WeaknessCardProps {
  weakness: string;
}

export function WeaknessCard({ weakness }: WeaknessCardProps) {
  return (
    <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-lg p-4">
      <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
      <span className="text-sm text-amber-800">{weakness}</span>
    </div>
  );
}
