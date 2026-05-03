'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { JobCard } from '@/components/jobs/JobCard';
import { JobSearch } from '@/components/jobs/JobSearch';
import { JobFilters, JobFilterValues } from '@/components/jobs/JobFilters';
import { JobDetail } from '@/components/jobs/JobDetail';
import { Job } from '@/lib/types';

export default function JobsPage() {
  const sessionData = useSession();
  const session = sessionData?.data;
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<JobFilterValues>({});

  const fetchJobs = async (query?: string, filterParams?: JobFilterValues) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (query) params.set('q', query);
      if (filterParams?.source) params.set('source', filterParams.source);
      if (filterParams?.jobType) params.set('type', filterParams.jobType);

      const res = await fetch(`/api/jobs?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        let result = data.data as Job[];
        if (filterParams?.location) {
          result = result.filter((j) => j.location === filterParams.location);
        }
        setJobs(result);
      } else {
        setJobs([]);
      }
    } catch (error) {
      console.error('[获取岗位列表失败]', error);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    fetchJobs(searchTerm, filters);
  }, [searchTerm, filters]);

  const getMatchScore = (job: Job) => {
    const baseScore = Math.floor(Math.random() * 30) + 60;
    return baseScore;
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handleFilter = (newFilters: JobFilterValues) => {
    setFilters(newFilters);
  };

  const handleJobClick = (job: Job) => {
    setSelectedJob(job);
    setDetailOpen(true);
  };

  const handleConfirm = () => {
    fetchJobs(searchTerm, filters);
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
            <h1 className="text-3xl font-bold text-gray-900">岗位推荐</h1>
            <p className="text-gray-600">发现适合你的理想工作</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border mb-6">
          <div className="flex gap-4">
            <JobSearch onSearch={handleSearch} />
            <JobFilters onFilter={handleFilter} />
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-500">
            <p className="text-lg">加载中...</p>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {jobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  matchScore={getMatchScore(job)}
                  onClick={() => handleJobClick(job)}
                />
              ))}
            </div>

            {jobs.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <p className="text-lg mb-2">暂无匹配的岗位</p>
                <p className="text-sm">试试其他关键词或筛选条件</p>
              </div>
            )}
          </>
        )}
      </div>

      <JobDetail
        job={selectedJob}
        matchScore={selectedJob ? getMatchScore(selectedJob) : undefined}
        userId={session?.user?.id}
        open={detailOpen}
        onOpenChange={setDetailOpen}
        onConfirm={handleConfirm}
      />
    </div>
  );
}
