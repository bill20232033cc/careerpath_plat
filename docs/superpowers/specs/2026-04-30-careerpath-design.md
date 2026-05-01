# CareerPath 职业规划平台 - 设计规范

**版本**: 1.0
**日期**: 2026-04-30
**状态**: 已批准

---

## 1. 项目概述

### 1.1 目标

CareerPath 是一款帮助大学生和在职人员规划职业发展路径的沉浸式在线平台，涵盖主流求职渠道信息，提供从简历解析到学习路径规划的完整求职解决方案。

### 1.2 核心价值

- **智能解析**: AI 驱动的简历分析，识别竞争力与短板
- **精准匹配**: 聚合主流招聘平台岗位，智能推荐目标
- **可视化学习**: Flipbook 风格的技能路径，激励式学习体验
- **成长追踪**: 个性化建议与成就系统，持续提升竞争力

---

## 2. 技术架构

### 2.1 技术栈

| 层级 | 技术选型 | 说明 |
|------|----------|------|
| 框架 | Next.js 14 (App Router) | 全栈 React 框架 |
| 语言 | TypeScript | 类型安全 |
| 样式 | Tailwind CSS | 原子化 CSS |
| UI 组件 | shadcn/ui | 现代组件库 |
| 动画 | Framer Motion | 交互动画 |
| 数据存储 | JSON 文件 | 开发阶段 |
| 认证 | NextAuth.js | 用户认证 |
| 部署 | Vercel | 零配置部署 |

### 2.2 项目结构

```
careerpath/
├── app/                    # Next.js App Router
│   ├── (auth)/            # 认证页面组
│   │   ├── login/
│   │   └── register/
│   ├── (main)/            # 主要功能页面
│   │   ├── dashboard/
│   │   ├── resume/
│   │   ├── jobs/
│   │   ├── path/
│   │   ├── learning/
│   │   └── community/
│   ├── api/               # API 路由
│   │   ├── auth/
│   │   ├── resume/
│   │   ├── jobs/
│   │   └── learning/
│   ├── layout.tsx
│   └── page.tsx
├── components/            # React 组件
│   ├── ui/               # shadcn/ui 组件
│   ├── flipbook/         # Flipbook 相关组件
│   ├── resume/           # 简历组件
│   ├── jobs/             # 岗位组件
│   └── community/        # 社区组件
├── lib/                   # 工具函数
│   ├── data/            # JSON 数据文件
│   ├── utils.ts
│   └── constants.ts
├── public/               # 静态资源
└── types/               # TypeScript 类型定义
```

### 2.3 数据流

