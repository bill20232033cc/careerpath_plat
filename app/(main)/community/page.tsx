'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Search, MessageSquare, TrendingUp, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PostCard } from '@/components/community/PostCard';
import { Post } from '@/lib/types';
import { sanitizeHtml } from '@/lib/utils';

export default function CommunityPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'latest' | 'hot'>('latest');

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/community/posts');
      const result = await res.json();
      if (result.success && result.data?.posts) {
        setPosts(result.data.posts);
      }
    } catch (error) {
      console.error('[获取帖子失败]', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (postId: string) => {
    try {
      const res = await fetch(`/api/community/posts/${postId}/like`, {
        method: 'POST',
      });
      const result = await res.json();
      if (result.success) {
        setPosts(
          posts.map((post) =>
            post.id === postId ? { ...post, likes: result.data.likes } : post
          )
        );
      }
    } catch (error) {
      console.error('[点赞失败]', error);
    }
  };

  const handleComment = async (postId: string, content: string) => {
    try {
      const userId = localStorage.getItem('userId') || 'anonymous';
      const res = await fetch(`/api/community/posts/${postId}/comment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, content }),
      });
      const result = await res.json();
      if (result.success) {
        setPosts(
          posts.map((post) =>
            post.id === postId
              ? { ...post, comments: [...post.comments, result.data.comment] }
              : post
          )
        );
      }
    } catch (error) {
      console.error('[评论失败]', error);
    }
  };

  const sanitizedSearchTerm = sanitizeHtml(searchTerm);

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
                value={sanitizedSearchTerm}
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

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <span className="ml-2 text-gray-600">加载中...</span>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {filteredPosts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  onLike={() => handleLike(post.id)}
                  onComment={(content) => handleComment(post.id, content)}
                />
              ))}
            </div>

            {filteredPosts.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <p className="text-lg mb-2">暂无相关帖子</p>
                <p className="text-sm">成为第一个发布的人！</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
