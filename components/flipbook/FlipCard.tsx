'use client';

import { cn } from '@/lib/utils';

interface FlipCardProps {
  front: React.ReactNode;
  back: React.ReactNode;
  isFlipped: boolean;
  onFlip: () => void;
}

export function FlipCard({ front, back, isFlipped, onFlip }: FlipCardProps) {
  return (
    <div
      className="perspective-1000 w-full h-80 cursor-pointer"
      onClick={onFlip}
    >
      <div
        className={cn(
          'relative w-full h-full transition-transform duration-500 transform-style-preserve-3d',
          isFlipped && 'rotate-y-180'
        )}
        style={{ transformStyle: 'preserve-3d' }}
      >
        <div
          className="absolute w-full h-full rounded-xl bg-white border-2 border-blue-100 shadow-lg p-6 flex items-center justify-center"
          style={{ backfaceVisibility: 'hidden' }}
        >
          {front}
        </div>
        <div
          className="absolute w-full h-full rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg p-6 flex items-center justify-center"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)'
          }}
        >
          {back}
        </div>
      </div>
    </div>
  );
}
