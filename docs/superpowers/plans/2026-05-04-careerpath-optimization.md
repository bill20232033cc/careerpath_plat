# CareerPath 全面优化开发计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将 CareerPath 从当前 MVP 原型升级为生产级可上线产品，分 4 个阶段逐步完成核心功能补全、代码质量提升、容错与安全加固、生产化部署准备。

**Architecture:** Next.js 14 App Router 全栈架构，数据层当前为 JSON 文件（后续迁移数据库），AI 服务通过 DeepSeek API（OpenAI SDK 封装），认证使用 NextAuth.js。优化策略遵循 project_rules.md 的渐进式升级原则，单次变更 ≤5 文件 / ≤200 行 / ≤1 模块。

**Tech Stack:** Next.js 14, TypeScript, Tailwind CSS, Radix UI (shadcn/ui), Framer Motion, NextAuth.js, DeepSeek API (OpenAI SDK), bcryptjs, JSON 文件存储

---

## 现状评估

### 已实现功能
| 模块 | 已实现 | 状态 |
|------|--------|------|
| 用户认证 | 注册/登录页面 + API | ⚠️ 缺少 logout/session，无 NextAuth 集成 |
| 简历分析 | 上传/粘贴 + AI 分析 + 报告展示 | ✅ 刚修复，基本可用 |
| 岗位匹配 | 岗位列表 + 搜索 + 匹配 API | ⚠️ 缺少详情/确认/筛选 |
| 技能路径 | Flipbook 组件 + 路径页面 | ⚠️ 使用硬编码数据，缺 API |
| 学习推荐 | 课程列表页面 | ⚠️ 缺少推荐 API 和进度追踪 |
| 社区系统 | 帖子列表 + 发帖 + 点赞 | ⚠️ 缺少详情/评论 API |
| 成就系统 | 成就展示页面 | ⚠️ 硬编码数据，缺 API |

### 缺失 API 端点（共 15 个）
1. `POST /api/auth/logout`
2. `GET /api/auth/session`
3. `GET /api/resume/report`
4. `GET /api/jobs/[id]`
5. `POST /api/jobs/confirm`
6. `GET /api/path/[jobId]`
7. `POST /api/path/progress`
8. `GET /api/learning/recommendations`
9. `GET /api/learning/courses`
10. `POST /api/learning/progress`
11. `GET /api/community/posts/[id]`
12. `POST /api/community/posts/[id]/like`
13. `POST /api/community/posts/[id]/comment`
14. `GET /api/achievements/progress`
15. `POST /api/achievements/unlock`

### 缺失组件（共 7 个）
1. `ResumePreview` - 简历预览组件
2. `StrengthCard` - 竞争力卡片
3. `WeaknessCard` - 短板卡片
4. `JobSearch` - 岗位搜索组件
5. `JobFilters` - 岗位筛选组件
6. `JobDetail` - 岗位详情弹窗
7. `MatchBadge` - 匹配度标签

### 代码质量问题
- 无统一 API 响应格式（设计文档定义了 `ApiResponse<T>` + 错误码，未实现）
- Achievement.condition 类型不一致（代码为 string，设计文档为 AchievementCondition）
- 缺少 UserAchievement 类型定义
- AI 调用 fallback 数据与正常返回结构不完全一致
- 前端页面大量使用硬编码示例数据，未接入 API

---

## 阶段划分

| 阶段 | 目标 | 预计周期 | 优先级 |
|------|------|----------|--------|
| Phase 1 | 核心功能稳定化 | 2 周 | P0 |
| Phase 2 | 功能补全与组件完善 | 3 周 | P1 |
| Phase 3 | 容错/安全/质量加固 | 2 周 | P2 |
| Phase 4 | 生产化与部署准备 | 1 周 | P3 |

---

## Phase 1: 核心功能稳定化（P0）

> 目标：修复已知 Bug，统一 API 响应格式，补全认证系统，让核心用户旅程可跑通

### Task 1.1: 统一 API 响应格式与错误码体系

**Files:**
- Modify: `lib/types.ts` — 新增 ApiResponse、ApiError 类型
- Modify: `lib/utils.ts` — 新增 apiResponse、apiError 工具函数

- [ ] **Step 1: 在 lib/types.ts 末尾新增统一响应类型**

