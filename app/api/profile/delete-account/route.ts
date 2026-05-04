import { prisma } from '@/lib/prisma'
import { apiSuccess, apiError } from '@/lib/utils'

export async function POST(request: Request) {
  try {
    const { userId } = await request.json()
    if (!userId) return apiError('AUTH001', '缺少用户ID', 400)

    await prisma.$transaction([
      prisma.resumeAnalysisHistory.deleteMany({ where: { userId } }),
      prisma.pathGenerationHistory.deleteMany({ where: { userId } }),
      prisma.userAchievement.deleteMany({ where: { userId } }),
      prisma.learningProgress.deleteMany({ where: { userId } }),
      prisma.post.deleteMany({ where: { userId } }),
      prisma.resume.deleteMany({ where: { userId } }),
      prisma.user.delete({ where: { id: userId } }),
    ])

    return apiSuccess({ message: '账号已注销' })
  } catch (error) {
    console.error('[注销账号失败]', error)
    return apiError('PROFILE001', '注销账号失败', 500)
  }
}
