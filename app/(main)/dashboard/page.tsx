'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import {
  ArrowRight,
  FileText,
  Target,
  BookOpen,
  Trophy,
  GraduationCap,
  Loader2,
  Sparkles,
  CheckCircle,
  TrendingUp,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AnalysisReport, Achievement, UserAchievement } from '@/lib/types';

interface Activity {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  icon: React.ReactNode;
}

interface AchievementProgress {
  total: number;
  unlocked: number;
  points: number;
}

export default function DashboardPage() {
  const sessionData = useSession();
  const session = sessionData?.data;
  const status = sessionData?.status;
  const [loading, setLoading] = useState(true);
  const [resumeReport, setResumeReport] = useState<AnalysisReport | null>(null);
  const [achievementProgress, setAchievementProgress] = useState<AchievementProgress | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);

  const userId = session?.user?.id;
  const username = session?.user?.name || '用户';

  useEffect(() => {
    if (status === 'loading') return;

    const fetchData = async () => {
      setLoading(true);

      try {
        const newActivities: Activity[] = [];

        if (userId) {
          const reportRes = await fetch(`/api/resume/report?userId=${userId}`);
          if (reportRes.ok) {
            const reportData = await reportRes.json();
            if (reportData.success && reportData.data) {
              setResumeReport(reportData.data);
              newActivities.push({
                id: 'resume-analysis',
                title: '完成简历分析',
                description: `识别出 ${reportData.data.strengths.length} 个核心竞争力和 ${reportData.data.weaknesses.length} 个待提升领域`,
                timestamp: new Date().toISOString(),
                icon: <Sparkles className="w-4 h-4 text-purple-600" />,
              });
            }
          }

          const achievementRes = await fetch(`/api/achievements/progress?userId=${userId}`);
          if (achievementRes.ok) {
            const achievementData = await achievementRes.json();
            if (achievementData.success && achievementData.data) {
              setAchievementProgress(achievementData.data);
            }
          }
        }

        if (newActivities.length === 0) {
          newActivities.push({
            id: 'welcome',
            title: '欢迎来到 CareerPath',
            description: '开始上传简历，开启你的职业规划之旅',
            timestamp: new Date().toISOString(),
            icon: <TrendingUp className="w-4 h-4 text-blue-600" />,
          });
        }

        setActivities(newActivities);
      } catch (error) {
        console.error('[Dashboard 数据获取失败]', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId, status]);

  const level = achievementProgress ? Math.floor(achievementProgress.points / 500) + 1 : 1;

  return (
    <div className="py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-2xl p-8 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold mb-2">
                {loading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    加载中...
                  </span>
                ) : (
                  `欢迎回来，${username}！`
                )}
              </h1>
              <p className="text-blue-100">继续你的职业规划之旅</p>
            </div>
            {!loading && (
              <div className="text-right">
                <div className="text-3xl font-bold">Lv.{level}</div>
                <div className="text-sm text-blue-200">
                  {achievementProgress ? `${achievementProgress.points} 积分` : '0 积分'}
                </div>
              </div>
            )}
          </div>

          {!loading && resumeReport && (
            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white/10 rounded-lg p-3">
                <div className="text-2xl font-bold">{resumeReport.strengths.length}</div>
                <div className="text-sm text-blue-200">核心竞争力</div>
              </div>
              <div className="bg-white/10 rounded-lg p-3">
                <div className="text-2xl font-bold">{resumeReport.weaknesses.length}</div>
                <div className="text-sm text-blue-200">待提升领域</div>
              </div>
              <div className="bg-white/10 rounded-lg p-3">
                <div className="text-2xl font-bold">{Object.keys(resumeReport.matchScores).length}</div>
                <div className="text-sm text-blue-200">匹配岗位</div>
              </div>
              <div className="bg-white/10 rounded-lg p-3">
                <div className="text-2xl font-bold">{resumeReport.suggestions.length}</div>
                <div className="text-sm text-blue-200">优化建议</div>
              </div>
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <QuickAction
            icon={<FileText className="w-6 h-6" />}
            title="简历分析"
            description="上传简历，获取 AI 分析"
            href="/resume"
          />
          <QuickAction
            icon={<Target className="w-6 h-6" />}
            title="岗位推荐"
            description="发现适合你的岗位"
            href="/jobs"
          />
          <QuickAction
            icon={<GraduationCap className="w-6 h-6" />}
            title="学习中心"
            description="推荐优质课程"
            href="/learning"
          />
          <QuickAction
            icon={<BookOpen className="w-6 h-6" />}
            title="技能路径"
            description="可视化学习路线"
            href="/path"
          />
          <QuickAction
            icon={<Trophy className="w-6 h-6" />}
            title="成就中心"
            description="查看你的成就"
            href="/achievements"
          />
        </div>

        <div className="bg-white rounded-xl p-6 border">
          <h2 className="text-lg font-semibold mb-4">最近活动</h2>

          {loading ? (
            <div className="text-center py-12 text-gray-500">
              <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
              <p>加载中...</p>
            </div>
          ) : activities.length > 0 ? (
            <div className="space-y-4">
              {activities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="mt-0.5">{activity.icon}</div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{activity.title}</div>
                    <div className="text-sm text-gray-500">{activity.description}</div>
                    <div className="text-xs text-gray-400 mt-1">
                      {new Date(activity.timestamp).toLocaleDateString('zh-CN')}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <p>暂无最近活动</p>
              <p className="text-sm mt-2">
                开始上传简历，开启你的职业规划之旅
              </p>
              <Link href="/resume">
                <Button className="mt-4">
                  上传简历
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function QuickAction({
  icon,
  title,
  description,
  href,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
}) {
  return (
    <Link href={href}>
      <div className="bg-white rounded-xl p-6 border hover:shadow-md hover:border-blue-200 transition-all">
        <div className="text-blue-600 mb-3">{icon}</div>
        <h3 className="font-semibold mb-1">{title}</h3>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
    </Link>
  );
}
