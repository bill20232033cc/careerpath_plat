import { readData, writeData } from '@/lib/data';
import { apiSuccess, apiError } from '@/lib/utils';
import { Post } from '@/lib/types';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const posts = readData<Post>('posts');
    const index = posts.findIndex((p) => p.id === params.id);
    if (index === -1) {
      return apiError('COMMUNITY001', '帖子不存在', 404);
    }

    posts[index] = { ...posts[index], likes: posts[index].likes + 1 };
    await writeData('posts', posts);

    return apiSuccess({ likes: posts[index].likes });
  } catch (error) {
    console.error('[点赞失败]', error);
    return apiError('COMMUNITY001', '点赞失败', 500);
  }
}
