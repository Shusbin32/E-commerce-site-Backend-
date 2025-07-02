const Product = require('../models/products');
const mongoose = require('mongoose');

// Create
exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, unit, category, stock } = req.body;
    const imagePath = req.file ? req.file.path : null;

    if (!imagePath) {
      return res.status(400).json({ message: 'Image is required' });
    }

    const product = await Product.create({
      name,
      description,
      price,
      unit,
      category,
      stock,
      imagePath
    });

    res.status(201).json({ message: 'Product created successfully', product });
  } catch (err) {
    console.error('Product creation error:', err);
    res.status(400).json({ message: 'Error creating product', error: err.message });
  }
};

// Read All
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching products', error: err.message });
  }
};

// Read One
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching product', error: err.message });
  }
};

// Update
exports.updateProduct = async (req, res) => {
  try {
    const updateData = { ...req.body };

    // If a new image is uploaded, update imagePath
    if (req.file) {
      updateData.imagePath = req.file.path;
    }

    const updated = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!updated) return res.status(404).json({ message: 'Not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: 'Error updating product', error: err.message });
  }
};

// Delete
exports.deleteProduct = async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting product', error: err.message });
  }
};

