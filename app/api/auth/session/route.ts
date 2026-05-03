import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { apiSuccess, apiError } from '@/lib/utils';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return apiError('AUTH002', '未登录', 401);
  }
  return apiSuccess(session);
}
