import { NextResponse } from 'next/server';
import { callDeepSeek } from '@/lib/deepseek';
import { apiSuccess, apiError } from '@/lib/utils';
import { validateResumeText } from '@/lib/validators';

const systemPrompt = `你是专业的职业规划顾问。请分析用户简历，返回 JSON 格式：

{
  "strengths": ["优势1", "优势2"],
  "weaknesses": ["短板1", "短板2"],
  "matchScores": {
    "岗位名称1": 85,
    "岗位名称2": 70,
    "岗位名称3": 60
  },
  "suggestions": ["提升建议1", "提升建议2"]
}

只返回 JSON，无额外文本。`;

const fallback = {
  strengths: ['前端开发能力强', '项目经验丰富', '学习能力快'],
  weaknesses: ['后端经验不足', '系统设计薄弱', '云部署经验少'],
  matchScores: {
    '前端工程师': 85,
    '全栈开发工程师': 70,
    'React 开发工程师': 60
  },
  suggestions: ['学习 Node.js 后端技术', '提升系统架构设计能力', '积累云部署经验']
};

export async function POST(request: Request) {
  try {
    const { text } = await request.json();

    const validationError = validateResumeText(text);
    if (validationError) {
      return apiError('RESUME001', validationError, 400);
    }

    let aiResponse: string | null = null;
    try {
      aiResponse = await callDeepSeek([
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `请分析以下简历：\n${text}` }
      ], { temperature: 0.5 });
    } catch (aiError) {
      console.error('AI 调用失败，使用 fallback:', aiError);
      return apiSuccess({ analysis: fallback, poweredBy: 'DeepSeek (fallback)' });
    }

    let analysis;
    try {
      analysis = JSON.parse(aiResponse || '{}');
    } catch {
      return apiSuccess({ analysis: fallback, poweredBy: 'DeepSeek (fallback)' });
    }

    return apiSuccess({ analysis, poweredBy: 'DeepSeek' });
  } catch (error) {
    console.error('AI 分析失败:', error);
    return apiError('RESUME002', 'AI 分析失败', 500);
  }
}
