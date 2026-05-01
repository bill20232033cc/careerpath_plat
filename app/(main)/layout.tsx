import { ReactNode } from 'react';
import Link from 'next/link';
import { Home, FileText, Target, BookOpen, Users, Trophy, GraduationCap } from 'lucide-react';

export default function MainLayout({ children }: { children: ReactNode }) {
  const navItems = [
    { href: '/dashboard', icon: Home, label: '首页' },
    { href: '/resume', icon: FileText, label: '简历' },
    { href: '/jobs', icon: Target, label: '岗位' },
    { href: '/learning', icon: GraduationCap, label: '学习' },
    { href: '/path', icon: BookOpen, label: '路径' },
    { href: '/community', icon: Users, label: '社区' },
    { href: '/achievements', icon: Trophy, label: '成就' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/dashboard" className="text-xl font-bold text-blue-600">
              CareerPath
            </Link>
            <div className="flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-blue-600 transition-colors"
                >
                  <item.icon className="w-4 h-4" />
                  <span className="text-sm">{item.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </nav>
      {children}
    </div>
  );
}
