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
    
    const { apiKey, apiSecret, currencyPair } = await req.json();
    
    // Validate input
    if (!apiKey || !apiSecret || !currencyPair) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Check if config exists
    const existingConfig = await prisma.botConfig.findFirst({
      where: { userId: session.user.id },
    });
    
    let config;
    
    if (existingConfig) {
      // Update existing config
      config = await prisma.botConfig.update({
        where: { id: existingConfig.id },
        data: { apiKey, apiSecret, currencyPair },
      });
    } else {
      // Create new config
      config = await prisma.botConfig.create({
        data: {
          userId: session.user.id,
          apiKey,
          apiSecret,
          currencyPair,
        },
      });
    }
    
    return NextResponse.json({ success: true, config }, { status: 200 });
  } catch (error) {
    console.error('Save config error:', error);
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
    
    const config = await prisma.botConfig.findFirst({
      where: { userId: session.user.id },
      select: {
        apiKey: true,
        apiSecret: true,
        currencyPair: true,
      },
    });
    
    if (!config) {
      return NextResponse.json({ config: null }, { status: 200 });
    }
    
    return NextResponse.json({ config }, { status: 200 });
  } catch (error) {
    console.error('Get config error:', error);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}