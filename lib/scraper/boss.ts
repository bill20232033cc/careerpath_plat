import { chromium } from 'playwright'

export type JobSource = 'boss' | 'lagou'

export interface ScrapedJob {
  id: string
  title: string
  company: string
  location: string
  salary: string
  experience: string
  education: string
  description: string
  requirements: string[]
  skills: string[]
  source: JobSource
  sourceUrl: string
  postedAt: string
}

export async function scrapeBossZhipin(keyword: string, city: string = '101010100'): Promise<ScrapedJob[]> {
  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  })
  const page = await context.newPage()

  try {
    const url = `https://www.zhipin.com/web/geek/job?query=${encodeURIComponent(keyword)}&city=${city}`
    await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 })

    await page.waitForSelector('.job-card-wrapper', { timeout: 15000 })

    const jobs = await page.evaluate(() => {
      const cards = document.querySelectorAll('.job-card-wrapper')
      return Array.from(cards).slice(0, 10).map((card, index) => {
        const title = card.querySelector('.job-name')?.textContent?.trim() || ''
        const company = card.querySelector('.company-name')?.textContent?.trim() || ''
        const salary = card.querySelector('.salary')?.textContent?.trim() || ''
        const location = card.querySelector('.job-area')?.textContent?.trim() || ''
        const experience = card.querySelector('.job-info .tag-list li:nth-child(1)')?.textContent?.trim() || ''
        const education = card.querySelector('.job-info .tag-list li:nth-child(2)')?.textContent?.trim() || ''
        const skills = Array.from(card.querySelectorAll('.job-card-footer .tag-list li')).map(li => li.textContent?.trim() || '')

        return {
          id: `boss-${index}`,
          title,
          company,
          location,
          salary,
          experience,
          education,
          description: `${title}，${company}，${salary}，${location}`,
          requirements: [],
          skills: skills.filter(Boolean),
          source: 'boss' as const,
          sourceUrl: '',
          postedAt: new Date().toISOString(),
        }
      })
    })

    return jobs
  } catch (error) {
    console.error('[Boss直聘爬虫失败]', error)
    return []
  } finally {
    await browser.close()
  }
}
