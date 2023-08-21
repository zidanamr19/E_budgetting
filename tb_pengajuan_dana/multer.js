const multer = require("multer");
const path = require("path");
const random_text = require("../config/ramdom_text");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "/uploads/")); // Ganti "/pdf/" dengan direktori tujuan Anda
  },
  filename: function (req, file, cb) {
    cb(null, random_text.ramdom(15) + path.extname(file.originalname));
  },
});

const pdfFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb("Hanya diperbolehkan upload dokumen PDF", false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: pdfFilter,
  limits: {
    fileSize: 1000000, // Batasan ukuran file dalam bytes (contoh: 1MB)
  },
});

module.exports = upload;