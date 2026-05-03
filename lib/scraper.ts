import * as cheerio from 'cheerio'

export interface ScrapedJob {
  title: string
  company: string
  location: string
  salary: string
  experience: string
  education: string
  jobType: 'full-time' | 'part-time' | 'intern'
  source: 'boss' | 'lagou' | 'zhilian' | '51job'
  description: string
  requirements: string[]
  skills: string[]
  benefits: string[]
  url: string
  postedAt: string
}

const SEARCH_QUERIES = [
  { keyword: '前端工程师', city: '全国' },
  { keyword: '后端工程师', city: '全国' },
  { keyword: '全栈工程师', city: '全国' },
  { keyword: 'React 开发', city: '全国' },
  { keyword: 'Java 开发', city: '全国' },
  { keyword: 'Python 开发', city: '全国' },
]

function buildBossUrl(keyword: string, city: string): string {
  const cityMap: Record<string, string> = { '全国': '100010000', '北京': '101010100', '上海': '101020100', '深圳': '101280100', '杭州': '101210100', '广州': '101280100' }
  const cityCode = cityMap[city] || '100010000'
  return `https://www.zhipin.com/web/geek/job?query=${encodeURIComponent(keyword)}&city=${cityCode}`
}

function buildLagouUrl(keyword: string): string {
  return `https://www.lagou.com/zhaopin/${encodeURIComponent(keyword)}/`
}

async function fetchWithTimeout(url: string, timeout = 10000): Promise<string> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeout)
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
      },
    })
    if (!res.ok) return ''
    return await res.text()
  } catch {
    return ''
  } finally {
    clearTimeout(timer)
  }
}

function parseBossJobs(html: string): ScrapedJob[] {
  const $ = cheerio.load(html)
  const jobs: ScrapedJob[] = []

  $('.job-list-wrapper .job-card-wrapper').each((_, el) => {
    try {
      const elem = $(el)
      const title = elem.find('.job-name').text().trim()
      const salary = elem.find('.salary').text().trim()
      const company = elem.find('.company-name a').text().trim()
      const tags = elem.find('.tag-list li').map((_, t) => $(t).text().trim()).get()
      const location = tags[0] || ''
      const experience = tags[1] || ''
      const education = tags[2] || ''
      const description = elem.find('.job-desc').text().trim()
      const skills = elem.find('.info-desc').text().trim().split(/[,，、]/).map(s => s.trim()).filter(Boolean)
      const url = elem.find('.job-card-left').attr('href') || ''
      const fullUrl = url.startsWith('http') ? url : `https://www.zhipin.com${url}`

      if (title && company) {
        jobs.push({
          title,
          company,
          location,
          salary: salary || '面议',
          experience,
          education,
          jobType: 'full-time',
          source: 'boss',
          description: description || `${title} - ${company}`,
          requirements: [],
          skills: skills.length > 0 ? skills : [title.split(' ')[0]],
          benefits: [],
          url: fullUrl,
          postedAt: new Date().toISOString().split('T')[0],
        })
      }
    } catch {}
  })

  return jobs
}

function parseLagouJobs(html: string): ScrapedJob[] {
  const $ = cheerio.load(html)
  const jobs: ScrapedJob[] = []

  $('.position_list .item_con_list li, .list_content_box .position_list_item').each((_, el) => {
    try {
      const elem = $(el)
      const title = elem.find('.position_name, .p-top a span').first().text().trim()
      const salary = elem.find('.salary, .money').text().trim()
      const company = elem.find('.company_name a, .industry').text().trim()
      const location = elem.find('.add em, .city').text().trim()
      const description = elem.find('.position_main_info, .pos-info').text().trim()

      if (title && company) {
        jobs.push({
          title,
          company,
          location: location || '全国',
          salary: salary || '面议',
          experience: '',
          education: '',
          jobType: 'full-time',
          source: 'lagou',
          description: description || `${title} - ${company}`,
          requirements: [],
          skills: [title.split(' ')[0]],
          benefits: [],
          url: elem.find('a').first().attr('href') || '',
          postedAt: new Date().toISOString().split('T')[0],
        })
      }
    } catch {}
  })

  return jobs
}

export async function scrapeJobs(
  keyword?: string,
  city?: string
): Promise<ScrapedJob[]> {
  const allJobs: ScrapedJob[] = []
  const queries = keyword
    ? [{ keyword, city: city || '全国' }]
    : SEARCH_QUERIES

  const tasks = queries.flatMap(q => [
    (async () => {
      const html = await fetchWithTimeout(buildBossUrl(q.keyword, q.city))
      if (html) allJobs.push(...parseBossJobs(html))
    })(),
    (async () => {
      const html = await fetchWithTimeout(buildLagouUrl(q.keyword))
      if (html) allJobs.push(...parseLagouJobs(html))
    })(),
  ])

  await Promise.allSettled(tasks)

  return allJobs.filter(j => j.title && j.company)
}

export function scrapedToJob(scraped: ScrapedJob, id: string): import('@/lib/types').Job {
  return {
    id,
    title: scraped.title,
    company: scraped.company,
    location: scraped.location,
    salary: scraped.salary,
    experience: scraped.experience,
    education: scraped.education,
    jobType: scraped.jobType,
    source: scraped.source,
    description: scraped.description,
    requirements: scraped.requirements,
    skills: scraped.skills,
    benefits: scraped.benefits,
    postedAt: scraped.postedAt,
  }
}
