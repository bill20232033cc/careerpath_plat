'use client'

import { useState, useEffect } from 'react'
import { getLevelColor } from '@/lib/ascii-art'
import { generateSkillFlow, generateProgressGauge } from '@/lib/ascii-structure'
import { SkillNode } from '@/lib/types'

interface AsciiHeaderProps {
  skillName: string
  asciiArt: string
  level: string
  fontIndex: number
  allSkills?: SkillNode[]
  currentIndex?: number
}

export function AsciiHeader({
  skillName,
  asciiArt,
  level,
  fontIndex,
  allSkills,
  currentIndex,
}: AsciiHeaderProps) {
  const [generatedArt, setGeneratedArt] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (allSkills && allSkills.length > 0 && currentIndex !== undefined) {
      const flow = generateSkillFlow(allSkills, currentIndex)
      setGeneratedArt(flow)
      setIsLoading(false)
      return
    }

    if (asciiArt && asciiArt.trim().length > 30) {
      setGeneratedArt(asciiArt)
      setIsLoading(false)
      return
    }

    let cancelled = false
    setIsLoading(true)

    fetch('/api/ascii-art', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: skillName, fontIndex }),
    })
      .then((res) => res.json())
      .then((result) => {
        if (!cancelled && result.success && result.data?.asciiArt) {
          setGeneratedArt(result.data.asciiArt)
        } else if (!cancelled) {
          setGeneratedArt(fallbackArt(skillName))
        }
      })
      .catch(() => {
        if (!cancelled) {
          setGeneratedArt(fallbackArt(skillName))
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [skillName, asciiArt, fontIndex, allSkills, currentIndex])

  const colorClass = getLevelColor(level)

  const progressGauge = allSkills && currentIndex !== undefined
    ? generateProgressGauge(
        allSkills.filter((s) => s.status === 'completed').length,
        allSkills.length
      )
    : null

  if (isLoading) {
    return (
      <div className="text-center py-4">
        <div className="animate-pulse font-mono text-xs text-gray-400">
          Generating ASCII Art...
        </div>
      </div>
    )
  }

  return (
    <div className="text-center">
      <pre
        className={`font-mono text-[8px] sm:text-[10px] leading-tight whitespace-pre bg-gray-900 rounded-lg p-4 border border-gray-700 overflow-x-auto ${colorClass}`}
      >
        {generatedArt}
      </pre>
      {progressGauge && (
        <pre className="font-mono text-[9px] sm:text-[11px] whitespace-pre text-gray-500 mt-2">
          {progressGauge}
        </pre>
      )}
    </div>
  )
}

function fallbackArt(name: string): string {
  const line = '═'.repeat(Math.max(name.length + 4, 12))
  return `╔${line}╗\n║  ${name.padStart(Math.floor((line.length + name.length) / 2)).slice(-line.length)}  ║\n╚${line}╝`
}
