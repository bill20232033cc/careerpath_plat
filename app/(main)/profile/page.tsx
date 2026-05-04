'use client'

import { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Trophy, FileText, BookOpen, Download, LogOut, Trash2, Loader2, Star, Lock, ChevronDown, ChevronUp, User } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'achievements' | 'resumes' | 'paths'>('achievements')
  const [achievements, setAchievements] = useState<any[]>([])
  const [resumeHistory, setResumeHistory] = useState<any[]>([])
  const [pathHistory, setPathHistory] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedItem, setExpandedItem] = useState<string | null>(null)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
      return
    }
    if (status === 'authenticated' && session?.user?.id) {
      fetchAllData(session.user.id)
    } else if (status === 'authenticated' && !session?.user?.id) {
      // 等待 session 加载完成
    } else if (status !== 'loading') {
      setLoading(false)
    }
  }, [status, session])

  const fetchAllData = async (userId: string) => {
    setLoading(true)
    try {
      const [achRes, resumeRes, pathRes] = await Promise.all([
        fetch(`/api/achievements/progress?userId=${userId}`),
        fetch(`/api/profile/resume-history?userId=${userId}`),
        fetch(`/api/profile/path-history?userId=${userId}`),
      ])
      const [achData, resumeData, pathData] = await Promise.all([
        achRes.json(),
        resumeRes.json(),
        pathRes.json(),
      ])
      if (achData.success) setAchievements(achData.data || [])
      if (resumeData.success) setResumeHistory(resumeData.data || [])
      if (pathData.success) setPathHistory(pathData.data || [])
    } catch (e) {
      console.error('[获取个人数据失败]', e)
    } finally {
      setLoading(false)
    }
  }

  const handleExport = async (format: 'text' | 'markdown') => {
    const userId = session?.user?.id
    if (!userId) return
    try {
      const res = await fetch(`/api/profile/export?userId=${userId}&format=${format}`)
      const data = await res.json()
      if (data.success && data.data?.content) {
        const blob = new Blob([data.data.content], { type: 'text/plain;charset=utf-8' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `careerpath-data-${new Date().toISOString().slice(0, 10)}.${format === 'markdown' ? 'md' : 'txt'}`
        a.click()
        URL.revokeObjectURL(url)
      }
    } catch (e) {
      console.error('[导出失败]', e)
    }
  }

  const handleDeleteAccount = async () => {
    if (!confirm('确定要注销账号吗？此操作不可撤销，所有数据将被删除。')) return
    const userId = session?.user?.id
    if (!userId) return
    try {
      const res = await fetch('/api/profile/delete-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      })
      const data = await res.json()
      if (data.success) {
        signOut({ callbackUrl: '/' })
      }
    } catch (e) {
      console.error('[注销失败]', e)
    }
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 py-12 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    )
  }

  if (status === 'unauthenticated') {
    return (
      <div className="min-h-screen bg-gray-50 py-12 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">请先登录</p>
          <Button onClick={() => router.push('/login')}>去登录</Button>
        </div>
      </div>
    )
  }

  const userName = session?.user?.name || session?.user?.email?.split('@')[0] || '用户'
  const userEmail = session?.user?.email || ''
  const userId = session?.user?.id

  const unlockedCount = achievements.filter((a) => a.unlocked).length
  const totalPoints = achievements
    .filter((a) => a.unlocked)
    .reduce((sum, a) => sum + (a.points || 0), 0)

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* 用户信息卡片 */}
        <div className="bg-white rounded-2xl p-8 border shadow-sm mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-2xl font-bold">
                {userName[0].toUpperCase()}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{userName}</h1>
                <p className="text-gray-500">{userEmail}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm font-medium text-yellow-600">{totalPoints} XP</span>
                  <span className="text-sm text-gray-400">·</span>
                  <span className="text-sm text-gray-500">{unlockedCount} 个成就</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Button variant="outline" size="sm" onClick={() => handleExport('text')}>
                <Download className="w-4 h-4 mr-1" /> 导出数据
              </Button>
              <Button variant="outline" size="sm" onClick={() => signOut({ callbackUrl: '/' })}>
                <LogOut className="w-4 h-4 mr-1" /> 退出登录
              </Button>
            </div>
          </div>
        </div>

        {/* Tab 切换 */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {[
            { key: 'achievements', label: '成就', icon: Trophy },
            { key: 'resumes', label: '简历分析历史', icon: FileText },
            { key: 'paths', label: '路径生成历史', icon: BookOpen },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab.key
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* 成就内容 */}
        {activeTab === 'achievements' && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {achievements.length === 0 ? (
              <div className="col-span-full text-center py-12 text-gray-500">暂无成就数据</div>
            ) : (
              achievements.map((achievement) => {
                const isUnlocked = achievement.unlocked
                return (
                  <div
                    key={achievement.id}
                    className={`bg-white rounded-xl p-6 border text-center transition-all ${
                      isUnlocked ? 'border-yellow-300 shadow-lg' : 'opacity-60'
                    }`}
                  >
                    <div className={`w-14 h-14 mx-auto rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-2xl mb-3 ${isUnlocked ? '' : 'grayscale'}`}>
                      {isUnlocked ? achievement.icon : <Lock className="w-5 h-5 text-gray-400" />}
                    </div>
                    <div className="font-semibold text-gray-900 mb-1">{achievement.name}</div>
                    <div className="text-xs text-gray-500 mb-2">{achievement.description}</div>
                    <div className="text-xs text-yellow-600 font-medium">{achievement.points} XP</div>
                  </div>
                )
              })
            )}
          </div>
        )}

        {/* 简历分析历史 */}
        {activeTab === 'resumes' && (
          <div className="space-y-4">
            {resumeHistory.length === 0 ? (
              <div className="text-center py-12 text-gray-500">暂无简历分析记录</div>
            ) : (
              resumeHistory.map((item) => (
                <div key={item.id} className="bg-white rounded-xl p-6 border">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-sm text-gray-500">{new Date(item.createdAt).toLocaleString('zh-CN')}</div>
                    <Button variant="ghost" size="sm" onClick={() => setExpandedItem(expandedItem === item.id ? null : item.id)}>
                      {expandedItem === item.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </Button>
                  </div>
                  {expandedItem === item.id && item.analysisReport && (
                    <pre className="text-sm text-gray-700 bg-gray-50 rounded-lg p-4 overflow-x-auto whitespace-pre-wrap">
                      {item.analysisReport}
                    </pre>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* 路径生成历史 */}
        {activeTab === 'paths' && (
          <div className="space-y-4">
            {pathHistory.length === 0 ? (
              <div className="text-center py-12 text-gray-500">暂无路径生成记录</div>
            ) : (
              pathHistory.map((item) => (
                <div key={item.id} className="bg-white rounded-xl p-6 border">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-semibold text-gray-900">{item.pathTitle}</div>
                    <div className="text-sm text-gray-500">{new Date(item.createdAt).toLocaleString('zh-CN')}</div>
                  </div>
                  <div className="text-sm text-gray-600 mb-2">目标岗位：{item.targetJob}</div>
                  <div className="text-xs text-gray-400">由 {item.poweredBy} 生成</div>
                </div>
              ))
            )}
          </div>
        )}

        {/* 危险操作区 */}
        <div className="mt-12 bg-red-50 rounded-xl p-6 border border-red-100">
          <h3 className="font-semibold text-red-900 mb-4">危险操作</h3>
          <Button variant="destructive" size="sm" onClick={handleDeleteAccount}>
            <Trash2 className="w-4 h-4 mr-1" /> 注销账号
          </Button>
          <p className="text-xs text-red-600 mt-2">此操作不可撤销，所有个人数据将被永久删除。</p>
        </div>
      </div>
    </div>
  )
}
