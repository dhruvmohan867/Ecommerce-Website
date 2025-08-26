import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import * as dotenv from "dotenv";
import UserRouter from "./routes/User.js";
import ProductRoutes from "./routes/Products.js";
import path from "path";
import compression from "compression";
import helmet from "helmet";
dotenv.config();

const app = express();
const __dirname = path.resolve();
const PORT = process.env.PORT || 8080;

app.use(cors({
  origin: "https://ecommerce-website-frontend3.onrender.com",
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  credentials: true,
}));

app.options("*", cors());
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(compression());
app.use(helmet());

// ✅ API routes first
app.use("/api/user", UserRouter);
app.use("/api/products", ProductRoutes);

// ✅ Serve React build folder
app.use(express.static(path.join(__dirname, "../client/build"), {
  maxAge: "1d",   
  etag: true
}));

// Catch-all handler: for any request that doesn't match an API route, send back React's index.html file.
app.get("*", (req, res) => {
  // If the request starts with /api, skip this handler
  if (req.path.startsWith("/api")) return res.status(404).send("API route not found");
  res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});

// ✅ Error handler
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
    await mongoose.connect(process.env.MONGO_DB , {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        maxPoolSize: 10,
    });
    console.log("✅ Connected to MongoDB");
  } catch (err) {
    console.error("❌ Failed to connect with MongoDB");
    console.error(err);
  }
};

const startServer = async () => {
  await connectDB(); 
  app.listen(PORT, () => console.log(`🚀 Server started on port ${PORT}`));
};

startServer();
