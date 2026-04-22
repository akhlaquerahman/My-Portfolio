// Server/middleware/uploadMiddleware.js (New File)
const multer = require('multer');

// Configure multer storage (we only use it to handle file buffer/stream)
const storage = multer.memoryStorage();

const ALLOWED_MIME_TYPES = new Set(['application/pdf']);

// File filter to accept images and resume PDFs
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image') || ALLOWED_MIME_TYPES.has(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Only image files and PDF files are allowed'), false);
    }
};

const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

module.exports = upload;
