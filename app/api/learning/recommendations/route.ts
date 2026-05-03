import { readData } from '@/lib/data'
import { apiSuccess } from '@/lib/utils'
import { Course } from '@/lib/types'

export async function GET() {
  const courses = readData<Course>('courses')
  const recommendations = courses.slice(0, 6).map((course) => ({
    ...course,
    reason: `基于你的技能缺口推荐：${course.skills.join('、')}`,
  }))
  return apiSuccess(recommendations)
}
