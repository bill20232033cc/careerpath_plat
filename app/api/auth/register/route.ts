import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { readData, writeData } from '@/lib/data';
import { generateId } from '@/lib/utils';
import { User } from '@/lib/types';

export async function POST(request: Request) {
  try {
    const { email, password, username } = await request.json();

    const users = readData<User>('users');
    if (users.find((u) => u.email === email)) {
      return NextResponse.json({ error: '该邮箱已被注册' }, { status: 400 });
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

    return NextResponse.json({ success: true, userId: newUser.id });
  } catch (error) {
    return NextResponse.json({ error: '注册失败' }, { status: 500 });
  }
}
