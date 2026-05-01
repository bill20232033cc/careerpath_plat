'use client';

import { useState } from 'react';
import { ArrowLeft, Search, Filter, MapPin, DollarSign, Briefcase, GraduationCap, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { JobCard } from '@/components/jobs/JobCard';
import { Job } from '@/lib/types';

const MOCK_JOBS: Job[] = [
  {
    id: '1',
    title: '前端工程师',
    company: '字节跳动',
    location: '北京',
    salary: '25K-40K',
    experience: '3-5年',
    education: '本科',
    jobType: 'full-time',
    source: 'boss',
    description: '负责公司核心产品的前端开发工作，参与技术架构设计与优化。',
    requirements: ['React', 'TypeScript', 'Node.js'],
    skills: ['React', 'TypeScript', 'Node.js', 'Git', 'CSS', 'HTML', 'Webpack'],
    benefits: ['六险一金', '免费三餐', '弹性工作', '股票期权'],
    postedAt: '2026-04-28',
  },
  {
    id: '2',
    title: '全栈工程师',
    company: '腾讯',
    location: '深圳',
    salary: '30K-50K',
    experience: '5-10年',
    education: '本科',
    jobType: 'full-time',
    source: 'lagou',
    description: '参与公司云服务产品开发，负责核心模块设计与实现。',
    requirements: ['Vue/React', 'Python/Go', '数据库'],
    skills: ['Vue', 'Python', 'PostgreSQL', 'Docker', 'K8s', 'Redis'],
    benefits: ['股票期权', '年度旅游', '带薪年假', '免费健身'],
    postedAt: '2026-04-27',
  },
  {
    id: '3',
    title: 'React 开发工程师',
    company: '阿里巴巴',
    location: '杭州',
    salary: '35K-55K',
    experience: '3-5年',
    education: '本科',
    jobType: 'full-time',
    source: 'zhilian',
    description: '参与电商平台前端架构设计与开发，打造高性能用户体验。',
    requirements: ['React', 'Redux', '性能优化'],
    skills: ['React', 'Redux', 'TypeScript', 'Webpack', '性能优化', '微前端'],
    benefits: ['股票期权', '免费班车', '年度体检', '子女教育'],
    postedAt: '2026-04-26',
  },
  {
    id: '4',
    title: '前端实习生',
    company: '美团',
    location: '北京',
    salary: '200-300/天',
    experience: '在读学生',
    education: '本科',
    jobType: 'intern',
    source: 'boss',
    description: '参与美团外卖前端业务开发，有导师带教。',
    requirements: ['HTML/CSS', 'JavaScript', 'React/Vue'],
    skills: ['HTML', 'CSS', 'JavaScript', 'React', 'Git'],
    benefits: ['免费三餐', '转正机会', '弹性工作'],
    postedAt: '2026-04-25',
  },
  {
    id: '5',
    title: '高级前端工程师',
    company: '拼多多',
    location: '上海',
    salary: '40K-70K',
    experience: '5-10年',
    education: '本科',
    jobType: 'full-time',
    source: '51job',
    description: '负责拼多多核心交易链路前端开发，技术引领创新。',
    requirements: ['React', '架构设计', '性能优化', '团队管理'],
    skills: ['React', 'TypeScript', 'Node.js', '架构设计', '性能优化', '团队协作'],
    benefits: ['股票期权', '免费食宿', '高额年终奖'],
    postedAt: '2026-04-24',
  },
];

export default function JobsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [jobs] = useState<Job[]>(MOCK_JOBS);

  const filteredJobs = jobs.filter(
    (job) =>
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getMatchScore = (job: Job) => {
    const baseScore = Math.floor(Math.random() * 30) + 60;
    return baseScore;
  };

  if (selectedJob) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <button
            onClick={() => setSelectedJob(null)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            返回岗位列表
          </button>

          <div className="bg-white rounded-xl border overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-2xl font-bold mb-2">{selectedJob.title}</h1>
                  <p className="text-blue-100">{selectedJob.company}</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">{selectedJob.salary}</div>
                  <div className="text-blue-200 text-sm">{selectedJob.location}</div>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center gap-2 text-gray-600">
                  <Briefcase className="w-4 h-4" />
                  <span>{selectedJob.experience}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <GraduationCap className="w-4 h-4" />
                  <span>{selectedJob.education}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span>{selectedJob.location}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <DollarSign className="w-4 h-4" />
                  <span>{selectedJob.salary}</span>
                </div>
              </div>

              <div>
                <h2 className="font-semibold mb-3">职位描述</h2>
                <p className="text-gray-600">{selectedJob.description}</p>
              </div>

              <div>
                <h2 className="font-semibold mb-3">技能要求</h2>
                <div className="flex flex-wrap gap-2">
                  {selectedJob.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="font-semibold mb-3">福利待遇</h2>
                <div className="flex flex-wrap gap-2">
                  {selectedJob.benefits.map((benefit) => (
                    <span
                      key={benefit}
                      className="flex items-center gap-1 px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm"
                    >
                      <CheckCircle2 className="w-3 h-3" />
                      {benefit}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t">
                <Button className="w-full" size="lg">
                  投递简历
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
            <h1 className="text-3xl font-bold text-gray-900">岗位推荐</h1>
            <p className="text-gray-600">发现适合你的理想工作</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border mb-6">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="搜索岗位、公司或技能..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
              />
            </div>
            <Button variant="outline" className="gap-2">
              <Filter className="w-4 h-4" />
              筛选
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          {filteredJobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              matchScore={getMatchScore(job)}
              onClick={() => setSelectedJob(job)}
            />
          ))}
        </div>

        {filteredJobs.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <p className="text-lg mb-2">暂无匹配的岗位</p>
            <p className="text-sm">试试其他关键词</p>
          </div>
        )}
      </div>
    </div>
  );
}