```
┌─────────────────────────────────────────────────────────────────┐
│                        用户请求流程                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   浏览器 ──▶ Next.js Server ──▶ API Routes                      │
│                    │              │                            │
│                    │              ├── /api/resume (简历解析)     │
│                    │              ├── /api/jobs (岗位数据)      │
│                    │              ├── /api/learning (学习推荐)  │
│                    │              └── /api/auth (用户认证)       │
│                    │              │                            │
│                    ▼              ▼                            │
│              Server Components   JSON Data Store               │
│                    │              │                            │
│                    └──────┬───────┘                            │
│                           ▼                                    │
│                    返回渲染页面                                  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3. 功能模块

### 3.1 用户认证系统

**功能点**:
- 邮箱/密码注册与登录
- Session 会话管理
- 密码加密存储 (bcrypt)
- 用户资料管理

**API 端点**:
- `POST /api/auth/register` - 用户注册
- `POST /api/auth/login` - 用户登录
- `POST /api/auth/logout` - 用户登出
- `GET /api/auth/session` - 获取会话

### 3.2 简历解析系统

**功能点**:
- 简历文本/文件上传
- AI 关键技能提取
- 竞争力分析
- 短板识别
- 生成分析报告

**分析维度**:
- 技术栈匹配度
- 工作经验评估
- 教育背景分析
- 软技能识别
- 行业相关性

**API 端点**:
- `POST /api/resume/upload` - 上传简历
- `POST /api/resume/analyze` - 解析简历
- `GET /api/resume/report` - 获取分析报告

### 3.3 岗位匹配系统

**功能点**:
- 聚合主流平台岗位数据 (模拟)
- 关键词搜索与筛选
- 岗位匹配度计算
- 目标岗位确认流程

**支持平台** (模拟数据):
- Boss 直聘
- 拉勾网
- 智联招聘
- 前程无忧

**API 端点**:
- `GET /api/jobs` - 获取岗位列表
- `GET /api/jobs/[id]` - 岗位详情
- `POST /api/jobs/match` - 匹配分析
- `POST /api/jobs/confirm` - 确认目标

### 3.4 Flipbook 技能可视化

**设计理念**:
借鉴 flipbook.page 的视觉探索理念，但采用轻量级实现：
- CSS 3D transforms 实现翻页动画
- ASCII 艺术装饰元素
- 预设模板 + 动态数据渲染

**功能点**:
- 技能节点卡片展示
- 翻页交互动画
- 技能详情展开
- 学习进度追踪
- ASCII 艺术化呈现

**组件结构**:
```
┌─────────────────────────────────────────┐
│           SkillFlipbook                 │
│  ┌─────────────────────────────────┐   │
│  │      ASCII Art Header          │   │
│  │      /\  /\  /\  /\  /\        │   │
│  │     /  \/  \/  \/  \/  \       │   │
│  └─────────────────────────────────┘   │
│  ┌─────────────────────────────────┐   │
│  │      Skill Card (正面)          │   │
│  │  - 技能名称                      │   │
│  │  - 当前进度                      │   │
│  │  - 预计时长                      │   │
│  └─────────────────────────────────┘   │
│  ┌─────────────────────────────────┐   │
│  │      Skill Card (背面)          │   │
│  │  - 技能详情                      │   │
│  │  - 推荐资源                      │   │
│  │  - 学习提示                      │   │
│  └─────────────────────────────────┘   │
│         [ ◀ ]  [ ●○○○ ]  [ ▶ ]         │
└─────────────────────────────────────────┘
```

**API 端点**:
- `GET /api/path/[jobId]` - 获取技能路径
- `POST /api/path/progress` - 更新进度

### 3.5 学习推荐系统

**功能点**:
- 个性化简历优化建议
- 资格考试学习方向
- 在线培训课程推荐
- 实习机会情报收集

**推荐类型**:
- 技能提升课程
- 认证考试准备
- 项目实战机会
- 实习/内推机会

**API 端点**:
- `GET /api/learning/recommendations` - 获取推荐
- `GET /api/learning/courses` - 课程列表
- `POST /api/learning/progress` - 学习进度

### 3.6 社区系统

**功能点**:
- 发布帖子/问答
- 评论与回复
- 点赞互动
- 用户关注
- 内容搜索

**帖子类型**:
- 求职经验分享
- 技能学习交流
- 面试经验
- 内推信息

**API 端点**:
- `GET /api/community/posts` - 帖子列表
- `POST /api/community/posts` - 发布帖子
- `GET /api/community/posts/[id]` - 帖子详情
- `POST /api/community/posts/[id]/like` - 点赞
- `POST /api/community/posts/[id]/comment` - 评论

### 3.7 成就系统

**功能点**:
- 成就徽章解锁
- 成长积分体系
- 等级进度追踪
- 积分排行榜
- 成就分享

**成就类别**:
| 类别 | 徽章 | 条件 |
|------|------|------|
| 新手 | 初次上路 | 完成注册 |
| 简历 | 简历达人 | 上传并分析简历 |
| 目标 | 目标猎手 | 确认目标岗位 |
| 学习 | 学习先锋 | 完成首个技能学习 |
| 社区 | 社区达人 | 发布帖子被点赞 |
| 进阶 | 求职高手 | 获得多个岗位匹配 |

**积分规则**:
| 行为 | 积分 |
|------|------|
| 完成注册 | 50 XP |
| 上传简历 | 100 XP |
| 完成简历分析 | 200 XP |
| 确认目标岗位 | 150 XP |
| 完成技能学习 | 300 XP |
| 发布帖子 | 50 XP |
| 帖子被点赞 | 20 XP |
| 评论被回复 | 15 XP |

**API 端点**:
- `GET /api/achievements` - 成就列表
- `GET /api/achievements/progress` - 进度状态
- `POST /api/achievements/unlock` - 解锁成就

---

## 4. 数据模型

### 4.1 用户 (User)

```typescript
interface User {
  id: string;
  email: string;
  password: string;        // bcrypt 加密
  username: string;
  avatar?: string;
  title?: string;          // 职业头衔
  bio?: string;            // 个人简介
  points: number;          // 成长积分
  level: number;           // 当前等级
  createdAt: string;
  updatedAt: string;
}
```

### 4.2 简历 (Resume)

```typescript
interface Resume {
  id: string;
  userId: string;
  rawText: string;         // 原始文本
  parsedData: ParsedResume;
  analysisReport?: AnalysisReport;
  createdAt: string;
  updatedAt: string;
}

