'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Image as ImageIcon, Code } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function CreatePostPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('求职经验');
  const [tags, setTags] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      alert('标题和内容不能为空');
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch('/api/community/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          content: content.trim(),
          category,
          tags: tags.split(',').map(t => t.trim()).filter(Boolean),
          userId: 'anonymous',
        }),
      });
      const data = await res.json();
      if (data.success) {
        router.push('/community');
      } else {
        alert(data.error?.message || '发布失败');
      }
    } catch (e) {
      console.error('[发布失败]', e);
      alert('发布失败，请检查网络');
    } finally {
      setSubmitting(false);
    }
  };

  const insertMarkdown = (syntax: string) => {
    const textarea = document.getElementById('content') as HTMLTextAreaElement;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const before = content.slice(0, start);
    const after = content.slice(end);
    const selected = content.slice(start, end);
    const newContent = before + syntax.replace('SELECTED', selected || '代码') + after;
    setContent(newContent);
    setTimeout(() => {
      textarea.focus();
      const newCursor = start + syntax.indexOf('SELECTED') + (selected ? selected.length : 2);
      textarea.setSelectionRange(newCursor, newCursor);
    }, 0);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/community">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">发布新帖子</h1>
        </div>

        <div className="bg-white rounded-xl p-6 border space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">标题</label>
            <Input
              placeholder="输入帖子标题..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">分类</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg text-sm"
            >
              <option>求职经验</option>
              <option>技术分享</option>
              <option>面试经验</option>
              <option>职业规划</option>
              <option>其他</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">标签（用逗号分隔）</label>
            <Input
              placeholder="例如：前端, React, 面试"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">内容</label>
            <div className="flex gap-2 mb-2">
              <Button variant="outline" size="sm" onClick={() => insertMarkdown('**SELECTED**')}>
                <strong>B</strong>
              </Button>
              <Button variant="outline" size="sm" onClick={() => insertMarkdown('\n```\nSELECTED\n```\n')}>
                <Code className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => insertMarkdown('\n![图片描述](图片URL)\n')}>
                <ImageIcon className="w-4 h-4" />
              </Button>
            </div>
            <textarea
              id="content"
              rows={12}
              placeholder="支持 Markdown 语法，可以插入代码块和图片..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg text-sm font-mono resize-y"
            />
          </div>

          <div className="flex justify-end gap-4">
            <Link href="/community">
              <Button variant="outline">取消</Button>
            </Link>
            <Button onClick={handleSubmit} disabled={submitting}>
              {submitting ? '发布中...' : '发布帖子'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
