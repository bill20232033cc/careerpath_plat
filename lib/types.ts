export interface User {
  id: string;
  email: string;
  password: string;
  username: string;
  avatar?: string;
  title?: string;
  bio?: string;
  points: number;
  level: number;
  createdAt: string;
  updatedAt: string;
}

export interface ParsedResume {
  skills: string[];
  education: Education[];
  experience: Experience[];
  projects: Project[];
}

export interface Education {
  school: string;
  degree: string;
  major: string;
  startDate: string;
  endDate: string;
}

export interface Experience {
  company: string;
  position: string;
  description: string;
  startDate: string;
  endDate: string;
}

export interface Project {
  name: string;
  description: string;
  technologies: string[];
  url?: string;
}

export interface AnalysisReport {
  strengths: string[];
  weaknesses: string[];
  matchScores: Record<string, number>;
  suggestions: string[];
}

export interface Resume {
  id: string;
  userId: string;
  rawText: string;
  parsedData: ParsedResume;
  analysisReport?: AnalysisReport;
  createdAt: string;
  updatedAt: string;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  companyLogo?: string;
  location: string;
  salary: string;
  experience: string;
  education: string;
  jobType: 'full-time' | 'part-time' | 'intern';
  source: 'boss' | 'lagou' | 'zhilian' | '51job';
  description: string;
  requirements: string[];
  skills: string[];
  benefits: string[];
  postedAt: string;
}

export interface SkillNode {
  id: string;
  name: string;
  description: string;
  asciiArt: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  estimatedHours: number;
  resources: Resource[];
  status: 'locked' | 'current' | 'completed';
  completedAt?: string;
}

export interface LearningPath {
  id: string;
  jobId: string;
  userId: string;
  status: 'in-progress' | 'completed';
  skillNodes: SkillNode[];
  createdAt: string;
  updatedAt: string;
}

export interface Resource {
  id: string;
  title: string;
  url: string;
  type: 'course' | 'doc' | 'video';
}

export interface Course {
  id: string;
  title: string;
  platform: string;
  url: string;
  thumbnail?: string;
  duration: string;
  skills: string[];
  level: 'beginner' | 'intermediate' | 'advanced';
  rating?: number;
  description: string;
}

export interface AchievementCondition {
  type: 'register' | 'analyze_resume' | 'confirm_target' | 'complete_skill' | 'post_liked' | 'multiple_matches';
  count: number;
}

export interface UserAchievement {
  userId: string;
  achievementId: string;
  unlockedAt: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'beginner' | 'resume' | 'target' | 'learning' | 'community' | 'master';
  points: number;
  condition: AchievementCondition;
}

export interface Post {
  id: string;
  userId: string;
  type: 'share' | 'question' | 'experience' | 'referral';
  title: string;
  content: string;
  likes: number;
  comments: Comment[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: string;
  userId: string;
  content: string;
  createdAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
  pagination?: {
    page: number;
    limit: number;
    total: number;
  };
}

export interface ApiError {
  code: string;
  message: string;
}

export type ErrorCode =
  | 'AUTH001'
  | 'AUTH002'
  | 'RESUME001'
  | 'RESUME002'
  | 'JOB001'
  | 'JOB002'
  | 'PATH001'
  | 'LEARNING001'
  | 'COMMUNITY001'
  | 'ACHIEVEMENT001';
