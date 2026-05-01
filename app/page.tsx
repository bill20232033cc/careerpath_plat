import Link from 'next/link';
import { ArrowRight, BookOpen, Target, Users, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <nav className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <span className="text-xl font-bold text-blue-600">CareerPath</span>
          <div className="flex gap-4">
            <Link href="/login">
              <Button variant="ghost">登录</Button>
            </Link>
            <Link href="/register">
              <Button>免费注册</Button>
            </Link>
          </div>
        </div>
      </nav>

      <section className="bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 text-white">
        <div className="max-w-6xl mx-auto px-4 py-24">
          <div className="max-w-2xl">
            <h1 className="text-5xl font-bold mb-6 leading-tight">
              开启你的
              <span className="text-yellow-300">职业之路</span>
            </h1>
            <p className="text-xl text-blue-100 mb-8">
              智能解析简历 · 精准岗位匹配 · 可视化学习路径
              <br />
              助你在求职路上脱颖而出
            </p>
            <div className="flex gap-4">
              <Link href="/register">
                <Button
                  size="lg"
                  className="bg-white text-blue-700 hover:bg-blue-50"
                >
                  立即开始
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">核心功能</h2>
            <p className="text-gray-600">一站式职业规划解决方案</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={<BookOpen className="w-8 h-8" />}
              title="简历解析"
              description="AI 智能分析简历，识别核心竞争力与待提升领域"
            />
            <FeatureCard
              icon={<Target className="w-8 h-8" />}
              title="岗位匹配"
              description="聚合主流招聘平台，精准推荐最适合你的岗位"
            />
            <FeatureCard
              icon={<BookOpen className="w-8 h-8" />}
              title="技能可视化"
              description="Flipbook 风格技能路径，让学习更有趣"
            />
            <FeatureCard
              icon={<Trophy className="w-8 h-8" />}
              title="成就系统"
              description="解锁徽章获取积分，激励持续成长"
            />
          </div>
        </div>
      </section>

      <section className="py-16 bg-white border-t">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <Stat number="10,000+" label="注册用户" />
            <Stat number="50,000+" label="岗位数据" />
            <Stat number="1,000+" label="课程资源" />
            <Stat number="95%" label="匹配准确率" />
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-700 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">准备好开始了吗？</h2>
          <p className="text-blue-100 mb-8">
            加入 CareerPath，让你的求职之路更加清晰
          </p>
          <Link href="/register">
            <Button size="lg" className="bg-white text-blue-700 hover:bg-blue-50">
              免费注册
            </Button>
          </Link>
        </div>
      </section>

      <footer className="bg-gray-900 text-gray-400 py-8">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p>CareerPath - 你的职业规划伙伴</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-white rounded-xl p-6 border hover:shadow-lg transition-shadow">
      <div className="text-blue-600 mb-4">{icon}</div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  );
}

function Stat({ number, label }: { number: string; label: string }) {
  return (
    <div>
      <div className="text-3xl font-bold text-blue-600 mb-1">{number}</div>
      <div className="text-gray-500">{label}</div>
    </div>
  );
}
