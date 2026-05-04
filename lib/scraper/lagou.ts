import { chromium } from 'playwright'
import { ScrapedJob } from './boss'

export async function scrapeLagou(keyword: string): Promise<ScrapedJob[]> {
  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  })
  const page = await context.newPage()

  try {
    const url = `https://www.lagou.com/wn/jobs?kd=${encodeURIComponent(keyword)}`
    await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 })

    await page.waitForSelector('.item__10RTO', { timeout: 15000 })

    const jobs = await page.evaluate(() => {
      const cards = document.querySelectorAll('.item__10RTO')
      return Array.from(cards).slice(0, 10).map((card, index) => {
        const title = card.querySelector('.p-top__1F7CL a')?.textContent?.trim() || ''
        const company = card.querySelector('.company-name__2-SjF')?.textContent?.trim() || ''
        const salary = card.querySelector('.money__3Lkgq')?.textContent?.trim() || ''
        const location = card.querySelector('.p-top__1F7CL span')?.textContent?.trim() || ''
        const requirements = Array.from(card.querySelectorAll('.p-bom__JlNuk li')).map(li => li.textContent?.trim() || '')

        return {
          id: `lagou-${index}`,
          title,
          company,
          location,
          salary,
          experience: requirements[0] || '',
          education: requirements[1] || '',
          description: `${title}，${company}，${salary}，${location}`,
          requirements: requirements.filter(Boolean),
          skills: [] as string[],
          source: 'lagou' as const,
          sourceUrl: '',
          postedAt: new Date().toISOString(),
        }
      })
    })

    return jobs
  } catch (error) {
    console.error('[拉勾爬虫失败]', error)
    return []
  } finally {
    await browser.close()
  }
}
