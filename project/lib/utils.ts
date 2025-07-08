import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, parseISO } from 'date-fns';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string): string {
  try {
    const date = typeof dateString === 'string' ? parseISO(dateString) : new Date(dateString);
    return format(date, 'MMM d, yyyy');
  } catch (error) {
    return dateString;
  }
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'INR',
  }).format(amount);
}

export function getTransactionMockData() {
  return [
    {
      id: "t1",
      date: "2025-03-15T12:00:00Z",
      description: "Salary",
      category: "Salary",
      amount: 5000,
      type: "income",
      status: "completed",
      account: "Chase Bank",
    },
    {
      id: "t2",
      date: "2025-03-14T12:00:00Z",
      description: "Apartment Rent",
      category: "Housing",
      amount: 1800,
      type: "expense",
      status: "completed",
      account: "Chase Bank",
    },
    {
      id: "t3",
      date: "2025-03-13T12:00:00Z",
      description: "Grocery Store",
      category: "Food",
      amount: 120.50,
      type: "expense",
      status: "completed",
      account: "Bank of America",
    },
    {
      id: "t4",
      date: "2025-03-12T12:00:00Z",
      description: "Uber",
      category: "Transport",
      amount: 25.30,
      type: "expense",
      status: "completed",
      account: "Citi Bank",
    },
    {
      id: "t5",
      date: "2025-03-11T12:00:00Z",
      description: "Amazon.com",
      category: "Shopping",
      amount: 67.43,
      type: "expense",
      status: "completed",
      account: "Chase Bank",
    },
    {
      id: "t6",
      date: "2025-03-10T12:00:00Z",
      description: "Freelance Payment",
      category: "Freelance",
      amount: 800,
      type: "income",
      status: "completed",
      account: "Bank of America",
    },
    {
      id: "t7",
      date: "2025-03-09T12:00:00Z",
      description: "Netflix Subscription",
      category: "Entertainment",
      amount: 15.99,
      type: "expense",
      status: "completed",
      account: "Chase Bank",
    },
    {
      id: "t8",
      date: "2025-03-08T12:00:00Z",
      description: "Electricity Bill",
      category: "Utilities",
      amount: 95.20,
      type: "expense",
      status: "completed",
      account: "Citi Bank",
    },
    {
      id: "t9",
      date: "2025-03-07T12:00:00Z",
      description: "Mobile Phone Bill",
      category: "Utilities",
      amount: 55.90,
      type: "expense",
      status: "pending",
      account: "Bank of America",
    },
    {
      id: "t10",
      date: "2025-03-06T12:00:00Z",
      description: "Interest",
      category: "Investment",
      amount: 12.38,
      type: "income",
      status: "completed",
      account: "Chase Bank",
    }
  ];
}