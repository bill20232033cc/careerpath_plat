import { readData, writeData } from '@/lib/data';
import { apiSuccess, apiError } from '@/lib/utils';
import { Achievement, UserAchievement, User } from '@/lib/types';

export async function POST(request: Request) {
  try {
    const { userId, achievementId } = await request.json();
    if (!userId || !achievementId) {
      return apiError('ACHIEVEMENT001', '缺少必要参数', 400);
    }

    const achievements = readData<Achievement>('achievements');
    const achievement = achievements.find((a) => a.id === achievementId);
    if (!achievement) {
      return apiError('ACHIEVEMENT001', '成就不存在', 404);
    }

    const userAchievements = readData<UserAchievement>('userAchievements') || [];
    const alreadyUnlocked = userAchievements.some(
      (ua) => ua.userId === userId && ua.achievementId === achievementId
    );

    if (alreadyUnlocked) {
      return apiSuccess({ message: '成就已解锁', alreadyUnlocked: true });
    }

    const newUserAchievement: UserAchievement = {
      userId,
      achievementId,
      unlockedAt: new Date().toISOString(),
    };
    userAchievements.push(newUserAchievement);
    await writeData('userAchievements', userAchievements);

    const users = readData<User>('users');
    const userIndex = users.findIndex((u) => u.id === userId);
    if (userIndex !== -1) {
      users[userIndex] = {
        ...users[userIndex],
        points: users[userIndex].points + achievement.points,
        updatedAt: new Date().toISOString(),
      };
      await writeData('users', users);
    }

    return apiSuccess({
      message: '成就已解锁',
      achievement,
      pointsAdded: achievement.points,
    });
  } catch (error) {
    console.error('[解锁成就失败]', error);
    return apiError('ACHIEVEMENT001', '解锁成就失败', 500);
  }
}
