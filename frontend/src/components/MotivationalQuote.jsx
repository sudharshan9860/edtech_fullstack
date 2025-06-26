// MotivationalQuote.jsx
import React, { useState, useEffect } from 'react';
import './MotivationalQuote.css';

const MotivationalQuote = () => {
  const [currentQuote, setCurrentQuote] = useState({});

  const quotes = [
    {
      text: "Practice makes progress!",
      author: "AI Educator",
      emoji: "💪",
      color: "teal"
    },
    {
      text: "Small steps lead to big achievements!",
      author: "Learning Journey",
      emoji: "🎯",
      color: "purple"
    },
    {
      text: "You're doing amazing! Keep going!",
      author: "Your Progress",
      emoji: "💫",
      color: "blue"
    },
    {
      text: "Every question solved is a step forward!",
      author: "Growth Mindset",
      emoji: "🚀",
      color: "green"
    },
    {
      text: "Learning is a treasure that will follow its owner everywhere!",
      author: "Chinese Proverb",
      emoji: "💎",
      color: "gold"
    },
    {
      text: "The expert in anything was once a beginner!",
      author: "Helen Hayes",
      emoji: "🌟",
      color: "orange"
    },
    {
      text: "Success is the sum of small efforts repeated day in and day out!",
      author: "Robert Collier",
      emoji: "⭐",
      color: "red"
    },
    {
      text: "Education is the most powerful weapon which you can use to change the world!",
      author: "Nelson Mandela",
      emoji: "🌍",
      color: "indigo"
    }
  ];

  useEffect(() => {
    // Set a random quote on component mount
    const randomIndex = Math.floor(Math.random() * quotes.length);
    setCurrentQuote(quotes[randomIndex]);

    // Change quote every 10 seconds
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * quotes.length);
      setCurrentQuote(quotes[randomIndex]);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  if (!currentQuote.text) return null;

  return (
    <div className={`motivational-quote ${currentQuote.color}`}>
      <div className="quote-content">
        <div className="quote-emoji">{currentQuote.emoji}</div>
        <div className="quote-text">
          <p className="quote-message">"{currentQuote.text}"</p>
          <cite className="quote-author">— {currentQuote.author}</cite>
        </div>
      </div>
    </div>
  );
};

export default MotivationalQuote;