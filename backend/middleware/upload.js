import multer from "multer";
import { v4 as uuid4 } from "uuid";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },

  filename: (req, file, cb) => {
    const ext = file.originalname.split(".").pop();
    const uniqueName = `${uuid4()}.${ext}`;
    cb(null, uniqueName);
  },
});

function fileFilter(req, file, cb) {
  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only JPEG, PNG, WEBP allowed."));
  }
}

// File size limit
const limits = 5 * 1024 * 1024;

export const upload = multer({ storage, fileFilter, limits });
