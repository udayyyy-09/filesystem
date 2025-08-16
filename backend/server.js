import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";

import summaryRoutes from "./routes/summaryRoutes.js";
import shareRoutes from "./routes/shareRoutes.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(bodyParser.json());

// Routes
app.use("/api/summary", summaryRoutes);
app.use("/api/share", shareRoutes);

// Health check
app.get("/ping", (req, res) => res.send("Server is running 🚀"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
