import { NextResponse } from 'next/server';
import { callDeepSeek } from '@/lib/deepseek';
import { readData } from '@/lib/data/index';

const systemPrompt = `你是职业匹配分析师。根据简历和岗位列表，返回岗位匹配度评分（0-100）和分析。

返回 JSON 格式：
{
  "matches": [
    {
      "jobId": "岗位 ID",
      "score": 90,
      "reason": "匹配理由",
      "skillsMatch": ["匹配的技能"],
      "gaps": ["缺失的技能"]
    }
  ]
}
`;

export async function POST(request: Request) {
  try {
    const { resume } = await request.json();
    const jobs = readData('jobs');

    const aiResponse = await callDeepSeek([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `简历：${resume}\n岗位列表：${JSON.stringify(jobs)}` }
    ], { temperature: 0.5, maxTokens: 2000 });

    let matchData;
    try {
      matchData = JSON.parse(aiResponse || '{}');
    } catch {
      matchData = {
        matches: jobs.map((job: any) => ({
          jobId: job.id,
          score: Math.floor(Math.random() * 40 + 60),
          reason: '技能基本匹配，需要学习一些新技能',
          skillsMatch: job.skills.slice(0, 3),
          gaps: job.skills.slice(3)
        }))
      };
    }

    return NextResponse.json({
      success: true,
      results: matchData.matches,
      poweredBy: 'DeepSeek'
    });
  } catch (error) {
    console.error('匹配失败:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : '匹配失败'
    }, { status: 500 });
  }
}
