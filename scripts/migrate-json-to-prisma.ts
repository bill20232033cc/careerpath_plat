import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL ?? 'file:./prisma/dev.db',
});
const prisma = new PrismaClient({ adapter });
const DATA_DIR = path.join(process.cwd(), 'lib', 'data');

function readJsonFile<T>(filename: string): T[] {
  const filePath = path.join(DATA_DIR, `${filename}.json`);
  if (!fs.existsSync(filePath)) {
    console.log(`  ⏭️  ${filename}.json 不存在，跳过`);
    return [];
  }
  const content = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(content);
}

async function migrateUsers() {
  const users = readJsonFile<any>('users');
  if (users.length === 0) return;

  console.log(`📦 迁移用户数据: ${users.length} 条`);
  for (const user of users) {
    await prisma.user.upsert({
      where: { id: user.id },
      update: {},
      create: {
        id: user.id,
        username: user.username,
        email: user.email,
        password: user.password,
        avatar: user.avatar ?? null,
        title: user.title ?? null,
        bio: user.bio ?? null,
        points: user.points ?? 0,
        level: user.level ?? 1,
        createdAt: user.createdAt ? new Date(user.createdAt) : new Date(),
        updatedAt: user.updatedAt ? new Date(user.updatedAt) : new Date(),
      },
    });
  }
  console.log('  ✅ 用户数据迁移完成');
}

async function migrateAchievements() {
  const achievements = readJsonFile<any>('achievements');
  if (achievements.length === 0) return;

  console.log(`📦 迁移成就数据: ${achievements.length} 条`);
  for (const ach of achievements) {
    await prisma.achievement.upsert({
      where: { id: ach.id },
      update: {},
      create: {
        id: ach.id,
        name: ach.name,
        description: ach.description,
        icon: ach.icon,
        category: ach.category,
        points: ach.points,
        condition: JSON.stringify(ach.condition),
      },
    });
  }
  console.log('  ✅ 成就数据迁移完成');
}

async function migrateUserAchievements() {
  const userAchievements = readJsonFile<any>('userAchievements');
  if (userAchievements.length === 0) return;

  console.log(`📦 迁移用户成就数据: ${userAchievements.length} 条`);
  for (const ua of userAchievements) {
    const user = await prisma.user.findFirst({ where: { username: ua.userId } });
    if (!user) {
      console.log(`  ⚠️  用户 ${ua.userId} 不存在，跳过该成就记录`);
      continue;
    }
    await prisma.userAchievement.upsert({
      where: {
        userId_achievementId: {
          userId: user.id,
          achievementId: ua.achievementId,
        },
      },
      update: {},
      create: {
        userId: user.id,
        achievementId: ua.achievementId,
        unlockedAt: ua.unlockedAt ? new Date(ua.unlockedAt) : new Date(),
      },
    });
  }
  console.log('  ✅ 用户成就数据迁移完成');
}

async function migrateJobs() {
  const jobs = readJsonFile<any>('jobs');
  if (jobs.length === 0) return;

  console.log(`📦 迁移岗位数据: ${jobs.length} 条`);
  for (const job of jobs) {
    await prisma.job.upsert({
      where: { id: job.id },
      update: {},
      create: {
        id: job.id,
        title: job.title,
        company: job.company,
        companyLogo: job.companyLogo ?? null,
        location: job.location,
        salary: job.salary,
        experience: job.experience,
        education: job.education,
        jobType: job.jobType,
        source: job.source,
        description: job.description ?? '',
        requirements: JSON.stringify(job.requirements ?? []),
        skills: JSON.stringify(job.skills ?? []),
        benefits: JSON.stringify(job.benefits ?? []),
        postedAt: job.postedAt ?? '',
        matchScore: job.matchScore ?? null,
      },
    });
  }
  console.log('  ✅ 岗位数据迁移完成');
}

async function migrateCourses() {
  const courses = readJsonFile<any>('courses');
  if (courses.length === 0) return;

  console.log(`📦 迁移课程数据: ${courses.length} 条`);
  for (const course of courses) {
    await prisma.course.upsert({
      where: { id: course.id },
      update: {},
      create: {
        id: course.id,
        title: course.title,
        description: course.description ?? '',
        platform: course.platform ?? '',
        duration: course.duration ?? '',
        level: course.level ?? 'beginner',
        skills: JSON.stringify(course.skills ?? []),
        url: course.url ?? '',
        thumbnail: course.thumbnail ?? null,
        rating: course.rating ?? null,
      },
    });
  }
  console.log('  ✅ 课程数据迁移完成');
}

