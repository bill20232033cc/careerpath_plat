export const dynamic = 'force-dynamic';

import { readData, writeData } from '@/lib/data';
import { Job } from '@/lib/types';
import { apiSuccess, apiError } from '@/lib/utils';
import { scrapeJobs, scrapedToJob } from '@/lib/scraper';
import { scrapeBossZhipin } from '@/lib/scraper/boss';
import { scrapeLagou } from '@/lib/scraper/lagou';
import { prisma } from '@/lib/prisma';

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
    const keyword = searchParams.get('keyword');

    if (refresh === 'true') {
      cachedJobs = null
      lastFetch = 0
    }

    // 当请求参数包含 keyword 时，调用 Playwright 爬虫获取真实数据
    if (keyword) {
      try {
        const [bossJobs, lagouJobs] = await Promise.allSettled([
          scrapeBossZhipin(keyword),
          scrapeLagou(keyword),
        ]);

        const realJobs = [
          ...(bossJobs.status === 'fulfilled' ? bossJobs.value : []),
          ...(lagouJobs.status === 'fulfilled' ? lagouJobs.value : []),
        ];

        if (realJobs.length > 0) {
          // 保存到数据库
          for (const job of realJobs) {
            await prisma.job.upsert({
              where: { id: job.id },
              update: {
                title: job.title,
                company: job.company,
                location: job.location,
                salary: job.salary,
                experience: job.experience,
                education: job.education,
                description: job.description,
                skills: JSON.stringify(job.skills),
                source: job.source,
                postedAt: job.postedAt,
              },
              create: {
                id: job.id,
                title: job.title,
                company: job.company,
                location: job.location,
                salary: job.salary,
                experience: job.experience,
                education: job.education,
                jobType: 'full-time',
                source: job.source,
                description: job.description,
                requirements: JSON.stringify(job.requirements),
                skills: JSON.stringify(job.skills),
                benefits: JSON.stringify([]),
                postedAt: job.postedAt,
              },
            });
          }

          // 转换为 Job 类型返回
          const jobs: Job[] = realJobs.map((j) => ({
            id: j.id,
            title: j.title,
            company: j.company,
            location: j.location,
            salary: j.salary,
            experience: j.experience,
            education: j.education,
            jobType: 'full-time',
            source: j.source,
            description: j.description,
            requirements: j.requirements,
            skills: j.skills,
            benefits: [],
            postedAt: j.postedAt,
          }));

          return apiSuccess(jobs);
        }
      } catch (error) {
        console.error('[爬虫获取岗位失败]', error);
      }
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
