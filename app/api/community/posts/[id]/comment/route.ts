import { readData, writeData } from '@/lib/data';
import { apiSuccess, apiError, generateId } from '@/lib/utils';
import { Post, Comment } from '@/lib/types';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId, content } = await request.json();
    if (!userId || !content) {
      return apiError('COMMUNITY001', '缺少必要参数', 400);
    }

    const posts = readData<Post>('posts');
    const index = posts.findIndex((p) => p.id === params.id);
    if (index === -1) {
      return apiError('COMMUNITY001', '帖子不存在', 404);
    }

    const newComment: Comment = {
      id: generateId(),
      userId,
      content,
      createdAt: new Date().toISOString(),
    };

    posts[index].comments.push(newComment);
    await writeData('posts', posts);

    return apiSuccess({ comment: newComment });
  } catch (error) {
    console.error('[评论失败]', error);
    return apiError('COMMUNITY001', '评论失败', 500);
  }
}
