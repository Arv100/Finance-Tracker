"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowDownIcon, ArrowRightIcon, ArrowUpIcon } from "lucide-react";

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

export function DashboardCards() {
  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Total Balance"
        value="$12,580.25"
        description="from last month"
        trend={12.5}
        icon={<div className="h-4 w-4 text-teal-500">💰</div>}
      />
      <StatCard
        title="Monthly Income"
        value="$5,240.00"
        description="from last month"
        trend={8.2}
        icon={<div className="h-4 w-4 text-green-500">📈</div>}
      />
      <StatCard
        title="Monthly Expenses"
        value="$3,680.50"
        description="from last month"
        trend={-4.1}
        icon={<div className="h-4 w-4 text-red-500">📉</div>}
      />
      <StatCard
        title="Savings Rate"
        value="29.8%"
        description="from last month"
        trend={2.3}
        icon={<div className="h-4 w-4 text-blue-500">🔒</div>}
      />
    </div>
  );
}