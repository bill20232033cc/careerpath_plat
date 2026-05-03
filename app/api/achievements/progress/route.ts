export const dynamic = 'force-dynamic';

import { readData } from '@/lib/data';
import { apiSuccess } from '@/lib/utils';
import { Achievement, UserAchievement } from '@/lib/types';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  const achievements = readData<Achievement>('achievements');
  const userAchievements = readData<UserAchievement>('userAchievements') || [];

  const unlockedIds = userAchievements
    .filter((ua) => ua.userId === userId)
    .map((ua) => ua.achievementId);

  const progress = achievements.map((a) => ({
    ...a,
    unlocked: unlockedIds.includes(a.id),
  }));

  return apiSuccess(progress);
}
