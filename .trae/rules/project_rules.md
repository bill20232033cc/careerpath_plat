# CareerPath 职业规划平台 - 项目开发规范

## 核心原则

**保护现有原型，渐进式升级，禁止一次性重构**

---

## 规范体系说明

本项目遵循**双文档协作规范体系**：

| 文档 | 定位 | 优先级 | 关系 |
|------|------|--------|------|
| **本项目开发规范** (`project_rules.md`) | 项目强制规范 | 高（必须遵守） | 基础规范，所有开发必须遵循 |
| **开发原则规范** (`AGENTS.md`) | 全流程执行标准 | 中（必须执行） | 全链路开发流程、技术设计指导 |

**协作原则**：
1. 所有代码必须符合本规范 (`project_rules.md`) 的硬性要求
2. 在满足本规范的前提下，可参考 `AGENTS.md` 优化设计和代码质量
3. 如两规范存在冲突，以 `project_rules.md` 为准
4. 建议开发者同时阅读两份规范，以编写高质量的代码

---

## 一、重构禁令

### 禁止事项
- ❌ **禁止** 一次性大规模重构
- ❌ **禁止** 同时修改多个模块
- ❌ **禁止** 重构时添加新功能
- ❌ **禁止** 未经用户确认修改核心数据模型

### 单次变更限制
| 限制项 | 上限 |
|--------|------|
| 修改文件数 | ≤5个 |
| 代码行数 | ≤200行 |
| 影响模块 | ≤1个 |

---

## 二、渐进式开发流程

### 阶段一：文档化（当前）
- 记录现状
- 建立规范
- 修复合规性问题

### 阶段二：新功能试点（1-2月）
- 新功能遵循规范
- 选择1-2模块试点
- 积累经验

### 阶段三：核心重构（3-6月）
- 重构核心页面
- 充分测试验证
- 保持回滚能力

### 阶段四：全面生产化（6月+）
- 全面应用规范
- 性能优化完成
- 合规审核通过

---

## 三、技术栈约束

### 已确定的技术栈（禁止更换）
| 技术 | 版本 | 用途 |
|------|------|------|
| Next.js | 14.2.0 | 全栈框架（App Router） |
| React | ^18.2.0 | UI 库 |
| TypeScript | ^5.3.3 | 类型系统 |
| Tailwind CSS | ^3.4.0 | 样式方案 |
| Radix UI | 各组件 | 无障碍 UI 原语 |
| Framer Motion | ^11.0.0 | 动画 |
| NextAuth.js | ^4.24.5 | 认证 |
| OpenAI SDK | ^4.28.0 | AI 服务调用（DeepSeek） |
| bcryptjs | ^2.4.3 | 密码加密 |

### 新增依赖原则
- 新增 npm 包必须经过用户确认
- 优先使用项目已有依赖的能力，避免引入重复功能的包
- UI 组件优先使用 shadcn/ui 模式（Radix + Tailwind + CVA）

---

## 四、代码规范

### 风格
- 缩进：2空格
- 分号：不使用（TypeScript 默认）
- 引号：单引号
- 组件文件：PascalCase（如 `ResumeUpload.tsx`）
- 工具/路由文件：camelCase 或 kebab-case
- 类型/接口：PascalCase（如 `AnalysisReport`）

### TypeScript 规范
- 所有新增代码必须使用 TypeScript
- 类型定义统一放在 `lib/types.ts`，禁止在组件中定义全局类型
- API 路由的请求/响应类型必须与 `lib/types.ts` 对齐
- 禁止使用 `any`，特殊情况必须注释说明原因

### 组件规范
- 组件使用 `'use client'` 标记客户端组件
- 组件 props 必须定义 interface
- UI 基础组件放在 `components/ui/`
- 业务组件按模块分目录：`components/resume/`, `components/jobs/`, `components/flipbook/`, `components/community/`