async function migrateResumes() {
  const resumes = readJsonFile<any>('resumes');
  if (resumes.length === 0) return;

  const anonExists = await prisma.user.findUnique({ where: { id: 'anonymous' } });
  if (!anonExists) {
    await prisma.user.create({
      data: {
        id: 'anonymous',
        username: 'anonymous',
        email: 'anonymous@careerpath.local',
        password: '$2a$10$placeholder',
      },
    });
    console.log('  ℹ️  创建匿名占位用户');
  }

  console.log(`📦 迁移简历数据: ${resumes.length} 条`);
  for (const resume of resumes) {
    const userId = resume.userId === 'anonymous' ? 'anonymous' : resume.userId;
    const existingUser = await prisma.user.findUnique({ where: { id: userId } });
    if (!existingUser) {
      console.log(`  ⚠️  用户 ${userId} 不存在，跳过简历 ${resume.id}`);
      continue;
    }

    await prisma.resume.upsert({
      where: { id: resume.id },
      update: {},
      create: {
        id: resume.id,
        userId: existingUser.id,
        rawText: resume.rawText ?? '',
        parsedData: JSON.stringify(resume.parsedData ?? {}),
        analysisReport: resume.analysisReport ? JSON.stringify(resume.analysisReport) : null,
        createdAt: resume.createdAt ? new Date(resume.createdAt) : new Date(),
        updatedAt: resume.updatedAt ? new Date(resume.updatedAt) : new Date(),
      },
    });
  }
  console.log('  ✅ 简历数据迁移完成');
}

async function migratePosts() {
  const posts = readJsonFile<any>('posts');
  if (posts.length === 0) return;

  console.log(`📦 迁移帖子数据: ${posts.length} 条`);
  for (const post of posts) {
    const existingUser = await prisma.user.findUnique({ where: { id: post.userId } });
    if (!existingUser) {
      console.log(`  ⚠️  用户 ${post.userId} 不存在，跳过帖子 ${post.id}`);
      continue;
    }

    const createdPost = await prisma.post.upsert({
      where: { id: post.id },
      update: {},
      create: {
        id: post.id,
        userId: post.userId,
        type: post.type ?? 'share',
        title: post.title,
        content: post.content,
        likes: post.likes ?? 0,
        tags: JSON.stringify(post.tags ?? []),
        createdAt: post.createdAt ? new Date(post.createdAt) : new Date(),
        updatedAt: post.updatedAt ? new Date(post.updatedAt) : new Date(),
      },
    });

    if (post.comments && Array.isArray(post.comments)) {
      for (const comment of post.comments) {
        await prisma.comment.upsert({
          where: { id: comment.id },
          update: {},
          create: {
            id: comment.id,
            userId: comment.userId,
            content: comment.content,
            postId: createdPost.id,
            createdAt: comment.createdAt ? new Date(comment.createdAt) : new Date(),
          },
        });
      }
    }
  }
  console.log('  ✅ 帖子数据迁移完成');
}

async function migratePaths() {
  const paths = readJsonFile<any>('paths');
  if (paths.length === 0) return;

  console.log(`📦 迁移学习路径数据: ${paths.length} 条`);
  for (const pathData of paths) {
    const userId = pathData.userId || null;
    if (userId) {
      const existingUser = await prisma.user.findUnique({ where: { id: userId } });
      if (!existingUser) {
        console.log(`  ⚠️  用户 ${userId} 不存在，路径 ${pathData.id} 的 userId 将置空`);
      }
    }

    const createdPath = await prisma.learningPath.upsert({
      where: { id: pathData.id },
      update: {},
      create: {
        id: pathData.id,
        jobId: pathData.jobId,
        userId: userId || null,
        status: pathData.status ?? 'in-progress',
        createdAt: pathData.createdAt ? new Date(pathData.createdAt) : new Date(),
        updatedAt: pathData.updatedAt ? new Date(pathData.updatedAt) : new Date(),
      },
    });

    if (pathData.skillNodes && Array.isArray(pathData.skillNodes)) {
      for (let i = 0; i < pathData.skillNodes.length; i++) {
        const node = pathData.skillNodes[i];
        const createdNode = await prisma.skillNode.upsert({
          where: { id: node.id },
          update: {},
          create: {
            id: node.id,
            pathId: createdPath.id,
            name: node.name,
            description: node.description,
            asciiArt: node.asciiArt ?? null,
            level: node.level ?? 'beginner',
            estimatedHours: node.estimatedHours ?? 0,
            status: node.status ?? 'locked',
            completedAt: node.completedAt ? new Date(node.completedAt) : null,
            order: i,
          },
        });

        if (node.resources && Array.isArray(node.resources)) {
          for (const res of node.resources) {
            await prisma.resource.upsert({
              where: { id: res.id },
              update: {},
              create: {
                id: res.id,
                nodeId: createdNode.id,
                title: res.title,
                url: res.url,
                type: res.type ?? 'doc',
              },
            });
          }
        }
      }
    }
  }
  console.log('  ✅ 学习路径数据迁移完成');
}

async function main() {
  console.log('🚀 开始 JSON → SQLite 数据迁移\n');

  try {
    await migrateUsers();
    await migrateAchievements();
    await migrateUserAchievements();
    await migrateJobs();
    await migrateCourses();
    await migrateResumes();
    await migratePosts();
    await migratePaths();

    console.log('\n🎉 数据迁移全部完成！');
    console.log('📁 原 JSON 文件保留在 lib/data/ 目录作为备份');
  } catch (error) {
    console.error('\n❌ 迁移失败:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
