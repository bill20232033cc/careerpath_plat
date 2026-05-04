export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { apiSuccess, apiError } from '@/lib/utils';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return apiError('RESUME001', '未上传文件', 400);
    }

    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      return apiError('RESUME001', '仅支持 PDF 和 Word (.docx) 文件', 400);
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    let text = '';

    if (file.type === 'application/pdf') {
      const pdfParse = await import('pdf-parse');
      const pdfData = await (pdfParse as any).PDFParse(buffer);
      text = pdfData.text;
    } else {
      const mammoth = await import('mammoth');
      const docxResult = await mammoth.extractRawText({ buffer });
      text = docxResult.value;
    }

    if (!text.trim()) {
      return apiError('RESUME001', '无法从文件中提取文本', 400);
    }

    return apiSuccess({ text, filename: file.name });
  } catch (error) {
    console.error('[文件解析失败]', error);
    return apiError('RESUME002', '文件解析失败', 500);
  }
}
