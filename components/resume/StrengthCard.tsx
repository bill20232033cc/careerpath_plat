'use client';

import { CheckCircle } from 'lucide-react';

interface StrengthCardProps {
  strength: string;
}

export function StrengthCard({ strength }: StrengthCardProps) {
  return (
    <div className="flex items-start gap-3 bg-green-50 border border-green-200 rounded-lg p-4">
      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
      <span className="text-sm text-green-800">{strength}</span>
    </div>
  );
}
