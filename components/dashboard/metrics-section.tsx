import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PerformanceMetrics } from "@/types/trade";
import { TrendingUp, TrendingDown, Percent, DollarSign } from "lucide-react";

interface MetricsSectionProps {
  metrics: PerformanceMetrics;
}

export default function MetricsSection({ metrics }: MetricsSectionProps) {
  const formatNumber = (num: number) => {
    return num.toFixed(2);
  };
  
  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Profit</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            ${formatNumber(metrics.totalProfit)}
          </div>
          <p className="text-xs text-muted-foreground">
            Lifetime earnings
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Win Rate</CardTitle>
          <Percent className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatNumber(metrics.winRate)}%
          </div>
          <p className="text-xs text-muted-foreground">
            Successful trades percentage
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Metrics</CardTitle>
          <div className="flex space-x-1">
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground">Sharpe Ratio</p>
              <div className="text-lg font-medium">{formatNumber(metrics.sharpeRatio)}</div>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Max Drawdown</p>
              <div className="text-lg font-medium">${formatNumber(metrics.maxDrawdown)}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}