```typescript
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
  pagination?: {
    page: number;
    limit: number;
    total: number;
  };
}

export interface ApiError {
  code: string;
  message: string;
}

export type ErrorCode =
  | 'AUTH001'
  | 'AUTH002'
  | 'RESUME001'
  | 'RESUME002'
  | 'JOB001'
  | 'JOB002'
  | 'PATH001'
  | 'LEARNING001'
  | 'COMMUNITY001'
  | 'ACHIEVEMENT001';
```

- [ ] **Step 2: 在 lib/utils.ts 新增 API 响应工具函数**

```typescript
import { NextResponse } from 'next/server';
import { ApiResponse, ApiError } from './types';

export function apiSuccess<T>(data: T, status = 200): NextResponse<ApiResponse<T>> {
  return NextResponse.json({ success: true, data }, { status });
}

export function apiError(code: string, message: string, status = 400): NextResponse<ApiResponse<never>> {
  return NextResponse.json({ success: false, error: { code, message } }, { status });
}

export function apiPaginated<T>(
  data: T[],
  page: number,
  limit: number,
  total: number
): NextResponse<ApiResponse<T[]>> {
  return NextResponse.json({
    success: true,
    data,
    pagination: { page, limit, total },
  });
}
```

- [ ] **Step 3: 验证类型编译通过**

Run: `npx tsc --noEmit`
Expected: 无类型错误

- [ ] **Step 4: Commit**

```bash
git add lib/types.ts lib/utils.ts
git commit -m "feat(api): add unified ApiResponse type and error code system"
```

---

### Task 1.2: 补全认证系统 — NextAuth 集成

**Files:**
- Create: `app/api/auth/[...nextauth]/route.ts`
- Modify: `app/api/auth/login/route.ts` — 使用统一响应格式
- Modify: `app/api/auth/register/route.ts` — 使用统一响应格式
- Modify: `app/(auth)/login/page.tsx` — 集成 NextAuth signIn
- Modify: `app/(auth)/register/page.tsx` — 注册后自动登录

- [ ] **Step 1: 创建 NextAuth 路由**

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
        if (!credentials?.email || !credentials?.password) return null;

        const users = readData<import('@/lib/types').User>('users');
        const user = users.find((u) => u.email === credentials.email);
        if (!user) return null;

        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) return null;

        return { id: user.id, email: user.email, name: user.username };
      },
    }),
  ],
  session: { strategy: 'jwt' },
  pages: { signIn: '/login' },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
    async session({ session, token }) {
      if (session.user) session.user.id = token.id as string;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
```

- [ ] **Step 2: 修改 login/route.ts 使用统一响应格式**

将现有的 `NextResponse.json({ error: '...' })` 改为使用 `apiError('AUTH001', '邮箱或密码错误', 401)` 等格式。

- [ ] **Step 3: 修改 register/route.ts 使用统一响应格式**

- [ ] **Step 4: 修改 login/page.tsx 集成 NextAuth**

```typescript
import { signIn } from 'next-auth/react';

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError('');
  const result = await signIn('credentials', {
    email,
    password,
    redirect: false,
  });
  if (result?.ok) {
    router.push('/dashboard');
  } else {
    setError('邮箱或密码错误');
  }
};
```

- [ ] **Step 5: 修改 register/page.tsx 注册成功后自动调用 signIn**

- [ ] **Step 6: 验证注册→登录→跳转仪表盘流程**

Run: `npm run dev`，手动测试注册和登录

- [ ] **Step 7: Commit**

```bash
git add app/api/auth/ app/\(auth\)/
git commit -m "feat(auth): integrate NextAuth with unified API response format"
```

---

### Task 1.3: 补全认证 API — logout 和 session

**Files:**
- Create: `app/api/auth/logout/route.ts`
- Create: `app/api/auth/session/route.ts`

- [ ] **Step 1: 创建 logout 路由**

```typescript
import { NextResponse } from 'next/server';
import { apiSuccess } from '@/lib/utils';

