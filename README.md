# CareerPath - 职业规划平台

智能解析简历 · 精准岗位匹配 · 可视化学习路径

## 功能特性

### 1. 简历解析
- 支持拖拽/粘贴上传简历
- AI 智能分析关键技能
- 竞争力与短板识别
- 岗位匹配度评估

### 2. 岗位匹配
- 聚合主流招聘平台岗位
- 智能搜索与筛选
- 匹配度可视化
- 岗位详情展示

### 3. Flipbook 技能可视化
- CSS 3D 翻页动画
- ASCII 艺术装饰
- 技能路径导航
- 学习资源推荐

### 4. 学习中心
- 优质课程推荐
- 技能标签筛选
- 学习进度追踪

### 5. 社区交流
- 帖子发布与互动
- 热门/最新切换
- 分类标签管理

### 6. 成就系统
- 徽章解锁
- 积分成长
- 等级进阶

## 技术栈

- **框架**: Next.js 14 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **动画**: Framer Motion
- **UI组件**: shadcn/ui 风格
- **数据**: JSON 文件存储

## 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

访问 http://localhost:3000

## 项目结构

```
careerpath/
├── app/
│   ├── (auth)/           # 认证页面
│   ├── (main)/           # 主要功能页面
│   └── api/              # API 路由
├── components/           # React 组件
│   ├── ui/              # 基础 UI 组件
│   ├── flipbook/         # Flipbook 组件
│   ├── resume/           # 简历组件
│   ├── jobs/             # 岗位组件
│   └── community/         # 社区组件
└── lib/                  # 工具函数和数据
```

## 页面路由

| 路由 | 页面 | 功能 |
|------|------|------|
| `/` | 首页 | 落地页 |
| `/login` | 登录 | 用户登录 |
| `/register` | 注册 | 用户注册 |
| `/dashboard` | 仪表盘 | 个人中心 |
| `/resume` | 简历 | 简历分析 |
| `/jobs` | 岗位 | 岗位推荐 |
| `/learning` | 学习 | 课程推荐 |
| `/path` | 路径 | 技能路径 |
| `/community` | 社区 | 社区交流 |
| `/achievements` | 成就 | 成就中心 |

## API 接口

| 接口 | 方法 | 功能 |
|------|------|------|
| `/api/auth/register` | POST | 用户注册 |
| `/api/auth/login` | POST | 用户登录 |
| `/api/resume` | POST | 简历分析 |
| `/api/jobs` | GET | 获取岗位列表 |
| `/api/learning` | GET | 获取课程列表 |
| `/api/community/posts` | GET/POST | 帖子列表/创建 |

## 许可证

MIT License
