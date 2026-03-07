const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: String,
  quantity: Number,
  price: Number,
  minQuantity: Number,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Product", productSchema);
