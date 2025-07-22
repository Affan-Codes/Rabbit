import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import { userRouter } from "./routes/userRoutes.js";
import { productRouter } from "./routes/productRoutes.js";
import { cartRouter } from "./routes/cartRoutes.js";
import { checkoutRouter } from "./routes/checkoutRoutes.js";
import { orderRouter } from "./routes/orderRoutes.js";
import { uploadRouter } from "./routes/uploadRoutes.js";
import { subscriberRouter } from "./routes/subscriberRoutes.js";
import { adminRouter } from "./routes/adminRoutes.js";
import { productAdminRouter } from "./routes/productAdminRoutes.js";
import { adminOrderRouter } from "./routes/adminOrdersRoutes.js";

const app = express();

app.use(express.json());
app.use(cors());

dotenv.config();

const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

app.get("/", (req, res) => {
  res.send("WELCOME TO RABBIT API");
});

// API Routes
app.use("/api/users", userRouter);
app.use("/api/products", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/checkout", checkoutRouter);
app.use("/api/orders", orderRouter);
app.use("/api/upload", uploadRouter);
app.use("/api", subscriberRouter);

// Admin
app.use("/api/admin/users", adminRouter);
app.use("/api/admin/products", productAdminRouter);
app.use("/api/admin/orders", adminOrderRouter);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
