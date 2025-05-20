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
    
    // Get all trade logs for the user
    const tradeLogs = await prisma.tradeLog.findMany({
      where: { userId: session.user.id },
    });
    
    if (tradeLogs.length === 0) {
      return NextResponse.json(
        {
          metrics: {
            totalProfit: 0,
            winRate: 0,
            sharpeRatio: 0,
            maxDrawdown: 0,
          },
        },
        { status: 200 }
      );
    }
    
    // Calculate metrics
    const totalProfit = tradeLogs.reduce((sum, log) => sum + log.profit, 0);
    const wins = tradeLogs.filter((log) => log.result === 'win').length;
    const winRate = (wins / tradeLogs.length) * 100;
    
    // Simple Sharpe Ratio calculation (simplified for MVP)
    const returns = tradeLogs.map((log) => log.profit);
    const avgReturn = totalProfit / tradeLogs.length;
    const stdDev = Math.sqrt(
      returns.reduce((sum, ret) => sum + Math.pow(ret - avgReturn, 2), 0) / returns.length
    );
    const sharpeRatio = stdDev !== 0 ? avgReturn / stdDev : 0;
    
    // Calculate max drawdown (simplified for MVP)
    let peak = 0;
    let maxDrawdown = 0;
    let runningTotal = 0;
    
    tradeLogs.forEach((log) => {
      runningTotal += log.profit;
      if (runningTotal > peak) {
        peak = runningTotal;
      }
      const drawdown = peak - runningTotal;
      if (drawdown > maxDrawdown) {
        maxDrawdown = drawdown;
      }
    });
    
    return NextResponse.json(
      {
        metrics: {
          totalProfit,
          winRate,
          sharpeRatio,
          maxDrawdown,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get metrics error:', error);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}