"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { transactionApi } from "@/lib/api";

interface Props {
  onSuccess: () => void;
}

export function TransactionForm({ onSuccess }: Props) {
  const [formData, setFormData] = useState<{
  date: string;
  description: string;
  amount: number;
  category: string;
  account: string;
  type: "income" | "expense";
}>({
  date: "",
  description: "",
  amount: 0,
  category: "",
  account: "",
  type: "expense", // default
});


  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await transactionApi.create(formData);
      toast({
        title: "Transaction Added",
        description: "Your transaction was successfully added.",
      });
      onSuccess();
    } catch (err) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pt-2">
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
        <div>
          <Label htmlFor="date">Date</Label>
          <Input type="date" name="date" value={formData.date} onChange={handleChange} required />
        </div>
        <div>
          <Label htmlFor="amount">Amount</Label>
          <Input type="number" name="amount" value={formData.amount} onChange={handleChange} required />
        </div>
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Input type="text" name="description" value={formData.description} onChange={handleChange} required />
      </div>
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
        <div>
          <Label htmlFor="category">Category</Label>
          <Input type="text" name="category" value={formData.category} onChange={handleChange} required />
        </div>
        <div>
          <Label htmlFor="account">Account</Label>
          <Input type="text" name="account" value={formData.account} onChange={handleChange} required />
        </div>
      </div>
      <div>
        <Label htmlFor="type">Type</Label>
        <select
          name="type"
          value={formData.type}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-md bg-background text-foreground"
        >
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
      </div>
      <div className="pt-4 flex justify-end gap-2">
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Add Transaction"}
        </Button>
      </div>
    </form>
  );
}
