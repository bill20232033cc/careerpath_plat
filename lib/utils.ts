import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { NextResponse } from 'next/server';
import { ApiResponse, ApiError } from './types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateId(): string {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function calculateLevel(points: number): number {
  return Math.floor(points / 500) + 1;
}

export function calculateMatchScore(
  userSkills: string[],
  jobSkills: string[]
): number {
  if (jobSkills.length === 0) return 0;
  const matchedSkills = userSkills.filter((skill) =>
    jobSkills.some(
      (jobSkill) =>
        skill.toLowerCase().includes(jobSkill.toLowerCase()) ||
        jobSkill.toLowerCase().includes(skill.toLowerCase())
    )
  );
  return Math.round((matchedSkills.length / jobSkills.length) * 100);
}

export function apiSuccess<T>(data: T, status = 200): NextResponse<ApiResponse<T>> {
  return NextResponse.json({ success: true, data }, { status });
}

export function apiError(code: string, message: string, status = 400): NextResponse<ApiResponse<never>> {
  return NextResponse.json({ success: false, error: { code, message } }, { status });
}

export function apiPaginated<T>(
  data: T[],
  page: number,
  limit: number,
  total: number
): NextResponse<ApiResponse<T[]>> {
  return NextResponse.json({
    success: true,
    data,
    pagination: { page, limit, total },
  });
}

export function sanitizeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}
