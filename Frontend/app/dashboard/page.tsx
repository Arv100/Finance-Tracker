"use client";

import { useQuery } from '@tanstack/react-query';
import Link from "next/link";
import { Metadata } from "next";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";
import { FileUploader } from "@/components/dashboard/file-uploader";
import { DashboardCards } from "@/components/dashboard/dashboard-cards";
import { AnalyticsCharts } from "@/components/dashboard/analytics-charts";
import { DataTable } from "@/components/dashboard/data-table";
import { transactionsColumns } from "@/components/dashboard/transactions-column";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { fetchTransactions, fetchFinancialSummary } from '@/lib/api';
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardPage() {
  const { data: transactions, isLoading: isLoadingTransactions } = useQuery({
    queryKey: ['transactions'],
    queryFn: fetchTransactions
  });

  const { data: financialSummary, isLoading: isLoadingFinancial } = useQuery({
    queryKey: ['financialSummary'],
    queryFn: fetchFinancialSummary
  });

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      
      <div className="flex flex-1">
        <aside className="hidden md:block w-64 border-r border-border">
          <DashboardSidebar />
        </aside>
        
        <main className="flex-1">
          <div className="container max-w-7xl py-6 space-y-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-muted-foreground">
                  Welcome back! Here's an overview of your finances.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Transaction
                </Button>
                <FileUploader />
              </div>
            </div>
            
            {isLoadingFinancial ? (
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} className="h-32" />
                ))}
              </div>
            ) : (
              <DashboardCards data={financialSummary} />
            )}
            
            {isLoadingFinancial ? (
              <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
                <Skeleton className="h-[400px]" />
                <Skeleton className="h-[400px]" />
                <Skeleton className="h-[400px] lg:col-span-2" />
              </div>
            ) : (
              <AnalyticsCharts data={financialSummary} />
            )}
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold tracking-tight">Recent Transactions</h2>
                <Link href="/dashboard/transactions">
                  <Button variant="link" className="font-medium">View All</Button>
                </Link>
              </div>
              
              {isLoadingTransactions ? (
                <Skeleton className="h-[400px]" />
              ) : (
                <DataTable
                  columns={transactionsColumns}
                  data={transactions || []}
                />
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}