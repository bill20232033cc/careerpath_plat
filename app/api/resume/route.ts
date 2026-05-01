import { NextResponse } from 'next/server';
import { callDeepSeek } from '@/lib/deepseek';

const systemPrompt = `你是专业的职业规划顾问。请分析用户简历，返回 JSON 格式：

{
  "skills": ["技能1", "技能2"],
  "strengths": ["优势1", "优势2"],
  "weaknesses": ["短板1", "短板2"],
  "recommendedRoles": ["推荐岗位1", "推荐岗位2"],
  "improvements": ["提升建议1", "提升建议2"]
}

只返回 JSON，无额外文本。`;

export async function POST(request: Request) {
  try {
    const { text } = await request.json();

    const aiResponse = await callDeepSeek([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `请分析以下简历：\n${text}` }
    ], { temperature: 0.5 });

    let analysis;
    try {
      analysis = JSON.parse(aiResponse || '{}');
    } catch {
      analysis = {
        skills: ['JavaScript', 'React'],
        strengths: ['前端开发能力强', '项目经验丰富'],
        weaknesses: ['后端经验不足', '系统设计薄弱'],
        recommendedRoles: ['前端工程师', '全栈开发'],
        improvements: ['学习后端技术', '提升架构设计能力']
      };
    }

    return NextResponse.json({
      success: true,
      analysis,
      poweredBy: 'DeepSeek'
    });
  } catch (error) {
    console.error('AI 分析失败:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'AI 分析失败',
      fallback: {
        skills: ['JavaScript', 'React', 'TypeScript'],
        strengths: ['前端开发能力强', '项目经验丰富', '学习能力快'],
        weaknesses: ['后端经验不足', '系统设计薄弱', '云部署经验少'],
        recommendedRoles: ['前端工程师', '全栈开发工程师', 'React 开发工程师'],
        improvements: ['学习 Node.js 后端技术', '提升系统架构设计能力', '积累云部署经验']
      }
    }, { status: 500 });
  }
}