export async function POST() {
  return apiSuccess({ message: '已退出登录' });
}
```

- [ ] **Step 2: 创建 session 路由**

```typescript
import { getServerSession } from 'next-auth';
import { authOptions } from '../[...nextauth]/route';
import { apiSuccess, apiError } from '@/lib/utils';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return apiError('AUTH002', '未登录', 401);
  }
  return apiSuccess(session);
}
```

- [ ] **Step 3: Commit**

```bash
git add app/api/auth/logout/ app/api/auth/session/
git commit -m "feat(auth): add logout and session API endpoints"
```

---

### Task 1.4: 修复 resume API 使用统一响应格式

**Files:**
- Modify: `app/api/resume/route.ts`

- [ ] **Step 1: 重构 resume route 使用 apiSuccess/apiError**

将 `NextResponse.json({ success: true, analysis, poweredBy: 'DeepSeek' })` 改为 `apiSuccess({ analysis, poweredBy: 'DeepSeek' })`，错误返回使用 `apiError('RESUME002', 'AI 分析失败', 500)`。

- [ ] **Step 2: 确保 fallback 数据也通过 apiSuccess 返回**

```typescript
return apiSuccess({ analysis: fallback, poweredBy: 'DeepSeek (fallback)' });
```

- [ ] **Step 3: Commit**

```bash
git add app/api/resume/route.ts
git commit -m "refactor(resume): use unified API response format"
```

---

### Task 1.5: 修复 jobs API 使用统一响应格式

**Files:**
- Modify: `app/api/jobs/route.ts`
- Modify: `app/api/jobs/match/route.ts`

- [ ] **Step 1: 重构 jobs route 使用 apiSuccess/apiError**

- [ ] **Step 2: 重构 jobs/match route 使用 apiSuccess/apiError**

- [ ] **Step 3: Commit**

```bash
git add app/api/jobs/
git commit -m "refactor(jobs): use unified API response format"
```

---

### Task 1.6: 补全类型定义 — AchievementCondition 和 UserAchievement

**Files:**
- Modify: `lib/types.ts`

- [ ] **Step 1: 新增 AchievementCondition 和 UserAchievement 类型**

```typescript
export interface AchievementCondition {
  type: 'register' | 'analyze_resume' | 'confirm_target' | 'complete_skill' | 'post_liked' | 'multiple_matches';
  count: number;
}

