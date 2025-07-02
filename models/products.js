const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');


const productschema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    unit : { type: String, required: true, default:'kg' },

 imagePath: { type: String, required: true },
    category: { type: String, required: true },
    stock: { type: Number, required: true, default: 0 },

});
const Product = mongoose.model('Product', productschema);
module.exports = Product;