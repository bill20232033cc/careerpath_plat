'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Trophy, Star, Lock, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Achievement } from '@/lib/types';

interface AchievementProgress extends Achievement {
  unlocked: boolean;
}

export default function AchievementsPage() {
  const [achievements, setAchievements] = useState<AchievementProgress[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProgress();
  }, []);

  const fetchProgress = async () => {
    try {
      setLoading(true);
      const userId = localStorage.getItem('userId') || '';
      const res = await fetch(`/api/achievements/progress?userId=${userId}`);
      const result = await res.json();
      if (result.success && result.data) {
        setAchievements(result.data);
      }
    } catch (error) {
      console.error('[获取成就进度失败]', error);
    } finally {
      setLoading(false);
    }
  };

  const unlockedIds = achievements.filter((a) => a.unlocked).map((a) => a.id);
  const totalPoints = unlockedIds.reduce((sum, id) => {
    const achievement = achievements.find((a) => a.id === id);
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
                  距离下一等级还需要 {Math.max(0, 300 - totalPoints)} XP
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold">
                {unlockedIds.length}/{achievements.length}
              </div>
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
            <div className="text-sm text-gray-500">新手期 · 继续加油！</div>
          </div>
          <div className="mt-3">
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full transition-all"
                style={{ width: `${Math.min(100, (totalPoints / 300) * 100)}%` }}
              />
            </div>
          </div>
        </div>

        <h2 className="text-xl font-semibold mb-4">全部成就</h2>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <span className="ml-2 text-gray-600">加载中...</span>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {achievements.map((achievement) => {
              const isUnlocked = achievement.unlocked;
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
                    {isUnlocked ? (
                      achievement.icon
                    ) : (
                      <Lock className="w-6 h-6 text-gray-400" />
                    )}
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
        )}

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
