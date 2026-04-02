import express from "express";
import { processQuery } from "../controllers/chatbotController.js";

const router = express.Router();

router.post("/", processQuery);

export default router;
