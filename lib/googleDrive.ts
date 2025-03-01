import { google } from "googleapis";
import fs from "fs";
import path from "path";
import os from "os";

const auth = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

auth.setCredentials({
  access_token: process.env.GOOGLE_ACCESS_TOKEN,
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
});

const drive = google.drive({ version: "v3", auth });

export async function uploadToGoogleDrive(file: File): Promise<string | null> {
  try {
    // Use system's temporary directory
    const tempDir = os.tmpdir();
    const filePath = path.join(tempDir, file.name);

    // Ensure file buffer is converted properly
    const buffer = await file.arrayBuffer();
    fs.writeFileSync(filePath, Buffer.from(buffer));

    // Upload to Google Drive
    const response = await drive.files.create({
      requestBody: {
        name: file.name,
        parents: [process.env.GOOGLE_DRIVE_FOLDER_ID as string],
      },
      media: {
        mimeType: file.type,
        body: fs.createReadStream(filePath),
      },
      fields: "id",
    });

    // Delete the temporary file
    fs.unlinkSync(filePath);

    return response.data.id || null;
  } catch (error) {
    console.error("Error uploading to Google Drive:", error);
    return null;
  }
}
