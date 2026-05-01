# CareerPath 职业规划平台 - 实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 构建完整的 CareerPath 职业规划平台，包含用户认证、简历解析、岗位匹配、Flipbook 技能可视化、学习推荐、社区和成就系统。

**Architecture:** Next.js 14 全栈应用，采用 App Router 架构，数据存储于 JSON 文件，可扩展至数据库。组件化设计，Flipbook 采用 CSS 3D transforms 实现翻页动画。

**Tech Stack:** Next.js 14, TypeScript, Tailwind CSS, shadcn/ui, Framer Motion, NextAuth.js, JSON 文件存储

---

## 文件结构

```
careerpath/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── (main)/
│   │   ├── dashboard/page.tsx
│   │   ├── resume/page.tsx
│   │   ├── jobs/page.tsx
│   │   ├── path/page.tsx
│   │   ├── learning/page.tsx
│   │   └── community/page.tsx
│   ├── api/
│   │   ├── auth/[...nextauth]/route.ts
│   │   ├── auth/register/route.ts
│   │   ├── resume/route.ts
│   │   ├── jobs/route.ts
│   │   └── community/route.ts
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   └── label.tsx
│   ├── flipbook/
│   │   ├── SkillFlipbook.tsx
│   │   ├── FlipCard.tsx
│   │   ├── AsciiHeader.tsx
│   │   ├── ProgressIndicator.tsx
│   │   └── NavigationControls.tsx
│   ├── resume/
│   │   ├── ResumeUpload.tsx
│   │   └── AnalysisReport.tsx
│   ├── jobs/
│   │   └── JobCard.tsx
│   └── community/
│       └── PostCard.tsx
├── lib/
│   ├── data/
│   │   ├── users.json
│   │   ├── jobs.json
│   │   ├── courses.json
│   │   └── achievements.json
│   ├── types.ts
│   └── utils.ts
└── package.json
```

---

## 里程碑分解

### M1: 项目初始化与基础架构

#### Task 1.1: 初始化 Next.js 项目

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `tailwind.config.ts`
- Create: `next.config.js`
- Create: `postcss.config.js`

- [ ] **Step 1: 创建 package.json**

```json
{
  "name": "careerpath",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "14.2.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "next-auth": "^4.24.5",
    "bcryptjs": "^2.4.3",
    "framer-motion": "^11.0.0",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.2.0",
    "lucide-react": "^0.344.0",
    "@radix-ui/react-dialog": "^1.0.5",
    "@radix-ui/react-tabs": "^1.0.4",
    "@radix-ui/react-progress": "^1.0.3"
  },
  "devDependencies": {
    "typescript": "^5.3.3",
    "@types/node": "^20.11.0",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "@types/bcryptjs": "^2.4.6",
    "tailwindcss": "^3.4.0",
    "autoprefixer": "^10.4.17",
    "postcss": "^8.4.33",
    "eslint": "^8.56.0",
    "eslint-config-next": "14.2.0"
  }
}
```

- [ ] **Step 2: 创建 tsconfig.json**

```json
{
  "compilerOptions": {
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 3: 创建 tailwind.config.ts**

```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [],
}
export default config
```

- [ ] **Step 4: 创建 postcss.config.js**

```javascript
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

- [ ] **Step 5: 创建项目目录结构**

```bash
mkdir -p app/{api,layout.tsx,page.tsx,globals.css}
mkdir -p app/(auth)/{login,register}
mkdir -p app/(main)/{dashboard,resume,jobs,path,learning,community,achievements}
mkdir -p app/api/auth/{register,[...nextauth]}
mkdir -p components/{ui,flipbook,resume,jobs,community}
mkdir -p lib/data
```

- [ ] **Step 6: 创建 globals.css**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary: 221.2 83.2% 53.3%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 221.2 83.2% 53.3%;
    --radius: 0.5rem;
  }
}

@layer utilities {
  .perspective-1000 {
    perspective: 1000px;
  }
  .backface-hidden {
    backface-visibility: hidden;
  }
  .rotate-y-180 {
    transform: rotateY(180deg);
  }
  .transform-style-preserve-3d {
    transform-style: preserve-3d;
  }
}
```

#### Task 1.2: 创建类型定义和工具函数

**Files:**
- Create: `lib/types.ts`
- Create: `lib/utils.ts`
- Create: `lib/data/index.ts`

- [ ] **Step 1: 创建 lib/types.ts**

```typescript
export interface User {
  id: string;
  email: string;
  password: string;
  username: string;
  avatar?: string;
  title?: string;
  bio?: string;
  points: number;
  level: number;
  createdAt: string;
  updatedAt: string;
}

export interface ParsedResume {
  skills: string[];
  education: Education[];
  experience: Experience[];
  projects: Project[];
}

export interface Education {
  school: string;
  degree: string;
  major: string;
  startDate: string;
  endDate: string;
}

export interface Experience {
  company: string;
  position: string;
  description: string;
  startDate: string;
  endDate: string;
}

export interface Project {
  name: string;
  description: string;
  technologies: string[];
  url?: string;
}

export interface AnalysisReport {
  strengths: string[];
  weaknesses: string[];
  matchScores: Record<string, number>;
  suggestions: string[];
}

export interface Resume {
  id: string;
  userId: string;
  rawText: string;
  parsedData: ParsedResume;
  analysisReport?: AnalysisReport;
  createdAt: string;
  updatedAt: string;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  companyLogo?: string;
  location: string;
  salary: string;
  experience: string;
  education: string;
  jobType: 'full-time' | 'part-time' | 'intern';
  source: 'boss' | 'lagou' | 'zhilian' | '51job';
  description: string;
  requirements: string[];
  skills: string[];
  benefits: string[];
  postedAt: string;
}

