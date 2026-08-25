const mongoose = require("mongoose");
const Product = require("../models/Product");
const StockMovement = require("../models/StockMovement");
const User = require("../models/User");
const sendEmail = require("../utils/emailService");
const lowStockEmailHtml = require("../utils/lowStockEmail");

// מחזירה את כל המוצרים עם המלאי הנוכחי שלהם
const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "כישלון בFetchRequest מוצרים" });
  }
};

// יוצרת מוצר חדש (currentStock מתחיל מ-0/מה שנשלח, בלי תנועת מלאי)
const createProduct = async (req, res) => {
  try {
    const newProduct = await Product.create(req.body);
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ message: "כישלון ביצירת מוצר" });
  }
};

// מעדכנת שדות של מוצר (שם, מחיר, קטגוריה וכו').
// currentStock לא ניתן לעדכון דרך ה-endpoint הזה - שינוי מלאי חייב לעבור
// דרך recordStockMovement (endpoint /movement) כדי לשמור על יומן תנועות תקין.
const updateProduct = async (req, res) => {
  try {
    const { currentStock, ...allowedUpdates } = req.body;

    const updates = {
      ...allowedUpdates,
      updatedAt: Date.now(),
    };

    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    if (!updatedProduct) {
      return res.status(404).json({ message: "מוצר לא נמצא" });
    }

    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: "כישלון בעדכון מוצר" });
  }
};

// מוחקת מוצר לפי ID
const deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);

    if (!deletedProduct) {
      return res.status(404).json({ message: "מוצר לא נמצא" });
    }

    res.status(200).json({ message: "מוצר נמחק בהצלחה" });
  } catch (error) {
    res.status(500).json({ message: "כישלון במחיקת מוצר" });
  }
};

// הפונקציה המרכזית של המערכת: רושמת תנועת מלאי ומעדכנת את currentStock
// באותה טרנזקציה - או ששתי הכתיבות מצליחות יחד, או ששתיהן מתבטלות יחד.
// זה מונע מצב שבו יש תנועה רשומה אבל המלאי לא התעדכן (ולהפך).
const recordStockMovement = async (productId, type, quantityChange, note, performedBy) => {
  const session = await mongoose.startSession();

  try {
    let updatedProduct;

    await session.withTransaction(async () => {
      const product = await Product.findById(productId).session(session);
      if (!product) {
        throw new Error("המוצר לא נמצא");
      }

      const newBalance = product.currentStock + quantityChange;
      if (newBalance < 0) {
        throw new Error("אין מספיק מלאי לביצוע הפעולה");
      }

      // כותבים קודם את שורת התנועה ביומן (immutable, לביקורת)
      await StockMovement.create(
        [
          {
            productId,
            performedBy,
            type,
            quantity: quantityChange,
            resultingBalance: newBalance,
            note,
          },
        ],
        { session }
      );

      // ורק אז מעדכנים את שדה המלאי המהיר לקריאה
      product.currentStock = newBalance;
      product.updatedAt = Date.now();
      await product.save({ session });

      updatedProduct = product;
    });

    // בהוצאה מהמלאי (quantityChange שלילי) שמגיעה לסף או מתחתיו - שולחים התראת מייל לכל האדמינים.
    // לא עוצר את הבקשה אם השליחה נכשלת - עדכון המלאי כבר הצליח והוא העיקר
    if (quantityChange < 0 && updatedProduct.currentStock <= updatedProduct.lowStockThreshold) {
      try {
        const admins = await User.find({ role: "admin" });
        if (admins.length > 0) {
          await sendEmail(
            admins.map((admin) => admin.email),
            "התראת מלאי נמוך - SmartStock",
            lowStockEmailHtml(updatedProduct)
          );
        }
      } catch (emailError) {
        console.error("שליחת מייל התראת מלאי נמוך נכשלה:", emailError);
      }
    }

    return updatedProduct;
  } finally {
    await session.endSession();
  }
};

// POST /api/products/:id/movement
// מקבלת { type, quantity, note } ומעדכנת מלאי דרך recordStockMovement
const createMovement = async (req, res) => {
  try {
    const { type, quantity, note } = req.body;

    const updatedProduct = await recordStockMovement(
      req.params.id,
      type,
      quantity,
      note,
      req.user.id
    );
    res.status(201).json(updatedProduct);
  } catch (error) {
    if (error.message === "המוצר לא נמצא") {
      return res.status(404).json({ message: error.message });
    }
    if (error.message === "אין מספיק מלאי לביצוע הפעולה") {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: "עדכון תנועת המלאי נכשל" });
  }
};

// GET /api/products/:id/movements
// מחזירה את היסטוריית תנועות המלאי של מוצר, מהחדש לישן
const getMovements = async (req, res) => {
  try {
    const movements = await StockMovement.find({ productId: req.params.id })
      .sort({ date: -1 })
      .populate("performedBy", "email username");
    res.status(200).json(movements);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch stock movements" });
  }
};

// GET /api/movements
// מחזירה את כל תנועות המלאי של כל המוצרים יחד, מהחדש לישן.
// populate מביא גם name/sku של המוצר לכל שורה, כדי שאין צורך בבקשה נוספת לכל תנועה.
const getAllMovements = async (req, res) => {
  try {
    const movements = await StockMovement.find()
      .sort({ date: -1 })
      .populate("productId", "name sku")
      .populate("performedBy", "email username");

    res.status(200).json(movements);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch stock movements" });
  }
};

// GET /api/products/:id/reconcile
// (בונוס) משווה בין סכום כל התנועות ביומן לבין currentStock בפועל,
// כדי לגלות סטייה/שיבוש בין השניים
const reconcileProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const result = await StockMovement.aggregate([
      { $match: { productId: product._id } },
      { $group: { _id: null, total: { $sum: "$quantity" } } },
    ]);

    const sumOfMovements = result.length > 0 ? result[0].total : 0;

    res.status(200).json({
      currentStock: product.currentStock,
      sumOfMovements,
      isConsistent: sumOfMovements === product.currentStock,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to reconcile product" });
  }
};

module.exports = {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  createMovement,
  getMovements,
  getAllMovements,
  reconcileProduct,
};
