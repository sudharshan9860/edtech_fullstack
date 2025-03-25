// src/components/ChatBox.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Button, Form, InputGroup } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCommentDots, faPaperPlane, faTimes } from '@fortawesome/free-solid-svg-icons';
import axiosInstance from '../api/axiosInstance';
import './ChatBox.css';

const ChatBox = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      text: "Hello! I'm your AI assistant. How can I help you with your questions today?", 
      sender: 'ai' 
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Scroll to bottom of messages when new ones are added
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleInputChange = (e) => {
    setNewMessage(e.target.value);
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    
    if (newMessage.trim() === '') return;
    
    const userMessageId = Date.now();
    const userMessage = {
      id: userMessageId,
      text: newMessage,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setIsTyping(true);
    console.log('Sending message:', newMessage);
    try {
      const response = await axiosInstance.post('/chatbot/', {
        message: newMessage
      });
      console.log(response.data);
      const aiResponse = {
        id: userMessageId + 1,
        text: response.data.step_by_step_solution || "I'm not sure about that. Could you try rephrasing your question?",
        sender: 'ai',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('Error sending message:', error);
      
      const errorResponse = {
        id: userMessageId + 1,
        text: "Sorry, I'm having trouble connecting to the server. Please try again later.",
        sender: 'ai',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsTyping(false);
    }
  };

  // Simple simulated responses for testing
  const getSimulatedResponse = (question) => {
    const questionLower = question.toLowerCase();
    
    if (questionLower.includes('hello') || questionLower.includes('hi')) {
      return "Hello! How can I help you with your studies today?";
    } else if (questionLower.includes('thank')) {
      return "You're welcome! Let me know if you have any other questions.";
    } else if (questionLower.includes('math') || questionLower.includes('equation')) {
      return "For math questions, it helps to break down the problem step by step. Can you tell me what specific concept you're struggling with?";
    } else if (questionLower.includes('concept') || questionLower.includes('understand')) {
      return "Learning new concepts can be challenging. Would you like me to explain it in a different way or provide an example?";
    } else {
      return "That's an interesting question! To better help you, could you provide more details or specify what part you're having difficulty with?";
    }
  };

  return (
    <div className="chat-box-container">
      {/* Chat toggle button */}
      <Button 
        className={`chat-toggle-btn ${isOpen ? 'open' : ''}`} 
        onClick={toggleChat}
      >
        <FontAwesomeIcon icon={isOpen ? faTimes : faCommentDots} />
        {!isOpen && <span className="chat-label">Ask a question</span>}
      </Button>
      
      {/* Chat box */}
      <div className={`chat-box ${isOpen ? 'open' : ''}`}>
        <div className="chat-header">
          <h5>AI Tutor Assistant</h5>
          <Button variant="link" className="close-btn" onClick={toggleChat}>
            <FontAwesomeIcon icon={faTimes} />
          </Button>
        </div>
        
        <div className="chat-messages">
          {messages.map((message) => (
            <div 
              key={message.id} 
              className={`message ${message.sender === 'user' ? 'user-message' : 'ai-message'}`}
            >
              <div className="message-bubble">
                {message.text}
              </div>
              <div className="message-time">
                {message.timestamp ? 
                  new Date(message.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 
                  ''}
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="message ai-message">
              <div className="message-bubble typing">
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
        
        <Form onSubmit={sendMessage}>
          <InputGroup className="chat-input">
            <Form.Control
              type="text"
              placeholder="Type your question..."
              value={newMessage}
              onChange={handleInputChange}
            />
            <Button type="submit" disabled={!newMessage.trim()}>
              <FontAwesomeIcon icon={faPaperPlane} />
            </Button>
          </InputGroup>
        </Form>
      </div>
    </div>
  );
};

export default ChatBox;