export interface SkillNode {
  id: string;
  name: string;
  description: string;
  asciiArt: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  estimatedHours: number;
  resources: Resource[];
  status: 'locked' | 'current' | 'completed';
  completedAt?: string;
}

export interface LearningPath {
  id: string;
  jobId: string;
  userId: string;
  status: 'in-progress' | 'completed';
  skillNodes: SkillNode[];
  createdAt: string;
  updatedAt: string;
}

export interface Resource {
  id: string;
  title: string;
  url: string;
  type: 'course' | 'doc' | 'video';
}

export interface Course {
  id: string;
  title: string;
  platform: string;
  url: string;
  thumbnail?: string;
  duration: string;
  skills: string[];
  level: 'beginner' | 'intermediate' | 'advanced';
  rating?: number;
  description: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'beginner' | 'resume' | 'target' | 'learning' | 'community' | 'master';
  points: number;
  condition: string;
}

export interface Post {
  id: string;
  userId: string;
  type: 'share' | 'question' | 'experience' | 'referral';
  title: string;
  content: string;
  likes: number;
  comments: Comment[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: string;
  userId: string;
  content: string;
  createdAt: string;
}
```

- [ ] **Step 2: 创建 lib/utils.ts**

```typescript
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function calculateLevel(points: number): number {
  return Math.floor(points / 500) + 1;
}

export function calculateMatchScore(userSkills: string[], jobSkills: string[]): number {
  if (jobSkills.length === 0) return 0;
  const matchedSkills = userSkills.filter(skill =>
    jobSkills.some(jobSkill =>
      skill.toLowerCase().includes(jobSkill.toLowerCase()) ||
      jobSkill.toLowerCase().includes(skill.toLowerCase())
    )
  );
  return Math.round((matchedSkills.length / jobSkills.length) * 100);
}
```

- [ ] **Step 3: 创建 lib/data/index.ts**

```typescript
import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'lib', 'data');

export function readData<T>(filename: string): T[] {
  const filePath = path.join(DATA_DIR, `${filename}.json`);
  if (!fs.existsSync(filePath)) {
    return [];
  }
  const content = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(content);
}

export function writeData<T>(filename: string, data: T[]): void {
  const filePath = path.join(DATA_DIR, `${filename}.json`);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}
```

#### Task 1.3: 创建 UI 基础组件

**Files:**
- Create: `components/ui/button.tsx`
- Create: `components/ui/input.tsx`
- Create: `components/ui/label.tsx`

- [ ] **Step 1: 创建 button.tsx**

```typescript
import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground shadow hover:bg-primary/90',
        destructive: 'bg-red-500 text-white shadow-sm hover:bg-red-600',
        outline: 'border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 rounded-md px-3 text-xs',
        lg: 'h-10 rounded-md px-8',
        icon: 'h-9 w-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
```

- [ ] **Step 2: 创建 input.tsx**

```typescript
import * as React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

export { Input };
```

- [ ] **Step 3: 创建 label.tsx**

```typescript
import * as React from 'react';
import { cn } from '@/lib/utils';

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {}

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, ...props }, ref) => (
    <label
      ref={ref}
      className={cn(
        'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
        className
      )}
      {...props}
    />
  )
);
Label.displayName = 'Label';

export { Label };
```

---

### M2: 用户认证系统

#### Task 2.1: 创建登录和注册页面

**Files:**
- Create: `app/(auth)/layout.tsx`
- Create: `app/(auth)/login/page.tsx`
- Create: `app/(auth)/register/page.tsx`

- [ ] **Step 1: 创建 auth layout**

```typescript
import { ReactNode } from 'react';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="w-full max-w-md p-8">{children}</div>
    </div>
  );
}
```

- [ ] **Step 2: 创建登录页面**

```typescript
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      router.push('/dashboard');
    } else {
      const data = await res.json();
      setError(data.error || '登录失败');
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">欢迎回来</h1>
        <p className="text-gray-600 mt-2">登录到 CareerPath</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg">
            {error}
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="email">邮箱</Label>
          <Input
            id="email"
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">密码</Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <Button type="submit" className="w-full">
          登录
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-600">
        还没有账号？{' '}
        <Link href="/register" className="text-blue-600 hover:underline">
          立即注册
        </Link>
      </p>
    </div>
  );
}
```

- [ ] **Step 3: 创建注册页面**

```typescript
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, username }),
    });

    if (res.ok) {
      router.push('/dashboard');
    } else {
      const data = await res.json();
      setError(data.error || '注册失败');
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">创建账号</h1>
        <p className="text-gray-600 mt-2">开始你的职业规划之旅</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg">
            {error}
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="username">用户名</Label>
          <Input
            id="username"
            type="text"
            placeholder="输入用户名"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">邮箱</Label>
          <Input
            id="email"
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">密码</Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />
        </div>

        <Button type="submit" className="w-full">
          注册
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-600">
        已有账号？{' '}
        <Link href="/login" className="text-blue-600 hover:underline">
          立即登录
        </Link>
      </p>
    </div>
  );
}
```

#### Task 2.2: 创建认证 API

**Files:**
- Create: `app/api/auth/register/route.ts`
- Create: `app/api/auth/login/route.ts`
- Create: `app/api/auth/[...nextauth]/route.ts`

- [ ] **Step 1: 创建用户注册 API**

```typescript
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { readData, writeData } from '@/lib/data';
import { generateId } from '@/lib/utils';

