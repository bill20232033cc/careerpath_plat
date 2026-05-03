export const dynamic = 'force-dynamic';

import { NextRequest } from 'next/server';
import { apiSuccess, apiError } from '@/lib/utils';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return apiError('RESUME001', '请上传文件', 400);
    }

    const ext = file.name.split('.').pop()?.toLowerCase() || '';
    const allowedExts = ['txt', 'md', 'pdf', 'doc', 'docx'];

    if (!allowedExts.includes(ext)) {
      return apiError('RESUME001', `不支持的文件格式: .${ext}，支持 ${allowedExts.join(', ')}`, 400);
    }

    if (file.size > 10 * 1024 * 1024) {
      return apiError('RESUME001', '文件大小不能超过 10MB', 400);
    }

    let text = '';

    if (ext === 'txt' || ext === 'md') {
      text = await file.text();
    } else if (ext === 'pdf') {
      text = await parsePdf(file);
    } else if (ext === 'docx' || ext === 'doc') {
      text = await parseDocx(file);
    }

    if (!text || text.trim().length === 0) {
      return apiError('RESUME002', '无法从文件中提取文本，请尝试直接粘贴简历内容', 400);
    }

    return apiSuccess({ text, fileName: file.name, charCount: text.length });
  } catch (error) {
    console.error('[文件解析失败]', error);
    return apiError('RESUME002', '文件解析失败，请尝试直接粘贴简历内容', 500);
  }
}

async function parsePdf(file: File): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());
  const pdfParse = await import('pdf-parse');
  const result = await (pdfParse as any).default(buffer);
  return result.text;
}

async function parseDocx(file: File): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());
  const mammoth = await import('mammoth');
  const result = await mammoth.extractRawText({ buffer });
  return result.value;
}
