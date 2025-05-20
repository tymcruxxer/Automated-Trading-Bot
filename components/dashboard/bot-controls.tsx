"use client"

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
// import { useToast } from '@/components/ui/use-toast';
import { PlayCircle, StopCircle, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';

interface BotControlsProps {
  isRunning: boolean;
  lastUpdated?: Date;
}

export default function BotControls({ isRunning: initialIsRunning, lastUpdated }: BotControlsProps) {
  const [isRunning, setIsRunning] = useState(initialIsRunning);
  const [isLoading, setIsLoading] = useState(false);
  // const { toast } = useToast();
  
  // Format timestamp to readable date and time
  const formatTimestamp = (date?: Date) => {
    if (!date) return 'Never updated';
    return format(new Date(date), 'MMM dd, yyyy HH:mm:ss');
  };
  
  const startBot = async () => {
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/bot/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to start bot');
      }
      
      setIsRunning(true);
      
      // toast({
      //   title: 'Success',
      //   description: 'Trading bot started successfully',
      // });
      console.log('Trading bot started successfully');
      
      // Simulate some trades
      simulateTrades();
    } catch (error) {
      // toast({
      //   title: 'Error',
      //   description: error instanceof Error ? error.message : 'Something went wrong',
      //   variant: 'destructive',
      // });
      console.error('Error starting bot:', error);
      alert(error instanceof Error ? error.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };
  
  const stopBot = async () => {
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/bot/stop', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to stop bot');
      }
      
      setIsRunning(false);
      
      // toast({
      //   title: 'Success',
      //   description: 'Trading bot stopped successfully',
      // });
      console.log('Trading bot stopped successfully');
    } catch (error) {
      // toast({
      //   title: 'Error',
      //   description: error instanceof Error ? error.message : 'Something went wrong',
      //   variant: 'destructive',
      // });
      console.error('Error stopping bot:', error);
      alert(error instanceof Error ? error.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Function to simulate trade logs (for demonstration purposes)
  const simulateTrades = async () => {
    // Get the bot config to know the currency pair
    const configResponse = await fetch('/api/setup/save');
    const configData = await configResponse.json();
    const currencyPair = configData.config?.currencyPair || 'BTC/USD';
    
    // Create some random trades
    for (let i = 0; i < 5; i++) {
      // Wait a bit between trades for realism
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const isWin = Math.random() > 0.4; // 60% win rate
      const profit = isWin ? 
        Math.random() * 100 + 10 : // Win between $10 and $110
        -1 * (Math.random() * 80 + 5); // Loss between $-5 and $-85
      
      await fetch('/api/log-trade', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currencyPair,
          result: isWin ? 'win' : 'loss',
          profit,
        }),
      });
    }
    
    // Refresh the page to show the new trades
    window.location.reload();
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Bot Controls</CardTitle>
        <CardDescription>
          Manage your trading bot
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <div className={`h-3 w-3 rounded-full ${isRunning ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="font-medium">Status: {isRunning ? 'Running' : 'Stopped'}</span>
          </div>
          <div className="text-sm text-muted-foreground">
            Last updated: {formatTimestamp(lastUpdated)}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant={isRunning ? "outline" : "default"}
          onClick={isRunning ? stopBot : startBot}
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? (
            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
          ) : isRunning ? (
            <StopCircle className="h-4 w-4 mr-2" />
          ) : (
            <PlayCircle className="h-4 w-4 mr-2" />
          )}
          {isRunning ? 'Stop Bot' : 'Start Bot'}
        </Button>
      </CardFooter>
    </Card>
  );
}