"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteDocument } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Link from "next/link";

interface Document {
  id: string;
  name: string;
  googleDriveFileId: string;
}

interface FamilyMember {
  id: string;
  name: string;
  documents: Document[];
}

export default function DocumentsPage({
  familyMember,
}: {
  familyMember: FamilyMember;
}) {
  const [, setSelectedDocument] = useState<Document | null>(null);
  const router = useRouter();

  const handleDelete = async (documentId: string) => {
    const success = await deleteDocument(documentId);
    if (success) {
      alert("Document deleted successfully!");
      router.refresh();
    } else {
      alert("Failed to delete document!");
    }
  };

  return (
    <div className="p-4">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>{familyMember.name}&apos;s Documents</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Link href="/">
            <Button variant="outline" className="w-full mt-4">
              Back to Family Members
            </Button>
          </Link>

          {familyMember.documents.length === 0 ? (
            <p className="text-center text-gray-500">No documents found.</p>
          ) : (
            <ul className="space-y-2">
              {familyMember.documents.map((doc) => (
                <li
                  key={doc.id}
                  className="flex justify-between items-center border p-2 rounded"
                >
                  <span>{doc.name}</span>
                  <div className="space-x-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          onClick={() => setSelectedDocument(doc)}
                        >
                          View
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>{doc.name}</DialogTitle>
                        </DialogHeader>
                        <iframe
                          src={`https://drive.google.com/file/d/${doc.googleDriveFileId}/preview`}
                          className="w-full h-[80vh]"
                        ></iframe>
                      </DialogContent>
                    </Dialog>
                    <Button
                      variant="outline"
                      onClick={() =>
                        window.open(
                          `https://wa.me/?text=View this document: https://drive.google.com/file/d/${doc.googleDriveFileId}`,
                          "_blank"
                        )
                      }
                    >
                      Share
                    </Button>

                    <Button
                      variant="destructive"
                      onClick={() => handleDelete(doc.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
          <Button
            className="w-full"
            onClick={() =>
              router.push(`/upload-documents?id=${familyMember.id}`)
            }
          >
            Upload Document
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
