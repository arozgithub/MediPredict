import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import React from "react";
import Navbar from "./components/Navbar";
import PredictorsPage from "./pages/PredictorsPage";
import AboutPage from "./pages/AboutPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignUpPage";
import HomePage from "./pages/HomePage";
import BreastPage from "./pages/BreastPage";
import LungPage from "./pages/LungPage";
import HeartPage from "./pages/HeartPage";
import DiabetesPage from "./pages/DiabetesPage";
import { UserContextProvider } from "./context/UserContext";
import Dashboard from "./pages/Dashboard";
import Chatbot from "./components/Chatbot";

function ChatbotWrapper() {
  const location = useLocation();
  const showChatbot = location.pathname.startsWith("/predictors");
  return showChatbot ? <Chatbot /> : null;
}

function App() {
  return (
    <UserContextProvider>
      <Router>
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/" element={<HomePage />} />
            <Route path="/predictors" element={<PredictorsPage />} />
            <Route path="/predictors/breast" element={<BreastPage />} />
            <Route path="/predictors/lung" element={<LungPage />} />
            <Route path="/predictors/heart" element={<HeartPage />} />
            <Route path="/predictors/diabetes" element={<DiabetesPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>

          {/* Show chatbot only on predictors routes */}
          <ChatbotWrapper />
        </div>
      </Router>
    </UserContextProvider>
  );
}

export default App;
