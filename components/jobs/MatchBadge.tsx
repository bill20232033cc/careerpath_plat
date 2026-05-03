'use client';

interface MatchBadgeProps {
  score: number;
}

export function MatchBadge({ score }: MatchBadgeProps) {
  const getColorClass = () => {
    if (score >= 80) return 'bg-green-100 text-green-700';
    if (score >= 60) return 'bg-yellow-100 text-yellow-700';
    return 'bg-gray-100 text-gray-600';
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getColorClass()}`}
    >
      匹配度 {score}%
    </span>
  );
}
