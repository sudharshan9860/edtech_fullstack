import React, { createContext, useState, useContext, useEffect } from 'react';
import { Leaderboard, LeaderboardEntry } from '../models/Leaderboard';
import { AuthContext } from '../components/AuthContext';
import axiosInstance from '../api/axiosInstance';

export const LeaderboardContext = createContext();

export const LeaderboardProvider = ({ children }) => {
  const { username, userId } = useContext(AuthContext);
  const [leaderboard, setLeaderboard] = useState(new Leaderboard());
  const [currentUserEntry, setCurrentUserEntry] = useState(null);

  // In your LeaderboardContext.js, update the fetchLeaderboardData function:
const fetchLeaderboardData = async () => {
    try {
        const response = await axiosInstance.get('/leaderboard/');
        console.log('Leaderboard API Response:', response.data);
        
        // Handle different response formats
        let leaderboardData = [];
        
        if (response.data) {
            // Check if data is directly an array
            if (Array.isArray(response.data)) {
                leaderboardData = response.data;
            }
            // Check if data is wrapped in a status object
            else if (response.data.data && Array.isArray(response.data.data)) {
                leaderboardData = response.data.data;
            }
            // Check if data has leaderboard property
            else if (response.data.leaderboard && Array.isArray(response.data.leaderboard)) {
                leaderboardData = response.data.leaderboard;
            }
            // Check if data has students property
            else if (response.data.students && Array.isArray(response.data.students)) {
                leaderboardData = response.data.students;
            }
            else {
                console.warn('Unexpected leaderboard data format:', response.data);
                leaderboardData = [];
            }
        }
        
        setLeaderboard(leaderboardData);
        
    } catch (error) {
        console.warn('Leaderboard temporarily unavailable:', error.message);
        setLeaderboard([]); // Don't crash - just show empty leaderboard
    }
};

  // Update leaderboard entry
  const updateLeaderboardEntry = async (updateData) => {
    try {
      const entry = currentUserEntry || new LeaderboardEntry(userId, username);
      
      // Apply updates based on the type of activity
      switch (updateData.type) {
        case 'question_solved':
          entry.calculatePointsForQuestionSolved(updateData.accuracy);
          break;
        case 'chapter_completed':
          entry.calculatePointsForChapterCompletion(updateData.chaptersCompleted);
          break;
        case 'accuracy_bonus':
          entry.calculateAccuracyBonus(updateData.overallAccuracy);
          break;
        case 'daily_streak':
          entry.calculateDailyStreakPoints(updateData.consecutiveDays);
          break;
        case 'challenge_completed':
          entry.calculateChallengeCompletionPoints(updateData.challengeComplexity);
          break;
      }

      // Send update to backend
      await axiosInstance.post('/leaderboard/update', entry.toJSON());

      // Update local leaderboard
      leaderboard.addOrUpdateEntry(entry);
      setCurrentUserEntry(entry);
      setLeaderboard(new Leaderboard.fromJSON(leaderboard.toJSON()));
    } catch (error) {
      console.error('Failed to update leaderboard:', error);
    }
  };

  // Effect to fetch leaderboard on component mount
  useEffect(() => {
    fetchLeaderboardData();
  }, [userId]);

  return (
    <LeaderboardContext.Provider value={{
      leaderboard,
      currentUserEntry,
      fetchLeaderboardData,
      updateLeaderboardEntry
    }}>
      {children}
    </LeaderboardContext.Provider>
  );
};

// Custom hook for easy leaderboard context usage
export const useLeaderboard = () => {
  const context = useContext(LeaderboardContext);
  if (!context) {
    throw new Error('useLeaderboard must be used within a LeaderboardProvider');
  }
  return context;
};