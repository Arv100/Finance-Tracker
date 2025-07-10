"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowDownIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  PiggyBank,
  TrendingUp,
  TrendingDown,
  Lock,
} from "lucide-react";
import { DashboardStats } from "@/lib/api";

interface StatCardProps {
  title: string;
  value: string;
  description: string;
  trend: number;
  icon: React.ReactNode;
}

export function StatCard({ title, value, description, trend, icon }: StatCardProps) {
  return (
    <Card className="h-full flex flex-col justify-between">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="text-xl">{icon}</div>
      </CardHeader>
      <CardContent className="flex flex-col justify-end">
        <div className="text-2xl font-bold">{value}</div>
        <div className="flex items-center text-xs text-muted-foreground mt-1">
          {trend > 0 ? (
            <ArrowUpIcon className="mr-1 h-3 w-3 text-green-500 animate-bounce" />
          ) : trend < 0 ? (
            <ArrowDownIcon className="mr-1 h-3 w-3 text-red-500 animate-bounce" />
          ) : (
            <ArrowRightIcon className="mr-1 h-3 w-3 text-yellow-500 animate-pulse" />
          )}
          <span className={trend > 0 ? "text-green-500" : trend < 0 ? "text-red-500" : "text-yellow-500"}>
            {Math.abs(trend)}%
          </span>
          <span className="ml-1">{description}</span>
        </div>
      </CardContent>
    </Card>
  );
}

interface DashboardCardsProps {
  stats?: DashboardStats;
}

export function DashboardCards({ stats }: DashboardCardsProps) {
  if (!stats) {
    return (
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Loading...</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">--</div>
              <div className="text-xs text-muted-foreground">Loading...</div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      <StatCard
        title="Total Balance"
        value={formatCurrency(stats.total_balance)}
        description="from last month"
        trend={stats.balance_trend}
        icon={<PiggyBank className="h-5 w-5 text-teal-500" />}
      />
      <StatCard
        title="Monthly Income"
        value={formatCurrency(stats.monthly_income)}
        description="from last month"
        trend={stats.income_trend}
        icon={<TrendingUp className="h-5 w-5 text-green-500" />}
      />
      <StatCard
        title="Monthly Expenses"
        value={formatCurrency(stats.monthly_expenses)}
        description="from last month"
        trend={stats.expenses_trend}
        icon={<TrendingDown className="h-5 w-5 text-red-500" />}
      />
      <StatCard
        title="Savings Rate"
        value={`${stats.savings_rate.toFixed(1)}%`}
        description="from last month"
        trend={stats.savings_trend}
        icon={<Lock className="h-5 w-5 text-blue-500" />}
      />
    </div>
  );
}