import { NextResponse } from 'next/server';
import { readData } from '@/lib/data';
import { Job } from '@/lib/types';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const source = searchParams.get('source');
    const jobType = searchParams.get('type');

    let jobs = readData<Job>('jobs');

    if (query) {
      const lowerQuery = query.toLowerCase();
      jobs = jobs.filter(
        (job) =>
          job.title.toLowerCase().includes(lowerQuery) ||
          job.company.toLowerCase().includes(lowerQuery) ||
          job.skills.some((s) => s.toLowerCase().includes(lowerQuery)) ||
          job.description.toLowerCase().includes(lowerQuery)
      );
    }

    if (source) {
      jobs = jobs.filter((job) => job.source === source);
    }

    if (jobType) {
      jobs = jobs.filter((job) => job.jobType === jobType);
    }

    return NextResponse.json({
      success: true,
      total: jobs.length,
      jobs,
    });
  } catch (error) {
    console.error('Jobs fetch error:', error);
    return NextResponse.json({ error: '获取岗位列表失败' }, { status: 500 });
  }
}
