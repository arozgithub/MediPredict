import React, { useState, useEffect, useRef } from "react";
import { Send, X, MessageCircle, Plus, Activity, Mic, MicOff } from "lucide-react";
import { jsPDF } from "jspdf";
import "./chatbot.css";

const Chatbot = () => {
  const [messages, setMessages] = useState([
    { text: "Hi! How can I assist with your diagnosis?", sender: "bot" },
  ]);
  const [conversationHistory, setConversationHistory] = useState("");
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const [statusMessage, setStatusMessage] = useState("");
  
  // Create a ref to the input element so we can focus it
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Initialize speech recognition
  useEffect(() => {
    // Check if the browser supports the Web Speech API
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = 'en-US';
      
      recognitionInstance.onstart = () => {
        setIsListening(true);
        setStatusMessage("Listening...");
      };
      
      recognitionInstance.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        
        // If we have final results
        if (event.results[0].isFinal) {
          setStatusMessage("Processing speech...");
        }
      };
      
      recognitionInstance.onend = () => {
        setIsListening(false);
        setStatusMessage("");
        
        // Auto-send the message if we have input text
        if (input.trim()) {
          setTimeout(() => {
            sendMessage();
          }, 300); // Short delay to allow state to update
        }
      };
      
      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
        setStatusMessage("Error: " + event.error);
        
        // Clear error message after a delay
        setTimeout(() => {
          setStatusMessage("");
        }, 3000);
      };
      
      setRecognition(recognitionInstance);
    } else {
      console.error('Speech recognition is not supported in this browser');
    }
    
    // Cleanup function
    return () => {
      if (recognition) {
        recognition.onresult = null;
        recognition.onend = null;
        recognition.onerror = null;
        recognition.onstart = null;
        try {
          recognition.stop();
        } catch (err) {
          // Ignore errors when stopping recognition
        }
      }
    };
  }, []); // Empty dependency array ensures this effect runs only once

  const toggleListening = () => {
    if (!recognition) {
      setStatusMessage("Speech recognition not available");
      setTimeout(() => setStatusMessage(""), 3000);
      return;
    }
    
    if (isListening) {
      recognition.stop();
    } else {
      setInput(""); // Clear input field before starting new recognition
      try {
        recognition.start();
      } catch (error) {
        console.error("Error starting speech recognition:", error);
        // If recognition is already started, stop it first then restart
        if (error.name === 'NotAllowedError') {
          setStatusMessage("Please allow microphone access");
          setTimeout(() => setStatusMessage(""), 3000);
        }
      }
    }
  };

  const updateHistory = (sender, text) => {
    const updatedHistory = conversationHistory + `\n${sender}: ${text}`;
    setConversationHistory(updatedHistory);
  };

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage = { text: input, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    updateHistory("User", input);

    // Store the current input before clearing it
    const currentInput = input;
    setInput("");
    
    try {
      const response = await fetch("http://192.168.0.103:8080/ai_followup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversation_history: conversationHistory + `\nUser: ${currentInput}`,
        }),
      });
      const data = await response.json();
      const botMessage = { text: data.follow_up_question, sender: "bot" };
      setMessages((prev) => [...prev, botMessage]);
      updateHistory("Bot", data.follow_up_question);
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prev) => [...prev, { 
        text: "Sorry, I'm having trouble connecting. Please try again later.", 
        sender: "bot" 
      }]);
    }
  };

  const handleFileChange = async (event) => {
    const selectedFile = event.target.files[0];
    if (!selectedFile) return;
  
    setFile(selectedFile);
    setMessages((prev) => [...prev, { text: `📎 ${selectedFile.name}`, sender: "user" }]);
    updateHistory("User", `Uploaded file: ${selectedFile.name}`);
  
    const formData = new FormData();
    formData.append("image", selectedFile);
  
    try {
      const response = await fetch("http://localhost:8000/detect_tumor/", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      console.log("Tumor Detection API Response:", data);
  
      let botMessage;
      if (data.tumor_detected && data.tumors.length > 0) {
        const tumorsInfo = data.tumors
          .map(
            (tumor, index) =>
              `🧠 Tumor ${index + 1}\nType: ${tumor.type}\nSize: ${tumor.size}\nLocation: ${tumor.location}\nConfidence: ${tumor.confidence}`
          )
          .join("\n\n");
        botMessage = { text: tumorsInfo, sender: "bot" };
      } else {
        botMessage = { text: "No tumor detected.", sender: "bot" };
      }
      setMessages((prev) => [...prev, botMessage]);
      updateHistory("Bot", botMessage.text);
    } catch (error) {
      console.error("Error uploading file:", error);
      const errorMessage = { text: "⚠️ Error processing the image.", sender: "bot" };
      setMessages((prev) => [...prev, errorMessage]);
      updateHistory("Bot", errorMessage.text);
    }
  };

  // Function to generate a PDF report from the conversation history
  const generatePDFReport = () => {
    const doc = new jsPDF();
    const lines = conversationHistory.split("\n");
    let y = 10;
    doc.setFontSize(12);
    lines.forEach((line) => {
      doc.text(line, 10, y);
      y += 7;
      if (y > 280) {
        doc.addPage();
        y = 10;
      }
    });
    doc.save("chat_report.pdf");
  };

  const diagnose = async () => {
    setMessages((prev) => [
      ...prev,
      { text: "Diagnosing your condition...", sender: "bot" },
    ]);
    updateHistory("Bot", "Diagnosing your condition...");
    try {
      const response = await fetch("http://192.168.0.103:8080/ai_diagnosis/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversation_history: conversationHistory }),
      });
      const data = await response.json();
      const diagnosisMessage = { text: data.diagnosis, sender: "bot" };
      setMessages((prev) => [...prev, diagnosisMessage]);
      updateHistory("Bot", data.diagnosis);
    } catch (error) {
      console.error("Error diagnosing:", error);
    }
  };

  // Handler for keypress events in the input field
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className={`chatbot-container ${isOpen ? "open" : ""}`}>
      {isOpen ? (
        <div className="chatbot-box">
          <div className="chatbot-header text-center">
            <span className="text-red-400">AI Medical Assistant</span>
            <X className="close-btn" onClick={() => setIsOpen(false)} />
          </div>
          <div className="chatbot-messages">
            {messages.map((msg, index) => (
              <div key={index} className={`chat-message ${msg.sender}`}>
                {msg.text}
              </div>
            ))}
          </div>
          <div className="chatbot-input">
            {statusMessage && (
              <div className={`speech-status ${statusMessage ? 'visible' : ''}`}>
                {statusMessage}
              </div>
            )}
            <input
              type="text"
              placeholder="Describe your symptoms..."
              value={input}
              ref={inputRef}
              onKeyDown={handleKeyDown}
              onChange={(e) => setInput(e.target.value)}
            />
            <button onClick={sendMessage}>
              <Send size={18} />
            </button>
            
            {/* Mic button - toggle speech recognition */}
            <button 
              className={`mic-btn ${isListening ? 'listening' : ''}`} 
              onClick={toggleListening}
              title={isListening ? "Stop recording" : "Click to speak"}
            >
              {isListening ? <MicOff size={18} /> : <Mic size={18} />}
            </button>
            
            <button className="diagnose-btn" onClick={diagnose}>
              <Activity size={18} />
            </button>
            {/* Button to manually generate PDF report */}
            <div className="pdf-report">
              <button onClick={generatePDFReport} className="pdf-button">
                Generate Report PDF
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="chatbot-icon" onClick={() => setIsOpen(true)}>
          <MessageCircle size={24} />
        </div>
      )}
    </div>
  );
};

export default Chatbot;