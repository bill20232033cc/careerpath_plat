import { prisma } from '@/lib/prisma'
import { apiSuccess, apiError } from '@/lib/utils'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId')
  const format = searchParams.get('format') || 'text'
  if (!userId) return apiError('AUTH001', '缺少用户ID', 400)

  try {
    const [user, resumes, paths, achievements] = await Promise.all([
      prisma.user.findUnique({ where: { id: userId } }),
      prisma.resumeAnalysisHistory.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } }),
      prisma.pathGenerationHistory.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } }),
      prisma.userAchievement.findMany({ where: { userId }, include: { achievement: true } }),
    ])

    let content = ''
    if (format === 'markdown') {
      content = `# CareerPath 个人数据导出\n\n`
      content += `## 用户信息\n- 用户名：${user?.username}\n- 邮箱：${user?.email}\n- 积分：${user?.points} XP\n\n`
      content += `## 成就 (${achievements.length})\n`
      achievements.forEach((a) => {
        content += `- ${a.achievement.icon} ${a.achievement.name} (${a.achievement.points} XP) - ${new Date(a.unlockedAt).toLocaleDateString('zh-CN')}\n`
      })
      content += `\n## 简历分析历史 (${resumes.length})\n`
      resumes.forEach((r) => {
        content += `### ${new Date(r.createdAt).toLocaleDateString('zh-CN')}\n${r.analysisReport || '无分析报告'}\n\n`
      })
      content += `\n## 路径生成历史 (${paths.length})\n`
      paths.forEach((p) => {
        content += `- **${p.pathTitle}** (${p.targetJob}) - ${new Date(p.createdAt).toLocaleDateString('zh-CN')}\n`
      })
    } else {
      content = `CareerPath 个人数据导出\n====================\n\n`
      content += `用户名：${user?.username}\n邮箱：${user?.email}\n积分：${user?.points} XP\n\n`
      content += `成就 (${achievements.length}):\n`
      achievements.forEach((a) => {
        content += `  [${a.achievement.icon}] ${a.achievement.name} - ${a.achievement.points} XP\n`
      })
      content += `\n简历分析历史 (${resumes.length}):\n`
      resumes.forEach((r) => {
        content += `  ${new Date(r.createdAt).toLocaleDateString('zh-CN')}: ${r.analysisReport?.slice(0, 100) || '无分析报告'}...\n`
      })
      content += `\n路径生成历史 (${paths.length}):\n`
      paths.forEach((p) => {
        content += `  ${p.pathTitle} (${p.targetJob}) - ${new Date(p.createdAt).toLocaleDateString('zh-CN')}\n`
      })
    }

    return apiSuccess({ content, format })
  } catch (error) {
    console.error('[导出数据失败]', error)
    return apiError('PROFILE001', '导出数据失败', 500)
  }
}
