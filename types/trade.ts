export interface TradeLogItem {
  id: string;
  currencyPair: string;
  result: 'win' | 'loss';
  profit: number;
  timestamp: Date;
}

export interface BotConfiguration {
  apiKey: string;
  apiSecret: string;
  currencyPair: string;
}

export interface BotStatus {
  isRunning: boolean;
  updatedAt: Date;
}

export interface PerformanceMetrics {
  totalProfit: number;
  winRate: number;
  sharpeRatio: number;
  maxDrawdown: number;
}