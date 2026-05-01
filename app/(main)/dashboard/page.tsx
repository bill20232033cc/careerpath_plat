'use client';

import Link from 'next/link';
import { ArrowRight, FileText, Target, BookOpen, Trophy, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function DashboardPage() {
  return (
    <div className="py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-2xl p-8 mb-8">
          <h1 className="text-2xl font-bold mb-2">欢迎回来！</h1>
          <p className="text-blue-100">继续你的职业规划之旅</p>
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
