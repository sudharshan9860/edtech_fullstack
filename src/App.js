// src/App.js
import React from 'react';
import { BrowserRouter as Router, useLocation } from 'react-router-dom';
import { AuthProvider } from './components/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { ProgressProvider } from './contexts/ProgressContext';
import { LeaderboardProvider } from './contexts/LeaderboardContext';
import { QuestProvider } from './contexts/QuestContext';
import AppRoutes from './routing/Routing';
import ChatBox from './components/ChatBox';
import './styles/theme.css';

// Wrapper component to use location hook
function AppContent() {
  const location = useLocation();
  
  // Check if current path is login or signup
  const isAuthPage = ['/login', '/', '/signup'].includes(location.pathname);
  
  return (
    <>
      <AppRoutes />
      {!isAuthPage && <ChatBox />}
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <ProgressProvider>
          <LeaderboardProvider>
            <QuestProvider>
              <Router>
                <AppContent />
              </Router>
            </QuestProvider>
          </LeaderboardProvider>
        </ProgressProvider>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;