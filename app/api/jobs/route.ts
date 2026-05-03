export const dynamic = 'force-dynamic';

import { readData, writeData } from '@/lib/data';
import { Job } from '@/lib/types';
import { apiSuccess, apiError } from '@/lib/utils';
import { scrapeJobs, scrapedToJob } from '@/lib/scraper';

const CACHE_TTL = 30 * 60 * 1000; // 30 minutes
let cachedJobs: Job[] | null = null;
let lastFetch = 0;

async function getJobsWithRefresh(): Promise<Job[]> {
  const now = Date.now()
  const localJobs = readData<Job>('jobs')

  if (cachedJobs && now - lastFetch < CACHE_TTL) {
    return [...localJobs, ...cachedJobs]
  }

  try {
    const scraped = await scrapeJobs()
    if (scraped.length > 0) {
      cachedJobs = scraped.map((s, i) => scrapedToJob(s, `scraped-${i}-${Date.now()}`))
      lastFetch = now

      await writeData('jobs_scraped', cachedJobs)
      return [...localJobs, ...cachedJobs]
    }
  } catch (e) {
    console.error('[抓取岗位失败，使用缓存]', e)
  }

  const scraped = readData<Job>('jobs_scraped')
  return [...localJobs, ...scraped]
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const source = searchParams.get('source');
    const jobType = searchParams.get('type');
    const refresh = searchParams.get('refresh');

    if (refresh === 'true') {
      cachedJobs = null
      lastFetch = 0
    }

    let jobs = await getJobsWithRefresh();

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

    return apiSuccess(jobs);
  } catch (error) {
    console.error('Jobs fetch error:', error);
    return apiError('JOB002', '获取岗位列表失败', 500);
  }
}
