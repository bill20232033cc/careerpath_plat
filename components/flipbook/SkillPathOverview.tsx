'use client'

import { SkillNode } from '@/lib/types'
import { cn } from '@/lib/utils'
import { Check, Lock, Star, ChevronRight } from 'lucide-react'

interface SkillPathOverviewProps {
  skills: SkillNode[]
  currentIndex: number
  onIndexChange: (index: number) => void
}

export function SkillPathOverview({
  skills,
  currentIndex,
  onIndexChange,
}: SkillPathOverviewProps) {
  return (
    <div className="space-y-6">
      {/* Flow progress bar */}
      <div className="bg-white rounded-xl p-6 border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">学习进度流程</h3>
        <div className="flex items-start gap-0 overflow-x-auto pb-2">
          {skills.map((skill, idx) => {
            const isCurrent = idx === currentIndex
            const isCompleted = skill.status === 'completed'
            const isLocked = skill.status === 'locked'
            const isActive = isCurrent || isCompleted

            return (
              <div key={skill.id} className="flex items-start shrink-0">
                <button
                  onClick={() => onIndexChange(idx)}
                  className={cn(
                    'flex flex-col items-center gap-2 px-3 py-3 rounded-xl transition-all min-w-[90px] group',
                    isCurrent
                      ? 'bg-blue-50 border-2 border-blue-500 shadow-md scale-105'
                      : isCompleted
                        ? 'bg-green-50 border border-green-200 hover:border-green-400'
                        : 'bg-gray-50 border border-gray-200 opacity-60 hover:opacity-80'
                  )}
                >
                  <div
                    className={cn(
                      'w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold transition-colors',
                      isCurrent
                        ? 'bg-blue-500 text-white'
                        : isCompleted
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-300 text-gray-500'
                    )}
                  >
                    {isCompleted ? (
                      <Check className="w-5 h-5" />
                    ) : isCurrent ? (
                      <Star className="w-5 h-5" />
                    ) : (
                      <Lock className="w-4 h-4" />
                    )}
                  </div>
                  <span
                    className={cn(
                      'text-xs text-center font-medium leading-tight max-w-[80px]',
                      isCurrent ? 'text-blue-700' : isCompleted ? 'text-green-700' : 'text-gray-500'
                    )}
                  >
                    {skill.name}
                  </span>
                  <span
                    className={cn(
                      'text-[10px] px-2 py-0.5 rounded-full',
                      isCurrent
                        ? 'bg-blue-100 text-blue-600'
                        : isCompleted
                          ? 'bg-green-100 text-green-600'
                          : 'bg-gray-100 text-gray-500'
                    )}
                  >
                    {isCompleted ? '已完成' : isCurrent ? '学习中' : '待解锁'}
                  </span>
                </button>
                {idx < skills.length - 1 && (
                  <div className="flex items-center self-center px-1 pt-2">
                    <div
                      className={cn(
                        'w-6 h-0.5',
                        idx < currentIndex ? 'bg-green-400' : 'bg-gray-300'
                      )}
                    />
                    <ChevronRight
                      className={cn(
                        'w-4 h-4 shrink-0',
                        idx < currentIndex ? 'text-green-400' : 'text-gray-300'
                      )}
                    />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Dependency tree */}
      <div className="bg-white rounded-xl p-6 border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">技能依赖关系</h3>
        <div className="overflow-x-auto">
          <div className="min-w-[600px]">
            {/* Tree header row */}
            <div className="flex items-center mb-2">
              <div className="w-[160px] text-xs text-gray-500 font-medium">前置技能</div>
              <div className="w-[160px] text-xs text-gray-500 font-medium text-center">当前技能</div>
              <div className="w-[160px] text-xs text-gray-500 font-medium text-center">后续解锁</div>
            </div>

            {skills.map((skill, idx) => {
              const isCurrent = idx === currentIndex
              const prerequisites = skills.slice(0, idx)
              const unlocks = skills.slice(idx + 1, idx + 3)

              return (
                <button
                  key={skill.id}
                  onClick={() => onIndexChange(idx)}
                  className={cn(
                    'w-full flex items-center py-2 px-2 rounded-lg transition-colors mb-1',
                    isCurrent ? 'bg-blue-50 ring-2 ring-blue-400' : 'hover:bg-gray-50'
                  )}
                >
                  {/* Prerequisites */}
                  <div className="w-[160px] flex items-center gap-1 flex-wrap">
                    {prerequisites.length === 0 && (
                      <span className="text-xs text-gray-400 italic">无前置</span>
                    )}
                    {prerequisites.map((pre, pi) => {
                      const preCompleted = pre.status === 'completed'
                      return (
                        <div key={pre.id} className="flex items-center gap-1">
                          {pi > 0 && (
                            <span className="text-gray-300 text-xs">,</span>
                          )}
                          <span
                            className={cn(
                              'text-xs px-2 py-0.5 rounded-full',
                              preCompleted
                                ? 'bg-green-100 text-green-700'
                                : 'bg-gray-100 text-gray-500'
                            )}
                          >
                            {pre.name.length > 8 ? pre.name.slice(0, 8) + '...' : pre.name}
                          </span>
                          <span className="text-gray-400 text-xs">→</span>
                        </div>
                      )
                    })}
                  </div>

                  {/* Current skill */}
                  <div className="w-[160px] flex justify-center">
                    <div
                      className={cn(
                        'text-sm px-3 py-1.5 rounded-lg font-medium',
                        skill.status === 'completed'
                          ? 'bg-green-500 text-white'
                          : skill.status === 'current'
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200 text-gray-500'
                      )}
                    >
                      {skill.name.length > 10 ? skill.name.slice(0, 10) + '...' : skill.name}
                    </div>
                  </div>

                  {/* Unlocks */}
                  <div className="w-[160px] flex items-center gap-1 flex-wrap">
                    {unlocks.length === 0 && (
                      <span className="text-xs text-gray-400 italic">终点技能</span>
                    )}
                    {unlocks.map((unlock, ui) => (
                      <div key={unlock.id} className="flex items-center gap-1">
                        <span className="text-gray-400 text-xs">→</span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">
                          {unlock.name.length > 8 ? unlock.name.slice(0, 8) + '...' : unlock.name}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Status indicator */}
                  <div className="ml-auto">
                    {skill.status === 'completed' && (
                      <span className="text-xs text-green-600 font-medium">✓ 已完成</span>
                    )}
                    {skill.status === 'current' && (
                      <span className="text-xs text-blue-600 font-medium">★ 当前</span>
                    )}
                    {skill.status === 'locked' && (
                      <span className="text-xs text-gray-400">🔒 锁定</span>
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
