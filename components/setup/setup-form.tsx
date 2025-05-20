"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { signOut } from 'next-auth/react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { BotConfiguration } from '@/types/trade';

const setupSchema = z.object({
  apiKey: z.string().min(1, { message: 'API Key is required' }),
  apiSecret: z.string().min(1, { message: 'API Secret is required' }),
  currencyPair: z.string().min(1, { message: 'Currency Pair is required' }),
});

type SetupFormValues = z.infer<typeof setupSchema>;

interface SetupFormProps {
  initialData?: Partial<BotConfiguration>;
}

export default function SetupForm({ initialData }: SetupFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<string | null>(null);
  const router = useRouter();

  const form = useForm<SetupFormValues>({
    resolver: zodResolver(setupSchema),
    defaultValues: {
      apiKey: initialData?.apiKey || '',
      apiSecret: initialData?.apiSecret || '',
      currencyPair: initialData?.currencyPair || '',
    },
  });

  async function onSubmit(data: SetupFormValues) {
    setIsLoading(true);

    try {
      const response = await fetch('/api/setup/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        alert(result.error || 'Something went wrong');
        return;
      }

      console.log('Setup successful:', result);
      router.push('/dashboard');
      router.refresh();
    } catch (error) {
      console.error('Setup error:', error);
      alert('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  }

  async function checkConnection() {
    setConnectionStatus('Checking...');
    try {
      const response = await fetch('/api/broker/check-connection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          apiKey: form.getValues('apiKey'),
          apiSecret: form.getValues('apiSecret'),
        }),
      });

      if (response.ok) {
        setConnectionStatus('Connection Successful');
      } else {
        const errorData = await response.json();
        setConnectionStatus(`Connection Failed: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      setConnectionStatus('Connection Failed: Unable to reach the server');
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Bot Configuration</CardTitle>
          <CardDescription>Enter your API credentials and trading preferences</CardDescription>
        </CardHeader>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <Alert>
              <AlertDescription>
                For this demo, you can use any credentials. In a production environment, you would use your actual API keys.
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <Label htmlFor="apiKey">API Key</Label>
              <Input
                id="apiKey"
                type="text"
                disabled={isLoading}
                {...form.register('apiKey')}
              />
              {form.formState.errors.apiKey && (
                <p className="text-sm text-destructive">{form.formState.errors.apiKey.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="apiSecret">API Secret</Label>
              <Input
                id="apiSecret"
                type="password"
                disabled={isLoading}
                {...form.register('apiSecret')}
              />
              {form.formState.errors.apiSecret && (
                <p className="text-sm text-destructive">{form.formState.errors.apiSecret.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="currencyPair">Currency Pair</Label>
              <Select
                onValueChange={(value) => form.setValue('currencyPair', value)}
                defaultValue={form.getValues('currencyPair')}
                disabled={isLoading}
              >
                <SelectTrigger id="currencyPair">
                  <SelectValue placeholder="Select a currency pair" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BTC/USD">BTC/USD</SelectItem>
                  <SelectItem value="ETH/USD">ETH/USD</SelectItem>
                  <SelectItem value="XRP/USD">XRP/USD</SelectItem>
                  <SelectItem value="LTC/USD">LTC/USD</SelectItem>
                  <SelectItem value="ADA/USD">ADA/USD</SelectItem>
                </SelectContent>
              </Select>
              {form.formState.errors.currencyPair && (
                <p className="text-sm text-destructive">{form.formState.errors.currencyPair.message}</p>
              )}
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={checkConnection}
              disabled={isLoading}
            >
              Check Connection
            </Button>
            {connectionStatus && <p className="text-sm mt-2">{connectionStatus}</p>}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" type="button" onClick={() => signOut({ callbackUrl: '/' })}>
              Logout
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {initialData ? 'Update Configuration' : 'Save Configuration'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}