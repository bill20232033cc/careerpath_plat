import figlet from 'figlet'

const FIGLET_FONTS: figlet.Fonts[] = [
  'Standard',
  'Slant',
  'Banner',
  'Big',
  'Block',
  'Digital',
  'Shadow',
  'ANSI Shadow',
  'Star Wars',
  'Ghost',
]

const LEVEL_COLORS_DARK: Record<string, string> = {
  beginner: 'text-green-400',
  intermediate: 'text-blue-400',
  advanced: 'text-purple-400',
}

const LEVEL_COLORS_LIGHT: Record<string, string> = {
  beginner: 'text-green-700',
  intermediate: 'text-blue-700',
  advanced: 'text-purple-700',
}

export function getLevelColor(level: string, dark: boolean = false): string {
  return (dark ? LEVEL_COLORS_DARK : LEVEL_COLORS_LIGHT)[level] || 'text-gray-500'
}

export function getAsciiArtSync(
  text: string,
  font: figlet.Fonts = 'Standard'
): string {
  try {
    const result = figlet.textSync(text, {
      font,
      horizontalLayout: 'default',
      verticalLayout: 'default',
    })
    return result || text
  } catch {
    return text
  }
}

export function generateAsciiArt(
  text: string,
  fontIndex: number = 0
): string {
  const font = FIGLET_FONTS[fontIndex % FIGLET_FONTS.length]
  return getAsciiArtSync(text, font)
}

export function getFontForIndex(index: number): figlet.Fonts {
  return FIGLET_FONTS[index % FIGLET_FONTS.length]
}

export function getAvailableFonts(): figlet.Fonts[] {
  return [...FIGLET_FONTS]
}
