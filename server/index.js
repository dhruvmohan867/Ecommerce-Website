import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import * as dotenv from "dotenv";
import UserRouter from "./routes/User.js";
import ProductRoutes from "./routes/Products.js";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));

app.get("/", async (req, res) => {
  try {
    res.status(200).json({
      message: "Hello Developers",
    });
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.use("/api/user/", UserRouter);
app.use("/api/products/", ProductRoutes);

// error handler (should be after all routes)
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Something went wrong";
  return res.status(status).json({
    success: false,
    status,
    message,
  });
});

const connectDB = async () => {
  try {
    mongoose.set("strictQuery", true);
    await mongoose.connect(process.env.MONGO_DB);
    console.log("✅ Connected to MongoDB");
  } catch (err) {
    console.error("❌ Failed to connect with MongoDB");
    console.error(err);
  }
};

const startServer = async () => {
  await connectDB(); // ✅ Make sure Mongo is connected before listening
  app.listen(PORT, () => console.log("🚀 Server started on port 8080"));
};

startServer();