// envTest.js
import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

console.log("Loaded MONGODB_URI:", process.env.MONGODB_URI);
