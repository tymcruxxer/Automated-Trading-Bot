import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Update bot status
    await prisma.botStatus.upsert({
      where: { userId: session.user.id },
      update: { isRunning: false },
      create: { userId: session.user.id, isRunning: false },
    });
    
    // In a production environment, this is where you would call the external Python service
    // For this MVP, we'll simulate stopping the bot

    return NextResponse.json(
      { success: true, message: 'Bot stopped successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Stop bot error:', error);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}