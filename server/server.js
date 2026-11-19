import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());

// API route
app.get("/api", (req, res) => {
  res.json({
    message: "WorkSphere API is running 🚀",
    status: "success",
  });
});

// Serve React frontend
app.use(express.static(path.join(__dirname, "../dist")));

// React routes fallback
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../dist/index.html"));
});

app.listen(PORT, () => {
  console.log(`WorkSphere server running on port ${PORT}`);
});