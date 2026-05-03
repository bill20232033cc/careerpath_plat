import { readData, writeData } from '@/lib/data';
import { apiSuccess, apiError } from '@/lib/utils';
import { Job, User } from '@/lib/types';

export async function POST(request: Request) {
  try {
    const { jobId, userId } = await request.json();
    if (!jobId || !userId) {
      return apiError('JOB001', '缺少必要参数', 400);
    }

    const jobs = readData<Job>('jobs');
    const job = jobs.find((j) => j.id === jobId);
    if (!job) {
      return apiError('JOB001', '岗位不存在', 404);
    }

    const users = readData<User>('users');
    const userIndex = users.findIndex((u) => u.id === userId);
    if (userIndex === -1) {
      return apiError('AUTH001', '用户不存在', 404);
    }

    users[userIndex] = {
      ...users[userIndex],
      title: job.title,
      updatedAt: new Date().toISOString(),
    };
    await writeData('users', users);

    return apiSuccess({ message: '目标岗位已确认', job });
  } catch (error) {
    console.error('[确认目标岗位失败]', error);
    return apiError('JOB002', '确认目标岗位失败', 500);
  }
}
