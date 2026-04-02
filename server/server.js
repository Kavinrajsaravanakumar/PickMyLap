import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./configs/db.js";

import laptopRoutes from "./route/laptopRoutes.js";
import authRoutes from "./route/authRoutes.js";
import reviewRoutes from "./route/reviewRoutes.js";
import chatbotRoutes from "./route/chatbotRoutes.js";
import errorHandler from "./middleware/errorHandler.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/laptops", laptopRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/chatbot", chatbotRoutes);

// Health check
app.get("/api/health", (_req, res) => res.json({ status: "ok" }));

// Error handler
app.use(errorHandler);

// Start
const PORT = process.env.PORT || 5000;
connectDB().then(() => {
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
});
