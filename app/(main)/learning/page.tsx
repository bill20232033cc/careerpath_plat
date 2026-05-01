'use client';

import { useState } from 'react';
import { ArrowLeft, Search, BookOpen, Clock, Star, ExternalLink, Play } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Course } from '@/lib/types';

const COURSES: Course[] = [
  {
    id: '1',
    title: 'React 官方教程',
    platform: 'React 官网',
    url: 'https://react.dev',
    duration: '8 小时',
    skills: ['React', 'Hooks', '组件'],
    level: 'beginner',
    description: '官方出品的 React 入门教程，从基础概念到实践项目',
  },
  {
    id: '2',
    title: 'TypeScript 进阶指南',
    platform: '慕课网',
    url: 'https://imooc.com',
    duration: '15 小时',
    skills: ['TypeScript', '类型系统'],
    level: 'intermediate',
    rating: 4.8,
    description: '深入理解 TypeScript 类型系统，提升代码质量',
  },
  {
    id: '3',
    title: 'Node.js 全栈开发',
    platform: '极客时间',
    url: 'https://geekbang.com',
    duration: '20 小时',
    skills: ['Node.js', 'Express', 'API'],
    level: 'intermediate',
    rating: 4.7,
    description: '从入门到实战，掌握后端开发能力',
  },
  {
    id: '4',
    title: 'CSS Grid & Flexbox',
    platform: 'FreeCodeCamp',
    url: 'https://freecodecamp.org',
    duration: '6 小时',
    skills: ['CSS', 'Grid', 'Flexbox'],
    level: 'beginner',
    description: '现代 CSS 布局技术，响应式设计必备',
  },
  {
    id: '5',
    title: '算法与数据结构',
    platform: 'LeetCode',
    url: 'https://leetcode.com',
    duration: '30 小时',
    skills: ['算法', '数据结构', '面试'],
    level: 'advanced',
    rating: 4.9,
    description: '高频面试算法题精讲，提升编程能力',
  },
  {
    id: '6',
    title: 'Docker 容器化部署',
    platform: 'Docker 官方',
    url: 'https://docker.com',
    duration: '10 小时',
    skills: ['Docker', '容器', '部署'],
    level: 'intermediate',
    description: '云原生必备技能，容器化部署实战',
  },
];

export default function LearningPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');

  const filteredCourses = COURSES.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.skills.some((s) => s.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesLevel = selectedLevel === 'all' || course.level === selectedLevel;
    return matchesSearch && matchesLevel;
  });

  const getLevelColor = (level: string) => {
    const colors: Record<string, string> = {
      beginner: 'bg-green-100 text-green-700',
      intermediate: 'bg-yellow-100 text-yellow-700',
      advanced: 'bg-red-100 text-red-700',
    };
    return colors[level] || 'bg-gray-100 text-gray-700';
  };

  const getLevelLabel = (level: string) => {
    const labels: Record<string, string> = {
      beginner: '入门',
      intermediate: '进阶',
      advanced: '高级',
    };
    return labels[level] || level;
  };

  const stats = {
    totalCourses: COURSES.length,
    totalHours: COURSES.reduce((sum, c) => parseInt(c.duration) + sum, 0),
    beginnerCourses: COURSES.filter((c) => c.level === 'beginner').length,
    intermediateCourses: COURSES.filter((c) => c.level === 'intermediate').length,
    advancedCourses: COURSES.filter((c) => c.level === 'advanced').length,
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">学习中心</h1>
            <p className="text-gray-600">推荐优质课程，助力技能提升</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 border">
            <div className="flex items-center gap-2 text-gray-500 mb-1">
              <BookOpen className="w-4 h-4" />
              <span className="text-sm">课程总数</span>
            </div>
            <div className="text-2xl font-bold text-blue-600">{stats.totalCourses}</div>
          </div>
          <div className="bg-white rounded-xl p-4 border">
            <div className="flex items-center gap-2 text-gray-500 mb-1">
              <Clock className="w-4 h-4" />
              <span className="text-sm">学习时长</span>
            </div>
            <div className="text-2xl font-bold text-green-600">{stats.totalHours}+ 小时</div>
          </div>
          <div className="bg-white rounded-xl p-4 border">
            <div className="text-sm text-gray-500 mb-1">难度分布</div>
            <div className="flex gap-2 text-xs">
              <span className="px-2 py-1 bg-green-100 text-green-700 rounded">
                入门 {stats.beginnerCourses}
              </span>
              <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded">
                进阶 {stats.intermediateCourses}
              </span>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border">
            <div className="text-sm text-gray-500 mb-1">学习建议</div>
            <div className="text-sm text-blue-600">
              根据岗位匹配度推荐
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="搜索课程或技能..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
              />
            </div>
            <div className="flex gap-2">
              {['all', 'beginner', 'intermediate', 'advanced'].map((level) => (
                <button
                  key={level}
                  onClick={() => setSelectedLevel(level)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedLevel === level
                      ? level === 'all'
                        ? 'bg-blue-600 text-white'
                        : getLevelColor(level) + ' border-2 border-current'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {level === 'all' ? '全部' : getLevelLabel(level)}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-xl border overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${getLevelColor(
                        course.level
                      )}`}
                    >
                      {getLevelLabel(course.level)}
                    </span>
                  </div>
                  {course.rating && (
                    <div className="flex items-center gap-1 text-yellow-500">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="text-sm font-medium">{course.rating}</span>
                    </div>
                  )}
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {course.title}
                </h3>
                <p className="text-sm text-gray-500 mb-4">{course.platform}</p>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {course.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {course.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{course.duration}</span>
                  </div>
                </div>

                <a
                  href={course.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <Button className="w-full gap-2">
                    <Play className="w-4 h-4" />
                    开始学习
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </a>
              </div>
            </div>
          ))}
        </div>

        {filteredCourses.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <BookOpen className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p className="text-lg mb-2">暂无匹配的课程</p>
            <p className="text-sm">试试其他搜索条件</p>
          </div>
        )}

        <div className="mt-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-8 text-white">
          <h2 className="text-2xl font-bold mb-4">个性化学习推荐</h2>
          <p className="text-blue-100 mb-6">
            完成简历分析后，我们将根据你的技能缺口和目标岗位，智能推荐最合适的学习路径。
          </p>
          <div className="flex gap-4">
            <Link href="/resume">
              <Button className="bg-white text-blue-600 hover:bg-blue-50">
                分析简历
              </Button>
            </Link>
            <Link href="/path">
              <Button variant="outline" className="text-white border-white hover:bg-white/10">
                查看技能路径
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
