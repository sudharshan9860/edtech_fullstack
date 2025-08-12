// TimerContext.js - Fixed timer functionality

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';

const TimerContext = createContext();

export const useTimer = () => {
  const context = useContext(TimerContext);
  if (!context) {
    throw new Error('useTimer must be used within a TimerProvider');
  }
  return context;
};

export const TimerProvider = ({ children }) => {
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const intervalRef = useRef(null);

  // Start the timer
  const startTimer = useCallback(() => {
    if (!isTimerActive) {
      const now = Date.now();
      setStartTime(now);
      setIsTimerActive(true);
      
      console.log('Timer started at:', new Date(now).toLocaleTimeString());
    }
  }, [isTimerActive]);

  // Stop the timer
  const stopTimer = useCallback(() => {
    if (isTimerActive) {
      setIsTimerActive(false);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      
      const totalElapsed = startTime ? Date.now() - startTime + elapsedTime : elapsedTime;
      console.log('Timer stopped. Total elapsed time:', Math.floor(totalElapsed / 1000), 'seconds');
    }
  }, [isTimerActive, startTime, elapsedTime]);

  // Pause the timer (keeps elapsed time)
  const pauseTimer = useCallback(() => {
    if (isTimerActive && startTime) {
      const currentElapsed = Date.now() - startTime;
      setElapsedTime(prev => prev + currentElapsed);
      setIsTimerActive(false);
      setStartTime(null);
      
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
  }, [isTimerActive, startTime]);

  // Resume the timer
  const resumeTimer = useCallback(() => {
    if (!isTimerActive) {
      const now = Date.now();
      setStartTime(now);
      setIsTimerActive(true);
    }
  }, [isTimerActive]);

  // Reset the timer
  const resetTimer = useCallback(() => {
    setIsTimerActive(false);
    setElapsedTime(0);
    setStartTime(null);
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // Get current elapsed time
  const getCurrentTime = useCallback(() => {
    if (isTimerActive && startTime) {
      return elapsedTime + (Date.now() - startTime);
    }
    return elapsedTime;
  }, [isTimerActive, startTime, elapsedTime]);

  // Format time as MM:SS
  const formatTime = useCallback((timeInMs) => {
    const totalSeconds = Math.floor(timeInMs / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }, []);

  // Update timer display every second when active
  useEffect(() => {
    if (isTimerActive && startTime) {
      intervalRef.current = setInterval(() => {
        // Force re-render by updating a dummy state or using getCurrentTime
        const currentTime = getCurrentTime();
        // This will trigger re-renders in components using getCurrentTime
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isTimerActive, startTime, getCurrentTime]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const value = {
    isTimerActive,
    elapsedTime: getCurrentTime(),
    startTimer,
    stopTimer,
    pauseTimer,
    resumeTimer,
    resetTimer,
    getCurrentTime,
    formatTime: (time) => formatTime(time || getCurrentTime()),
    // Additional utility methods
    getElapsedSeconds: () => Math.floor(getCurrentTime() / 1000),
    getElapsedMinutes: () => Math.floor(getCurrentTime() / (1000 * 60)),
  };

  return (
    <TimerContext.Provider value={value}>
      {children}
    </TimerContext.Provider>
  );
};

export default TimerProvider;