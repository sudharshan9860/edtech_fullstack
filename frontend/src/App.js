// Updated App.js - Configuration for New API
import React from "react";
import { BrowserRouter as Router, useLocation } from "react-router-dom";
import { AuthProvider } from "./components/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { NotificationProvider } from "./contexts/NotificationContext";
import { ProgressProvider } from "./contexts/ProgressContext";
import { LeaderboardProvider } from "./contexts/LeaderboardContext";
import { QuestProvider } from "./contexts/QuestContext";
import { CurrentQuestionProvider } from "./contexts/CurrentQuestionContext";
import AppRoutes from "./routing/Routing";
import MultilingualChatBox from "./components/MultilingualChatBox";
import "./styles/multilingualChat.css";
import "./styles/theme.css";
import { TimerProvider } from "./contexts/TimerContext";

// Import Bootstrap and other existing CSS
import 'bootstrap/dist/css/bootstrap.min.css';
import './components/StudentDash.css';
import './components/Layout.css';
import './styles/dark-mode-enhanced.css';

// ✅ UPDATED: Add global API configuration
window.STUDENT_ASSISTANT_CONFIG = {
  API_URL: process.env.REACT_APP_STUDENT_ASSISTANT_API_URL || "https://chatbot.smartlearners.ai",
  API_VERSION: "1.0",
  FEATURES: {
    VOICE_ENABLED: true,
    IMAGE_UPLOAD: true,
    MULTILINGUAL: true,
    CURRICULUM_AWARE: true
  }
};

function AppContent() {
  const location = useLocation();
  const isAuthPage = ["/login", "/", "/signup"].includes(location.pathname);

  return (
    <>
      <AppRoutes />
      {!isAuthPage && <MultilingualChatBox />}    
    </>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <NotificationProvider>
          <ProgressProvider>
            <TimerProvider>
              <LeaderboardProvider>
                <QuestProvider>
                  <CurrentQuestionProvider>
                    <Router>
                      <AppContent />
                    </Router>
                  </CurrentQuestionProvider>
                </QuestProvider>
              </LeaderboardProvider>
            </TimerProvider>
          </ProgressProvider>
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>   
  );
}

export default App;