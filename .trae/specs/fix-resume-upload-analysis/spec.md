# 修复简历上传与分析功能 Spec

## Why
简历分析页面存在三个关键问题：点击上传无响应、拖拽上传无响应、粘贴文本被截断、分析接口报错。这些问题导致用户无法正常使用简历分析核心功能。

## What Changes
- 修复 ResumeUpload 组件中点击上传和拖拽上传的事件冲突与逻辑错误
- 修复 resume page 与 API 之间的字段名不匹配问题
- 修复 API 返回数据结构 AnalysisReport 类型不匹配问题
- 移除 prompt 粘贴方式，改用 textarea 以支持大容量文本输入
- 增加上传区域对 PDF/DOC/DOCX 等常见简历格式的支持
- 优化 API 错误处理与前端提示

## Impact
- Affected specs: 简历上传、简历分析、AI 分析接口
- Affected code: ResumeUpload.tsx, resume/page.tsx, api/resume/route.ts, lib/types.ts

## ADDED Requirements
### Requirement: 支持多种简历格式上传
The system SHALL 支持 .txt, .md, .pdf, .doc, .docx 格式的简历文件上传。

#### Scenario: 用户选择 PDF 文件
- **WHEN** 用户点击选择文件并选择 PDF
- **THEN** 系统应正确读取文本内容（或提示暂不支持解析，引导粘贴）

### Requirement: 大容量文本粘贴
The system SHALL 提供 textarea 输入框支持至少 10000 字符的简历文本粘贴。

#### Scenario: 用户粘贴长文本
- **WHEN** 用户在 textarea 中粘贴超过 5000 字符的简历
- **THEN** 内容应完整保留，不被截断

## MODIFIED Requirements
### Requirement: 简历分析接口数据格式统一
The system SHALL 统一前后端数据字段名和类型定义。

#### Scenario: 前端发送简历文本
- **WHEN** 前端调用 POST /api/resume
- **THEN** 请求体字段名为 `text`，与后端解析一致

#### Scenario: 后端返回分析结果
- **THEN** 返回数据结构应符合 AnalysisReport 类型（strengths, weaknesses, matchScores, suggestions）

### Requirement: 上传交互修复
The system SHALL 修复拖拽上传和点击上传的交互逻辑。

#### Scenario: 用户拖拽文件到上传区
- **WHEN** 用户拖拽文件到上传区域
- **THEN** 应正确触发文件读取，且不会误触发点击事件

#### Scenario: 用户点击上传区域
- **WHEN** 用户点击上传区域
- **THEN** 应弹出文件选择框，或显示文本输入框

## REMOVED Requirements
### Requirement: prompt 输入方式
**Reason**: prompt 弹窗有字符限制，不适合长文本简历粘贴
**Migration**: 使用 textarea 组件替代
