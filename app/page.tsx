export const dynamic = 'force-dynamic'; // Ensures the page is rendered dynamically


import Link from 'next/link';
import { ArrowRight, LineChart, Shield, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function Home() {
  const session = await getServerSession(authOptions);
  
  if (session?.user) {
    redirect('/dashboard');
  }
  
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <LineChart className="h-6 w-6" />
            <span className="font-semibold">TradingBot</span>
          </div>
          <nav className="flex items-center gap-4">
            <Link 
              href="/login" 
              className="text-sm font-medium hover:underline underline-offset-4"
            >
              Sign In
            </Link>
            <Button asChild>
              <Link href="/register">Get Started</Link>
            </Button>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-24 md:py-32">
          <div className="container flex flex-col items-center justify-center gap-6 text-center">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-chart-1 to-chart-2 bg-clip-text text-transparent">
                Automated Trading
              </span>{" "}
              with Advanced Analytics
            </h1>
            <p className="max-w-[700px] text-muted-foreground md:text-xl">
              Deploy your trading strategies with confidence. Monitor performance in real-time and make data-driven decisions.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button size="lg" asChild>
                <Link href="/register">
                  Start Trading Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/login">Sign In</Link>
              </Button>
            </div>
          </div>
        </section>
        <section className="w-full py-16 md:py-24 bg-muted/50">
          <div className="container grid gap-8 md:gap-12 lg:grid-cols-3">
            <div className="flex flex-col items-center gap-3 text-center">
              <div className="rounded-full bg-primary/10 p-3">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Secure Authentication</h3>
              <p className="text-muted-foreground">
                Your trading credentials are securely encrypted and stored with industry-standard
                security protocols.
              </p>
            </div>
            <div className="flex flex-col items-center gap-3 text-center">
              <div className="rounded-full bg-primary/10 p-3">
                <LineChart className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Real-time Analytics</h3>
              <p className="text-muted-foreground">
                Track your bot's performance with advanced metrics including win rates, Sharpe ratio,
                and maximum drawdown.
              </p>
            </div>
            <div className="flex flex-col items-center gap-3 text-center">
              <div className="rounded-full bg-primary/10 p-3">
                <Zap className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Strategy Automation</h3>
              <p className="text-muted-foreground">
                Set up your trading parameters once and let our bot execute your strategy
                automatically 24/7.
              </p>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t py-8 md:py-0">
        <div className="container flex flex-col gap-6 md:h-16 md:flex-row md:items-center">
          <p className="text-xs text-muted-foreground md:text-sm">
            © {new Date().getFullYear()} TradingBot. All rights reserved.
          </p>
          <nav className="ml-auto flex gap-4 sm:gap-6">
            <Link 
              href="#" 
              className="text-xs text-muted-foreground hover:underline md:text-sm"
            >
              Terms of Service
            </Link>
            <Link 
              href="#" 
              className="text-xs text-muted-foreground hover:underline md:text-sm"
            >
              Privacy Policy
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}