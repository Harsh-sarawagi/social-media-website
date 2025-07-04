import express from "express";
import { connecttodatabase } from "./database/connecttodatabase.js";
import authroutes from "./routes/auth-routes.js"
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors"
import friendroutes from "./routes/friends-routes.js"
import profileroutes from "./routes/profile-routes.js"
import searchroute from "./routes/search-route.js"
import uploadroute from "./routes/upload-route.js"
import editroutes from "./routes/editprofile-routes.js"
import postroutes from "./routes/post-routes.js"
// import cors from

dotenv.config();

const app = express();
const allowedOrigins = [
  "http://localhost:5174",
  "http://localhost:5173",                // local dev
  "https://client-rw4x.onrender.com"      // deployed frontend
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));
app.use(cookieParser());
app.use(express.json());
app.use("/api/auth",authroutes);
app.use("/api/friend",friendroutes);
app.use("/api/profile",profileroutes);
app.use("/api",searchroute);
app.use("/api/upload",uploadroute);
app.use("/api/profile",editroutes);
app.use("/api/post",postroutes);
connecttodatabase();
app.listen(3000, () => {
  console.log("✅ Server is running on http://localhost:3000");
});