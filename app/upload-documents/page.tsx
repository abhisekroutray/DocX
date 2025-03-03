"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { uploadDocument, getFamilyMember } from "@/lib/actions"; // Fetch family member name
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

function UploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const [memberId, setMemberId] = useState<string | null>(null);
  const [familyMemberName, setFamilyMemberName] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const id = searchParams.get("id");
    setMemberId(id);

    if (id) {
      // Fetch family member name
      getFamilyMember(id)
        .then((data) => {
          if (data?.name) {
            setFamilyMemberName(data.name);
          } else {
            setFamilyMemberName("Unknown Member");
          }
        })
        .catch((error) => {
          console.error("Error fetching member:", error);
          setFamilyMemberName("Unknown Member");
        });
    }
  }, [searchParams]);

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

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("fileName", fileName);
      formData.append("familyMemberName", familyMemberName || "Unknown");

      const success = await uploadDocument(memberId, formData);
      setUploading(false);

      if (success) {
        alert("Document uploaded successfully!");
        router.push(`/${memberId}`);
      } else {
        alert("Failed to upload document.");
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("An error occurred while uploading the document.");
      setUploading(false);
    }
  };

  return (
    <div className="p-4">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Upload Document</CardTitle>
          {familyMemberName && (
            <p className="text-sm text-gray-500">
              Uploading for: {familyMemberName}
            </p>
          )}
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
