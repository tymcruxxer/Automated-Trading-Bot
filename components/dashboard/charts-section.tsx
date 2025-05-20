"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';

interface ChartPoint {
  date: Date;
  profit: number;
}

interface ChartsSectionProps {
  chartData: ChartPoint[];
}

export default function ChartsSection({ chartData }: ChartsSectionProps) {
  // Prepare cumulative profit data
  const cumulativeData = chartData.reduce((acc: any[], point, index) => {
    const previousTotal = index > 0 ? acc[index - 1].cumulativeProfit : 0;
    acc.push({
      date: point.date,
      cumulativeProfit: previousTotal + point.profit,
      formattedDate: format(new Date(point.date), 'MMM dd'),
    });
    return acc;
  }, []);
  
  // Prepare daily profit data
  const dailyData = chartData.map(point => ({
    date: point.date,
    profit: point.profit,
    formattedDate: format(new Date(point.date), 'MMM dd'),
  }));
  
  // Custom tooltip formatter
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border rounded-md p-2 shadow-sm">
          <p className="text-sm">{payload[0].payload.formattedDate}</p>
          <p className="text-sm font-semibold">{`${payload[0].name}: $${payload[0].value.toFixed(2)}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Performance Chart</CardTitle>
        <CardDescription>
          Track your trading performance over time
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="cumulative">
          <TabsList className="mb-4">
            <TabsTrigger value="cumulative">Cumulative Profit</TabsTrigger>
            <TabsTrigger value="daily">Daily Results</TabsTrigger>
          </TabsList>
          <TabsContent value="cumulative" className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={cumulativeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="formattedDate" 
                  tickMargin={10}
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => value}
                />
                <YAxis 
                  tickFormatter={(value) => `$${value}`}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line 
                  type="monotone" 
                  dataKey="cumulativeProfit" 
                  name="Cumulative Profit"
                  stroke="hsl(var(--chart-1))" 
                  activeDot={{ r: 6 }}
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </TabsContent>
          <TabsContent value="daily" className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="formattedDate" 
                  tickMargin={10}
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => value}
                />
                <YAxis 
                  tickFormatter={(value) => `$${value}`}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line 
                  type="monotone" 
                  dataKey="profit" 
                  name="Daily Profit"
                  stroke="hsl(var(--chart-2))" 
                  activeDot={{ r: 6 }}
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}