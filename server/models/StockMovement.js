const mongoose = require("mongoose");

// יומן תנועות המלאי (ledger) - מקור האמת ההיסטורי.
// כל שורה היא immutable - לא נערכת ולא נמחקת אחרי שנוצרה.
const stockMovementSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
    index: true,
  },
  type: {
    type: String,
    enum: ["sale", "return", "restock", "adjustment"],
    required: true,
  },
  // ערך מסומן (signed): שלילי ל-sale/adjustment-out, חיובי ל-return/restock/adjustment-in
  quantity: {
    type: Number,
    required: true,
  },
  // תמונת מצב של currentStock מיד אחרי התנועה הזו - לצורך ביקורת/התאמה בלבד,
  // אף פעם לא משמש כמקור לעדכון המלאי
  resultingBalance: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  note: {
    type: String,
    required: false,
  },
});

module.exports = mongoose.model("StockMovement", stockMovementSchema);
