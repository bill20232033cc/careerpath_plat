import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { readData } from '@/lib/data';
import { User } from '@/lib/types';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    const users = readData<User>('users');
    const user = users.find((u) => u.email === email);

    if (!user) {
      return NextResponse.json({ error: '邮箱或密码错误' }, { status: 401 });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return NextResponse.json({ error: '邮箱或密码错误' }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        points: user.points,
        level: user.level,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: '登录失败' }, { status: 500 });
  }
}
