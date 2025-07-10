"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Plus, RefreshCw } from "lucide-react";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { FileUploader } from "@/components/dashboard/file-uploader";
import { DashboardCards } from "@/components/dashboard/dashboard-cards";
import { AnalyticsCharts } from "@/components/dashboard/analytics-charts";
import { DataTable } from "@/components/dashboard/data-table";
import { transactionsColumns } from "@/components/dashboard/transactions-column";
import { transactionApi, dashboardApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TransactionForm } from "@/components/dashboard/transaction-form";

export default function DashboardPage() {
  const router = useRouter();
  const [refreshKey, setRefreshKey] = useState(0);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      router.push("/login");
    }
  }, []);

  const {
    data: transactions = [],
    isLoading: transactionsLoading,
    error: transactionsError,
    refetch: refetchTransactions
  } = useQuery({
    queryKey: ['transactions', refreshKey],
    queryFn: transactionApi.getAll,
    retry: 3,
    retryDelay: 1000,
  });

  const {
    data: dashboardStats,
    isLoading: statsLoading,
    error: statsError,
    refetch: refetchStats
  } = useQuery({
    queryKey: ['dashboard-stats', refreshKey],
    queryFn: dashboardApi.getStats,
    retry: 3,
    retryDelay: 1000,
  });

  const {
    data: financialSummary,
    isLoading: summaryLoading,
    error: summaryError,
    refetch: refetchSummary
  } = useQuery({
    queryKey: ['financial-summary', refreshKey],
    queryFn: dashboardApi.getSummary,
    retry: 3,
    retryDelay: 1000,
  });

  const handleRefresh = async () => {
    try {
      setRefreshKey(prev => prev + 1);
      await Promise.all([
        refetchTransactions(),
        refetchStats(),
        refetchSummary()
      ]);
      toast({
        title: "Data refreshed",
        description: "Dashboard data has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Refresh failed",
        description: "Failed to refresh dashboard data. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleUploadSuccess = () => {
    handleRefresh();
  };

    const handleTransactionAdded = () => {
    setShowForm(false);
    handleRefresh();
  };

  if (transactionsError || statsError || summaryError) {
    return (
      <div className="flex min-h-screen flex-col">
        <DashboardHeader />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold text-destructive">Error Loading Dashboard</h2>
            <p className="text-muted-foreground">
              Failed to load dashboard data. Please check if the backend server is running.
            </p>
            <Button onClick={handleRefresh} variant="outline">
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />

      <main className="flex-1 bg-background">
        <div className="max-w-screen-xl mx-auto px-4 py-6 space-y-8 w-full">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
              <p className="text-muted-foreground">
                Welcome back! Here's an overview of your finances.
              </p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Button variant="outline" onClick={handleRefresh}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </Button>
              <Dialog open={showForm} onOpenChange={setShowForm}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Transaction
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-lg">
                  <DialogHeader>
                    <DialogTitle>Add New Transaction</DialogTitle>
                  </DialogHeader>
                  <TransactionForm onSuccess={handleTransactionAdded} />
                </DialogContent>
              </Dialog>
              <FileUploader onUploadSuccess={handleUploadSuccess} />
            </div>
          </div>

          {/* Dashboard Cards */}
          <div className="w-full">
            {statsLoading ? (
              <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} className="h-32" />
                ))}
              </div>
            ) : (
              <DashboardCards stats={dashboardStats} />
            )}
          </div>

          {/* Analytics Charts */}
          <div className="grid gap-6 grid-cols-1 lg:grid-cols-1">
            {summaryLoading ? (
              <>
                <Skeleton className="h-80" />
                <Skeleton className="h-80" />
                <Skeleton className="h-80 lg:col-span-2" />
              </>
            ) : (
              <AnalyticsCharts summary={financialSummary} />
            )}
          </div>

          {/* Transactions Table */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold tracking-tight">Recent Transactions</h2>
              <Link href="/dashboard/transactions">
                <Button variant="link" className="font-medium">View All</Button>
              </Link>
            </div>
            {transactionsLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-10" />
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-16" />
                ))}
              </div>
            ) : (
              <DataTable
                columns={transactionsColumns}
                data={transactions}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
