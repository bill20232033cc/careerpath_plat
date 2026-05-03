import { NextResponse } from 'next/server';
import { callDeepSeek } from '@/lib/deepseek';
import { apiSuccess, apiError } from '@/lib/utils';

const systemPrompt = `你是职业学习路径规划专家。根据用户简历和目标岗位，生成技能学习路径。

返回 JSON：
{
  "title": "路径标题",
  "nodes": [
    {
      "title": "技能名称",
      "description": "技能描述",
      "level": 0-100,
      "duration": "2周",
      "resources": ["课程1", "课程2"],
      "tips": "学习建议"
    }
  ]
}

只返回 JSON。`;

const fallbackPath = {
  title: 'React 前端进阶路径',
  nodes: [
    { title: 'JavaScript 高级', description: '闭包、原型链、异步编程', level: 20, duration: '2周', resources: ['MDN JavaScript 高级', 'JavaScript 高级程序设计'], tips: '动手写示例代码' },
    { title: 'React 性能优化', description: '虚拟列表、懒加载、useMemo', level: 40, duration: '3周', resources: ['React 性能优化指南', '高性能 React'], tips: '使用 React DevTools 分析' },
    { title: 'TypeScript 进阶', description: '泛型、装饰器、类型体操', level: 60, duration: '2周', resources: ['TypeScript 官方文档', 'TypeScript 从入门到精通'], tips: '类型体操练习网站' },
    { title: '状态管理', description: 'Zustand、Jotai、Redux', level: 75, duration: '3周', resources: ['Zustand 官方文档', 'Redux 官方文档'], tips: '对比不同方案' },
    { title: '工程化', description: 'CI/CD、打包优化、性能监控', level: 90, duration: '2周', resources: ['GitHub Actions 入门', 'Webpack 官方文档'], tips: '在真实项目中实践' }
  ]
};

export async function POST(request: Request) {
  try {
    const { resume, targetJob } = await request.json();

    let aiResponse: string | null = null;
    try {
      aiResponse = await callDeepSeek([
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `简历：${resume}\n目标岗位：${targetJob}` }
      ], { temperature: 0.6, maxTokens: 3000 });
    } catch (aiError) {
      console.error('AI 调用失败，使用 fallback:', aiError);
      return apiSuccess({ path: fallbackPath, poweredBy: 'DeepSeek (fallback)' });
    }

    let pathData;
    try {
      pathData = JSON.parse(aiResponse || '{}');
    } catch {
      return apiSuccess({ path: fallbackPath, poweredBy: 'DeepSeek (fallback)' });
    }

    return apiSuccess({ path: pathData, poweredBy: 'DeepSeek' });
  } catch (error) {
    console.error('生成路径失败:', error);
    return apiError('PATH001', '生成路径失败', 500);
  }
}
