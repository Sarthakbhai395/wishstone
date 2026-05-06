const multer = require("multer");
const { productStorage, categoryStorage, videoStorage } = require("../config/cloudinary");
const path = require("path");
const fs = require("fs");

// Check if Cloudinary is configured
const isCloudinaryConfigured = () => {
  return process.env.CLOUDINARY_CLOUD_NAME && 
         process.env.CLOUDINARY_API_KEY && 
         process.env.CLOUDINARY_API_SECRET;
};

// Local storage fallback (for development without Cloudinary)
const localStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isVideo = file.mimetype.startsWith("video/");
    const dir = isVideo ? "uploads/videos" : "uploads/images";
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`);
  },
});

// Get the appropriate storage
const getStorage = (type = "product") => {
  if (isCloudinaryConfigured()) {
    switch (type) {
      case "category": return categoryStorage;
      case "video": return videoStorage;
      case "product":
      default: return productStorage;
    }
  }
  return localStorage;
};

// Create upload middleware for products (supports up to 5 images)
const uploadProductImages = (fields) => {
  const storage = getStorage("product");
  const upload = multer({ 
    storage, 
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
  });
  return upload.fields(fields);
};

// Create upload middleware for categories (single image)
const uploadCategoryImage = () => {
  const storage = getStorage("category");
  const upload = multer({ 
    storage, 
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
  });
  return upload.single("image");
};

// Helper to get file URLs after upload
const getFileUrls = (req) => {
  const isCloudinary = isCloudinaryConfigured();
  
  if (isCloudinary) {
    // Cloudinary returns full URLs
    return {
      images: req.files?.images?.map(f => f.path) || [],
      image: req.files?.image?.map(f => f.path) || [],
      previewVideo: req.files?.previewVideo?.[0]?.path || "",
      fullVideo: req.files?.fullVideo?.[0]?.path || "",
    };
  } else {
    // Local storage - construct URLs with backend URL
    const baseUrl = process.env.BACKEND_URL || `https://wishstone.onrender.com`;
    const mapPath = f => f.path.startsWith("http") ? f.path : `${baseUrl}/${f.path.replace(/\\/g, "/")}`;
    
    return {
      images: [
        ...(req.files?.images || []).map(mapPath),
        ...(req.files?.image || []).map(mapPath),
      ],
      previewVideo: req.files?.previewVideo?.[0] ? mapPath(req.files.previewVideo[0]) : "",
      fullVideo: req.files?.fullVideo?.[0] ? mapPath(req.files.fullVideo[0]) : "",
    };
  }
};

module.exports = {
  uploadProductImages,
  uploadCategoryImage,
  getFileUrls,
  isCloudinaryConfigured,
};
