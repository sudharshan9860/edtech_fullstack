// src/App.js
import React from "react";
import { BrowserRouter as Router, useLocation } from "react-router-dom";
import { AuthProvider } from "./components/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext"; // Import ThemeProvider
import { NotificationProvider } from "./contexts/NotificationContext";
import { ProgressProvider } from "./contexts/ProgressContext";
import { LeaderboardProvider } from "./contexts/LeaderboardContext";
import { QuestProvider } from "./contexts/QuestContext";
import { CurrentQuestionProvider } from "./contexts/CurrentQuestionContext";
import AppRoutes from "./routing/Routing";
import ChatBox from "./components/ChatBox";
import "./styles/theme.css";
import { TimerProvider } from "./contexts/TimerContext";


// Wrapper component to use location hook
function AppContent() {
  const location = useLocation();

  // Check if current path is login or signup
  const isAuthPage = ["/login", "/", "/signup"].includes(location.pathname);

  return (
    <>
      <AppRoutes />
      {!isAuthPage && <ChatBox />}
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
