import axios from 'axios';
import { Transaction, FinancialSummary } from '@/types/transaction';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://api.fintrack.com',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const fetchTransactions = async (): Promise<Transaction[]> => {
  const response = await api.get('/transactions');
  return response.data;
};

export const fetchFinancialSummary = async (): Promise<FinancialSummary> => {
  const response = await api.get('/financial-summary');
  return response.data;
};

export const uploadTransactions = async (file: File): Promise<void> => {
  const formData = new FormData();
  formData.append('file', file);
  await api.post('/transactions/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};