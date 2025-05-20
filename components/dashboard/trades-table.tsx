"use client"

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { TradeLogItem } from "@/types/trade";
import { format } from "date-fns";

interface TradesTableProps {
  trades: TradeLogItem[];
}

export default function TradesTable({ trades }: TradesTableProps) {
  const [visibleTrades, setVisibleTrades] = useState(10);
  
  // Show more trades when Load More is clicked
  const loadMore = () => {
    setVisibleTrades(prev => prev + 10);
  };
  
  // Format timestamp to readable date and time
  const formatDate = (date: Date) => {
    return format(new Date(date), 'MMM dd, yyyy HH:mm');
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Trades</CardTitle>
        <CardDescription>
          Your most recent trading activity
        </CardDescription>
      </CardHeader>
      <CardContent>
        {trades.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8">
            <p className="text-muted-foreground text-center">
              No trades yet. Start your trading bot to see activity here.
            </p>
          </div>
        ) : (
          <>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Currency Pair</TableHead>
                    <TableHead>Result</TableHead>
                    <TableHead className="text-right">Profit</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {trades.slice(0, visibleTrades).map((trade) => (
                    <TableRow key={trade.id}>
                      <TableCell className="font-medium">
                        {formatDate(trade.timestamp)}
                      </TableCell>
                      <TableCell>{trade.currencyPair}</TableCell>
                      <TableCell>
                        <Badge variant={trade.result === 'win' ? 'default' : 'destructive'}>
                          {trade.result === 'win' ? 'Win' : 'Loss'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <span className={trade.profit >= 0 ? 'text-green-600' : 'text-red-600'}>
                          ${trade.profit.toFixed(2)}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            
            {visibleTrades < trades.length && (
              <div className="mt-4 flex justify-center">
                <button
                  className="text-sm text-primary hover:underline"
                  onClick={loadMore}
                >
                  Load More
                </button>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}