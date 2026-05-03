export function validateEmail(email: unknown): string | null {
  if (typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return '邮箱格式不正确';
  }
  return null;
}

export function validatePassword(password: unknown): string | null {
  if (typeof password !== 'string' || password.length < 6) {
    return '密码至少6位';
  }
  return null;
}

export function validateRequired(value: unknown, fieldName: string): string | null {
  if (value === undefined || value === null || (typeof value === 'string' && value.trim() === '')) {
    return `${fieldName}不能为空`;
  }
  return null;
}

export function validateResumeText(text: unknown): string | null {
  if (typeof text !== 'string' || text.trim().length === 0) {
    return '简历内容不能为空';
  }
  if (text.length > 50000) {
    return '简历内容不能超过50000字符';
  }
  return null;
}