### API 路由规范
- 路由文件放在 `app/api/` 下，遵循 Next.js App Router 约定
- 每个路由必须做 try-catch 异常处理
- 返回格式统一：`{ success: boolean, data/analysis/fallback?: any, error?: string }`
- AI 调用必须提供 fallback 数据，fallback 结构与正常返回一致

### 前后端字段名一致性
- 前端 fetch 的 body 字段名必须与后端 `request.json()` 解析的字段名完全匹配
- 后端返回的 JSON 结构必须与前端 `lib/types.ts` 中的类型定义一致
- 新增接口必须先定义类型，再实现

### 异常处理
```typescript
try {
  await operation();
} catch (error) {
  console.error('[操作失败]', error);
}
```

### 边界处理
```typescript
const value = obj?.property ?? defaultValue;
if (!Array.isArray(arr)) return [];
```

---

## 五、安全防护措施

### 重构前
- **Git备份**：`git checkout -b backup/功能名-日期`
- **基线测试**：验证核心功能正常

### 重构中
- 每30分钟提交一次
- 每完成小功能点验证
- 添加关键位置日志

### 重构后
- 本地验证：`npm run build` 无错误
- 页面验证：核心页面功能正常
- API 验证：接口返回正确

---

## 六、回滚策略

### 代码回滚
```bash
git revert HEAD                    # 回滚上一提交
git checkout backup/xxx            # 从备份恢复
```

---

## 七、Git工作流

```
main (生产)
  └── develop (开发)
        ├── feature/xxx
        ├── fix/xxx
        └── docs/xxx
```

### 提交格式
```
<type>(<scope>): <subject>

type: feat/fix/docs/style/refactor/test/chore
scope: resume/jobs/path/learning/community/auth/ui/api
```

---

## 八、测试标准

### 必测项
- [ ] 核心功能正常
- [ ] 数据隔离正确
- [ ] 边界情况处理
- [ ] 错误提示清晰
- [ ] 前后端字段名一致

### 回归测试
- 简历模块变更 → 测试上传/粘贴/分析全流程
- 岗位模块变更 → 测试匹配/展示流程
- 认证模块变更 → 测试注册/登录流程
- AI 接口变更 → 测试正常返回 + fallback 降级

---

## 九、安全红线

### 数据安全
- 密码必须使用 bcryptjs 哈希存储
- API Key 禁止硬编码，必须通过环境变量配置
- 环境变量必须提供 `.env.example` 模板

### 访问控制
- 登录状态检查
- API 路由需验证请求参数完整性

### 输入验证
- 长度/类型验证
- XSS 防护
- 文件上传限制（类型、大小）

### AI 服务安全
- DeepSeek API Key 禁止提交到代码仓库
- AI 返回内容必须做 JSON 解析容错
- 禁止将用户敏感信息（密码等）传入 AI Prompt

---

## 十、决策流程

### 技术决策
1. 评估风险等级
2. 制定回滚方案
3. 小范围试点
4. 验证后推广

### 紧急处理
1. 立即回滚到稳定版本
2. 定位问题原因
3. 修复后重新验证
4. 记录经验教训

---

## 十一、环境变量管理

### 必需变量
| 变量 | 说明 | 示例 |
|------|------|------|
| `DEEPSEEK_API_KEY` | DeepSeek API 密钥 | `sk-xxx` |
| `DEEPSEEK_API_BASE` | API 基础地址 | `https://api.deepseek.com/v1` |
| `DEEPSEEK_MODEL` | 模型名称 | `deepseek-chat` |

### 可选变量
| 变量 | 说明 | 示例 |
|------|------|------|
| `NEXTAUTH_URL` | NextAuth 回调地址 | `http://localhost:3001` |
| `NEXTAUTH_SECRET` | NextAuth 加密密钥 | 随机字符串 |

### 规则
- 所有环境变量必须在 `.env.example` 中登记
- 禁止在代码中硬编码密钥
- 禁止将 `.env` 文件提交到代码仓库
