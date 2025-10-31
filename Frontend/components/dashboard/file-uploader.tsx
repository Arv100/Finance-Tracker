"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "@/hooks/use-toast";
import { UploadCloud, Loader2, AlertTriangle, CheckCircle } from "lucide-react";
import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// All available categories
const EXPENSE_CATEGORIES = [
  "Food & Dining", "Groceries", "Housing", "Rent/Mortgage", "Utilities",
  "Transportation", "Gas/Fuel", "Public Transport", "Healthcare", "Insurance",
  "Entertainment", "Shopping", "Clothing", "Personal Care", "Education",
  "Travel", "Subscriptions", "Gifts & Donations", "Fees & Charges", "Taxes",
  "Other Expense"
];

const INCOME_CATEGORIES = [
  "Salary", "Freelance", "Business", "Investment", "Rental Income",
  "Dividends", "Interest", "Bonus", "Gift", "Refund", "Other Income"
];

interface TransactionPreview {
  id: string;
  date: string;
  description: string;
  amount: number;
  suggested_category: string;
  suggested_type: string;
  confidence: number;
  needs_review: boolean;
  account: string;
}

interface FileUploaderProps {
  onUploadSuccess?: () => void;
}

export function EnhancedFileUploader({ onUploadSuccess }: FileUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [open, setOpen] = useState(false);
  const [previewData, setPreviewData] = useState<TransactionPreview[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const allowedTypes = [".csv", ".xlsx", ".xls"];
      const fileExtension = "." + file.name.split(".").pop()?.toLowerCase();

      if (!allowedTypes.includes(fileExtension)) {
        toast({
          title: "Invalid file type",
          description: "Please select a CSV or Excel file.",
          variant: "destructive",
        });
        return;
      }

      setSelectedFile(file);
    }
  };

  const handlePreview = async () => {
    if (!selectedFile) {
      toast({
        title: "No file selected",
        description: "Please select a file to upload.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const token = localStorage.getItem("access_token");
      const response = await axios.post(
        `${API_BASE_URL}/api/upload/preview`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setPreviewData(response.data.preview);
      setShowPreview(true);

      toast({
        title: "File processed",
        description: `${response.data.total_count} transactions ready for review. ${response.data.needs_review_count} need manual review.`,
      });
    } catch (error: any) {
      console.error("Preview error:", error);
      toast({
        title: "Preview failed",
        description:
          error.response?.data?.detail ||
          "Failed to process file. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleConfirmImport = async () => {
    setIsConfirming(true);

    try {
      const token = localStorage.getItem("access_token");
      await axios.post(
        `${API_BASE_URL}/api/upload/confirm`,
        previewData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast({
        title: "Import successful",
        description: `${previewData.length} transactions have been imported.`,
      });

      setSelectedFile(null);
      setPreviewData([]);
      setShowPreview(false);
      setOpen(false);

      // Reset file input
      const fileInput = document.getElementById("file-upload") as HTMLInputElement;
      if (fileInput) {
        fileInput.value = "";
      }

      if (onUploadSuccess) {
        onUploadSuccess();
      }
    } catch (error: any) {
      console.error("Confirm error:", error);
      toast({
        title: "Import failed",
        description:
          error.response?.data?.detail ||
          "Failed to import transactions. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsConfirming(false);
    }
  };

  const updateCategory = (id: string, newCategory: string) => {
    setPreviewData((prev) =>
      prev.map((txn) =>
        txn.id === id ? { ...txn, suggested_category: newCategory } : txn
      )
    );
  };

  const updateType = (id: string, newType: string) => {
    setPreviewData((prev) =>
      prev.map((txn) =>
        txn.id === id ? { ...txn, suggested_type: newType } : txn
      )
    );
  };

  const getConfidenceBadge = (confidence: number) => {
    if (confidence >= 0.7) {
      return <Badge variant="success" className="text-xs">High</Badge>;
    } else if (confidence >= 0.4) {
      return <Badge variant="warning" className="text-xs">Medium</Badge>;
    } else {
      return <Badge variant="destructive" className="text-xs">Low</Badge>;
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <UploadCloud className="mr-2 h-4 w-4" />
          Upload Data
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-6xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Upload Financial Data</DialogTitle>
          <DialogDescription>
            Upload CSV or Excel files. We'll automatically categorize your transactions.
          </DialogDescription>
        </DialogHeader>

        {!showPreview ? (
          <div className="grid gap-4 py-4">
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-12 text-center cursor-pointer hover:bg-muted/50 transition-colors">
              <input
                type="file"
                id="file-upload"
                className="hidden"
                accept=".csv,.xls,.xlsx"
                onChange={handleFileChange}
                disabled={isUploading}
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer flex flex-col items-center"
              >
                <UploadCloud className="h-10 w-10 text-muted-foreground mb-4" />
                <p className="text-sm text-muted-foreground mb-1">
                  {selectedFile
                    ? selectedFile.name
                    : "Drag and drop or click to upload"}
                </p>
                <p className="text-xs text-muted-foreground">
                  Supports CSV, Excel files (max 10MB)
                </p>
              </label>
            </div>

            {selectedFile && (
              <div className="text-sm space-y-2 bg-muted p-4 rounded-lg">
                <p>
                  <strong>File:</strong> {selectedFile.name}
                </p>
                <p>
                  <strong>Size:</strong>{" "}
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
                <p className="text-muted-foreground text-xs">
                  Expected columns: date, description, amount (or debit/credit), account
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-muted p-3 rounded-lg">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="font-medium">{previewData.length} transactions found</span>
              </div>
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
                <span className="text-sm">
                  {previewData.filter((t) => t.needs_review).length} need review
                </span>
              </div>
            </div>

            <ScrollArea className="h-[400px] rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Confidence</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {previewData.map((txn) => (
                    <TableRow key={txn.id} className={txn.needs_review ? "bg-yellow-50 dark:bg-yellow-950/10" : ""}>
                      <TableCell className="text-xs">{txn.date}</TableCell>
                      <TableCell className="max-w-[200px] truncate text-xs">
                        {txn.description}
                      </TableCell>
                      <TableCell className="text-xs font-medium">
                        ${txn.amount.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <Select
                          value={txn.suggested_type}
                          onValueChange={(value) => updateType(txn.id, value)}
                        >
                          <SelectTrigger className="h-8 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="income">Income</SelectItem>
                            <SelectItem value="expense">Expense</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Select
                          value={txn.suggested_category}
                          onValueChange={(value) => updateCategory(txn.id, value)}
                        >
                          <SelectTrigger className="h-8 text-xs w-[150px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="max-h-60">
                            {(txn.suggested_type === "expense"
                              ? EXPENSE_CATEGORIES
                              : INCOME_CATEGORIES
                            ).map((cat) => (
                              <SelectItem key={cat} value={cat} className="text-xs">
                                {cat}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        {getConfidenceBadge(txn.confidence)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </div>
        )}

        <DialogFooter>
          {!showPreview ? (
            <>
              <Button
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isUploading}
              >
                Cancel
              </Button>
              <Button
                onClick={handlePreview}
                disabled={!selectedFile || isUploading}
              >
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Preview & Categorize"
                )}
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                onClick={() => {
                  setShowPreview(false);
                  setPreviewData([]);
                }}
                disabled={isConfirming}
              >
                Back
              </Button>
              <Button
                onClick={handleConfirmImport}
                disabled={isConfirming}
              >
                {isConfirming ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Importing...
                  </>
                ) : (
                  `Import ${previewData.length} Transactions`
                )}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}