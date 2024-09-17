import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB file size limit
  fileFilter: (req, file, cb) => {
    const allowedImageTypes = /jpeg|jpg|png|gif/;
    const allowedVideoTypes = /mp4|mov|avi|mkv/;

    const extname =
      allowedImageTypes.test(path.extname(file.originalname).toLowerCase()) ||
      allowedVideoTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype =
      allowedImageTypes.test(file.mimetype) ||
      allowedVideoTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error("Can upload photo or video only"));
  },
});

export default upload;
