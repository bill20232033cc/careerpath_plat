# Tasks

- [x] Task 1: 修复 ResumeUpload 组件交互与输入方式
  - [x] SubTask 1.1: 将 prompt 输入改为 textarea 弹窗/展开式输入，支持大容量文本
  - [x] SubTask 1.2: 修复拖拽上传事件，确保 onDrop 正确读取文件且不与 click 冲突
  - [x] SubTask 1.3: 修复点击上传，确保文件选择框正确弹出
  - [x] SubTask 1.4: 扩展 accept 文件类型为 .txt,.md,.pdf,.doc,.docx，对非常见格式给出友好提示

- [x] Task 2: 修复前后端数据格式不匹配
  - [x] SubTask 2.1: 修改 resume/page.tsx 中 fetch body 字段名从 `resumeText` 改为 `text`
  - [x] SubTask 2.2: 修改 api/resume/route.ts 返回数据结构，将 skills/recommendedRoles/improvements 映射为 AnalysisReport 的 matchScores/suggestions 等字段

- [x] Task 3: 优化错误处理与用户体验
  - [x] SubTask 3.1: 前端增加对 API 返回 fallback 数据的兼容处理，避免直接报错
  - [x] SubTask 3.2: 确保分析按钮 loading 状态与 API 请求生命周期一致

# Task Dependencies
- Task 2 依赖 Task 1（需要先能正确上传/输入内容）
- Task 3 可与 Task 2 并行
