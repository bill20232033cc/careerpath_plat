'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@radix-ui/react-dialog';
import {
  MapPin,
  DollarSign,
  Briefcase,
  GraduationCap,
  CheckCircle2,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Job } from '@/lib/types';
import { MatchBadge } from './MatchBadge';

interface JobDetailProps {
  job: Job | null;
  matchScore?: number;
  userId?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm?: () => void;
}

export function JobDetail({
  job,
  matchScore,
  userId,
  open,
  onOpenChange,
  onConfirm,
}: JobDetailProps) {
  const [confirming, setConfirming] = useState(false);

  if (!job) return null;

  const handleConfirm = async () => {
    if (!userId) return;
    setConfirming(true);
    try {
      const res = await fetch('/api/jobs/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobId: job.id, userId }),
      });
      const data = await res.json();
      if (data.success) {
        onConfirm?.();
        onOpenChange(false);
      } else {
        alert(data.error?.message || '确认失败');
      }
    } catch (error) {
      console.error('[确认目标岗位失败]', error);
      alert('确认失败，请重试');
    } finally {
      setConfirming(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="absolute inset-0 bg-black/50"
          onClick={() => onOpenChange(false)}
        />
        <div className="relative bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl">
          <button
            onClick={() => onOpenChange(false)}
            className="absolute right-4 top-4 p-1 rounded-full hover:bg-gray-100 transition-colors z-10"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>

          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-t-xl">
            <DialogTitle className="text-2xl font-bold mb-2">
              {job.title}
            </DialogTitle>
            <p className="text-blue-100">{job.company}</p>
            <div className="flex items-center gap-4 mt-4">
              <div className="text-2xl font-bold">{job.salary}</div>
              <div className="text-blue-200">{job.location}</div>
              {matchScore !== undefined && <MatchBadge score={matchScore} />}
            </div>
          </div>

          <div className="p-6 space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-2 text-gray-600">
                <Briefcase className="w-4 h-4" />
                <span>{job.experience}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <GraduationCap className="w-4 h-4" />
                <span>{job.education}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="w-4 h-4" />
                <span>{job.location}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <DollarSign className="w-4 h-4" />
                <span>{job.salary}</span>
              </div>
            </div>

            <div>
              <h2 className="font-semibold mb-3">职位描述</h2>
              <p className="text-gray-600">{job.description}</p>
            </div>

            <div>
              <h2 className="font-semibold mb-3">技能要求</h2>
              <div className="flex flex-wrap gap-2">
                {job.skills.map((skill) => (
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
                {job.benefits.map((benefit) => (
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
              <Button
                className="w-full"
                size="lg"
                onClick={handleConfirm}
                disabled={confirming || !userId}
              >
                {confirming ? '确认中...' : '确认目标'}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
