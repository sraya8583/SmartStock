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

const router = express.Router();

// כל הראוטים שמתחילים ב-/api מוגנים - חייבים טוקן תקין כדי להמשיך (next)
// חשוב להגביל ל-"/api" ולא להשאיר בלי path, אחרת זה יתפוס גם בקשות ל-/auth
// (הראוטר הזה מחובר ב-app.js בלי prefix, לפני auth routes)
router.use("/api", authMiddleware);

router.post("/api/products", createProduct);
router.put("/api/products/:id", updateProduct);
router.get("/api/products", getProducts);
router.delete("/api/products/:id", deleteProduct);

// היסטוריה כללית של תנועות המלאי של כל המוצרים יחד
router.get("/api/movements", getAllMovements);

router.post("/api/products/:id/movement", createMovement);
router.get("/api/products/:id/movements", getMovements);
router.get("/api/products/:id/reconcile", reconcileProduct);

module.exports = router;