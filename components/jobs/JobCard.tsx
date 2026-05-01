import { Briefcase, MapPin, DollarSign, Clock } from 'lucide-react';
import { Job } from '@/lib/types';

interface JobCardProps {
  job: Job;
  matchScore?: number;
  onClick: () => void;
}

export function JobCard({ job, matchScore, onClick }: JobCardProps) {
  const getMatchColor = (score: number) => {
    if (score >= 80) return 'bg-green-100 text-green-700 border-green-200';
    if (score >= 60) return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    return 'bg-gray-100 text-gray-600 border-gray-200';
  };

  const getSourceLabel = (source: string) => {
    const labels: Record<string, string> = {
      boss: 'Boss',
      lagou: '拉勾',
      zhilian: '智联',
      '51job': '前程',
    };
    return labels[source] || source;
  };

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl p-6 border hover:border-blue-300 hover:shadow-md transition-all cursor-pointer"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
            <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-xs rounded">
              {getSourceLabel(job.source)}
            </span>
          </div>
          <p className="text-gray-600">{job.company}</p>
        </div>
        {matchScore !== undefined && (
          <div
            className={`px-3 py-1 rounded-full text-sm font-medium border ${getMatchColor(matchScore)}`}
          >
            {matchScore}% 匹配
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-500 mb-4">
        <div className="flex items-center gap-1">
          <MapPin className="w-4 h-4" />
          <span>{job.location}</span>
        </div>
        <div className="flex items-center gap-1">
          <DollarSign className="w-4 h-4" />
          <span>{job.salary}</span>
        </div>
        <div className="flex items-center gap-1">
          <Briefcase className="w-4 h-4" />
          <span>{job.experience}</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="w-4 h-4" />
          <span>{job.postedAt}</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {job.skills.slice(0, 5).map((skill) => (
          <span
            key={skill}
            className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs"
          >
            {skill}
          </span>
        ))}
        {job.skills.length > 5 && (
          <span className="px-2 py-1 text-gray-400 text-xs">
            +{job.skills.length - 5}
          </span>
        )}
      </div>
    </div>
  );
}
