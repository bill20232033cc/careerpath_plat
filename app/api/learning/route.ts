export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { readData } from '@/lib/data';
import { Course } from '@/lib/types';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const skill = searchParams.get('skill');
    const level = searchParams.get('level');

    let courses = readData<Course>('courses');

    if (skill) {
      const lowerSkill = skill.toLowerCase();
      courses = courses.filter((course) =>
        course.skills.some((s) => s.toLowerCase().includes(lowerSkill))
      );
    }

    if (level) {
      courses = courses.filter((course) => course.level === level);
    }

    return NextResponse.json({
      success: true,
      total: courses.length,
      courses,
    });
  } catch (error) {
    console.error('Courses fetch error:', error);
    return NextResponse.json({ error: '获取课程列表失败' }, { status: 500 });
  }
}
