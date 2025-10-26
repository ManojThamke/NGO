// ngo-backend/src/index.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import formsRouter from "./routes/forms.js";
import adminRouter from "./routes/admin.js";
import authRouter from "./routes/auth.js";
import donationsRouter from './routes/donations.js';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// quick debug to confirm env loaded
console.log('ADMIN_PASSWORD set?', Boolean(process.env.ADMIN_PASSWORD));
console.log('MONGO_URI present?', Boolean(process.env.MONGO_URI));

mongoose.connect(process.env.MONGO_URI || "", {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ DB connection error:", err));

app.get("/", (req, res) => res.send("🌿 NGO Backend running successfully!"));

// API routes
app.use("/api", formsRouter);

// auth route (public)
app.use('/api/admin/auth', authRouter);

// admin (protected) routes
app.use("/api/admin", adminRouter);

app.use('/api/donations', donationsRouter);

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
