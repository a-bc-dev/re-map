const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure upload directories exist
const uploadDirs = {
    photos: path.join(__dirname, "../uploads/photos"),
    videos: path.join(__dirname, "../uploads/videos"),
    audio: path.join(__dirname, "../uploads/audio"),
    thumbnails: path.join(__dirname, "../uploads/thumbnails"),
};

Object.values(uploadDirs).forEach((dir) => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
});

// Storage configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        let folder = "photos"; // default

        if (file.mimetype.startsWith("image/")) {
            folder = "photos";
        } else if (file.mimetype.startsWith("video/")) {
            folder = "videos";
        } else if (file.mimetype.startsWith("audio/")) {
            folder = "audio";
        }

        cb(null, uploadDirs[folder]);
    },
    filename: function (req, file, cb) {
        // Generate unique filename: timestamp-randomstring-originalname
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname);
        const basename = path.basename(file.originalname, ext);
        cb(null, basename + "-" + uniqueSuffix + ext);
    },
});

// File filter
const fileFilter = (req, file, cb) => {
    // Allowed file types
    const allowedImageTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp", "image/heic"];
    const allowedVideoTypes = ["video/mp4", "video/mpeg", "video/quicktime", "video/x-msvideo", "video/webm"];
    const allowedAudioTypes = ["audio/mpeg", "audio/mp3", "audio/wav", "audio/webm", "audio/ogg"];

    const allAllowedTypes = [...allowedImageTypes, ...allowedVideoTypes, ...allowedAudioTypes];

    if (allAllowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Invalid file type. Only images, videos, and audio files are allowed."), false);
    }
};

// Multer configuration
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 100 * 1024 * 1024, // 100 MB max file size
    },
});

module.exports = upload;
