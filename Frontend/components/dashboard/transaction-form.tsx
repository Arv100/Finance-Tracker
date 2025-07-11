"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { transactionApi } from "@/lib/api";
import type { Transaction, TransactionCreate } from "@/lib/api";

interface Props {
  initialValues?: Partial<Transaction>;
  onSuccess: () => void;
  mode?: "create" | "edit";
  onClose?: () => void;
}

export function TransactionForm({
  initialValues,
  onSuccess,
  onClose,
  mode = "create",
}: Props) {
  const [formData, setFormData] = useState<TransactionCreate>({
    date: "",
    description: "",
    amount: 0,
    category: "",
    account: "",
    type: "expense",
    status: "pending",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialValues) {
      setFormData({
        date: initialValues.date || "",
        description: initialValues.description || "",
        amount: initialValues.amount || 0,
        category: initialValues.category || "",
        account: initialValues.account || "",
        type: initialValues.type || "expense",
        status: initialValues.status || "pending",
      });
    }
  }, [initialValues]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "amount" ? +value : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "edit" && initialValues?.id) {
        await transactionApi.update(initialValues.id, formData);
        toast({ title: "Transaction Updated" });
      } else {
        await transactionApi.create(formData);
        toast({ title: "Transaction Added" });
      }
      onSuccess();
      if (onClose) onClose();
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

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
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
        <div>
          <Label htmlFor="status">Status</Label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md bg-background text-foreground"
          >
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      <div className="pt-4 flex justify-end gap-2">
        {onClose && (
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={loading}>
          {loading
            ? "Saving..."
            : mode === "edit"
            ? "Update Transaction"
            : "Add Transaction"}
        </Button>
      </div>
    </form>
  );
}
