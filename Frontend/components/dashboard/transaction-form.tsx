"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { transactionApi } from "@/lib/api";
import type { Transaction, TransactionCreate } from "@/lib/api";

// Predefined categories
const EXPENSE_CATEGORIES = [
  "Food & Dining",
  "Groceries",
  "Housing",
  "Rent/Mortgage",
  "Utilities",
  "Transportation",
  "Gas/Fuel",
  "Public Transport",
  "Healthcare",
  "Insurance",
  "Entertainment",
  "Shopping",
  "Clothing",
  "Personal Care",
  "Education",
  "Travel",
  "Subscriptions",
  "Gifts & Donations",
  "Fees & Charges",
  "Taxes",
  "Other Expense",
];

const INCOME_CATEGORIES = [
  "Salary",
  "Freelance",
  "Business",
  "Investment",
  "Rental Income",
  "Dividends",
  "Interest",
  "Bonus",
  "Gift",
  "Refund",
  "Other Income",
];

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
  const [availableCategories, setAvailableCategories] = useState(EXPENSE_CATEGORIES);

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

  // Update available categories when type changes
  useEffect(() => {
    if (formData.type === "expense") {
      setAvailableCategories(EXPENSE_CATEGORIES);
    } else {
      setAvailableCategories(INCOME_CATEGORIES);
    }
    
    // Reset category if it doesn't exist in new category list
    if (!availableCategories.includes(formData.category)) {
      setFormData((prev) => ({ ...prev, category: "" }));
    }
  }, [formData.type]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "amount" ? +value : value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
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
          <Label htmlFor="type">Type</Label>
          <Select
            value={formData.type}
            onValueChange={(value) => handleSelectChange("type", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="expense">Expense</SelectItem>
              <SelectItem value="income">Income</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="date">Date</Label>
          <Input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
        <div>
          <Label htmlFor="amount">Amount</Label>
          <Input
            type="number"
            name="amount"
            step="0.01"
            value={formData.amount}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <Label htmlFor="category">Category</Label>
          <Select
            value={formData.category}
            onValueChange={(value) => handleSelectChange("category", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent className="max-h-60">
              {availableCategories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Input
          type="text"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
        />
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
        <div>
          <Label htmlFor="account">Account</Label>
          <Input
            type="text"
            name="account"
            value={formData.account}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <Label htmlFor="status">Status</Label>
          <Select
            value={formData.status}
            onValueChange={(value) => handleSelectChange("status", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
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