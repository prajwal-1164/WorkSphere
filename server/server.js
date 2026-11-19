import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "WorkSphere API is running 🚀",
    status: "success",
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "healthy",
    service: "WorkSphere Backend",
  });
});

app.listen(PORT, () => {
  console.log(`WorkSphere server running on http://localhost:${PORT}`);
});