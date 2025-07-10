import express from "express";
import { connecttodatabase } from "./database/connecttodatabase.js";
import authroutes from "./routes/auth-routes.js";
import friendroutes from "./routes/friends-routes.js";
import profileroutes from "./routes/profile-routes.js";
import editroutes from "./routes/editprofile-routes.js";
import searchroute from "./routes/search-route.js";
import uploadroute from "./routes/upload-route.js";
import postroutes from "./routes/post-routes.js";
import notificationroutes from "./routes/notification-routes.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

dotenv.config();

const app = express();

// ✅ Allowed Origins
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",               // for local dev
  "https://client-rw4x.onrender.com"     // deployed frontend
];

// ✅ CORS Middleware
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// ✅ Middleware
app.use(cookieParser());
app.use(express.json());

// ✅ Routes
app.use("/api/auth", authroutes);
app.use("/api/friend", friendroutes);
app.use("/api/profile", profileroutes);         // Main profile routes
app.use("/api/profile", editroutes);       // Edit profile safely under subpath
app.use("/api", searchroute);                   // Handles /api/search etc.
app.use("/api/upload", uploadroute);
app.use("/api/post", postroutes);
app.use("/api/notification",notificationroutes)

// ✅ Connect DB and Start Server
connecttodatabase();

app.listen(3000, () => {
  console.log("✅ Server is running on http://localhost:3000");
});
