import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { LineChart } from "lucide-react";

interface DashboardHeaderProps {
  userName: string;
  currencyPair: string;
}

export default function DashboardHeader({ userName, currencyPair }: DashboardHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 pb-4 border-b">
      <div className="flex items-center mb-4 sm:mb-0">
        <LineChart className="h-8 w-8 mr-2 text-primary" />
        <div>
          <h1 className="text-2xl font-bold">Trading Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {userName} | Trading {currencyPair}
          </p>
        </div>
      </div>
      <div className="flex space-x-2">
        <Button variant="outline" asChild>
          <Link href="/setup">Settings</Link>
        </Button>
        <Button variant="outline" type="button" onClick={() => signOut({ callbackUrl: '/' })}>
              Logout
        </Button>
      </div>
    </div>
  );
}