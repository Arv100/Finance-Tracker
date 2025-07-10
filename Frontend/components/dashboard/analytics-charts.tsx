"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FinancialSummary } from "@/lib/api";
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  LineChart,
  Line,
  CartesianGrid,
  AreaChart,
  Area
} from "recharts";

import {formatCurrency} from "@/lib/utils"

interface AnalyticsChartsProps {
  summary?: FinancialSummary;
}
// export const formatCurrency = (value: number) =>
//   new Intl.NumberFormat("en-IN", {
//     style: "currency",
//     currency: "INR",
//   }).format(value);

export function AnalyticsCharts({ summary }: AnalyticsChartsProps) {
  if (!summary) {
    return (
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Loading Charts...</CardTitle>
          </CardHeader>
          <CardContent className="h-80 flex items-center justify-center">
            <div className="text-muted-foreground">Loading chart data...</div>
          </CardContent>
        </Card>
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Loading Charts...</CardTitle>
          </CardHeader>
          <CardContent className="h-80 flex items-center justify-center">
            <div className="text-muted-foreground">Loading chart data...</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle>Monthly Overview</CardTitle>
          <CardDescription>Income vs. Expenses for the last 6 months</CardDescription>
        </CardHeader>
        <CardContent className="h-80">
          console.log(summary.category_summary);
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={summary.monthly_data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--background))', 
                  borderColor: 'hsl(var(--border))',
                  borderRadius: '0.5rem',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                }} 
                formatter={(value) => [formatCurrency(Number(value)), '']}
              />
              <Legend />
              <Bar dataKey="income" fill="hsl(var(--chart-2))" name="Income" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expenses" fill="hsl(var(--chart-1))" name="Expenses" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle>Expense Breakdown</CardTitle>
          <CardDescription>Distribution of expenses by category</CardDescription>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={summary.category_summary}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="amount"
                label={({ category, percentage }) => `${category} (${percentage}%)`}
                labelLine={{ stroke: 'hsl(var(--foreground))', strokeWidth: 0.5, opacity: 0.5 }}
              >
                {/* {console.log(summary.category_summary)} */}
                {summary.category_summary.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value) => [formatCurrency(Number(value)), 'Amount']}
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--background))', 
                  borderColor: 'hsl(var(--border))',
                  borderRadius: '0.5rem',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="col-span-1 lg:col-span-2">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Financial Trends</CardTitle>
              <CardDescription>View your financial trends over time</CardDescription>
            </div>
            <Tabs defaultValue="balance">
              <TabsList>
                <TabsTrigger value="balance">Balance</TabsTrigger>
                <TabsTrigger value="income">Income</TabsTrigger>
                <TabsTrigger value="expenses">Expenses</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent className="h-80">
          <Tabs defaultValue="balance" className="h-full">
            <TabsContent value="balance" className="h-full mt-0">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={summary.monthly_data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <defs>
                    <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value, name, props) => {
                      if (name === "balance") {
                        const income = props.payload.income;
                        const expenses = props.payload.expenses;
                        return [formatCurrency(Number(income) - Number(expenses)), 'Balance'];
                      }
                      else if (name === "income"){
                        const income = props.payload.income;
                        return [formatCurrency(Number(income)), 'Income'];
                      }
                      else if (name === "expense"){
                        const expense = props.payload.expenses;
                        return [formatCurrency(Number(expense)), 'Expenses'];
                      }
                      return [formatCurrency(Number(value)), name];
                    }}
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--background))', 
                      borderColor: 'hsl(var(--border))',
                      borderRadius: '0.5rem'
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey={(data) => data.income - data.expenses} 
                    name="balance"
                    stroke="hsl(var(--chart-2))" 
                    fillOpacity={1} 
                    fill="url(#colorBalance)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </TabsContent>
            <TabsContent value="income" className="h-full mt-0">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={summary.monthly_data.map(({ month, income }) => ({ month, income }))} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => [formatCurrency(Number(value)), 'Income']}
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--background))', 
                      borderColor: 'hsl(var(--border))',
                      borderRadius: '0.5rem' 
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="income" 
                    stroke="hsl(var(--chart-2))" 
                    strokeWidth={2}
                    dot={{ r: 4, fill: 'hsl(var(--chart-2))' }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </TabsContent>
            <TabsContent value="expenses" className="h-full mt-0">
  <ResponsiveContainer width="100%" height="100%">
    <LineChart data={summary.monthly_data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
      <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
      <XAxis dataKey="month" />
      <YAxis />
      <Tooltip 
        formatter={(value) => [formatCurrency(Number(value)), 'Expenses']}
        contentStyle={{ 
          backgroundColor: 'hsl(var(--background))', 
          borderColor: 'hsl(var(--border))',
          borderRadius: '0.5rem' 
        }}
      />
      <Line 
        type="monotone" 
        dataKey="expenses" 
        stroke="hsl(var(--chart-1))" 
        strokeWidth={2}
        dot={{ r: 4, fill: 'hsl(var(--chart-1))' }}
        activeDot={{ r: 6 }}
      />
    </LineChart>
  </ResponsiveContainer>
</TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}