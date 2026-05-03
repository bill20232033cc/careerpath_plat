import { readData } from '@/lib/data';
import { apiSuccess, apiError } from '@/lib/utils';
import { Job } from '@/lib/types';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const jobs = readData<Job>('jobs');
  const job = jobs.find((j) => j.id === params.id);
  if (!job) {
    return apiError('JOB001', '岗位不存在', 404);
  }
  return apiSuccess(job);
}
