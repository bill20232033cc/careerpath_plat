'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FlipCard } from './FlipCard'
import { ProgressIndicator } from './ProgressIndicator'
import { NavigationControls } from './NavigationControls'
import { AsciiHeader } from './AsciiHeader'
import { SkillNode } from '@/lib/types'
import { ExternalLink } from 'lucide-react'
import { getLevelColor } from '@/lib/ascii-art'
import {
  getSkillStructureConfig,
  generateSkillTree,
  generateSkillConstellation,
  generateProgressGauge,
} from '@/lib/ascii-structure'

interface SkillFlipbookProps {
  skills: SkillNode[]
  currentIndex: number
  onIndexChange: (index: number) => void
}

export function SkillFlipbook({
  skills,
  currentIndex,
  onIndexChange,
}: SkillFlipbookProps) {
  const [isFlipped, setIsFlipped] = useState(false)
  const currentSkill = skills[currentIndex]

  const handlePrev = () => {
    if (currentIndex > 0) {
      setIsFlipped(false)
      onIndexChange(currentIndex - 1)
    }
  }

  const handleNext = () => {
    if (currentIndex < skills.length - 1) {
      setIsFlipped(false)
      onIndexChange(currentIndex + 1)
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-gradient-to-b from-gray-50 to-white rounded-2xl p-8 border border-gray-200 shadow-xl">
        <AsciiHeader
          skillName={currentSkill.name}
          asciiArt={currentSkill.asciiArt}
          level={currentSkill.level}
          fontIndex={currentIndex}
          allSkills={skills}
          currentIndex={currentIndex}
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
                front={<SkillCardFront skill={currentSkill} skills={skills} currentIndex={currentIndex} />}
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
  )
}

function SkillCardFront({
  skill,
  skills,
  currentIndex,
}: {
  skill: SkillNode
  skills: SkillNode[]
  currentIndex: number
}) {
  const [figletArt, setFigletArt] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    fetch('/api/ascii-art', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: skill.name, fontIndex: currentIndex }),
    })
      .then((res) => res.json())
      .then((result) => {
        if (!cancelled && result.success && result.data?.asciiArt) {
          setFigletArt(result.data.asciiArt)
        }
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [skill.name, currentIndex])

  const config = getSkillStructureConfig(skill.level)
  const prerequisites = skills
    .slice(0, currentIndex)
    .map((s) => s.name)
  const unlocks = skills
    .slice(currentIndex + 1)
    .slice(0, 2)
    .map((s) => s.name)

  let structureArt = ''
  if (config.type === 'tree') {
    structureArt = generateSkillTree(skill, prerequisites, unlocks)
  } else if (config.type === 'constellation') {
    const related = skills
      .filter((_, i) => i !== currentIndex)
      .map((s, i) => ({
        name: s.name,
        distance: Math.abs(
          skills.findIndex((sk) => sk.id === s.id) - currentIndex
        ),
      }))
    structureArt = generateSkillConstellation(skill, related.slice(0, 4))
  }

  const levelColors = {
    beginner: 'bg-green-100 text-green-700',
    intermediate: 'bg-yellow-100 text-yellow-700',
    advanced: 'bg-red-100 text-red-700',
  }

  const levelLabels = {
    beginner: '入门',
    intermediate: '进阶',
    advanced: '高级',
  }

  const statusIcons = {
    locked: '🔒',
    current: '⭐',
    completed: '✅',
  }

  const asciiColorClass = getLevelColor(skill.level)
  const progressGauge = generateProgressGauge(
    skills.filter((s) => s.status === 'completed').length,
    skills.length
  )

  return (
    <div className="h-full flex flex-col justify-center items-center text-center px-2">
      <div className="text-3xl mb-1">{statusIcons[skill.status]}</div>
      {isLoading ? (
        <div className="animate-pulse font-mono text-xs text-gray-400">
          Loading...
        </div>
      ) : figletArt ? (
        <pre
          className={`font-mono text-[7px] sm:text-[9px] leading-tight whitespace-pre ${asciiColorClass} mb-1 max-w-full overflow-x-auto`}
        >
          {figletArt}
        </pre>
      ) : (
        <div className="text-xl font-bold text-gray-900 mb-1">
          {skill.name}
        </div>
      )}

      {structureArt && (
        <pre className="font-mono text-[7px] sm:text-[9px] leading-tight whitespace-pre text-gray-900 mb-1 max-w-full overflow-x-auto">
          {structureArt}
        </pre>
      )}

      <pre className="font-mono text-[8px] sm:text-[10px] whitespace-pre text-gray-500 mb-2">
        {progressGauge}
      </pre>

      <div className="text-xs text-gray-500 mb-2">
        预计学习时长: {skill.estimatedHours} 小时
      </div>
      <div className="flex gap-2">
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${levelColors[skill.level]}`}
        >
          {levelLabels[skill.level]}
        </span>
        <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
          {config.title}
        </span>
      </div>
    </div>
  )
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
  )
}