interface ParsedResume {
  skills: string[];
  education: Education[];
  experience: Experience[];
  projects: Project[];
}

interface AnalysisReport {
  strengths: string[];     // 强项
  weaknesses: string[];     // 短板
  matchScores: Record<string, number>; // 岗位匹配度
  suggestions: string[];    // 优化建议
}
```

### 4.3 岗位 (Job)

```typescript
interface Job {
  id: string;
  title: string;
  company: string;
  companyLogo?: string;
  location: string;
  salary: string;
  experience: string;       // 经验要求
  education: string;        // 学历要求
  jobType: 'full-time' | 'part-time' | 'intern';
  source: 'boss' | 'lagou' | 'zhilian' | '51job';
  description: string;
  requirements: string[];
  skills: string[];
  benefits: string[];
  postedAt: string;
}
```

### 4.4 技能路径 (LearningPath)

```typescript
interface LearningPath {
  id: string;
  jobId: string;
  userId: string;
  status: 'in-progress' | 'completed';
  skillNodes: SkillNode[];
  createdAt: string;
  updatedAt: string;
}

interface SkillNode {
  id: string;
  name: string;
  description: string;
  asciiArt: string;         // ASCII 装饰图案
  level: 'beginner' | 'intermediate' | 'advanced';
  estimatedHours: number;
  resources: Resource[];
  status: 'locked' | 'current' | 'completed';
  completedAt?: string;
}
```

### 4.5 课程 (Course)

```typescript
interface Course {
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
```

### 4.6 社区帖子 (Post)

```typescript
interface Post {
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

interface Comment {
  id: string;
  userId: string;
  content: string;
  createdAt: string;
}
```

### 4.7 成就 (Achievement)

```typescript
interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'beginner' | 'resume' | 'target' | 'learning' | 'community' | 'master';
  points: number;
  condition: AchievementCondition;
}

interface UserAchievement {
  userId: string;
  achievementId: string;
  unlockedAt: string;
}
```

---

## 5. 页面设计

### 5.1 首页 (/)

**设计目标**: 清晰展示平台价值主张，引导用户快速开始。

**组件**:
- Hero 区域: 主标题 + CTA 按钮
- 核心功能介绍卡片
- 数据统计 (用户数、岗位数、课程数)
- 用户评价轮播
- Footer

### 5.2 仪表盘 (/dashboard)

**设计目标**: 展示个人求职进度与关键数据。

**组件**:
- 用户欢迎卡片 + 等级进度
- 简历分析摘要
- 目标岗位进度
- 最近学习路径
- 成就徽章展示
- 快捷操作入口

### 5.3 简历页面 (/resume)

**功能**: 简历上传、编辑、分析。

**组件**:
- 简历上传区 (拖拽/点击)
- 简历预览
- AI 分析按钮
- 分析报告展示

### 5.4 岗位页面 (/jobs)

**功能**: 岗位搜索、筛选、匹配。

**组件**:
- 搜索栏 + 筛选条件
- 岗位卡片列表
- 匹配度标签
- 岗位详情弹窗/页

### 5.5 技能路径页面 (/path)

**功能**: Flipbook 风格技能可视化。

**组件**:
- 技能卡片翻转组件
- 进度指示器
- 导航控制 (上/下翻页)
- ASCII 艺术装饰
- 学习资源链接

### 5.6 学习中心 (/learning)

**功能**: 课程推荐、学习追踪。

**组件**:
- 推荐课程卡片
- 学习进度列表
- 技能雷达图
- 实习机会列表

### 5.7 社区页面 (/community)

**功能**: 内容发布、互动交流。

**组件**:
- 帖子分类标签
- 发布入口
- 帖子列表
- 点赞/评论交互
- 用户卡片

---

## 6. 组件库

### 6.1 Flipbook 组件

```
components/
└── flipbook/
    ├── SkillFlipbook.tsx      # 主容器
    ├── FlipCard.tsx           # 翻转卡片
    ├── AsciiHeader.tsx        # ASCII 装饰头部
    ├── ProgressIndicator.tsx # 进度指示器
    └── NavigationControls.tsx # 导航控制
```

### 6.2 简历组件

```
components/
└── resume/
    ├── ResumeUpload.tsx       # 上传组件
    ├── ResumePreview.tsx      # 预览组件
    ├── AnalysisReport.tsx     # 分析报告
    ├── StrengthCard.tsx       # 强项卡片
    └── WeaknessCard.tsx      # 短板卡片
```

### 6.3 岗位组件

```
components/
└── jobs/
    ├── JobSearch.tsx          # 搜索组件
    ├── JobFilters.tsx         # 筛选组件
    ├── JobCard.tsx            # 岗位卡片
    ├── JobDetail.tsx          # 岗位详情
    └── MatchBadge.tsx         # 匹配度标签
```

---

## 7. API 设计

### 7.1 统一响应格式

```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
  pagination?: {
    page: number;
    limit: number;
    total: number;
  };
}
```

### 7.2 错误码

| 码 | 说明 |
|----|------|
| AUTH001 | 无效的凭据 |
| AUTH002 | 会话过期 |
| RESUME001 | 上传失败 |
| RESUME002 | 解析失败 |
| JOB001 | 岗位不存在 |
| JOB002 | 匹配失败 |

---

## 8. 部署方案

### 8.1 开发环境

```bash
npm install
npm run dev
```

### 8.2 生产环境

- **平台**: Vercel
- **域名**: careerpath.app (待配置)
- **环境变量**:
  - `NEXTAUTH_SECRET`
  - `NEXTAUTH_URL`

### 8.3 数据迁移路径

```
Phase 1: JSON 文件 (MVP)
    ↓
