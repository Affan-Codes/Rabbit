import express from "express";
import { Product } from "../models/Product.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const productAdminRouter = express.Router();

// @route GET /api/admin/products
// @desc Get all products (Admin only)
// @access Private/Admin
productAdminRouter.get("/", protect, admin, async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

export { productAdminRouter };
