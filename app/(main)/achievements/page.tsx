'use client';

import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Achievement } from '@/lib/types';
import { Trophy, Star, Lock } from 'lucide-react';

const ACHIEVEMENTS: Achievement[] = [
  {
    id: '1',
    name: '初次上路',
    description: '完成注册',
    icon: '🚀',
    category: 'beginner',
    points: 50,
    condition: 'register',
  },
  {
    id: '2',
    name: '简历达人',
    description: '上传并分析简历',
    icon: '📝',
    category: 'resume',
    points: 100,
    condition: 'analyze_resume',
  },
  {
    id: '3',
    name: '目标猎手',
    description: '确认目标岗位',
    icon: '🎯',
    category: 'target',
    points: 150,
    condition: 'confirm_target',
  },
  {
    id: '4',
    name: '学习先锋',
    description: '完成首个技能学习',
    icon: '📚',
    category: 'learning',
    points: 300,
    condition: 'complete_skill',
  },
  {
    id: '5',
    name: '社区达人',
    description: '发布帖子被点赞',
    icon: '🤝',
    category: 'community',
    points: 200,
    condition: 'post_liked',
  },
  {
    id: '6',
    name: '求职高手',
    description: '获得多个岗位匹配',
    icon: '💎',
    category: 'master',
    points: 500,
    condition: 'multiple_matches',
  },
];

export default function AchievementsPage() {
  const unlockedIds = ['1', '2'];
  const totalPoints = unlockedIds.reduce((sum, id) => {
    const achievement = ACHIEVEMENTS.find((a) => a.id === id);
    return sum + (achievement?.points || 0);
  }, 0);

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      beginner: 'from-green-400 to-green-600',
      resume: 'from-blue-400 to-blue-600',
      target: 'from-yellow-400 to-orange-500',
      learning: 'from-purple-400 to-purple-600',
      community: 'from-pink-400 to-pink-600',
      master: 'from-indigo-400 to-indigo-600',
    };
    return colors[category] || 'from-gray-400 to-gray-600';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">成就中心</h1>
            <p className="text-gray-600">解锁徽章，提升等级</p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 rounded-2xl p-8 mb-8 text-white shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
                <Trophy className="w-10 h-10" />
              </div>
              <div>
                <div className="text-4xl font-bold mb-1">{totalPoints} XP</div>
                <div className="text-white/80">当前积分</div>
                <div className="text-sm mt-1 text-white/60">
                  距离下一等级还需要 {300 - totalPoints} XP
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold">{unlockedIds.length}/{ACHIEVEMENTS.length}</div>
              <div className="text-white/80">已解锁成就</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500" />
              <span className="font-medium">等级 1</span>
            </div>
            <div className="text-sm text-gray-500">
              新手期 · 继续加油！
            </div>
          </div>
          <div className="mt-3">
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full transition-all"
                style={{ width: `${(totalPoints / 300) * 100}%` }}
              />
            </div>
          </div>
        </div>

        <h2 className="text-xl font-semibold mb-4">全部成就</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {ACHIEVEMENTS.map((achievement) => {
            const isUnlocked = unlockedIds.includes(achievement.id);
            return (
              <div
                key={achievement.id}
                className={`bg-white rounded-xl p-6 border text-center transition-all ${
                  isUnlocked
                    ? 'border-yellow-300 shadow-lg'
                    : 'opacity-60'
                }`}
              >
                <div
                  className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-br ${getCategoryColor(achievement.category)} flex items-center justify-center text-3xl mb-4 ${
                    isUnlocked ? '' : 'grayscale'
                  }`}
                >
                  {isUnlocked ? achievement.icon : <Lock className="w-6 h-6 text-gray-400" />}
                </div>
                <div className="font-semibold text-gray-900 mb-1">
                  {achievement.name}
                </div>
                <div className="text-sm text-gray-500 mb-3">
                  {achievement.description}
                </div>
                <div className="flex items-center justify-center gap-1 text-sm">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span className="font-medium text-yellow-600">
                    {achievement.points} XP
                  </span>
                </div>
                {isUnlocked && (
                  <div className="mt-3 text-xs text-green-600 font-medium bg-green-50 py-1 px-3 rounded-full inline-block">
                    ✓ 已解锁
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-8 bg-blue-50 rounded-xl p-6 border border-blue-100">
          <h3 className="font-semibold text-blue-900 mb-4">成就说明</h3>
          <ul className="space-y-2 text-sm text-blue-700">
            <li>• 完成注册即可获得「初次上路」成就</li>
            <li>• 上传并分析简历可获得「简历达人」成就</li>
            <li>• 确认目标岗位可获得「目标猎手」成就</li>
            <li>• 完成技能学习可获得「学习先锋」成就</li>
            <li>• 帖子被点赞可获得「社区达人」成就</li>
            <li>• 获得多个岗位匹配可获得「求职高手」成就</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
