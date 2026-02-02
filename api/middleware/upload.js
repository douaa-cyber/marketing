const multer = require("multer");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image files allowed"));
    }
    cb(null, true);
  },
});

const convertToWebp = async (req, res, next) => {
  if (!req.file) return next();

  const uploadDir = "uploads";
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const filename = `form-${Date.now()}-${Math.round(Math.random() * 1e9)}.webp`;

  const outputPath = path.join(uploadDir, filename);

  try {
    await sharp(req.file.buffer)
      .resize({ width: 1600, withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile(outputPath);

    req.file.path = outputPath;
    req.file.filename = filename;

    next();
  } catch (err) {
    next(err);
  }
};

module.exports = { upload, convertToWebp };
