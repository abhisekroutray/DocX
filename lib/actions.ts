"use server";

import { prisma } from "@/lib/prisma";
import { uploadToGoogleDrive } from "@/lib/googleDrive";

export async function getFamilyMember(id: string) {
  try {
    const member = await prisma.familyMember.findUnique({
      where: { id },
      include: { documents: true }, // Fetch related documents
    });

    if (!member) throw new Error("Family member not found");
    return member;
  } catch (error) {
    console.error("Error fetching family member:", error);
    return null;
  }
}

export async function deleteDocument(documentId: string) {
  try {
    await prisma.document.delete({
      where: { id: documentId },
    });
    return true;
  } catch (error) {
    console.error("Error deleting document:", error);
    return false;
  }
}

export async function deleteMember(familyMemberId: string) {
  try {
    // Delete all associated documents first
    await prisma.document.deleteMany({
      where: { familyMemberId },
    });

    // Now delete the family member
    await prisma.familyMember.delete({
      where: { id: familyMemberId },
    });

    return true;
  } catch (error) {
    console.error("Error deleting Member:", error);
    return false;
  }
}

// export async function uploadDocument(memberId: string, formData: FormData) {
//   try {
//     const file = formData.get("file") as File;
//     const fileName = formData.get("fileName") as string;

//     if (!file || !fileName) {
//       throw new Error("Missing file or file name.");
//     }

//     const googleDriveFileId = await uploadToGoogleDrive(file);

//     if (!googleDriveFileId) {
//       throw new Error("Failed to upload to Google Drive.");
//     }

//     const document = await prisma.document.create({
//       data: {
//         name: fileName, // Use user-provided file name
//         googleDriveFileId,
//         familyMemberId: memberId,
//       },
//     });

//     return document;
//   } catch (error) {
//     console.error("Upload error:", error);
//     return null;
//   }
// }

export async function uploadDocument(memberId: string, formData: FormData) {
  try {
    const file = formData.get("file") as File;
    const fileName = formData.get("fileName") as string;
    const familyMemberName = formData.get("familyMemberName") as string;

    if (!file || !fileName || !familyMemberName) {
      throw new Error("Missing file, file name, or family member name.");
    }

    // Pass both file and familyMemberName to uploadToGoogleDrive
    const googleDriveFileId = await uploadToGoogleDrive(
      file,
      fileName,
      familyMemberName
    );

    if (!googleDriveFileId) {
      throw new Error("Failed to upload to Google Drive.");
    }

    const document = await prisma.document.create({
      data: {
        name: fileName,
        googleDriveFileId,
        familyMemberId: memberId,
      },
    });

    return document;
  } catch (error) {
    console.error("Upload error:", error);
    return null;
  }
}
