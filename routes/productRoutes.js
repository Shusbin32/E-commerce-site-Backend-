const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { protect } = require('../middleware/Utils/authMiddleware');
const productController = require('../controllers/productscontroller');

// Multer config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Make sure this folder exists
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// Create product with image upload
router.post('/', protect, upload.single('image'), productController.createProduct);

router.get('/', productController.getProducts);
router.get('/:id', productController.getProductById);
router.put('/:id', protect, upload.single('image'), productController.updateProduct);
router.delete('/:id', protect, productController.deleteProduct);

module.exports = router;

