import { MessageCircle, ThumbsUp } from 'lucide-react';
import { Post } from '@/lib/types';

interface PostCardProps {
  post: Post;
  onLike: () => void;
  onClick?: () => void;
}

export function PostCard({ post, onLike, onClick }: PostCardProps) {
  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      share: 'bg-blue-100 text-blue-700',
      question: 'bg-purple-100 text-purple-700',
      experience: 'bg-green-100 text-green-700',
      referral: 'bg-orange-100 text-orange-700',
    };
    return colors[type] || 'bg-gray-100 text-gray-700';
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      share: '分享',
      question: '问答',
      experience: '经验',
      referral: '内推',
    };
    return labels[type] || type;
  };

  return (
    <div
      className="bg-white rounded-xl p-6 border hover:shadow-sm transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-medium">
          {post.userId.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-900">
              用户 {post.userId.slice(0, 6)}
            </span>
            <span className={`px-2 py-0.5 rounded text-xs ${getTypeColor(post.type)}`}>
              {getTypeLabel(post.type)}
            </span>
          </div>
          <div className="text-sm text-gray-500">{post.createdAt}</div>
        </div>
      </div>

      <h3 className="text-lg font-semibold mb-2">{post.title}</h3>
      <p className="text-gray-600 mb-4 line-clamp-3">{post.content}</p>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onLike();
            }}
            className="flex items-center gap-1 text-gray-500 hover:text-blue-600 transition-colors"
          >
            <ThumbsUp className="w-4 h-4" />
            <span>{post.likes}</span>
          </button>
          <div className="flex items-center gap-1 text-gray-500">
            <MessageCircle className="w-4 h-4" />
            <span>{post.comments.length}</span>
          </div>
        </div>
        <div className="flex gap-2">
          {post.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
