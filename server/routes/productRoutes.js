const express = require("express");
const {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

const router = express.Router();

router.post("/api/products", createProduct);
router.patch("/api/products/:id", updateProduct);
router.get("/api/products", getProducts);
router.delete("/api/products/:id", deleteProduct);

module.exports = router;