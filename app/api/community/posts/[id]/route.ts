import { readData } from '@/lib/data';
import { apiSuccess, apiError } from '@/lib/utils';
import { Post } from '@/lib/types';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const posts = readData<Post>('posts');
  const post = posts.find((p) => p.id === params.id);
  if (!post) {
    return apiError('COMMUNITY001', '帖子不存在', 404);
  }
  return apiSuccess(post);
}
