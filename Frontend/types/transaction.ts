export interface Transaction {
  id: string;
  date: string;
  description: string;
  category: string;
  amount: number;
  type: "income" | "expense";
  status: "completed" | "pending";
  account: string;
}

export interface ChartData {
  name: string;
  value: number;
  color?: string;
}

export type CategoryBreakdown = {
  category: string;
  amount: number;
  percentage: number;
  color: string;
};

export interface FinancialSummary {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  categorySummary: CategoryBreakdown[];
  monthlyData: {
    month: string;
    income: number;
    expenses: number;
  }[];
}
