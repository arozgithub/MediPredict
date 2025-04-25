import { Router } from "express";
import { getAIFollowUp, getAIDiagnosis } from "../controllers/chatbot.controller.js";


const router = Router();

// Routes for AI chatbot functionality
router.post("/ai_followup", getAIFollowUp);
router.post("/ai_diagnosis", getAIDiagnosis);


export default router;