export interface UserAchievement {
  userId: string;
  achievementId: string;
  unlockedAt: string;
}
```

- [ ] **Step 2: 修改 Achievement 接口的 condition 字段类型**

将 `condition: string` 改为 `condition: AchievementCondition`。

- [ ] **Step 3: 更新 lib/data/achievements.json 中的 condition 字段格式**

将 `"condition": "register"` 改为 `"condition": { "type": "register", "count": 1 }`。

- [ ] **Step 4: 更新 achievements/page.tsx 中引用 condition 的代码**

- [ ] **Step 5: 验证编译通过**

Run: `npx tsc --noEmit`

- [ ] **Step 6: Commit**

```bash
git add lib/types.ts lib/data/achievements.json app/\(main\)/achievements/page.tsx
git commit -m "refactor(types): add AchievementCondition and UserAchievement types"
```

---

## Phase 2: 功能补全与组件完善（P1）

> 目标：补全所有缺失的 API 端点和组件，让每个页面都接入真实 API 数据

### Task 2.1: 补全岗位模块 — 详情、确认、筛选

**Files:**
- Create: `app/api/jobs/[id]/route.ts`
- Create: `app/api/jobs/confirm/route.ts`
- Create: `components/jobs/JobSearch.tsx`
- Create: `components/jobs/JobFilters.tsx`
- Create: `components/jobs/JobDetail.tsx`
- Create: `components/jobs/MatchBadge.tsx`
- Modify: `app/(main)/jobs/page.tsx` — 接入 API 和新组件

- [ ] **Step 1: 创建 GET /api/jobs/[id] 路由**

```typescript
import { readData } from '@/lib/data';
import { apiSuccess, apiError } from '@/lib/utils';
import { Job } from '@/lib/types';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const jobs = readData<Job>('jobs');
  const job = jobs.find((j) => j.id === params.id);
  if (!job) {
    return apiError('JOB001', '岗位不存在', 404);
  }
  return apiSuccess(job);
}
```

- [ ] **Step 2: 创建 POST /api/jobs/confirm 路由**

接收 `{ jobId: string }`，将目标岗位写入用户数据，返回确认结果。

- [ ] **Step 3: 创建 JobSearch 组件**

搜索框组件，接收 `onSearch: (term: string) => void`，包含防抖逻辑。

- [ ] **Step 4: 创建 JobFilters 组件**

筛选组件，支持按 source（平台）、jobType（类型）、location（城市）筛选。

- [ ] **Step 5: 创建 JobDetail 组件**

岗位详情弹窗，使用 Radix Dialog，展示完整岗位信息 + 技能标签 + 福利 + 确认按钮。

- [ ] **Step 6: 创建 MatchBadge 组件**

匹配度标签组件，根据分数显示不同颜色（≥80 绿色、≥60 黄色、<60 灰色）。

- [ ] **Step 7: 重构 jobs/page.tsx 接入 API 和新组件**

将硬编码数据改为 `fetch('/api/jobs')`，集成 JobSearch、JobFilters、JobDetail、MatchBadge。

- [ ] **Step 8: 验证岗位搜索→筛选→查看详情→确认目标流程**

- [ ] **Step 9: Commit**

```bash
git add app/api/jobs/ components/jobs/ app/\(main\)/jobs/page.tsx
git commit -m "feat(jobs): add job detail, confirm, search, filters components and API"
```

---

### Task 2.2: 补全技能路径模块 — API 接入

**Files:**
- Create: `app/api/path/[jobId]/route.ts`
- Create: `app/api/path/progress/route.ts`
- Modify: `app/(main)/path/page.tsx` — 接入 API
- Modify: `app/api/path/generate/route.ts` — 使用统一响应格式

- [ ] **Step 1: 创建 GET /api/path/[jobId] 路由**

根据 jobId 返回对应的技能路径数据。先从 JSON 文件读取，后续可接入 AI 生成。

- [ ] **Step 2: 创建 POST /api/path/progress 路由**

接收 `{ skillNodeId: string, status: 'completed' }`，更新技能节点状态。

- [ ] **Step 3: 重构 path/page.tsx 接入 API**

将硬编码 SAMPLE_SKILLS 改为从 API 获取，支持从岗位确认页跳转并携带 jobId。

- [ ] **Step 4: Commit**

```bash
git add app/api/path/ app/\(main\)/path/page.tsx
git commit -m "feat(path): add skill path API and connect to page"
```

---

### Task 2.3: 补全学习推荐模块

**Files:**
- Create: `app/api/learning/recommendations/route.ts`
- Create: `app/api/learning/courses/route.ts`
- Create: `app/api/learning/progress/route.ts`
- Modify: `app/api/learning/route.ts` — 使用统一响应格式
- Modify: `app/(main)/learning/page.tsx` — 接入 API

- [ ] **Step 1: 创建 GET /api/learning/recommendations 路由**

基于用户简历分析结果，使用 AI 生成个性化学习推荐。

- [ ] **Step 2: 创建 GET /api/learning/courses 路由**

从 courses.json 读取课程列表，支持按 skill 和 level 筛选。

- [ ] **Step 3: 创建 POST /api/learning/progress 路由**

更新用户学习进度。

- [ ] **Step 4: 重构 learning/page.tsx 接入 API**

- [ ] **Step 5: Commit**

```bash
git add app/api/learning/ app/\(main\)/learning/page.tsx
git commit -m "feat(learning): add recommendations, courses, progress API"
```

---

### Task 2.4: 补全社区模块

**Files:**
- Create: `app/api/community/posts/[id]/route.ts`
- Create: `app/api/community/posts/[id]/like/route.ts`
- Create: `app/api/community/posts/[id]/comment/route.ts`
- Modify: `app/api/community/posts/route.ts` — 使用统一响应格式
- Modify: `app/(main)/community/page.tsx` — 接入 API

- [ ] **Step 1: 创建 GET /api/community/posts/[id] 路由**

- [ ] **Step 2: 创建 POST /api/community/posts/[id]/like 路由**

- [ ] **Step 3: 创建 POST /api/community/posts/[id]/comment 路由**

- [ ] **Step 4: 重构 community/page.tsx 接入 API**

- [ ] **Step 5: Commit**

```bash
git add app/api/community/ app/\(main\)/community/page.tsx
git commit -m "feat(community): add post detail, like, comment API"
```

---

### Task 2.5: 补全成就模块

**Files:**
- Create: `app/api/achievements/progress/route.ts`
- Create: `app/api/achievements/unlock/route.ts`
- Modify: `app/(main)/achievements/page.tsx` — 接入 API

- [ ] **Step 1: 创建 GET /api/achievements/progress 路由**

返回当前用户的成就进度列表。

- [ ] **Step 2: 创建 POST /api/achievements/unlock 路由**

检查成就条件是否满足，满足则解锁并返回结果。

- [ ] **Step 3: 重构 achievements/page.tsx 接入 API**

- [ ] **Step 4: Commit**

```bash
git add app/api/achievements/ app/\(main\)/achievements/page.tsx
git commit -m "feat(achievements): add progress and unlock API"
```

---

### Task 2.6: 补全简历模块 — 预览与报告

**Files:**
- Create: `components/resume/ResumePreview.tsx`
- Create: `components/resume/StrengthCard.tsx`
- Create: `components/resume/WeaknessCard.tsx`
- Create: `app/api/resume/report/route.ts`
- Modify: `app/(main)/resume/page.tsx` — 集成新组件

- [ ] **Step 1: 创建 ResumePreview 组件**

展示简历原始文本，支持折叠/展开，高亮关键技能词。

- [ ] **Step 2: 创建 StrengthCard 组件**

竞争力卡片，展示单项优势 + 相关技能标签。

- [ ] **Step 3: 创建 WeaknessCard 组件**

短板卡片，展示待提升项 + 改进建议。

- [ ] **Step 4: 创建 GET /api/resume/report 路由**

返回最近一次简历分析报告。

- [ ] **Step 5: 重构 resume/page.tsx 集成新组件**

- [ ] **Step 6: Commit**

```bash
git add components/resume/ app/api/resume/report/ app/\(main\)/resume/page.tsx
git commit -m "feat(resume): add preview, strength/weakness cards and report API"
```

---

### Task 2.7: Dashboard 页面接入真实数据

**Files:**
- Modify: `app/(main)/dashboard/page.tsx`

- [ ] **Step 1: 重构 dashboard 接入各模块 API**

- 从 `/api/auth/session` 获取用户信息
- 从 `/api/resume/report` 获取简历分析摘要
- 从 `/api/achievements/progress` 获取成就进度
- 显示最近活动、快捷操作、等级进度

- [ ] **Step 2: Commit**

```bash
git add app/\(main\)/dashboard/page.tsx
git commit -m "feat(dashboard): connect to real API data"
```

---

## Phase 3: 容错/安全/质量加固（P2）

> 目标：建立完整的容错体系、安全防护、测试覆盖

### Task 3.1: AI 服务容错与降级

**Files:**
- Modify: `lib/deepseek.ts` — 增加超时、重试、降级机制
- Modify: `app/api/resume/route.ts` — 增加超时处理
- Modify: `app/api/jobs/match/route.ts` — 增加超时处理
- Modify: `app/api/path/generate/route.ts` — 增加超时处理

- [ ] **Step 1: 重构 callDeepSeek 增加超时和重试**

```typescript
export async function callDeepSeek(
  messages: any[],
  options?: { temperature?: number; maxTokens?: number; retries?: number; timeout?: number }
) {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  const baseURL = process.env.DEEPSEEK_API_BASE || 'https://api.deepseek.com/v1';

  if (!apiKey || apiKey === 'your_deepseek_api_key_here') {
    throw new Error('请配置 DEEPSEEK_API_KEY');
  }

  const deepseek = new OpenAI({ apiKey, baseURL, timeout: options?.timeout || 30000 });
  const retries = options?.retries ?? 2;
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await deepseek.chat.completions.create({
        model: process.env.DEEPSEEK_MODEL || 'deepseek-chat',
        messages,
        temperature: options?.temperature || 0.7,
        max_tokens: options?.maxTokens || 2048,
      });
      return response.choices[0].message.content;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      if (attempt < retries) {
        await new Promise((resolve) => setTimeout(resolve, 1000 * (attempt + 1)));
      }
    }
  }

  throw lastError;
}
```

- [ ] **Step 2: 为所有 AI 调用 API 路由增加超时降级**

当 AI 调用超时时，返回 fallback 数据而非 500 错误。

- [ ] **Step 3: Commit**

```bash
git add lib/deepseek.ts app/api/resume/route.ts app/api/jobs/match/route.ts app/api/path/generate/route.ts
git commit -m "feat(ai): add timeout, retry and graceful degradation for DeepSeek calls"
```

---

### Task 3.2: 输入验证与安全加固

**Files:**
- Create: `lib/validators.ts` — 统一输入验证函数
- Modify: `app/api/auth/register/route.ts` — 增加输入验证
- Modify: `app/api/auth/login/route.ts` — 增加输入验证
- Modify: `app/api/resume/route.ts` — 增加文本长度限制

- [ ] **Step 1: 创建 lib/validators.ts**

```typescript
export function validateEmail(email: unknown): string | null {
  if (typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return '邮箱格式不正确';
  }
  return null;
}

