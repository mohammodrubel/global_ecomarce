import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import multer from "multer";
import path from "path";

// Cloudinary config
cloudinary.config({
  cloud_name: "de2ysphks",
  api_key: "426748166613985",
  api_secret: "7gqc9Xwit13V0MP58NqqOqRLKNs",
});

// 🔹 Helper to sanitize filenames for Cloudinary
const sanitizeFileName = (filename: string) => {
  const name = path.parse(filename).name; // without extension
  return name
    .replace(/[^a-zA-Z0-9-_]/g, "_") // replace spaces & symbols with "_"
    .toLowerCase();
};

// 🔹 Upload buffer directly to Cloudinary
export const sendImageCloudinary = async (
  buffer: Buffer,
  originalName?: string,
  folder: string = "specialOffers" // default folder
): Promise<UploadApiResponse> => {
  return new Promise((resolve, reject) => {
    let options: any = { folder };

    // If originalName provided → sanitize & set as public_id
    if (originalName) {
      options.public_id = sanitizeFileName(originalName);
    }

    const stream = cloudinary.uploader.upload_stream(
      options,
      (error, result) => {
        if (error) return reject(error);
        if (result) return resolve(result);
      }
    );

    stream.end(buffer);
  });
};

// 🔹 Multer config (memory storage → keeps files in RAM, no disk writes)
const storage = multer.memoryStorage();
export const upload = multer({ storage });
