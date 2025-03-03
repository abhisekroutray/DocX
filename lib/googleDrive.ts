// import { google } from "googleapis";
// import fs from "fs";
// import path from "path";
// import os from "os";

// const SCOPES = ["https://www.googleapis.com/auth/drive.file"];
// const KEY_FILE_PATH = path.join(process.cwd(), "service-account.json"); // Path to Service Account JSON file
// const FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID || ""; // Folder ID from .env

// const auth = new google.auth.GoogleAuth({
//   keyFile: KEY_FILE_PATH, // Use Service Account JSON
//   scopes: SCOPES,
// });

// const drive = google.drive({ version: "v3", auth });

// export async function uploadToGoogleDrive(
//   file: File,
//   fileName: string,
//   familyMemberName: string
// ): Promise<string | null> {
//   try {
//     if (!familyMemberName.trim()) {
//       throw new Error("Family member name is required.");
//     }

//     // Ensure the file buffer is converted properly
//     const buffer = await file.arrayBuffer();

//     // Save file temporarily
//     const tempDir = os.tmpdir();
//     const sanitizedMemberName = familyMemberName.replace(/\s+/g, "_"); // Replace spaces with underscores
//     const newFileName = `${sanitizedMemberName}_${fileName}`; // Prepend family member name
//     const filePath = path.join(tempDir, newFileName);
//     fs.writeFileSync(filePath, Buffer.from(buffer));

//     // Upload file to Google Drive
//     const response = await drive.files.create({
//       requestBody: {
//         name: newFileName,
//         parents: [FOLDER_ID],
//       },
//       media: {
//         mimeType: file.type,
//         body: fs.createReadStream(filePath),
//       },
//       fields: "id",
//     });

//     // Delete the temporary file after upload
//     fs.unlinkSync(filePath);

//     return response.data.id || null;
//   } catch (error) {
//     console.error("Error uploading to Google Drive:", error);
//     return null;
//   }
// }

import { google } from "googleapis";
import fs from "fs";
import path from "path";
import os from "os";

const SCOPES = ["https://www.googleapis.com/auth/drive.file"];
const FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID || ""; // Folder ID from .env

const auth = new google.auth.GoogleAuth({
  credentials: {
    type: "service_account",
    project_id: process.env.GOOGLE_PROJECT_ID,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
  },
  scopes: SCOPES,
});

const drive = google.drive({ version: "v3", auth });

export async function uploadToGoogleDrive(
  file: File,
  fileName: string,
  familyMemberName: string
): Promise<string | null> {
  try {
    if (!familyMemberName.trim()) {
      throw new Error("Family member name is required.");
    }

    // Convert file buffer
    const buffer = await file.arrayBuffer();

    // Create a temporary file path
    const tempDir = os.tmpdir();
    const sanitizedMemberName = familyMemberName.replace(/\s+/g, "_"); // Replace spaces with underscores
    const newFileName = `${sanitizedMemberName}_${fileName}`; // Append family member name
    const filePath = path.join(tempDir, newFileName);
    fs.writeFileSync(filePath, Buffer.from(buffer));

    // Upload to Google Drive
    const response = await drive.files.create({
      requestBody: {
        name: newFileName,
        parents: [FOLDER_ID],
      },
      media: {
        mimeType: file.type,
        body: fs.createReadStream(filePath),
      },
      fields: "id",
    });

    // Delete temporary file
    fs.unlinkSync(filePath);

    return response.data.id || null;
  } catch (error) {
    console.error("Error uploading to Google Drive:", error);
    return null;
  }
}
