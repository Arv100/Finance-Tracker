"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowDownIcon, ArrowRightIcon, ArrowUpIcon } from "lucide-react";
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
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="flex items-center text-xs text-muted-foreground">
          {trend > 0 ? (
            <ArrowUpIcon className="mr-1 h-3 w-3 text-green-500" />
          ) : trend < 0 ? (
            <ArrowDownIcon className="mr-1 h-3 w-3 text-red-500" />
          ) : (
            <ArrowRightIcon className="mr-1 h-3 w-3 text-yellow-500" />
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
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
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
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Total Balance"
        value={formatCurrency(stats.total_balance)}
        description="from last month"
        trend={stats.balance_trend}
        icon={<div className="h-4 w-4 text-teal-500">💰</div>}
      />
      <StatCard
        title="Monthly Income"
        value={formatCurrency(stats.monthly_income)}
        description="from last month"
        trend={stats.income_trend}
        icon={<div className="h-4 w-4 text-green-500">📈</div>}
      />
      <StatCard
        title="Monthly Expenses"
        value={formatCurrency(stats.monthly_expenses)}
        description="from last month"
        trend={stats.expenses_trend}
        icon={<div className="h-4 w-4 text-red-500">📉</div>}
      />
      <StatCard
        title="Savings Rate"
        value={`${stats.savings_rate.toFixed(1)}%`}
        description="from last month"
        trend={stats.savings_trend}
        icon={<div className="h-4 w-4 text-blue-500">🔒</div>}
      />
    </div>
  );
}