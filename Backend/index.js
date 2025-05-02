import dotenv from "dotenv";
dotenv.config({ path: "./.env" }); // Correct path

import connectDB from "./db/index.js";
import express from "express";
import cors from "cors";
import os from "os";
import path from "path";


console.log("MONGODB_URI from env:", process.env.MONGODB_URI);

import { app } from "./app.js";

// ─── CORS FIX: Allow both Localhost and Vercel ────────────────────────────────
const allowedOrigins = [
  "http://localhost:5173", // Local environment
  "http://localhost:3000",
  "http://localhost:5174", // Additional local development port
  "http://127.0.0.1:5173",
  "http://127.0.0.1:3000",
  "http://127.0.0.1:5174", // Additional local development port
  "http://192.168.0.103:5173", // Local IP address
  "http://192.168.0.103:5174", // Local IP address with different port
  "http://192.168.0.103:8080", // Local IP address with different port
  "https://predicti-x-v2.vercel.app", // Deployed Vercel environment
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps, curl requests)
      if (!origin) {
        return callback(null, true);
      }
      
      if (allowedOrigins.indexOf(origin) !== -1) {
        return callback(null, true); // allow the origin
      } 
      
      console.log("Blocked origin:", origin);
      callback(new Error("Not allowed by CORS")); // Reject the request
    },
    credentials: true, // Enable cookies and credentials if needed
  })
);

// ─── Serve Frontend ────────────────────────────────────────────────────────────
const _dirname = path.dirname("");
const frontendBP = path.join(_dirname, "../Frontend/dist");
app.use(express.static(frontendBP));

// ─── Local IP Function ─────────────────────────────────────────────────────────
function getLocalIpAddress() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === "IPv4" && !iface.internal) {
        return iface.address;
      }
    }
  }
  return "http://localhost/"; // Default to localhost
}

// ─── DB Connection and Server Start ────────────────────────────────────────────
connectDB()
  .then(() => {
    app.on("error", (error) => {
      console.log("ERROR: ", error);
      throw error;
    });

    const PORT = process.env.PORT || 8000;

    app.listen(PORT, () => {
      const ip = getLocalIpAddress();
      console.log(`Server is running at port : ${PORT}`);
      console.log(`Server running at http://${ip}:${PORT}/`);
    });
  })
  .catch((err) => {
    console.log("MONGODB connection failed !!!", err);
  });
