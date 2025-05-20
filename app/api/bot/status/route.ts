import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const botStatus = await prisma.botStatus.findUnique({
      where: { userId: session.user.id },
    });
    
    if (!botStatus) {
      return NextResponse.json(
        { isRunning: false, updatedAt: new Date() },
        { status: 200 }
      );
    }
    
    return NextResponse.json(
      { isRunning: botStatus.isRunning, updatedAt: botStatus.updatedAt },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get bot status error:', error);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}