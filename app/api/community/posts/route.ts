import { NextResponse } from 'next/server';
import { readData, writeData } from '@/lib/data';
import { generateId } from '@/lib/utils';
import { Post } from '@/lib/types';

export async function GET() {
  try {
    const posts = readData<Post>('posts');
    const sortedPosts = posts.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    return NextResponse.json({
      success: true,
      total: posts.length,
      posts: sortedPosts,
    });
  } catch (error) {
    console.error('Posts fetch error:', error);
    return NextResponse.json({ error: '获取帖子列表失败' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { userId, title, content, type, tags } = await request.json();

    if (!title || !content) {
      return NextResponse.json({ error: '标题和内容不能为空' }, { status: 400 });
    }

    const newPost: Post = {
      id: generateId(),
      userId: userId || 'anonymous',
      type: type || 'share',
      title,
      content,
      likes: 0,
      comments: [],
      tags: tags || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const posts = readData<Post>('posts');
    posts.push(newPost);
    writeData('posts', posts);

    return NextResponse.json({
      success: true,
      postId: newPost.id,
      post: newPost,
    });
  } catch (error) {
    console.error('Post create error:', error);
    return NextResponse.json({ error: '创建帖子失败' }, { status: 500 });
  }
}
