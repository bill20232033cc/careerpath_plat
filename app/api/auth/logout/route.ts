import { apiSuccess } from '@/lib/utils';

export async function POST() {
  return apiSuccess({ message: '已退出登录' });
}
