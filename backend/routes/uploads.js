const express = require('express');
const multer = require('multer');
const { uploadProductImage } = require('../controllers/uploadController');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 3 * 1024 * 1024 },
});

router.post('/product-image', protect, admin, upload.single('image'), uploadProductImage);

module.exports = router;
