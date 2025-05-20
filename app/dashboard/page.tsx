'use client';

export const dynamic = 'force-dynamic'; // Ensures the page is rendered dynamically


import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import DashboardHeader from '@/components/dashboard/dashboard-header';
import MetricsSection from '@/components/dashboard/metrics-section';
import ChartsSection from '@/components/dashboard/charts-section';
import TradesTable from '@/components/dashboard/trades-table';
import BotControls from '@/components/dashboard/bot-controls';
import { useEffect } from 'react';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  useEffect(() => {
    get_wallet_balance();
  }, []);
  // Check if bot is running

  if (!session?.user) {
    redirect('/login');
  }

  // Check if bot config exists
  const config = await prisma.botConfig.findFirst({
    where: { userId: session.user.id },
  });

  if (!config) {
    redirect('/setup');
  }

  const get_wallet_balance = async () => {
  try {
    const response = await fetch('https://api.binance.com/binancepay/openapi/balance', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.BINANCE_API_KEY}`,
      },
      body: JSON.stringify({
        wallet: "SPOT_WALLET",
        currency: "USDT"
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Wallet balance:', data);
    return data;

  } catch (error) {
    if (error instanceof Error) {
      console.error('Failed to fetch wallet balance:', error.message);
      // Optionally, return an error object or rethrow
      return { error: error.message };
    } else {
      console.error('Failed to fetch wallet balance:', error);
      return { error: String(error) };
    }
  }
};


  

  // Get bot status
  const botStatus = await prisma.botStatus.findUnique({
    where: { userId: session.user.id },
  });

  // Get trade logs
  const tradeLogs = await prisma.tradeLog.findMany({
    where: { userId: session.user.id },
    orderBy: { timestamp: 'desc' },
    take: 20,
  });

  // Calculate metrics
  const allTradeLogs = await prisma.tradeLog.findMany({
    where: { userId: session.user.id },
  });

  let metrics = {
    totalProfit: 0,
    winRate: 0,
    sharpeRatio: 0,
    maxDrawdown: 0,
  };

  if (allTradeLogs.length > 0) {
    const totalProfit = allTradeLogs.reduce((sum, log) => sum + log.profit, 0);
    const wins = allTradeLogs.filter((log) => log.result === 'win').length;
    const winRate = (wins / allTradeLogs.length) * 100;

    // Simple Sharpe Ratio calculation (simplified for MVP)
    const returns = allTradeLogs.map((log) => log.profit);
    const avgReturn = totalProfit / allTradeLogs.length;
    const stdDev = Math.sqrt(
      returns.reduce((sum, ret) => sum + Math.pow(ret - avgReturn, 2), 0) / returns.length
    );
    const sharpeRatio = stdDev !== 0 ? avgReturn / stdDev : 0;

    // Calculate max drawdown (simplified for MVP)
    let peak = 0;
    let maxDrawdown = 0;
    let runningTotal = 0;

    allTradeLogs.forEach((log) => {
      runningTotal += log.profit;
      if (runningTotal > peak) {
        peak = runningTotal;
      }
      const drawdown = peak - runningTotal;
      if (drawdown > maxDrawdown) {
        maxDrawdown = drawdown;
      }
    });

    metrics = {
      totalProfit,
      winRate,
      sharpeRatio,
      maxDrawdown,
    };
  }

  // Prepare chart data
  const chartData = allTradeLogs.map((log) => ({
    date: log.timestamp,
    profit: log.profit,
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <DashboardHeader
        userName={session.user.name || 'Guest'}
        currencyPair={config.currencyPair}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <MetricsSection metrics={metrics} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <ChartsSection chartData={chartData} />
        </div>
        <div>
          <BotControls
            isRunning={botStatus?.isRunning || false}
            lastUpdated={botStatus?.updatedAt}
          />
        </div>
      </div>

      {/* <div className="mb-8">
        <TradesTable trades={tradeLogs} />
      </div> */}
    </div>
  );
}