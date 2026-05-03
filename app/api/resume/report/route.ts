export const dynamic = 'force-dynamic';

import { readData } from '@/lib/data';
import { apiSuccess, apiError } from '@/lib/utils';
import { Resume } from '@/lib/types';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return apiError('AUTH001', '缺少 userId 参数', 400);
    }

    const resumes = readData<Resume>('resumes');
    const resume = resumes.find((r) => r.userId === userId);

    if (!resume || !resume.analysisReport) {
      return apiError('RESUME001', '未找到简历分析报告', 404);
    }

    return apiSuccess(resume.analysisReport);
  } catch (error) {
    console.error('[获取简历报告失败]', error);
    return apiError('RESUME002', '获取简历报告失败', 500);
  }
}
