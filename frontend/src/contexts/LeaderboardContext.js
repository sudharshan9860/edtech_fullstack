import React, { createContext, useState, useContext, useEffect } from 'react';
import { Leaderboard, LeaderboardEntry } from '../models/Leaderboard';
import { AuthContext } from '../components/AuthContext';
import axiosInstance from '../api/axiosInstance';

export const LeaderboardContext = createContext();

export const LeaderboardProvider = ({ children }) => {
  const { username, userId } = useContext(AuthContext);
  const [leaderboard, setLeaderboard] = useState(new Leaderboard());
  const [currentUserEntry, setCurrentUserEntry] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch leaderboard data from backend
  const fetchLeaderboardData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axiosInstance.get('/leaderboard/');
      
      // Handle different possible response structures
      let leaderboardData;
      
      // Check what structure the API response has
      console.log('API Response:', response.data);
      
      // Case 1: Data is directly in response.data as array
      if (Array.isArray(response.data)) {
        leaderboardData = response.data;
      }
      // Case 2: Data is nested under response.data.data (common pattern)
      else if (response.data && Array.isArray(response.data.data)) {
        leaderboardData = response.data.data;
      }
      // Case 3: Data is nested under response.data.leaderboard
      else if (response.data && Array.isArray(response.data.leaderboard)) {
        leaderboardData = response.data.leaderboard;
      }
      // Case 4: Data is nested under response.data.entries
      else if (response.data && Array.isArray(response.data.entries)) {
        leaderboardData = response.data.entries;
      }
      // Case 5: Handle empty response
      else if (!response.data) {
        console.warn('No leaderboard data received');
        leaderboardData = [];
      }
      // Case 6: Unexpected format
      else {
        console.error('Unexpected API response format:', response.data);
        throw new Error('Invalid leaderboard data format received from API');
      }
      
      // Ensure we have an array
      if (!Array.isArray(leaderboardData)) {
        throw new Error('Leaderboard data is not an array');
      }
      
      // Process the leaderboard entries
      const fetchedEntries = leaderboardData.map(entry => {
        // Handle different entry formats
        if (entry.userId && entry.username) {
          // Already in correct format
          return LeaderboardEntry.fromJSON(entry);
        } else if (entry.student_id) {
          // Convert from API format to our format
          const convertedEntry = {
            userId: entry.student_id,
            username: entry.username,
            totalPoints: entry.totalPoints || entry.average_score || 0,
            pointBreakdown: entry.pointBreakdown || {
              questionsSolved: 0,
              chaptersCompleted: 0,
              accuracyBonus: 0,
              dailyStreak: 0,
              challengesCompleted: 0
            },
            rank: entry.rank || null,
            badges: entry.badges || [],
            lastUpdated: entry.lastUpdated || new Date().toISOString()
          };
          return LeaderboardEntry.fromJSON(convertedEntry);
        } else {
          // Handle other formats
          return LeaderboardEntry.fromJSON(entry);
        }
      });
      
      const updatedLeaderboard = new Leaderboard();
      fetchedEntries.forEach(entry => 
        updatedLeaderboard.addOrUpdateEntry(entry)
      );
      
      setLeaderboard(updatedLeaderboard);
      
      // Find current user's entry
      const userEntry = updatedLeaderboard.entries.find(
        entry => entry.userId === userId
      );
      setCurrentUserEntry(userEntry);
      
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error);
      setError(error.message || 'Failed to fetch leaderboard data');
      
      // Set empty leaderboard on error
      setLeaderboard(new Leaderboard());
      setCurrentUserEntry(null);
    } finally {
      setLoading(false);
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
        default:
          console.warn('Unknown update type:', updateData.type);
          return;
      }

      // Send update to backend
      await axiosInstance.post('/leaderboard/update', entry.toJSON());

      // Update local leaderboard
      leaderboard.addOrUpdateEntry(entry);
      setCurrentUserEntry(entry);
      
      // Create new leaderboard instance to trigger re-render
      const newLeaderboard = new Leaderboard();
      leaderboard.entries.forEach(existingEntry => {
        newLeaderboard.addOrUpdateEntry(existingEntry);
      });
      setLeaderboard(newLeaderboard);
      
    } catch (error) {
      console.error('Failed to update leaderboard:', error);
      setError('Failed to update leaderboard entry');
    }
  };

  // Add new entry (for when user doesn't exist in leaderboard yet)
  const addLeaderboardEntry = async (userData) => {
    try {
      const newEntry = new LeaderboardEntry(userData.userId, userData.username);
      
      // Send to backend
      await axiosInstance.post('/leaderboard/add', newEntry.toJSON());
      
      // Update local state
      leaderboard.addOrUpdateEntry(newEntry);
      setCurrentUserEntry(newEntry);
      setLeaderboard(new Leaderboard().fromJSON(leaderboard.toJSON()));
      
    } catch (error) {
      console.error('Failed to add leaderboard entry:', error);
      setError('Failed to add new leaderboard entry');
    }
  };

  // Get user's current rank
  const getCurrentUserRank = () => {
    return currentUserEntry ? currentUserEntry.rank : null;
  };

  // Get top N entries
  const getTopEntries = (limit = 10) => {
    return leaderboard.getTopEntries(limit);
  };

  // Get entries around current user (for showing user's position)
  const getEntriesAroundUser = (range = 2) => {
    if (!currentUserEntry || !currentUserEntry.rank) return [];
    
    const userRank = currentUserEntry.rank;
    const startIndex = Math.max(0, userRank - range - 1);
    const endIndex = Math.min(leaderboard.entries.length, userRank + range);
    
    return leaderboard.entries.slice(startIndex, endIndex);
  };

  // Refresh leaderboard data
  const refreshLeaderboard = () => {
    fetchLeaderboardData();
  };

  // Effect to fetch leaderboard on component mount and when userId changes
  useEffect(() => {
    if (userId) {
      fetchLeaderboardData();
    }
  }, [userId]);

  // Auto-refresh leaderboard every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      if (userId) {
        fetchLeaderboardData();
      }
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, [userId]);

  const contextValue = {
    leaderboard,
    currentUserEntry,
    loading,
    error,
    fetchLeaderboardData,
    updateLeaderboardEntry,
    addLeaderboardEntry,
    getCurrentUserRank,
    getTopEntries,
    getEntriesAroundUser,
    refreshLeaderboard
  };

  return (
    <LeaderboardContext.Provider value={contextValue}>
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