const express = require("express");
const {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  createMovement,
  getMovements,
  getAllMovements,
  reconcileProduct,
} = require("../controllers/productController");
const authMiddleware = require("../middleware/authMiddleware");
const requireAdmin = require("../middleware/requireAdmin");

const router = express.Router();

// כל הראוטים שמתחילים ב-/api מוגנים - חייבים טוקן תקין כדי להמשיך (next)
// חשוב להגביל ל-"/api" ולא להשאיר בלי path, אחרת זה יתפוס גם בקשות ל-/auth
// (הראוטר הזה מחובר ב-app.js בלי prefix, לפני auth routes)
router.use("/api", authMiddleware);

// הוספה/עריכה/מחיקה של מוצר מותרות רק ל-admin; משתמש רגיל עדיין יכול לצפות ולרשום תנועות מלאי
router.post("/api/products", requireAdmin, createProduct);
router.put("/api/products/:id", requireAdmin, updateProduct);
router.get("/api/products", getProducts);
router.delete("/api/products/:id", requireAdmin, deleteProduct);

// היסטוריה כללית של תנועות המלאי של כל המוצרים יחד
router.get("/api/movements", getAllMovements);

router.post("/api/products/:id/movement", createMovement);
router.get("/api/products/:id/movements", getMovements);
router.get("/api/products/:id/reconcile", reconcileProduct);

module.exports = router;