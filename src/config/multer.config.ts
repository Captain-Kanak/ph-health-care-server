import { CloudinaryStorage } from "multer-storage-cloudinary";
import { cloudinaryUpload } from "./cloudinary.config";
import multer from "multer";

const storage = new CloudinaryStorage({
  cloudinary: cloudinaryUpload,
  params: async (req, file) => {
    const originalFileName = file.originalname;
    const extension = originalFileName.split(".").pop()?.toLocaleLowerCase();
    const fileNameWithoutExtension = originalFileName
      .split(".")
      .slice(0, -1)
      .join(".")
      .toLocaleLowerCase()
      .replace(/\s+/g, "-") // Replace spaces with hyphens
      .replace(/[^a-zA-Z0-9-]/g, ""); // Remove special characters

    const uniqueFileName =
      Math.random().toString(36).substring(2) +
      "-" +
      Date.now() +
      "-" +
      fileNameWithoutExtension;

    const folderName = extension === "pdf" ? "pdfs" : "images";

    return {
      folder: `ph-healthcare/${folderName}`,
      public_id: uniqueFileName,
      resource_type: "auto",
    };
  },
});

export const multerUpload = multer({ storage });
