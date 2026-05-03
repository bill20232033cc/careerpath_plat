import { readData } from '@/lib/data'
import { apiSuccess, apiError } from '@/lib/utils'
import { LearningPath } from '@/lib/types'

export async function GET(
  request: Request,
  { params }: { params: { jobId: string } }
) {
  const paths = readData<LearningPath>('paths')
  const path = paths.find((p) => p.jobId === params.jobId)
  if (!path) {
    return apiError('PATH001', '技能路径不存在', 404)
  }
  return apiSuccess(path)
}