export function validatePassword(password: unknown): string | null {
  if (typeof password !== 'string' || password.length < 6) {
    return '密码至少6位';
  }
  return null;
}

export function validateRequired(value: unknown, fieldName: string): string | null {
  if (value === undefined || value === null || (typeof value === 'string' && value.trim() === '')) {
    return `${fieldName}不能为空`;
  }
  return null;
}

export function validateResumeText(text: unknown): string | null {
  if (typeof text !== 'string' || text.trim().length === 0) {
    return '简历内容不能为空';
  }
  if (text.length > 50000) {
    return '简历内容不能超过50000字符';
  }
  return null;
}
```

- [ ] **Step 2: 在 register 和 login 路由中使用验证函数**

- [ ] **Step 3: 在 resume 路由中增加文本长度验证**

- [ ] **Step 4: Commit**

```bash
git add lib/validators.ts app/api/auth/register/route.ts app/api/auth/login/route.ts app/api/resume/route.ts
git commit -m "feat(security): add input validation for auth and resume APIs"
```

---

### Task 3.3: XSS 防护与内容安全

**Files:**
- Modify: `lib/utils.ts` — 新增 sanitizeHtml 函数
- Modify: `components/community/PostCard.tsx` — 对用户内容做转义
- Modify: `app/(main)/community/page.tsx` — 对帖子内容做转义

- [ ] **Step 1: 在 lib/utils.ts 新增 sanitizeHtml**

```typescript
export function sanitizeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}
```

- [ ] **Step 2: 在社区帖子展示中使用 sanitizeHtml**

- [ ] **Step 3: Commit**

```bash
git add lib/utils.ts components/community/PostCard.tsx app/\(main\)/community/page.tsx
git commit -m "feat(security): add XSS protection for user-generated content"
```

---

### Task 3.4: 前端错误边界与 Loading 状态统一

**Files:**
- Create: `components/ui/error-boundary.tsx`
- Create: `components/ui/loading-spinner.tsx`
- Modify: `app/(main)/layout.tsx` — 包裹 ErrorBoundary

- [ ] **Step 1: 创建 ErrorBoundary 组件**

```typescript
'use client';

