import express from "express";
import { generateSummary } from "../controllers/summaryController.js";

const router = express.Router();

router.post("/", generateSummary);

export default router;
