import { readData, writeData } from '@/lib/data';
import { apiSuccess, apiError, generateId } from '@/lib/utils';
import { Post } from '@/lib/types';

export async function GET() {
  try {
    const posts = readData<Post>('posts');
    const sortedPosts = posts.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    return apiSuccess({ total: posts.length, posts: sortedPosts });
  } catch (error) {
    console.error('[获取帖子列表失败]', error);
    return apiError('COMMUNITY001', '获取帖子列表失败', 500);
  }
}

export async function POST(request: Request) {
  try {
    const { userId, title, content, type, tags } = await request.json();

    if (!title || !content) {
      return apiError('COMMUNITY001', '标题和内容不能为空', 400);
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
    await writeData('posts', posts);

    return apiSuccess({ postId: newPost.id, post: newPost });
  } catch (error) {
    console.error('[创建帖子失败]', error);
    return apiError('COMMUNITY001', '创建帖子失败', 500);
  }
}