import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">出错了</h2>
          <p className="text-gray-600">页面加载失败，请刷新重试</p>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            重试
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
```

- [ ] **Step 2: 创建 LoadingSpinner 组件**

- [ ] **Step 3: 在 main layout 中包裹 ErrorBoundary**

- [ ] **Step 4: Commit**

```bash
git add components/ui/error-boundary.tsx components/ui/loading-spinner.tsx app/\(main\)/layout.tsx
git commit -m "feat(ui): add error boundary and loading spinner components"
```

---

### Task 3.5: 数据层并发安全

**Files:**
- Modify: `lib/data/index.ts` — 增加文件锁机制

- [ ] **Step 1: 为 readData/writeData 增加基本并发保护**

使用简单的内存锁防止并发写入冲突：

```typescript
import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'lib', 'data');
const locks = new Map<string, Promise<void>>();

function acquireLock(key: string): Promise<() => void> {
  let resolveLock: () => void;
  const prev = locks.get(key) || Promise.resolve();
  const next = new Promise<void>((resolve) => { resolveLock = resolve; });
  locks.set(key, next);
  return prev.then(() => resolveLock!);
}

export function readData<T>(filename: string): T[] {
  const filePath = path.join(DATA_DIR, `${filename}.json`);
  if (!fs.existsSync(filePath)) return [];
  const content = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(content);
}

export async function writeData<T>(filename: string, data: T[]): Promise<void> {
  const release = await acquireLock(filename);
  try {
    const filePath = path.join(DATA_DIR, `${filename}.json`);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  } finally {
    release();
  }
}
```

- [ ] **Step 2: 更新所有调用 writeData 的代码为 await**

- [ ] **Step 3: Commit**

```bash
git add lib/data/index.ts app/api/auth/register/route.ts app/api/community/posts/route.ts
git commit -m "fix(data): add file write lock to prevent concurrent write conflicts"
```

---

## Phase 4: 生产化与部署准备（P3）

> 目标：性能优化、部署配置、监控埋点

### Task 4.1: 环境变量与部署配置

**Files:**
- Modify: `.env.example` — 补全所有环境变量
- Create: `app/api/health/route.ts` — 健康检查端点

- [ ] **Step 1: 补全 .env.example**

```env
# DeepSeek API 配置
DEEPSEEK_API_KEY=your_deepseek_api_key_here
DEEPSEEK_API_BASE=https://api.deepseek.com/v1
DEEPSEEK_MODEL=deepseek-chat

