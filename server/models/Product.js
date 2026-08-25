const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  sku: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  category: {
    type: String,
    required: true,
    trim: true,
  },
  // מלאי נוכחי - שדה "מהיר לקריאה" בשביל הפרונטאנד.
  // מתעדכן ישירות ואטומית יחד עם כתיבת StockMovement (ראה recordStockMovement),
  // ולעולם לא מחושב מחדש ע"י שאילתה/מיון של תנועות המלאי.
  currentStock: {
    type: Number,
    required: true,
    default: 0,
  },
  lowStockThreshold: {
    type: Number,
    default: 5,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Product", productSchema);
