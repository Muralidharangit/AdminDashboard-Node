const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload");

const {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

// Create Product
router.post("/", upload.single("image"), createProduct);

// Get All Products
router.get("/", getProducts);

// Get Single Product
router.get("/:id", getProduct);

// Update Product
router.put("/:id", upload.single("image"), updateProduct);

// Delete Product
router.delete("/:id", deleteProduct);

module.exports = router;