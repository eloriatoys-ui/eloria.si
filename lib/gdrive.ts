import "server-only";
import { google } from "googleapis";
import { Readable } from "node:stream";

// Uploads invoice PDFs to a shared Google Drive folder via a service account.
// Env:
//   GOOGLE_SERVICE_ACCOUNT_KEY  — base64 of the service-account JSON key
//   GDRIVE_INVOICES_FOLDER_ID   — ID of a Drive folder shared with that account
// Returns the file's shareable webViewLink, or null if not configured / failed.

function driveClient() {
  const b64 = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
  const folderId = process.env.GDRIVE_INVOICES_FOLDER_ID;
  if (!b64 || !folderId) return null;
  let creds: { client_email: string; private_key: string };
  try {
    creds = JSON.parse(Buffer.from(b64, "base64").toString("utf8"));
  } catch {
    console.error("[gdrive] GOOGLE_SERVICE_ACCOUNT_KEY is not valid base64 JSON");
    return null;
  }
  const auth = new google.auth.JWT({
    email: creds.client_email,
    key: creds.private_key,
    scopes: ["https://www.googleapis.com/auth/drive.file"],
  });
  return { drive: google.drive({ version: "v3", auth }), folderId };
}

/** Upload a PDF to the invoices folder. Returns webViewLink or null. Never throws. */
export async function uploadInvoiceToDrive(
  fileName: string,
  bytes: Uint8Array,
): Promise<string | null> {
  const client = driveClient();
  if (!client) {
    console.warn("[gdrive] not configured — skipping Drive upload for", fileName);
    return null;
  }
  try {
    const res = await client.drive.files.create({
      requestBody: { name: fileName, parents: [client.folderId] },
      media: { mimeType: "application/pdf", body: Readable.from(Buffer.from(bytes)) },
      fields: "id, webViewLink",
      supportsAllDrives: true,
    });
    return res.data.webViewLink ?? null;
  } catch (err) {
    console.error("[gdrive] upload failed for", fileName, err);
    return null;
  }
}
