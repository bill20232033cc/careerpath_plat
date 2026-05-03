import { readData, writeData } from '@/lib/data'
import { apiSuccess, apiError } from '@/lib/utils'

interface LearningProgress {
  userId: string
  courseId: string
  progress: number
  updatedAt: string
}

export async function POST(request: Request) {
  try {
    const { userId, courseId, progress } = await request.json()
    if (!userId || !courseId || progress === undefined) {
      return apiError('LEARNING001', '缺少必要参数', 400)
    }

    const progresses = readData<LearningProgress>('learningProgress') || []
    const existingIndex = progresses.findIndex(
      (p) => p.userId === userId && p.courseId === courseId
    )

    const newProgress = {
      userId,
      courseId,
      progress,
      updatedAt: new Date().toISOString(),
    }
    if (existingIndex >= 0) {
      progresses[existingIndex] = newProgress
    } else {
      progresses.push(newProgress)
    }

    await writeData('learningProgress', progresses)
    return apiSuccess({ message: '学习进度已更新' })
  } catch (error) {
    console.error('[更新学习进度失败]', error)
    return apiError('LEARNING001', '更新学习进度失败', 500)
  }
}
