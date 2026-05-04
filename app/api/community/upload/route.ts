export const dynamic = 'force-dynamic';

import { writeFile } from 'fs/promises';
import { join } from 'path';
import { apiSuccess, apiError } from '@/lib/utils';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) return apiError('COMMUNITY001', '未上传文件', 400);
    if (!file.type.startsWith('image/')) return apiError('COMMUNITY001', '仅支持图片文件', 400);
    if (file.size > 5 * 1024 * 1024) return apiError('COMMUNITY001', '图片大小不能超过 5MB', 400);

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filename = `${Date.now()}-${file.name}`;
    const uploadDir = join(process.cwd(), 'public', 'uploads');
    const filepath = join(uploadDir, filename);

    await writeFile(filepath, buffer);

    return apiSuccess({ url: `/uploads/${filename}` });
  } catch (error) {
    console.error('[图片上传失败]', error);
    return apiError('COMMUNITY001', '图片上传失败', 500);
  }
}
