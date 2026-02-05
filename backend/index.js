import express from "express";
import env from "dotenv";
env.config();

import pool, { connectDb } from "./db/database.js";
import { sessionMiddleware } from "./middleware/session.js";

import adminRoutes from "./routes/admin.routes.js";
import authRoutes from "./routes/auth.routes.js";
import contactRoutes from "./routes/contact.routes.js";

import path from "path";
import { fileURLToPath } from "url";

const app = express();
const port = 3000;

// ****************  GLOBAL middlewares ***************************

app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
app.use(sessionMiddleware(pool));

// ***************  ROUTES     ********************************

app.use("/api/admin", adminRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/contact", contactRoutes);

// **************  SERVE REACT    ********************************

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve React build
app.use(express.static(path.join(__dirname, "../frontend/dist")));

// React Router fallback (must be LAST)
app.get("/{*splat}", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});

// *************     Start   ************************************

async function startServer() {
  await connectDb();

  app.listen(port, () => {
    console.log(`Backend is running on port: ${port}`);
  });
}

startServer();
