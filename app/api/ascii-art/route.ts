import { NextRequest, NextResponse } from 'next/server'
import { generateAsciiArt, getAvailableFonts } from '@/lib/ascii-art'

function extractAsciiPart(text: string): string {
  const asciiMatch = text.match(/[A-Za-z0-9\/\+\-#\.\!]+/g)
  if (asciiMatch && asciiMatch.length > 0) {
    return asciiMatch.join(' ')
  }
  return ''
}

function fallbackArt(name: string): string {
  const line = '═'.repeat(Math.max(name.length * 2 + 4, 20))
  const padded = name.padStart(Math.floor((line.length + name.length) / 2))
  return `╔${line}╗\n║${padded.slice(-line.length)}║\n╚${line}╝`
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { text, fontIndex } = body

    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { success: false, error: 'text 参数必填且为字符串' },
        { status: 400 }
      )
    }

    const index = typeof fontIndex === 'number' ? fontIndex : 0
    const asciiPart = extractAsciiPart(text)

    let asciiArt: string
    if (asciiPart) {
      asciiArt = generateAsciiArt(asciiPart, index)
    } else {
      asciiArt = fallbackArt(text)
    }

    return NextResponse.json({
      success: true,
      data: {
        asciiArt,
        font: getAvailableFonts()[index % getAvailableFonts().length],
        originalText: text,
        renderedText: asciiPart || text,
      },
    })
  } catch (error) {
    console.error('[ASCII Art 生成失败]', error)
    return NextResponse.json(
      { success: false, error: 'ASCII 艺术生成失败' },
      { status: 500 }
    )
  }
}