Phase 2: SQLite (小型生产)
    ↓
Phase 3: PostgreSQL + Prisma (规模化)
```

---

## 9. 里程碑

| 阶段 | 内容 | 优先级 |
|------|------|--------|
| M1 | 项目初始化、基础组件库 | P0 |
| M2 | 用户认证系统 | P0 |
| M3 | 简历解析核心功能 | P0 |
| M4 | 岗位匹配系统 | P0 |
| M5 | Flipbook 技能可视化 | P1 |
| M6 | 学习推荐系统 | P1 |
| M7 | 社区系统 | P1 |
| M8 | 成就系统 | P2 |

---

## 10. 附录

### A. ASCII 艺术资源

技能卡片 ASCII 装饰图案库:

```javascript
const ASCII_PATTERNS = {
  frontend: `
    /\\  /\\  /\\
   /  \\/  \\/  \\
  <  React  >
   \\  /\\  /\\  /
    \\/  \\/  \\/
  `,
  backend: `
   |  __   __|
   | |  | |  |
   | |__| |__|
   |________|
   Node.js
  `,
  algorithm: `
    /\\
   /  \\
  /____\\
   |  |
   /|  |\\
  / |  | \\
   `,
  database: `
   .------.
   |      |
   | SQL  |
   '------'
   `
};
```

### B. 成就徽章设计

| ID | 名称 | 图标 | 颜色 |
|----|------|------|------|
| beginner-001 | 初次上路 | 🚀 | #10b981 |
| resume-001 | 简历达人 | 📝 | #3b82f6 |
| target-001 | 目标猎手 | 🎯 | #f59e0b |
| learning-001 | 学习先锋 | 📚 | #8b5cf6 |
| community-001 | 社区达人 | 🤝 | #ec4899 |
| master-001 | 求职高手 | 💎 | #6366f1 |

---

**文档结束**
