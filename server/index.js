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
app.use(cors({
  origin: "http://localhost:5173", // your frontend URL
  credentials: true,               // allow cookies
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