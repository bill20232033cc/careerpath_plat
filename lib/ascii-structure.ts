export interface SkillStructureConfig {
  type: 'flow' | 'tree' | 'constellation';
  title: string;
}

export function getSkillStructureConfig(level: string): SkillStructureConfig {
  if (level === 'beginner') {
    return { type: 'flow', title: '技能流程' };
  }
  if (level === 'intermediate') {
    return { type: 'tree', title: '技能树' };
  }
  return { type: 'constellation', title: '技能星图' };
}

export function generateSkillFlow(
  skills: { name: string; status: string }[],
  currentIndex: number
): string {
  const lines: string[] = [];
  const maxNameLen = Math.max(...skills.map((s) => s.name.length), 6);
  const boxWidth = maxNameLen + 4;

  lines.push('┌' + '─'.repeat(boxWidth) + '┐');
  lines.push('│' + ' 技能路径 '.padStart(Math.floor((boxWidth + 6) / 2)).slice(-boxWidth) + '│');
  lines.push('└' + '─'.repeat(boxWidth) + '┘');
  lines.push('');

  skills.forEach((skill, i) => {
    const icon = skill.status === 'completed' ? '✓'
      : skill.status === 'current' ? '▶'
      : '○';
    const marker = i === currentIndex ? ' ◀' : '  ';
    const name = skill.name.padEnd(maxNameLen);
    const statusTag = skill.status === 'completed' ? '[done]'
      : skill.status === 'current' ? '[now]'
      : '[todo]';

    if (i === currentIndex) {
      lines.push(`  ╔${'═'.repeat(boxWidth)}╗`);
      lines.push(`  ║ ${icon} ${name} ${statusTag} ║${marker}`);
      lines.push(`  ╚${'═'.repeat(boxWidth)}╝`);
    } else {
      const dimIcon = skill.status === 'completed' ? '✓' : '·';
      lines.push(`  ┌${'─'.repeat(boxWidth)}┐`);
      lines.push(`  │ ${dimIcon} ${name} ${statusTag} │${marker}`);
      lines.push(`  └${'─'.repeat(boxWidth)}┘`);
    }

    if (i < skills.length - 1) {
      const connector = i < currentIndex ? '  │' : '  ┊';
      lines.push(connector);
      lines.push(connector + '  ▼');
      lines.push(connector);
    }
  });

  return lines.join('\n');
}

export function generateSkillTree(
  skill: { name: string; level: string; status: string },
  prerequisites: string[],
  unlocks: string[]
): string {
  const lines: string[] = [];
  const centerName = `◆ ${skill.name} ◆`;

  lines.push('');
  if (prerequisites.length > 0) {
    prerequisites.forEach((pre, i) => {
      const prefix = i === prerequisites.length - 1 ? '  └──' : '  ├──';
      lines.push(`${prefix} ${pre}`);
    });
    lines.push('      │');
    lines.push('      ▼');
  }

  lines.push(`  ╔${'═'.repeat(centerName.length + 2)}╗`);
  lines.push(`  ║ ${centerName} ║`);
  lines.push(`  ╚${'═'.repeat(centerName.length + 2)}╝`);

  if (unlocks.length > 0) {
    lines.push('      │');
    lines.push('      ▼');
    unlocks.forEach((unlock, i) => {
      const prefix = i === unlocks.length - 1 ? '  └──' : '  ├──';
      lines.push(`${prefix} ${unlock}`);
    });
  }

  return lines.join('\n');
}

export function generateSkillConstellation(
  skill: { name: string; level: string },
  relatedSkills: { name: string; distance: number }[]
): string {
  const lines: string[] = [];
  const centerName = skill.name;

  lines.push('');
  lines.push(`          ✦ ${centerName} ✦`);
  lines.push('          ╱  │  ╲');

  const near = relatedSkills.filter((s) => s.distance <= 1);
  const mid = relatedSkills.filter((s) => s.distance === 2);
  const far = relatedSkills.filter((s) => s.distance >= 3);

  if (near.length > 0) {
    const names = near.map((s) => s.name).join(' ── ');
    lines.push(`    ┌──── ${names}`);
    lines.push('    │');
  }

  lines.push(`    ★  ${centerName}`);
  lines.push('    │');

  if (mid.length > 0) {
    const names = mid.map((s) => s.name).join(' · ');
    lines.push(`    └──── ${names}`);
  }

  if (far.length > 0) {
    lines.push('    ·');
    const names = far.map((s) => s.name).join(' · ');
    lines.push(`    ····· ${names}`);
  }

  lines.push('');
  return lines.join('\n');
}

export function generateProgressGauge(
  current: number,
  total: number,
  width: number = 20
): string {
  const filled = Math.round((current / total) * width);
  const empty = width - filled;
  const bar = '█'.repeat(filled) + '░'.repeat(empty);
  const pct = Math.round((current / total) * 100);
  return `[${bar}] ${pct}% (${current}/${total})`;
}
