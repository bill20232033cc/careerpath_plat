import bcrypt from 'bcryptjs';
import { readData } from '@/lib/data';
import { User } from '@/lib/types';
import { apiSuccess, apiError } from '@/lib/utils';
import { validateEmail, validatePassword } from '@/lib/validators';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    const emailError = validateEmail(email);
    if (emailError) {
      return apiError('AUTH001', emailError, 400);
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      return apiError('AUTH001', passwordError, 400);
    }

    const users = readData<User>('users');
    const user = users.find((u) => u.email === email);

    if (!user) {
      return apiError('AUTH001', '邮箱或密码错误', 401);
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return apiError('AUTH001', '邮箱或密码错误', 401);
    }

    return apiSuccess({
      id: user.id,
      email: user.email,
      username: user.username,
      points: user.points,
      level: user.level,
    });
  } catch (error) {
    console.error('[登录失败]', error);
    return apiError('AUTH001', '登录失败', 500);
  }
}
