import { prisma } from '@/lib/prisma'
import { apiSuccess, apiError } from '@/lib/utils'

export async function POST(request: Request) {
  try {
    const { userId, courseId, progress } = await request.json()
    if (!userId || !courseId || progress === undefined) {
      return apiError('LEARNING001', '缺少必要参数', 400)
    }

    const updated = await prisma.learningProgress.upsert({
      where: { userId_courseId: { userId, courseId } },
      update: { progress, updatedAt: new Date() },
      create: { userId, courseId, progress },
    })

    return apiSuccess({ message: '学习进度已更新', progress: updated.progress })
  } catch (error) {
    console.error('[更新学习进度失败]', error)
    return apiError('LEARNING001', '更新学习进度失败', 500)
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId')
  if (!userId) return apiError('AUTH001', '缺少用户ID', 400)

  try {
    const progresses = await prisma.learningProgress.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
    })
    return apiSuccess(progresses)
  } catch (error) {
    console.error('[获取学习进度失败]', error)
    return apiError('LEARNING001', '获取学习进度失败', 500)
  }
}
