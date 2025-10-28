const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Dynamic upload path
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let folder = "uploads/";

    if (req.baseUrl.includes("blogs")) folder += "blogs/";
    else if (req.baseUrl.includes("contributors")) folder += "contributors/";
    else if (req.baseUrl.includes("projects")) folder += "projects/";
    else if (req.baseUrl.includes("news")) folder += "news/";
    else folder += "misc/";

    // Create folder if not exists
    if (!fs.existsSync(folder)) fs.mkdirSync(folder, { recursive: true });

    cb(null, folder);
  },

  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
  },
});

// File filter - allow only images
function fileFilter(req, file, cb) {
  const allowed = /jpeg|jpg|png|gif|webp/;
  const extname = allowed.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowed.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"), false);
  }
}

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB max
  fileFilter,
});

module.exports = upload;
