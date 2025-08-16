import express from "express";
import { shareSummary } from "../controllers/shareController.js";

const router = express.Router();

router.post("/", shareSummary);

export default router;
