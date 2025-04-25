import { asyncHandler } from "../utils/asyncHandler.js";
import logging from "../utils/logging.js";
import Groq from "groq-sdk";

// Initialize Groq with your API key
const groq = new Groq({ apiKey: "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" });


// Function to query Groq AI for general health diagnosis
const query_groq_health_diagnosis = async (conversation_history) => {
  try {
    const response = await groq.chat.completions.create({
        messages: [
            {
              role: "system",
              content: `You are a highly knowledgeable and empathetic AI health assistant. 
          The user will provide their symptoms and medical history. 
          Your task is to analyze the information and provide a clear, general health assessment. 
          
          Consider:
          - Possible underlying causes
          - Severity of symptoms
          - Urgency (whether immediate medical attention may be needed)
          - Suggestions for next steps, including lifestyle tips or medical consultation
          
          Do not provide a definitive diagnosis. Use professional but friendly language and ensure the response is easy for a non-medical user to understand.`,
            },
            {
              role: "user",
              content: `Symptoms and history: ${conversation_history}`,
            },
          ]
          ,
      model: "llama-3.3-70b-versatile",
    });

    const content = response?.choices?.[0]?.message?.content;
    return content || "I'm unable to provide a diagnosis at the moment.";
  } catch (error) {
    logging.error(`Error in query_groq_health_diagnosis: ${error.message}`, error);
    return "I couldn't process your symptoms right now. Please try again later or consult a healthcare professional.";
  }
};

// Function to query Groq AI for follow-up questions
const query_groq_follow_up_questions = async (conversation_history) => {
  try {
    const response = await groq.chat.completions.create({
        messages: [
            {
              role: "system",
              content: `You are a highly knowledgeable and empathetic AI health assistant. 
          The user has provided their symptoms and medical history. 
          Your task is to generate clear, concise, and medically relevant follow-up questions 
          to better understand their condition.
          
          Focus on gathering information such as:
          - Duration and severity of symptoms
          - Associated symptoms or changes
          - Current medications or treatments
          - Relevant lifestyle or environmental factors
          
          Respond in a friendly and professional tone.`,
            },
            {
              role: "user",
              content: `Symptoms and history: ${conversation_history}`,
            },
          ]
          ,
      model: "llama-3.3-70b-versatile",
    });

    const content = response?.choices?.[0]?.message?.content;
    return content || "I couldn't generate follow-up questions right now. Please try again later.";
  } catch (error) {
    logging.error(`Error in query_groq_follow_up_questions: ${error.message}`, error);
    return "I couldn't generate follow-up questions right now. Please try again later.";
  }
};

// API endpoint to get AI-generated follow-up questions
const getAIFollowUp = asyncHandler(async (req, res) => {
  const { conversation_history } = req.body;

  if (!conversation_history) {
    return res.status(400).json({ error: "Conversation history is required" });
  }

  const follow_up_question = await query_groq_follow_up_questions(conversation_history);
  return res.json({ follow_up_question });
});

// API endpoint to get AI-generated health diagnosis
const getAIDiagnosis = asyncHandler(async (req, res) => {
  const { conversation_history } = req.body;

  if (!conversation_history) {
    return res.status(400).json({ error: "Conversation history is required" });
  }

  const diagnosis = await query_groq_health_diagnosis(conversation_history);
  return res.json({ diagnosis });
});

export {
  getAIFollowUp,
  getAIDiagnosis,
};
