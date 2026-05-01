'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FlipCard } from './FlipCard';
import { ProgressIndicator } from './ProgressIndicator';
import { NavigationControls } from './NavigationControls';
import { AsciiHeader } from './AsciiHeader';
import { SkillNode } from '@/lib/types';
import { ExternalLink } from 'lucide-react';

interface SkillFlipbookProps {
  skills: SkillNode[];
  currentIndex: number;
  onIndexChange: (index: number) => void;
}

export function SkillFlipbook({
  skills,
  currentIndex,
  onIndexChange,
}: SkillFlipbookProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const currentSkill = skills[currentIndex];

  const handlePrev = () => {
    if (currentIndex > 0) {
      setIsFlipped(false);
      onIndexChange(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < skills.length - 1) {
      setIsFlipped(false);
      onIndexChange(currentIndex + 1);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-gradient-to-b from-gray-50 to-white rounded-2xl p-8 border border-gray-200 shadow-xl">
        <AsciiHeader
          skillName={currentSkill.name}
          asciiArt={currentSkill.asciiArt}
        />

        <div className="my-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <FlipCard
                front={<SkillCardFront skill={currentSkill} />}
                back={<SkillCardBack skill={currentSkill} />}
                isFlipped={isFlipped}
                onFlip={() => setIsFlipped(!isFlipped)}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        <ProgressIndicator current={currentIndex + 1} total={skills.length} />

        <NavigationControls
          onPrev={handlePrev}
          onNext={handleNext}
          canPrev={currentIndex > 0}
          canNext={currentIndex < skills.length - 1}
        />

        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
          <p className="text-center text-sm text-blue-700">
            💡 点击卡片翻转查看详情，支持键盘 ← → 翻页
          </p>
        </div>
      </div>
    </div>
  );
}

function SkillCardFront({ skill }: { skill: SkillNode }) {
  const levelColors = {
    beginner: 'bg-green-100 text-green-700',
    intermediate: 'bg-yellow-100 text-yellow-700',
    advanced: 'bg-red-100 text-red-700',
  };

  const levelLabels = {
    beginner: '入门',
    intermediate: '进阶',
    advanced: '高级',
  };

  const statusIcons = {
    locked: '🔒',
    current: '⭐',
    completed: '✅',
  };

  return (
    <div className="h-full flex flex-col justify-center items-center text-center">
      <div className="text-3xl mb-2">{statusIcons[skill.status]}</div>
      <div className="text-2xl font-bold text-gray-900 mb-2">
        {skill.name}
      </div>
      <div className="text-sm text-gray-500 mb-4">
        预计学习时长: {skill.estimatedHours} 小时
      </div>
      <div className="flex gap-2">
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${levelColors[skill.level]}`}
        >
          {levelLabels[skill.level]}
        </span>
      </div>
    </div>
  );
}

function SkillCardBack({ skill }: { skill: SkillNode }) {
  return (
    <div className="h-full flex flex-col justify-center">
      <div className="text-lg font-semibold mb-3">📚 学习详情</div>
      <p className="text-sm opacity-90 mb-4">{skill.description}</p>
      <div className="text-sm opacity-80">
        <div className="font-medium mb-2">推荐资源:</div>
        <ul className="space-y-2">
          {skill.resources.slice(0, 3).map((resource) => (
            <li key={resource.id} className="flex items-center gap-2">
              <ExternalLink className="w-3 h-3" />
              <span className="hover:underline cursor-pointer">
                {resource.title}
              </span>
              <span className="text-xs opacity-60">({resource.type})</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
