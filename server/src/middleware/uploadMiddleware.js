import multer from "multer";

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "src/uploads");
  },

  filename(req, file, cb) {
    cb(null, `temp-${Date.now()}`);
  }
});

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
      return cb(new Error("Only images allowed"));
    }

    cb(null, true);
  }
});

export default upload;