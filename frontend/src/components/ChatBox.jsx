import React, { useState, useRef, useEffect } from "react";
import { Button, Form, InputGroup } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCommentDots,
  faPaperPlane,
  faTimes,
  faUpload,
} from "@fortawesome/free-solid-svg-icons";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";
import axiosInstance from "../api/axiosInstance";
import { useCurrentQuestion } from "../contexts/CurrentQuestionContext";
import MarkdownWithMath from "./MarkdownWithMath";
import "./ChatBox.css";

const formatMessage = (text) => {
  if (!text) return null;

  // Handle array responses
  if (Array.isArray(text)) {
    return (
      <div className="paragraph-solution">
        {text.map((paragraph, index) => {
          // Remove ALL quotes, colons, commas, and square brackets from each paragraph
          let cleanedText = paragraph;
          if (typeof cleanedText === "string") {
            cleanedText = cleanedText.trim()
          }

          return (
            <p key={index} className="solution-paragraph">
              {formatMessageText(cleanedText)}
            </p>
          );
        })}
      </div>
    );
  }

  return formatMessageText(text);
};

const formatMessageText = (text) => {
  if (!text) return null;

  // Remove ALL quotes, colons, commas, and square brackets from non-array text
  if (typeof text === "string") {
    text = text.trim()
  }

  // Split text into segments based on math delimiters
  const segments = text.split(/(\$\$.*?\$\$|\$.*?\$)/g);

  return segments.map((segment, index) => {
    if (segment.startsWith("$$") && segment.endsWith("$$")) {
      return <MarkdownWithMath content= {segment.slice(2, -2)} />;
    } else if (segment.startsWith("$") && segment.endsWith("$")) {
      return <InlineMath key={index}>{segment.slice(1, -1)}</InlineMath>;
    } else if (segment.startsWith("```") && segment.endsWith("```")) {
      return (
        <pre key={index} className="code-block">
          <code>{segment.slice(3, -3)}</code>
        </pre>
      );
    } else {
      return (
        <span key={index}>
          {segment.split("\n").map((line, i) => (
            <React.Fragment key={i}>
              {line}
              {i !== segment.split("\n").length - 1 && <br />}
            </React.Fragment>
          ))}
        </span>
      );
    }
  });
};

const ChatBox = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your AI assistant. How can I help you with your questions today?",
      sender: "ai",
      timestamp: new Date(),
    },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const { currentQuestion } = useCurrentQuestion();

  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  // Clean up preview URL when component unmounts
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleInputChange = (e) => {
    setNewMessage(e.target.value);
  };

  // File handling functions
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    handleFile(file);
  };

  const handleFile = (file) => {
    if (!file) return;
    
    // Check if file is an image
    if (!file.type.match('image.*')) {
      alert('Please upload an image file');
      return;
    }
    
    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size should not exceed 5MB');
      return;
    }
    
    setSelectedFile(file);
    
    // Create a preview
    const fileUrl = URL.createObjectURL(file);
    setPreviewUrl(fileUrl);
  };

  const clearSelectedFile = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  const handleFileButtonClick = () => {
    fileInputRef.current.click();
  };

  const sendMessage = async (e) => {
    e.preventDefault();

    if (newMessage.trim() === "" && !selectedFile) return;

    const userMessageId = Date.now();
    
    // Create user message with text and/or image
    const userMessage = {
      id: userMessageId,
      text: newMessage,
      sender: "user",
      timestamp: new Date(),
      image: previewUrl
    };

    setMessages((prev) => [...prev, userMessage]);
    setNewMessage("");
    setIsTyping(true);

    try {
      // Create FormData for sending files
      const formData = new FormData();
      formData.append('message', newMessage);
      
      if (currentQuestion) {
        formData.append('question_text', currentQuestion.question);
      }
      
      if (selectedFile) {
        formData.append('ans_img', selectedFile);
      }

      // Send to backend using axios
      const response = await axiosInstance.post("/chatbot/", formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      // Process the solution data
      let solutionData = response.data.step_by_step_solution;

      // If it's an array, clean each string element by removing ALL quotes
      if (Array.isArray(solutionData)) {
        solutionData = solutionData.map((item) =>
          typeof item === "string" ? item.trim() : item
        );
      }

      const aiResponse = {
        id: userMessageId + 1,
        text:
          solutionData ||
          "I'm not sure about that. Could you try rephrasing your question?",
        sender: "ai",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiResponse]);
    } catch (error) {
      console.error("Error sending message:", error);
      const errorResponse = {
        id: userMessageId + 1,
        text: "Sorry, I'm having trouble connecting to the server. Please try again later.",
        sender: "ai",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorResponse]);
    } finally {
      setIsTyping(false);
      clearSelectedFile();
    }
  };

  return (
    <div className="chat-box-container">
      <button
        className={`chat-toggle-btn ${isOpen ? "open" : ""}`}
        onClick={toggleChat}
      >
        <FontAwesomeIcon icon={isOpen ? faTimes : faCommentDots} />
        {!isOpen && <span className="chat-label">Ask a question</span>}
      </button>

      <div 
        className={`chat-box ${isOpen ? "open" : ""}`}
      >
        <div className="chat-header">
          <h5>AI Tutor Assistant</h5>
          <button className="close-btn" onClick={toggleChat}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        <div className="chat-messages">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`message ${message.sender === "user" ? "user-message" : "ai-message"}`}
            >
              <div className="message-bubble">
                {formatMessage(message.text)}
                {message.image && (
                  <div className="message-image-container">
                    <img 
                      src={message.image} 
                      alt="User uploaded" 
                      className="message-image"
                    />
                  </div>
                )}
              </div>
              <div className="message-time">
                {message.timestamp
                  ? new Date(message.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                  : ""}
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

        <Form onSubmit={sendMessage} className="chat-input">
          <InputGroup>
            <Form.Control
              type="text"
              placeholder="Type your question..."
              value={newMessage}
              onChange={handleInputChange}
            />
            
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              style={{ display: 'none' }}
            />
            
            {previewUrl ? (
              <div className="input-thumbnail-container">
                <div className="input-thumbnail">
                  <img src={previewUrl} alt="Thumbnail" className="thumbnail-image" />
                  <button 
                    className="remove-thumbnail-btn" 
                    onClick={clearSelectedFile}
                    aria-label="Remove image"
                    type="button"
                  >
                    <FontAwesomeIcon icon={faTimes} />
                  </button>
                </div>
              </div>
            ) : (
              <Button 
                className="ms-1 d-flex align-items-center justify-content-center" 
                type="button"
                onClick={handleFileButtonClick}
              >
                <FontAwesomeIcon className="flex" icon={faUpload} />
              </Button>
            )}
          </InputGroup>
          <Button 
            className="ms-1 d-flex align-items-center justify-content-center"  
            type="submit" 
            disabled={!newMessage.trim() && !selectedFile}
          >
            <FontAwesomeIcon icon={faPaperPlane} />
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default ChatBox;