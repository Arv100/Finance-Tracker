// "use client";

// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// // import { toast } from "@/components/ui/toast";
// import { UploadCloud } from "lucide-react";

// export function FileUploader() {
//   const [isUploading, setIsUploading] = useState(false);
//   const [fileName, setFileName] = useState<string | null>(null);
//   const [open, setOpen] = useState(false);

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       setFileName(file.name);
//     }
//   };

//   const handleUpload = () => {
//     if (!fileName) {
//       toast({
//         title: "No file selected",
//         description: "Please select a file to upload.",
//         variant: "destructive",
//       });
//       return;
//     }

//     setIsUploading(true);

//     // Simulate upload process
//     setTimeout(() => {
//       setIsUploading(false);
//       toast({
//         title: "File uploaded successfully",
//         description: `${fileName} has been processed.`,
//       });
//       setFileName(null);
//       setOpen(false);
//     }, 2000);
//   };

//   return (
//     <Dialog open={open} onOpenChange={setOpen}>
//       <DialogTrigger asChild>
//         <Button>
//           <UploadCloud className="mr-2 h-4 w-4" />
//           Upload Data
//         </Button>
//       </DialogTrigger>
//       <DialogContent>
//         <DialogHeader>
//           <DialogTitle>Upload Financial Data</DialogTitle>
//           <DialogDescription>
//             Upload CSV files from your bank or financial institution.
//             We support formats from most major banks.
//           </DialogDescription>
//         </DialogHeader>
        
//         <div className="grid gap-4 py-4">
//           <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-12 text-center cursor-pointer hover:bg-muted/50 transition-colors">
//             <input
//               type="file"
//               id="file-upload"
//               className="hidden"
//               accept=".csv,.xls,.xlsx"
//               onChange={handleFileChange}
//             />
//             <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
//               <UploadCloud className="h-10 w-10 text-muted-foreground mb-4" />
//               <p className="text-sm text-muted-foreground mb-1">
//                 {fileName ? fileName : "Drag and drop or click to upload"}
//               </p>
//               <p className="text-xs text-muted-foreground">
//                 Supports CSV, Excel files
//               </p>
//             </label>
//           </div>
//         </div>
        
//         <DialogFooter>
//           <Button variant="outline" onClick={() => setOpen(false)}>
//             Cancel
//           </Button>
//           <Button onClick={handleUpload} disabled={!fileName || isUploading}>
//             {isUploading ? "Uploading..." : "Upload"}
//           </Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// }