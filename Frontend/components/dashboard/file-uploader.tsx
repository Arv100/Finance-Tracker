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
import { toast } from "@/hooks/use-toast";
import { UploadCloud, Loader2 } from "lucide-react";
import { uploadApi } from "@/lib/api";

interface FileUploaderProps {
  onUploadSuccess?: () => void;
}

export function FileUploader({ onUploadSuccess }: FileUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [open, setOpen] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
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

  const handleUpload = async () => {
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
      const result = await uploadApi.uploadFile(selectedFile);

      toast({
        title: "File uploaded successfully",
        description: `${result.processed_count} transactions have been processed.`,
      });

      setSelectedFile(null);
      setOpen(false);

      // Reset file input
      const fileInput = document.getElementById(
        "file-upload"
      ) as HTMLInputElement;
      if (fileInput) {
        fileInput.value = "";
      }

      // Trigger refresh in parent component
      if (onUploadSuccess) {
        onUploadSuccess();
      }
    } catch (error: any) {
      console.error("Upload error:", error);
      toast({
        title: "Upload failed",
        description:
          error.response?.data?.detail ||
          "Failed to upload file. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload Financial Data</DialogTitle>
          <DialogDescription>
            Upload CSV or Excel files from your bank or financial institution.
            We support formats from most major banks.
          </DialogDescription>
        </DialogHeader>

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
            <div className="text-sm text-muted-foreground">
              <p>
                <strong>Selected file:</strong> {selectedFile.name}
              </p>
              <p>
                <strong>Size:</strong>{" "}
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
              <p>
                <strong>Type:</strong> {selectedFile.type || "Unknown"}
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isUploading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpload}
            disabled={!selectedFile || isUploading}
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              "Upload"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
