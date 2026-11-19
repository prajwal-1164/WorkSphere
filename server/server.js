import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Resolve current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json());

// API route
app.get("/api", (req, res) => {
  res.json({
    message: "WorkSphere API is running 🚀",
    status: "success",
  });
});

// Serve React frontend (Vite build)
const frontendPath = path.join(__dirname, "../dist");

app.use(express.static(frontendPath));

// React Router fallback
app.get("/{*path}", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

// Start server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`WorkSphere server running on port ${PORT} 🚀`);
});