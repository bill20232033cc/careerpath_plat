export const dynamic = 'force-dynamic';

import { readData } from '@/lib/data'
import { apiSuccess } from '@/lib/utils'
import { Course } from '@/lib/types'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const skill = searchParams.get('skill')
  const level = searchParams.get('level')

  let courses = readData<Course>('courses')
  if (skill) {
    courses = courses.filter((c) =>
      c.skills.some((s) => s.toLowerCase().includes(skill.toLowerCase()))
    )
  }
  if (level) {
    courses = courses.filter((c) => c.level === level)
  }

  return apiSuccess(courses)
}
