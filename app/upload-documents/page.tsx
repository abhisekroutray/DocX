"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { uploadDocument } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

function UploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const memberId = searchParams.get("id");

  if (!memberId) {
    return (
      <p className="text-red-500 text-center">
        Invalid request: No member ID provided.
      </p>
    );
  }

  const handleUpload = async () => {
    if (!file || !fileName.trim()) {
      alert("Please select a file and enter a file name.");
      return;
    }

    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("fileName", fileName);

    const success = await uploadDocument(memberId, formData);
    setUploading(false);

    if (success) {
      alert("Document uploaded successfully!");
      router.push(`/${memberId}`);
    } else {
      alert("Failed to upload document.");
    }
  };

  return (
    <div className="p-4">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Upload Document</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            type="text"
            placeholder="Enter file name"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
          />
          <Input
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
          <Button
            className="w-full"
            onClick={handleUpload}
            disabled={uploading}
          >
            {uploading ? "Uploading..." : "Upload"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default function UploadDocumentsPage() {
  return (
    <Suspense fallback={<p className="text-center">Loading...</p>}>
      <UploadForm />
    </Suspense>
  );
}
