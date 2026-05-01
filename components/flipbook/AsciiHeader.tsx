interface AsciiHeaderProps {
  skillName: string;
  asciiArt: string;
}

export function AsciiHeader({ skillName, asciiArt }: AsciiHeaderProps) {
  return (
    <div className="text-center">
      <pre className="font-mono text-xs text-gray-600 whitespace-pre leading-tight bg-gray-50 rounded-lg p-4 border border-gray-200 overflow-x-auto">
{asciiArt || `
    ╔═══════════════════╗
    ║   ${skillName.padStart(8).padEnd(8)}   ║
    ╚═══════════════════╝
`}
      </pre>
    </div>
  );
}
