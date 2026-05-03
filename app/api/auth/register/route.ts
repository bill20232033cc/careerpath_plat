import bcrypt from 'bcryptjs';
import { readData, writeData } from '@/lib/data';
import { generateId, apiSuccess, apiError } from '@/lib/utils';
import { validateEmail, validatePassword, validateRequired } from '@/lib/validators';
import { User } from '@/lib/types';

export async function POST(request: Request) {
  try {
    const { email, password, username } = await request.json();

    const emailError = validateEmail(email);
    if (emailError) {
      return apiError('AUTH001', emailError, 400);
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      return apiError('AUTH001', passwordError, 400);
    }

    const usernameError = validateRequired(username, '用户名');
    if (usernameError) {
      return apiError('AUTH001', usernameError, 400);
    }

    const users = readData<User>('users');
    if (users.find((u) => u.email === email)) {
      return apiError('AUTH001', '该邮箱已被注册', 400);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      id: generateId(),
      email,
      password: hashedPassword,
      username,
      points: 50,
      level: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    users.push(newUser);
    writeData('users', users);

    return apiSuccess({ userId: newUser.id });
  } catch (error) {
    console.error('[注册失败]', error);
    return apiError('AUTH001', '注册失败', 500);
  }
}