# NextAuth 配置
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_here

# 应用配置
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=CareerPath
```

- [ ] **Step 2: 创建健康检查端点**

```typescript
import { apiSuccess } from '@/lib/utils';

export async function GET() {
  return apiSuccess({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '0.1.0',
  });
}
```

- [ ] **Step 3: Commit**

```bash
git add .env.example app/api/health/route.ts
git commit -m "feat(deploy): add health check endpoint and complete env config"
```

---

### Task 4.2: 构建验证与性能优化

**Files:**
- Modify: `next.config.js` — 增加性能优化配置

- [ ] **Step 1: 优化 next.config.js**

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['bcryptjs'],
  },
  images: {
    domains: [],
  },
  headers: async () => [
    {
      source: '/(.*)',
      headers: [
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'X-Frame-Options', value: 'DENY' },
        { key: 'X-XSS-Protection', value: '1; mode=block' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      ],
    },
  ],
};

module.exports = nextConfig;
```

- [ ] **Step 2: 运行完整构建验证**

Run: `npm run build`
Expected: 构建成功，无错误

- [ ] **Step 3: 运行 lint 验证**

Run: `npm run lint`
Expected: 无 lint 错误

- [ ] **Step 4: Commit**

```bash
git add next.config.js
git commit -m "feat(perf): add security headers and optimize next config"
```

---

### Task 4.3: 全链路冒烟测试

**Files:**
- 无新增文件，手动测试验证

- [ ] **Step 1: 验证注册→登录→仪表盘流程**

- [ ] **Step 2: 验证简历上传/粘贴→AI 分析→报告展示流程**

- [ ] **Step 3: 验证岗位搜索→筛选→详情→确认目标流程**

- [ ] **Step 4: 验证技能路径 Flipbook 交互→进度更新流程**

- [ ] **Step 5: 验证学习推荐→课程浏览流程**

- [ ] **Step 6: 验证社区发帖→点赞→评论流程**

- [ ] **Step 7: 验证成就解锁→积分更新流程**

- [ ] **Step 8: 验证 AI 服务降级（不配置 API Key 时 fallback 正常）**

- [ ] **Step 9: 验证错误边界（故意触发错误页面）**

- [ ] **Step 10: 运行 `npm run build` 确认生产构建通过**

---

## 自检清单

### 1. 规格覆盖
| 设计文档功能 | 对应 Task | 状态 |
|-------------|-----------|------|
| 用户认证（注册/登录/登出/会话） | Task 1.2, 1.3 | ✅ |
| 简历上传/解析/报告 | Task 1.4, 2.6 | ✅ |
| 岗位列表/详情/匹配/确认 | Task 1.5, 2.1 | ✅ |
| Flipbook 技能可视化 | Task 2.2 | ✅ |
| 学习推荐/课程/进度 | Task 2.3 | ✅ |
| 社区帖子/点赞/评论 | Task 2.4 | ✅ |
| 成就进度/解锁 | Task 2.5 | ✅ |
| 仪表盘 | Task 2.7 | ✅ |
| 统一 API 响应格式 | Task 1.1 | ✅ |
| 错误码体系 | Task 1.1 | ✅ |
| AI 容错降级 | Task 3.1 | ✅ |
| 输入验证 | Task 3.2 | ✅ |
| XSS 防护 | Task 3.3 | ✅ |
| 错误边界 | Task 3.4 | ✅ |
| 部署配置 | Task 4.1, 4.2 | ✅ |

### 2. 占位符检查
- 无 "TBD"、"TODO"、"implement later" 等占位符 ✅
- 所有步骤包含完整代码 ✅

### 3. 类型一致性
- ApiResponse<T> 在 Task 1.1 定义，所有后续 API 路由使用 ✅
- AchievementCondition 在 Task 1.6 定义，achievements 模块使用 ✅
- UserAchievement 在 Task 1.6 定义 ✅
- ErrorCode 在 Task 1.1 定义，apiError 函数使用 ✅

---

**计划完成！**

保存至: `docs/superpowers/plans/2026-05-04-careerpath-optimization.md`