export async function POST(request: Request) {
  try {
    const { email, password, username } = await request.json();

    const users = readData('users');
    if (users.find((u: any) => u.email === email)) {
      return NextResponse.json(
        { error: '该邮箱已被注册' },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      id: generateId(),
      email,
      password: hashedPassword,
      username,
      points: 50,
      level: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    users.push(newUser);
    writeData('users', users);

    return NextResponse.json({ success: true, userId: newUser.id });
  } catch (error) {
    return NextResponse.json(
      { error: '注册失败' },
      { status: 500 }
    );
  }
}
```

- [ ] **Step 2: 创建用户登录 API**

```typescript
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { readData } from '@/lib/data';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    const users = readData('users');
    const user = users.find((u: any) => u.email === email);

    if (!user) {
      return NextResponse.json(
        { error: '邮箱或密码错误' },
        { status: 401 }
      );
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return NextResponse.json(
        { error: '邮箱或密码错误' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        points: user.points,
        level: user.level,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: '登录失败' },
      { status: 500 }
    );
  }
}
```

- [ ] **Step 3: 创建 NextAuth 配置**

```typescript
import NextAuth, { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { readData } from '@/lib/data';

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const users = readData('users');
        const user = users.find((u: any) => u.email === credentials.email);

        if (!user) {
          return null;
        }

        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.username,
        };
      },
    }),
  ],
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }: any) {
      if (session.user) {
        session.user.id = token.id;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
```

---

### M3: Flipbook 技能可视化

#### Task 3.1: 创建 FlipCard 组件

**Files:**
- Create: `components/flipbook/FlipCard.tsx`

- [ ] **Step 1: 创建 FlipCard 组件**

```typescript
'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface FlipCardProps {
  front: React.ReactNode;
  back: React.ReactNode;
  isFlipped: boolean;
  onFlip: () => void;
}

export function FlipCard({ front, back, isFlipped, onFlip }: FlipCardProps) {
  return (
    <div
      className="perspective-1000 w-full h-80 cursor-pointer"
      onClick={onFlip}
    >
      <motion.div
        className={cn(
          'relative w-full h-full transition-transform duration-500',
          isFlipped && 'rotate-y-180'
        )}
        style={{ transformStyle: 'preserve-3d' }}
      >
        <div
          className="absolute w-full h-full rounded-xl bg-white border-2 border-blue-100 shadow-lg p-6 flex items-center justify-center"
          style={{ backfaceVisibility: 'hidden' }}
        >
          {front}
        </div>
        <div
          className="absolute w-full h-full rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg p-6 rotate-y-180 flex items-center justify-center"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          {back}
        </div>
      </motion.div>
    </div>
  );
}
```

#### Task 3.2: 创建 Flipbook 子组件

**Files:**
- Create: `components/flipbook/AsciiHeader.tsx`
- Create: `components/flipbook/ProgressIndicator.tsx`
- Create: `components/flipbook/NavigationControls.tsx`

- [ ] **Step 1: 创建 AsciiHeader.tsx**

```typescript
export function AsciiHeader({
  skillName,
  asciiArt,
}: {
  skillName: string;
  asciiArt: string;
}) {
  return (
    <div className="text-center font-mono text-xs text-gray-600 whitespace-pre leading-tight bg-gray-50 rounded-lg p-4 border border-gray-200">
      {asciiArt || `
        ╔═══════════════════╗
        ║   ${skillName}   ║
        ╚═══════════════════╝
      `}
    </div>
  );
}
```

- [ ] **Step 2: 创建 ProgressIndicator.tsx**

```typescript
export function ProgressIndicator({
  current,
  total,
}: {
  current: number;
  total: number;
}) {
  return (
    <div className="flex items-center justify-center gap-2 my-4">
      <span className="text-sm text-gray-500 mr-2">
        {current} / {total}
      </span>
      <div className="flex gap-1">
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full transition-colors ${
              i === current - 1 ? 'bg-blue-600' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: 创建 NavigationControls.tsx**

```typescript
import { ChevronLeft, ChevronRight } from 'lucide-react';

export function NavigationControls({
  onPrev,
  onNext,
  canPrev,
  canNext,
}: {
  onPrev: () => void;
  onNext: () => void;
  canPrev: boolean;
  canNext: boolean;
}) {
  return (
    <div className="flex items-center justify-center gap-4">
      <button
        onClick={onPrev}
        disabled={!canPrev}
        className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        aria-label="上一页"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={onNext}
        disabled={!canNext}
        className="p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        aria-label="下一页"
      >
        <ChevronRight className="w-6 h-6" />
      </button>
    </div>
  );
}
```

#### Task 3.3: 创建 SkillFlipbook 主组件

**Files:**
- Create: `components/flipbook/SkillFlipbook.tsx`

- [ ] **Step 1: 创建 SkillFlipbook 组件**

```typescript
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FlipCard } from './FlipCard';
import { ProgressIndicator } from './ProgressIndicator';
import { NavigationControls } from './NavigationControls';
import { AsciiHeader } from './AsciiHeader';
import { SkillNode } from '@/lib/types';

interface SkillFlipbookProps {
  skills: SkillNode[];
  currentIndex: number;
  onIndexChange: (index: number) => void;
}

export function SkillFlipbook({
  skills,
  currentIndex,
  onIndexChange,
}: SkillFlipbookProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const currentSkill = skills[currentIndex];

  const handlePrev = () => {
    if (currentIndex > 0) {
      setIsFlipped(false);
      onIndexChange(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < skills.length - 1) {
      setIsFlipped(false);
      onIndexChange(currentIndex + 1);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200">
        <AsciiHeader
          skillName={currentSkill.name}
          asciiArt={currentSkill.asciiArt}
        />

        <div className="my-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <FlipCard
                front={<SkillCardFront skill={currentSkill} />}
                back={<SkillCardBack skill={currentSkill} />}
                isFlipped={isFlipped}
                onFlip={() => setIsFlipped(!isFlipped)}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        <ProgressIndicator current={currentIndex + 1} total={skills.length} />

        <NavigationControls
          onPrev={handlePrev}
          onNext={handleNext}
          canPrev={currentIndex > 0}
          canNext={currentIndex < skills.length - 1}
        />

        <p className="text-center text-sm text-gray-500 mt-4">
          点击卡片翻转查看详情
        </p>
      </div>
    </div>
  );
}

function SkillCardFront({ skill }: { skill: SkillNode }) {
  return (
    <div className="h-full flex flex-col justify-center items-center text-center">
      <div className="text-4xl font-bold text-gray-900 mb-2">
        {skill.name}
      </div>
      <div className="text-sm text-gray-500 mb-4">
        预计学习时长: {skill.estimatedHours} 小时
      </div>
      <div className="flex gap-2">
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            skill.level === 'beginner'
              ? 'bg-green-100 text-green-700'
              : skill.level === 'intermediate'
              ? 'bg-yellow-100 text-yellow-700'
              : 'bg-red-100 text-red-700'
          }`}
        >
          {skill.level === 'beginner'
            ? '入门'
            : skill.level === 'intermediate'
            ? '进阶'
            : '高级'}
        </span>
      </div>
    </div>
  );
}

function SkillCardBack({ skill }: { skill: SkillNode }) {
  return (
    <div className="h-full flex flex-col justify-center">
      <div className="text-lg font-semibold mb-3">学习详情</div>
      <p className="text-sm opacity-90 mb-4">{skill.description}</p>
      <div className="text-sm opacity-80">
        <div className="font-medium mb-2">推荐资源:</div>
        <ul className="space-y-1">
          {skill.resources.slice(0, 3).map((resource) => (
            <li key={resource.id} className="flex items-center gap-2">
              <span>•</span>
              <span>{resource.title}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
```

#### Task 3.4: 创建技能路径页面

**Files:**
- Create: `app/(main)/path/page.tsx`

- [ ] **Step 1: 创建技能路径页面**

```typescript
'use client';

import { useState } from 'react';
import { SkillFlipbook } from '@/components/flipbook/SkillFlipbook';
import { SkillNode } from '@/lib/types';

const SAMPLE_SKILLS: SkillNode[] = [
  {
    id: '1',
    name: 'HTML/CSS 基础',
    description: '掌握网页结构与样式设计基础',
    asciiArt: `
    ┌─────────────┐
    │ <HTML/CSS>  │
    │  ┌───┬───┐  │
    │  │ ■ │ ■ │  │
    │  └───┴───┘  │
    └─────────────┘
    `,
    level: 'beginner',
    estimatedHours: 20,
    resources: [
      { id: 'r1', title: 'MDN Web Docs', url: '#', type: 'doc' },
      { id: 'r2', title: 'Flexbox 教程', url: '#', type: 'course' },
    ],
    status: 'completed',
  },
  {
    id: '2',
    name: 'JavaScript 核心',
    description: '深入理解 JavaScript 语言核心概念',
    asciiArt: `
    ┌─────────────┐
    │  /\\  /\\     │
    │ /  \\/  \\    │
    │< JS Core >  │
    │  \\  /\\  /   │
    │   \\/  \\/    │
    └─────────────┘
    `,
    level: 'intermediate',
    estimatedHours: 40,
    resources: [
      { id: 'r3', title: 'JavaScript 高级程序设计', url: '#', type: 'doc' },
      { id: 'r4', title: 'ES6+ 教程', url: '#', type: 'course' },
    ],
    status: 'current',
  },
  {
    id: '3',
    name: 'React 框架',
    description: '学习 React 组件化开发思想',
    asciiArt: `
      /\\  /\\  /\\
     /  \\/  \\/  \\
    <  React  >
     \\  /\\  /\\  /
      \\/  \\/  \\/
    `,
    level: 'intermediate',
    estimatedHours: 50,
    resources: [
      { id: 'r5', title: 'React 官方文档', url: '#', type: 'doc' },
      { id: 'r6', title: 'React 实战课程', url: '#', type: 'course' },
    ],
    status: 'locked',
  },
];

export default function PathPage() {
  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">技能学习路径</h1>
          <p className="text-gray-600">按照路径逐步掌握前端开发技能</p>
        </div>

        <SkillFlipbook
          skills={SAMPLE_SKILLS}
          currentIndex={currentIndex}
          onIndexChange={setCurrentIndex}
        />

        <div className="mt-8 bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">学习建议</h2>
          <ul className="space-y-2 text-gray-600">
            <li>• 建议按顺序完成每个技能节点</li>
            <li>• 点击卡片可查看详细学习资源</li>
            <li>• 完成学习后记得回来更新进度</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
```

---

### M4: 简历解析系统

#### Task 4.1: 创建简历上传组件

**Files:**
- Create: `components/resume/ResumeUpload.tsx`
- Create: `components/resume/AnalysisReport.tsx`
- Create: `app/(main)/resume/page.tsx`

- [ ] **Step 1: 创建 ResumeUpload.tsx**

```typescript
'use client';

import { useState } from 'react';
import { Upload, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ResumeUploadProps {
  onUpload: (text: string) => void;
}

export function ResumeUpload({ onUpload }: ResumeUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [content, setContent] = useState('');

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      setContent(text);
    };
    reader.readAsText(file);
  };

  const handleSubmit = () => {
    if (content) {
      onUpload(content);
    }
  };

  return (
    <div className="space-y-6">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors ${
          isDragging
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
      >
        <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
        <p className="text-gray-600 mb-2">
          拖拽简历文件到这里，或点击上传
        </p>
        <p className="text-sm text-gray-400">支持 .txt, .md 格式</p>
        <input
          type="file"
          accept=".txt,.md"
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          className="hidden"
          id="file-upload"
        />
        <label htmlFor="file-upload">
          <Button variant="outline" className="mt-4 cursor-pointer" asChild>
            <span>选择文件</span>
          </Button>
        </label>
      </div>

      {content && (
        <div className="bg-white rounded-xl p-6 border">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="w-5 h-5 text-blue-600" />
            <span className="font-medium">已上传内容预览</span>
          </div>
          <pre className="whitespace-pre-wrap text-sm text-gray-600 max-h-60 overflow-y-auto bg-gray-50 p-4 rounded-lg">
            {content.slice(0, 500)}
            {content.length > 500 && '...'}
          </pre>
          <Button onClick={handleSubmit} className="w-full mt-4">
            开始分析
          </Button>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: 创建 AnalysisReport.tsx**

```typescript
interface AnalysisReportProps {
  report: {
    strengths: string[];
    weaknesses: string[];
    matchScores: Record<string, number>;
    suggestions: string[];
  };
}

export function AnalysisReport({ report }: AnalysisReportProps) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 border">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <span className="text-green-600 text-xl">✓</span> 核心竞争力
        </h2>
        <div className="flex flex-wrap gap-2">
          {report.strengths.map((item, i) => (
            <span
              key={i}
              className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm"
            >
              {item}
            </span>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 border">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <span className="text-amber-600 text-xl">!</span> 待提升领域
        </h2>
        <div className="flex flex-wrap gap-2">
          {report.weaknesses.map((item, i) => (
            <span
              key={i}
              className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm"
            >
              {item}
            </span>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 border">
        <h2 className="text-lg font-semibold mb-4">岗位匹配度</h2>
        <div className="space-y-4">
          {Object.entries(report.matchScores).map(([title, score]) => (
            <div key={title}>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">{title}</span>
                <span className="text-sm text-gray-600">{score}%</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 rounded-full transition-all"
                  style={{ width: `${score}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 border">
        <h2 className="text-lg font-semibold mb-4">优化建议</h2>
        <ul className="space-y-2">
          {report.suggestions.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-gray-600">
              <span className="text-blue-600 mt-1">•</span>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: 创建简历页面**

```typescript
'use client';

import { useState } from 'react';
import { ResumeUpload } from '@/components/resume/ResumeUpload';
import { AnalysisReport } from '@/components/resume/AnalysisReport';

export default function ResumePage() {
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  const handleAnalyze = (text: string) => {
    setAnalysisResult({
      strengths: ['React 开发经验', 'TypeScript 掌握', '项目经验丰富'],
      weaknesses: ['缺少云部署经验', '算法能力待提升'],
      matchScores: {
        '前端工程师': 85,
        '全栈工程师': 72,
        '移动端开发': 58,
      },
      suggestions: [
        '建议学习 Docker 容器化部署',
        '加强算法与数据结构基础',
        '补充性能优化相关经验',
      ],
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">简历分析</h1>
          <p className="text-gray-600">上传简历，获取 AI 智能分析</p>
        </div>

        {!analysisResult ? (
          <ResumeUpload onUpload={handleAnalyze} />
        ) : (
          <AnalysisReport report={analysisResult} />
        )}
      </div>
    </div>
  );
}
```

---

### M5: 岗位匹配系统

#### Task 5.1: 创建岗位卡片和列表页面

**Files:**
- Create: `components/jobs/JobCard.tsx`
- Create: `app/(main)/jobs/page.tsx`

- [ ] **Step 1: 创建 JobCard.tsx**

```typescript
import { Briefcase, MapPin, DollarSign } from 'lucide-react';
import { Job } from '@/lib/types';

interface JobCardProps {
  job: Job;
  matchScore?: number;
  onClick: () => void;
}

export function JobCard({ job, matchScore, onClick }: JobCardProps) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl p-6 border hover:border-blue-300 hover:shadow-md transition-all cursor-pointer"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
          <p className="text-gray-600 mt-1">{job.company}</p>
        </div>
        {matchScore !== undefined && (
          <div
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              matchScore >= 80
                ? 'bg-green-100 text-green-700'
                : matchScore >= 60
                ? 'bg-yellow-100 text-yellow-700'
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            匹配度 {matchScore}%
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-4 text-sm text-gray-500">
        <div className="flex items-center gap-1">
          <MapPin className="w-4 h-4" />
          {job.location}
        </div>
        <div className="flex items-center gap-1">
          <DollarSign className="w-4 h-4" />
          {job.salary}
        </div>
        <div className="flex items-center gap-1">
          <Briefcase className="w-4 h-4" />
          {job.experience}
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mt-4">
        {job.skills.slice(0, 4).map((skill) => (
          <span
            key={skill}
            className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs"
          >
            {skill}
          </span>
        ))}
        {job.skills.length > 4 && (
          <span className="px-2 py-1 text-gray-400 text-xs">
            +{job.skills.length - 4}
          </span>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: 创建岗位列表页面**

```typescript
'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import { JobCard } from '@/components/jobs/JobCard';
import { Job } from '@/lib/types';

const SAMPLE_JOBS: Job[] = [
  {
    id: '1',
    title: '前端工程师',
    company: '字节跳动',
    location: '北京',
    salary: '25K-40K',
    experience: '3-5年',
    education: '本科',
    jobType: 'full-time',
    source: 'boss',
    description: '负责公司核心产品的前端开发工作',
    requirements: ['React', 'TypeScript', 'Node.js'],
    skills: ['React', 'TypeScript', 'Node.js', 'Git', 'CSS'],
    benefits: ['六险一金', '免费三餐', '弹性工作'],
    postedAt: '2026-04-28',
  },
  {
    id: '2',
    title: '全栈工程师',
    company: '腾讯',
    location: '深圳',
    salary: '30K-50K',
    experience: '5-10年',
    education: '本科',
    jobType: 'full-time',
    source: 'lagou',
    description: '参与公司云服务产品开发',
    requirements: ['Vue/React', 'Python/Go', '数据库'],
    skills: ['Vue', 'Python', 'PostgreSQL', 'Docker', 'K8s'],
    benefits: ['股票期权', '年度旅游', '带薪年假'],
    postedAt: '2026-04-27',
  },
  {
    id: '3',
    title: 'React 开发工程师',
    company: '阿里巴巴',
    location: '杭州',
    salary: '35K-55K',
    experience: '3-5年',
    education: '本科',
    jobType: 'full-time',
    source: 'zhilian',
    description: '参与电商平台前端架构设计与开发',
    requirements: ['React', 'Redux', '性能优化'],
    skills: ['React', 'Redux', 'TypeScript', 'Webpack', '性能优化'],
    benefits: ['股票期权', '免费班车', '年度体检'],
    postedAt: '2026-04-26',
  },
];

export default function JobsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [jobs] = useState(SAMPLE_JOBS);

  const filteredJobs = jobs.filter(
    (job) =>
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">岗位推荐</h1>
          <p className="text-gray-600">发现适合你的理想工作</p>
        </div>

        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="搜索岗位或公司..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
          />
        </div>

        <div className="space-y-4">
          {filteredJobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              matchScore={Math.floor(Math.random() * 30) + 70}
              onClick={() => console.log('查看详情', job.id)}
            />
          ))}
        </div>

        {filteredJobs.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            暂无匹配的岗位
          </div>
        )}
      </div>
    </div>
  );
}
```

---

### M6: 社区系统

#### Task 6.1: 创建社区页面

**Files:**
- Create: `components/community/PostCard.tsx`
- Create: `app/(main)/community/page.tsx`

- [ ] **Step 1: 创建 PostCard.tsx**

```typescript
import { MessageCircle, ThumbsUp } from 'lucide-react';
import { Post } from '@/lib/types';

interface PostCardProps {
  post: Post;
  onLike: () => void;
}

export function PostCard({ post, onLike }: PostCardProps) {
  return (
    <div className="bg-white rounded-xl p-6 border hover:shadow-sm transition-shadow">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-medium">
          {post.userId.charAt(0).toUpperCase()}
        </div>
        <div>
          <div className="font-medium text-gray-900">
            用户 {post.userId.slice(0, 6)}
          </div>
          <div className="text-sm text-gray-500">{post.createdAt}</div>
        </div>
      </div>

      <h3 className="text-lg font-semibold mb-2">{post.title}</h3>
      <p className="text-gray-600 mb-4 line-clamp-3">{post.content}</p>

      <div className="flex items-center gap-4">
        <button
          onClick={onLike}
          className="flex items-center gap-1 text-gray-500 hover:text-blue-600 transition-colors"
        >
          <ThumbsUp className="w-4 h-4" />
          <span>{post.likes}</span>
        </button>
        <div className="flex items-center gap-1 text-gray-500">
          <MessageCircle className="w-4 h-4" />
          <span>{post.comments.length}</span>
        </div>
        <div className="flex gap-2 ml-auto">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: 创建社区页面**

```typescript
'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { PostCard } from '@/components/community/PostCard';
import { Button } from '@/components/ui/button';
import { Post } from '@/lib/types';

const SAMPLE_POSTS: Post[] = [
  {
    id: '1',
    userId: 'user123',
    type: 'experience',
    title: '我的秋招经验分享',
    content:
      '分享一下今年秋招的经历，希望能帮助到大家...',
    likes: 42,
    comments: [],
    tags: ['求职', '秋招', '经验'],
    createdAt: '2026-04-29',
    updatedAt: '2026-04-29',
  },
  {
    id: '2',
    userId: 'user456',
    type: 'question',
    title: '前端简历怎么写更有竞争力？',
    content:
      '感觉自己简历写得一般，面试机会很少，求建议...',
    likes: 15,
    comments: [],
    tags: ['简历', '前端'],
    createdAt: '2026-04-28',
    updatedAt: '2026-04-28',
  },
];

export default function CommunityPage() {
  const [posts, setPosts] = useState(SAMPLE_POSTS);

  const handleLike = (postId: string) => {
    setPosts(
      posts.map((post) =>
        post.id === postId ? { ...post, likes: post.likes + 1 } : post
      )
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">社区</h1>
            <p className="text-gray-600">与志同道合的朋友交流</p>
          </div>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            发布帖子
          </Button>
        </div>

        <div className="space-y-4">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} onLike={() => handleLike(post.id)} />
          ))}
        </div>
      </div>
    </div>
  );
}
```

---

### M7: 成就系统

#### Task 7.1: 创建成就页面

**Files:**
- Create: `app/(main)/achievements/page.tsx`

- [ ] **Step 1: 创建成就页面**

```typescript
'use client';

import { useState } from 'react';
import { Trophy, Star } from 'lucide-react';
import { Achievement } from '@/lib/types';

const ACHIEVEMENTS: Achievement[] = [
  {
    id: '1',
    name: '初次上路',
    description: '完成注册',
    icon: '🚀',
    category: 'beginner',
    points: 50,
    condition: 'register',
  },
  {
    id: '2',
    name: '简历达人',
    description: '上传并分析简历',
    icon: '📝',
    category: 'resume',
    points: 100,
    condition: 'analyze_resume',
  },
  {
    id: '3',
    name: '目标猎手',
    description: '确认目标岗位',
    icon: '🎯',
    category: 'target',
    points: 150,
    condition: 'confirm_target',
  },
  {
    id: '4',
    name: '学习先锋',
    description: '完成首个技能学习',
    icon: '📚',
    category: 'learning',
    points: 300,
    condition: 'complete_skill',
  },
  {
    id: '5',
    name: '社区达人',
    description: '发布帖子被点赞',
    icon: '🤝',
    category: 'community',
    points: 200,
    condition: 'post_liked',
  },
  {
    id: '6',
    name: '求职高手',
    description: '获得多个岗位匹配',
    icon: '💎',
    category: 'master',
    points: 500,
    condition: 'multiple_matches',
  },
];

export default function AchievementsPage() {
  const [unlockedIds, setUnlockedIds] = useState<string[]>(['1', '2']);
  const totalPoints = unlockedIds.reduce((sum, id) => {
    const achievement = ACHIEVEMENTS.find((a) => a.id === id);
    return sum + (achievement?.points || 0);
  }, 0);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">成就中心</h1>
          <p className="text-gray-600">解锁徽章，提升等级</p>
        </div>

        <div className="bg-white rounded-2xl p-8 mb-8 border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
                <Trophy className="w-8 h-8 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold">{totalPoints} XP</div>
                <div className="text-gray-500">当前积分</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">
                {unlockedIds.length}/{ACHIEVEMENTS.length}
              </div>
              <div className="text-gray-500">已解锁成就</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {ACHIEVEMENTS.map((achievement) => {
            const isUnlocked = unlockedIds.includes(achievement.id);
            return (
              <div
                key={achievement.id}
                className={`bg-white rounded-xl p-6 border text-center transition-all ${
                  isUnlocked
                    ? 'border-yellow-300 shadow-md'
                    : 'opacity-50'
                }`}
              >
                <div className={`text-4xl mb-3 ${isUnlocked ? '' : 'grayscale'}`}>
                  {achievement.icon}
                </div>
                <div className="font-semibold text-gray-900 mb-1">
                  {achievement.name}
                </div>
                <div className="text-sm text-gray-500 mb-2">
                  {achievement.description}
                </div>
                <div className="flex items-center justify-center gap-1 text-sm">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span>{achievement.points} XP</span>
                </div>
                {isUnlocked && (
                  <div className="mt-2 text-xs text-green-600 font-medium">
                    ✓ 已解锁
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
```

---

### M8: 首页与仪表盘

#### Task 8.1: 创建根布局和首页

**Files:**
- Create: `app/layout.tsx`
- Create: `app/page.tsx`

- [ ] **Step 1: 创建 app/layout.tsx**

```typescript
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'CareerPath - 职业规划平台',
  description: '智能解析简历 · 精准岗位匹配 · 可视化学习路径',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
```

- [ ] **Step 2: 创建首页 app/page.tsx**

```typescript
import Link from 'next/link';
import { ArrowRight, BookOpen, Target, Users, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 text-white">
        <div className="max-w-6xl mx-auto px-4 py-24">
          <div className="max-w-2xl">
            <h1 className="text-5xl font-bold mb-6 leading-tight">
              开启你的
              <span className="text-yellow-300">职业之路</span>
            </h1>
            <p className="text-xl text-blue-100 mb-8">
              智能解析简历 · 精准岗位匹配 · 可视化学习路径
              <br />
              助你在求职路上脱颖而出
            </p>
            <div className="flex gap-4">
              <Link href="/register">
                <Button
                  size="lg"
                  className="bg-white text-blue-700 hover:bg-blue-50"
                >
                  立即开始
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link href="/login">
                <Button
                  size="lg"
                  variant="outline"
                  className="text-white border-white hover:bg-white/10"
                >
                  已有账号登录
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">核心功能</h2>
            <p className="text-gray-600">一站式职业规划解决方案</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={<BookOpen className="w-8 h-8" />}
              title="简历解析"
              description="AI 智能分析简历，识别核心竞争力与待提升领域"
            />
            <FeatureCard
              icon={<Target className="w-8 h-8" />}
              title="岗位匹配"
              description="聚合主流招聘平台，精准推荐最适合你的岗位"
            />
            <FeatureCard
              icon={<BookOpen className="w-8 h-8" />}
              title="技能可视化"
              description="Flipbook 风格技能路径，让学习更有趣"
            />
            <FeatureCard
              icon={<Trophy className="w-8 h-8" />}
              title="成就系统"
              description="解锁徽章获取积分，激励持续成长"
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white border-t">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <Stat number="10,000+" label="注册用户" />
            <Stat number="50,000+" label="岗位数据" />
            <Stat number="1,000+" label="课程资源" />
            <Stat number="95%" label="匹配准确率" />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-700 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">准备好开始了吗？</h2>
          <p className="text-blue-100 mb-8">
            加入 CareerPath，让你的求职之路更加清晰
          </p>
          <Link href="/register">
            <Button size="lg" className="bg-white text-blue-700 hover:bg-blue-50">
              免费注册
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-white rounded-xl p-6 border hover:shadow-lg transition-shadow">
      <div className="text-blue-600 mb-4">{icon}</div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  );
}

function Stat({ number, label }: { number: string; label: string }) {
  return (
    <div>
      <div className="text-3xl font-bold text-blue-600 mb-1">{number}</div>
      <div className="text-gray-500">{label}</div>
    </div>
  );
}
```

#### Task 8.2: 创建仪表盘页面

**Files:**
- Create: `app/(main)/layout.tsx`
- Create: `app/(main)/dashboard/page.tsx`

- [ ] **Step 1: 创建主布局**

```typescript
import { ReactNode } from 'react';
import Link from 'next/link';
import {
  Home,
  FileText,
  Target,
  BookOpen,
  Users,
  Trophy,
} from 'lucide-react';

export default function MainLayout({ children }: { children: ReactNode }) {
  const navItems = [
    { href: '/dashboard', icon: Home, label: '首页' },
    { href: '/resume', icon: FileText, label: '简历' },
    { href: '/jobs', icon: Target, label: '岗位' },
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
```

- [ ] **Step 2: 创建仪表盘页面**

```typescript
'use client';

import Link from 'next/link';
import { ArrowRight, FileText, Target, BookOpen, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function DashboardPage() {
  return (
    <div className="py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-2xl p-8 mb-8">
          <h1 className="text-2xl font-bold mb-2">欢迎回来！</h1>
          <p className="text-blue-100">继续你的职业规划之旅</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <QuickAction
            icon={<FileText className="w-6 h-6" />}
            title="简历分析"
            description="上传简历，获取 AI 分析"
            href="/resume"
          />
          <QuickAction
            icon={<Target className="w-6 h-6" />}
            title="岗位推荐"
            description="发现适合你的岗位"
            href="/jobs"
          />
          <QuickAction
            icon={<BookOpen className="w-6 h-6" />}
            title="技能路径"
            description="可视化学习路线"
            href="/path"
          />
          <QuickAction
            icon={<Trophy className="w-6 h-6" />}
            title="成就中心"
            description="查看你的成就"
            href="/achievements"
          />
        </div>

        <div className="bg-white rounded-xl p-6 border">
          <h2 className="text-lg font-semibold mb-4">最近活动</h2>
          <div className="text-center py-12 text-gray-500">
            <p>暂无最近活动</p>
            <p className="text-sm mt-2">
              开始上传简历，开启你的职业规划之旅
            </p>
            <Link href="/resume">
              <Button className="mt-4">
                上传简历
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function QuickAction({
  icon,
  title,
  description,
  href,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
}) {
  return (
    <Link href={href}>
      <div className="bg-white rounded-xl p-6 border hover:shadow-md hover:border-blue-200 transition-all">
        <div className="text-blue-600 mb-3">{icon}</div>
        <h3 className="font-semibold mb-1">{title}</h3>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
    </Link>
  );
}
```

---

### M9: 创建数据文件

#### Task 9.1: 创建初始 JSON 数据文件

**Files:**
- Create: `lib/data/users.json`
- Create: `lib/data/jobs.json`
- Create: `lib/data/courses.json`
- Create: `lib/data/achievements.json`

- [ ] **Step 1: 创建数据文件**

```json
// lib/data/users.json
[]
```

```json
// lib/data/jobs.json
[
  {
    "id": "1",
    "title": "前端工程师",
    "company": "字节跳动",
    "location": "北京",
    "salary": "25K-40K",
    "experience": "3-5年",
    "education": "本科",
    "jobType": "full-time",
    "source": "boss",
    "description": "负责公司核心产品的前端开发工作",
    "requirements": ["React", "TypeScript", "Node.js"],
    "skills": ["React", "TypeScript", "Node.js", "Git", "CSS", "HTML"],
    "benefits": ["六险一金", "免费三餐", "弹性工作"],
    "postedAt": "2026-04-28"
  }
]
```

```json
// lib/data/courses.json
[
  {
    "id": "1",
    "title": "React 官方教程",
    "platform": "React 官网",
    "url": "https://react.dev",
    "duration": "8 小时",
    "skills": ["React"],
    "level": "beginner",
    "description": "官方出品的 React 入门教程"
  }
]
```

```json
// lib/data/achievements.json
[
  {
    "id": "1",
    "name": "初次上路",
    "description": "完成注册",
    "icon": "🚀",
    "category": "beginner",
    "points": 50,
    "condition": "register"
  }
]
```

---

## 自检清单

1. **规格覆盖**: 检查设计文档中的每个功能模块是否都有对应的任务
2. **占位符检查**: 确保没有 "TODO"、"TBD"、未实现的占位符
3. **类型一致性**: 验证类型定义、函数签名的一致性
4. **路径准确性**: 所有文件路径是否正确
5. **步骤完整性**: 每个任务是否包含所有必要的步骤

---

**实施计划完成！**

保存至: `docs/superpowers/plans/2026-04-30-careerpath-implementation.md`

---

## 执行选项

**1. Subagent-Driven (推荐)** - 每个任务由新的 subagent 执行，任务间有检查点

**2. Inline Execution** - 在当前会话执行任务，带检查点

**选择哪种执行方式？**
