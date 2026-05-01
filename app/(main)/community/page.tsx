'use client';

import { useState } from 'react';
import { ArrowLeft, Plus, Search, MessageSquare, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PostCard } from '@/components/community/PostCard';
import { Post } from '@/lib/types';

const SAMPLE_POSTS: Post[] = [
  {
    id: '1',
    userId: 'user123',
    type: 'experience',
    title: '我的秋招经验分享 - 从简历到offer',
    content: '作为一名 985 硕士，秋招收到了字节、腾讯、阿里的offer，今天来分享一些经验... 首先简历非常重要，要突出项目亮点和量化成果。其次是算法，建议提前三个月开始刷题...',
    likes: 128,
    comments: [
      { id: 'c1', userId: 'user456', content: '感谢分享！请问算法刷了多久？', createdAt: '2026-04-28' },
    ],
    tags: ['求职', '秋招', '经验分享'],
    createdAt: '2026-04-29',
    updatedAt: '2026-04-29',
  },
  {
    id: '2',
    userId: 'user789',
    type: 'question',
    title: '前端简历怎么写更有竞争力？',
    content: '感觉自己简历写得一般，投了很多简历都没面试机会... 目前有1年React经验，做过2个项目，想问问大家的简历是怎么突出亮点的？',
    likes: 45,
    comments: [
      { id: 'c2', userId: 'user101', content: '可以看看我的简历模板', createdAt: '2026-04-27' },
      { id: 'c3', userId: 'user202', content: '建议突出项目规模和影响', createdAt: '2026-04-27' },
    ],
    tags: ['简历', '前端', '求职指导'],
    createdAt: '2026-04-28',
    updatedAt: '2026-04-28',
  },
  {
    id: '3',
    userId: 'user555',
    type: 'share',
    title: '分享一个超实用的前端学习路线图',
    content: '整理了一份前端学习路线图，从 HTML/CSS 到 React 全家桶，适合零基础入门到进阶。包含免费资源推荐和实战项目建议...',
    likes: 256,
    comments: [],
    tags: ['学习路线', '前端', '资源分享'],
    createdAt: '2026-04-27',
    updatedAt: '2026-04-27',
  },
  {
    id: '4',
    userId: 'user888',
    type: 'referral',
    title: '字节跳动前端急招！内推通道开启',
    content: '我们组急招前端工程师，base 北京，要求：3年以上经验，熟练 React，技术栈 Vue/React 都可以。有兴趣的可以私信我简历，优先处理内推！',
    likes: 89,
    comments: [],
    tags: ['内推', '字节跳动', '前端'],
    createdAt: '2026-04-26',
    updatedAt: '2026-04-26',
  },
];

export default function CommunityPage() {
  const [posts, setPosts] = useState<Post[]>(SAMPLE_POSTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'latest' | 'hot'>('latest');

  const filteredPosts = posts
    .filter(
      (post) =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => {
      if (activeTab === 'hot') {
        return b.likes - a.likes;
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

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
        <div className="flex items-center gap-4 mb-8">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900">社区</h1>
            <p className="text-gray-600">与志同道合的朋友交流</p>
          </div>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            发布帖子
          </Button>
        </div>

        <div className="bg-white rounded-xl p-4 border mb-6">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="搜索帖子..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12"
              />
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            <button
              onClick={() => setActiveTab('latest')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'latest'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              最新
            </button>
            <button
              onClick={() => setActiveTab('hot')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'hot'
                  ? 'bg-orange-100 text-orange-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              热门
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {filteredPosts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onLike={() => handleLike(post.id)}
            />
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <p className="text-lg mb-2">暂无相关帖子</p>
            <p className="text-sm">成为第一个发布的人！</p>
          </div>
        )}
      </div>
    </div>
  );
}
