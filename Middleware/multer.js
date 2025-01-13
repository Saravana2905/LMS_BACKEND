const multer = require('multer');
const path = require('path');
const fs = require('fs');
// Configure multer storage options
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Use a temporary or default upload directory
    const defaultUploadPath = path.join(__dirname, '..', '..', '..', 'uploads/default');
    
    // Ensure the directory exists
    if (!fs.existsSync(defaultUploadPath)) {
      fs.mkdirSync(defaultUploadPath, { recursive: true });
    }
    
    cb(null, defaultUploadPath);
  },
  filename: (req, file, cb) => {
    // Generate a unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const extension = path.extname(file.originalname);
    cb(null, uniqueSuffix + extension);
  },
});

// Multer file filter to validate file types
const fileFilter = (req, file, cb) => {
  const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.mp4', '.avi', '.mov', '.mkv', '.flv', '.pdf', '.doc', '.docx', '.ppt', '.pptx', '.txt', '.xls', '.xlsx'];
  const ext = path.extname(file.originalname).toLowerCase();

  if (!validExtensions.includes(ext)) {
    return cb(new Error('Invalid file type. Only images, videos, and documents are allowed.'));
  }

  cb(null, true);
};

// Initialize multer with the defined storage and file filter
const upload = multer({
  storage,
  fileFilter,
});

module.exports = upload;
