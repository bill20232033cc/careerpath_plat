import { prisma } from '@/lib/prisma'
import { apiSuccess, apiError } from '@/lib/utils'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId')
  if (!userId) return apiError('AUTH001', '缺少用户ID', 400)

  try {
    const histories = await prisma.pathGenerationHistory.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    })
    return apiSuccess(histories)
  } catch (error) {
    console.error('[获取路径历史失败]', error)
    return apiError('PROFILE001', '获取路径历史失败', 500)
  }
}
