import express from "express";
import {
  getLaptops,
  getLaptopById,
  getRecommendations,
  seedLaptops,
} from "../controllers/laptopController.js";

const router = express.Router();

router.get("/seed", seedLaptops);
router.get("/", getLaptops);
router.get("/:id", getLaptopById);
router.get("/:id/recommendations", getRecommendations);

export default router;
