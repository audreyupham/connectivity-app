import multer from "multer";

const storage = multer.memoryStorage();

const allowedTypes = [
"image/jpeg",
"image/png",
"image/webp"
];

const upload = multer({
  storage,

  limits: {
    fileSize: 2 * 1024 * 1024
  },

  fileFilter(req, file, cb) {
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(
        new Error("Only JPEG, PNG, and WebP images are allowed")
      );
    }

    cb(null, true);
  }
});

export default upload;