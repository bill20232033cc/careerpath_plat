import { apiSuccess } from '@/lib/utils';

export async function GET() {
  return apiSuccess({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '0.1.0',
  });
}
