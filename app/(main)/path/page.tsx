'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { ArrowLeft, Sparkles, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { SkillFlipbook } from '@/components/flipbook/SkillFlipbook'
import { SkillPathOverview } from '@/components/flipbook/SkillPathOverview'
import { SkillNode } from '@/lib/types'
import { Input } from '@/components/ui/input'

const FALLBACK_SKILLS: SkillNode[] = [
  {
    id: '1',
    name: 'HTML/CSS 基础',
    description: '掌握网页结构与样式设计基础，包括语义化标签、Flexbox 布局、CSS 选择器等核心概念',
    asciiArt: `
    ┌───────────────────┐
    │  ╔═══╦═══╦═══╗    │
    │  ║ H ║ T ║ M ║    │
    │  ╠═══╬═══╬═══╣    │
    │  ║   ║ L ║   ║    │
    │  ╚═══╩═══╩═══╝    │
    │   Web Foundation  │
    └───────────────────┘
    `,
    level: 'beginner',
    estimatedHours: 20,
    resources: [
      { id: 'r1', title: 'MDN Web Docs', url: '#', type: 'doc' },
      { id: 'r2', title: 'Flexbox 指南', url: '#', type: 'course' },
      { id: 'r3', title: 'CSS Tricks', url: '#', type: 'doc' },
    ],
    status: 'completed',
  },
  {
    id: '2',
    name: 'JavaScript 核心',
    description: '深入理解 JavaScript 语言核心概念，包括变量、函数、原型链、异步编程等',
    asciiArt: `
      ┌─────────────────┐
      │    /\    /\     │
      │   /  \  /  \    │
      │  /    \/    \   │
      │ <   JS Core   > │
      │  \    /\    /   │
      │   \  /  \  /    │
      │    \/    \/     │
      └─────────────────┘
    `,
    level: 'intermediate',
    estimatedHours: 40,
    resources: [
      { id: 'r4', title: 'JavaScript 高级程序设计', url: '#', type: 'doc' },
      { id: 'r5', title: 'ES6+ 教程', url: '#', type: 'course' },
      { id: 'r6', title: '你不知道的 JS', url: '#', type: 'doc' },
    ],
    status: 'current',
  },
  {
    id: '3',
    name: 'React 框架',
    description: '学习 React 组件化开发思想，包括 Hooks、状态管理、性能优化等',
    asciiArt: `
       ╭─────────────────╮
      ╱                   ╲
     ╱   ◢████████████◣    ╲
    │   ◢██╲      ╱██◣      │
    │   ████◣    ◢████      │
    │   ◥███╱      ╲██◤      │
     ╲   ◥████████████◤     ╱
      ╲                   ╱
       ╰─────────────────╯
          React 生态
    `,
    level: 'intermediate',
    estimatedHours: 50,
    resources: [
      { id: 'r7', title: 'React 官方文档', url: '#', type: 'doc' },
      { id: 'r8', title: 'React 实战课程', url: '#', type: 'course' },
      { id: 'r9', title: 'React Hooks 指南', url: '#', type: 'doc' },
    ],
    status: 'locked',
  },
  {
    id: '4',
    name: 'TypeScript',
    description: '掌握 TypeScript 类型系统，提升代码质量和开发效率',
    asciiArt: `
    ┌────────────────────┐
    │    ┌──────────┐    │
    │    │  Type   │    │
    │    │  Script │    │
    │    └────┬────┘    │
    │         │         │
    │    ┌────┴────┐    │
    │    │ Safety! │    │
    │    └─────────┘    │
    └────────────────────┘
    `,
    level: 'intermediate',
    estimatedHours: 30,
    resources: [
      { id: 'r10', title: 'TypeScript 官方文档', url: '#', type: 'doc' },
      { id: 'r11', title: 'TypeScript 进阶', url: '#', type: 'course' },
    ],
    status: 'locked',
  },
  {
    id: '5',
    name: 'Node.js 后端',
    description: '学习 Node.js 后端开发，包括 Express、Koa 框架、数据库操作',
    asciiArt: `
       ╭─────────────────╮
       │                 │
       │    ◢━━━━━━◣    │
       │    ┃Node.js┃    │
       │    ◥━━━━━━◤    │
       │      ┃┃┃       │
       │      ╰━╯       │
       │                 │
       ╰─────────────────╯
    `,
    level: 'advanced',
    estimatedHours: 60,
    resources: [
      { id: 'r12', title: 'Node.js 官方文档', url: '#', type: 'doc' },
      { id: 'r13', title: 'Express 实战', url: '#', type: 'course' },
      { id: 'r14', title: 'RESTful API 设计', url: '#', type: 'doc' },
    ],
    status: 'locked',
  },
]

