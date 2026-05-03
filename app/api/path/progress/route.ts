import { readData, writeData } from '@/lib/data'
import { apiSuccess, apiError } from '@/lib/utils'
import { LearningPath } from '@/lib/types'

export async function POST(request: Request) {
  try {
    const { pathId, skillNodeId, status } = await request.json()
    if (!pathId || !skillNodeId || !status) {
      return apiError('PATH001', '缺少必要参数', 400)
    }

    const paths = readData<LearningPath>('paths')
    const pathIndex = paths.findIndex((p) => p.id === pathId)
    if (pathIndex === -1) {
      return apiError('PATH001', '技能路径不存在', 404)
    }

    const nodeIndex = paths[pathIndex].skillNodes.findIndex((n) => n.id === skillNodeId)
    if (nodeIndex === -1) {
      return apiError('PATH001', '技能节点不存在', 404)
    }

    paths[pathIndex].skillNodes[nodeIndex] = {
      ...paths[pathIndex].skillNodes[nodeIndex],
      status,
      completedAt: status === 'completed' ? new Date().toISOString() : undefined,
    }
    await writeData('paths', paths)

    return apiSuccess({ message: '进度已更新' })
  } catch (error) {
    console.error('[更新进度失败]', error)
    return apiError('PATH001', '更新进度失败', 500)
  }
}
