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
    
    const { currencyPair, result, profit } = await req.json();
    
    // Validate input
    if (!currencyPair || !result || profit === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Create trade log
    const tradeLog = await prisma.tradeLog.create({
      data: {
        userId: session.user.id,
        currencyPair,
        result,
        profit,
      },
    });
    
    return NextResponse.json({ success: true, tradeLog }, { status: 201 });
  } catch (error) {
    console.error('Log trade error:', error);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const tradeLogs = await prisma.tradeLog.findMany({
      where: { userId: session.user.id },
      orderBy: { timestamp: 'desc' },
      take: 20,
    });
    
    return NextResponse.json({ tradeLogs }, { status: 200 });
  } catch (error) {
    console.error('Get trade logs error:', error);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}