function PathPageContent() {
  const searchParams = useSearchParams()
  const jobId = searchParams.get('jobId')

  const [currentIndex, setCurrentIndex] = useState(1)
  const [skills, setSkills] = useState<SkillNode[]>(FALLBACK_SKILLS)
  const [loading, setLoading] = useState(false)
  const [pageLoading, setPageLoading] = useState(!!jobId)
  const [resumeInput, setResumeInput] = useState('')
  const [targetJobInput, setTargetJobInput] = useState('')
  const [pathTitle, setPathTitle] = useState('React 前端进阶路径')

  useEffect(() => {
    if (jobId) {
      fetchPath(jobId)
    }
  }, [jobId])

  const fetchPath = async (id: string) => {
    setPageLoading(true)
    try {
      const res = await fetch(`/api/path/${id}`)
      const data = await res.json()
      if (data.success && data.data) {
        const pathData = data.data
        setPathTitle(`技能路径 - 岗位 ${id}`)
        setSkills(pathData.skillNodes)
        setCurrentIndex(
          pathData.skillNodes.findIndex((n: SkillNode) => n.status === 'current') || 1
        )
      }
    } catch (e) {
      console.error('[获取路径失败]', e)
    } finally {
      setPageLoading(false)
    }
  }

  const handleGenerate = async () => {
    if (!resumeInput || !targetJobInput) return
    setLoading(true)
    try {
      const res = await fetch('/api/path/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resume: resumeInput,
          targetJob: targetJobInput,
        }),
      })
      const data = await res.json()
      const pathData = data.path || data.fallback

      setPathTitle(pathData.title)
      const newSkills = pathData.nodes.map((node: any, idx: number) => ({
        id: String(idx + 1),
        name: node.title,
        description: node.description,
        level: idx === 0 ? 'beginner' : idx < 3 ? 'intermediate' : 'advanced',
        estimatedHours: parseInt(node.duration) * 10,
        resources: (node.resources || []).map((r: string, i: number) => ({
          id: `r${i}`,
          title: r,
          url: '#',
          type: 'course',
        })),
        status: idx === 1 ? 'current' : idx < 1 ? 'completed' : 'locked',
        asciiArt: `
        ┌─────────────────┐
        │  ════════════  │
        │  ${node.title.slice(0, 12)}  │
        │  ════════════  │
        └─────────────────┘
        `,
      }))
      setSkills(newSkills)
      setCurrentIndex(1)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      setCurrentIndex((prev) => Math.max(0, prev - 1))
    } else if (e.key === 'ArrowRight') {
      setCurrentIndex((prev) => Math.min(skills.length - 1, prev + 1))
    }
  }

  if (pageLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 py-12 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <p className="text-gray-600">加载技能路径中...</p>
        </div>
      </div>
    )
  }

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 py-12"
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{pathTitle}</h1>
            <p className="text-gray-600">个性化技能学习路径，由 DeepSeek 智能生成</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-purple-500" />
            <h2 className="text-lg font-semibold">AI 生成个性化路径</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">你的简历/背景</label>
              <Input
                placeholder="简述你的技能和经验..."
                value={resumeInput}
                onChange={(e) => setResumeInput(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">目标岗位</label>
              <Input
                placeholder="例如：React 前端工程师"
                value={targetJobInput}
                onChange={(e) => setTargetJobInput(e.target.value)}
              />
            </div>
          </div>
          <Button
            onClick={handleGenerate}
            disabled={loading || !resumeInput || !targetJobInput}
            className="w-full md:w-auto"
          >
            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {loading ? '生成中...' : '生成个性化路径'}
          </Button>
        </div>

        <SkillPathOverview
          skills={skills}
          currentIndex={currentIndex}
          onIndexChange={setCurrentIndex}
        />

        <SkillFlipbook
          skills={skills}
          currentIndex={currentIndex}
          onIndexChange={setCurrentIndex}
        />

        <div className="mt-8 grid md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-4 border">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-green-500">✅</span>
              <span className="font-medium">已完成</span>
            </div>
            <div className="text-2xl font-bold text-green-600">
              {skills.filter((s) => s.status === 'completed').length}
            </div>
            <div className="text-sm text-gray-500">个技能</div>
          </div>

          <div className="bg-white rounded-xl p-4 border">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-yellow-500">⭐</span>
              <span className="font-medium">进行中</span>
            </div>
            <div className="text-2xl font-bold text-yellow-600">
              {skills.filter((s) => s.status === 'current').length}
            </div>
            <div className="text-sm text-gray-500">个技能</div>
          </div>

          <div className="bg-white rounded-xl p-4 border">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-gray-400">🔒</span>
              <span className="font-medium">待解锁</span>
            </div>
            <div className="text-2xl font-bold text-gray-600">
              {skills.filter((s) => s.status === 'locked').length}
            </div>
            <div className="text-sm text-gray-500">个技能</div>
          </div>
        </div>

        <div className="mt-8 bg-white rounded-xl p-6 border">
          <h2 className="text-lg font-semibold mb-4">学习建议</h2>
          <ul className="space-y-2 text-gray-600">
            <li>• 建议按顺序完成每个技能节点</li>
            <li>• 点击卡片可翻转查看详细学习资源</li>
            <li>• 使用键盘 ← → 或点击按钮切换技能</li>
            <li>• 完成当前技能后自动解锁下一个</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default function PathPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 py-12 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <p className="text-gray-600">加载中...</p>
          </div>
        </div>
      }
    >
      <PathPageContent />
    </Suspense>
  )
}
