// Updated MultilingualChatBox.jsx - Integrated with New Student Performance Assistant API

import React, { useState, useRef, useEffect, useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCommentDots,
  faPaperPlane,
  faTimes,
  faMicrophone,
  faMicrophoneSlash,
  faVolumeUp,
  faLanguage,
  faImage,
  faSpinner,
  faTrash,
  faStop,
  faExclamationTriangle,
  faEye,
  faUser,
  faBook
} from "@fortawesome/free-solid-svg-icons";
import { AuthContext } from './AuthContext';

/**
 * UPDATED MultilingualChatBox for Student Performance Assistant API
 * 
 * New Features:
 * ✅ Integration with new authentication system
 * ✅ Student information retrieval
 * ✅ Curriculum-aware responses
 * ✅ Chat history management
 * ✅ Updated audio processing endpoint
 * ✅ Improved error handling and session management
 */

const MultilingualChatBox = () => {
  // Auth Context
  const { username, isAuthenticated } = useContext(AuthContext);

  // Basic State
  const [isOpen, setIsOpen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState("en");
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Student Information State
  const [studentInfo, setStudentInfo] = useState(null);
  const [curriculumInfo, setCurriculumInfo] = useState(null);

  // Voice States
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);
  const [recordingTime, setRecordingTime] = useState(0);

  // Image States  
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);

  // UI States
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('checking');

  // Refs
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const recordingIntervalRef = useRef(null);
  const messageCounter = useRef(0);

  // Updated API URL - pointing to the new Student Performance Assistant API
  const API_URL = process.env.REACT_APP_STUDENT_ASSISTANT_API_URL || "https://chatbot.smartlearners.ai";

  // Languages supported by the new API
  const languages = [
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "hi", name: "Hindi", flag: "🇮🇳" },
    { code: "te", name: "Telugu", flag: "🇮🇳" },
    { code: "ta", name: "Tamil", flag: "🇮🇳" },
    { code: "bn", name: "Bengali", flag: "🇧🇩" },
    { code: "mr", name: "Marathi", flag: "🇮🇳" },
    { code: "es", name: "Spanish", flag: "🇪🇸" },
    { code: "fr", name: "French", flag: "🇫🇷" },
    { code: "ar", name: "Arabic", flag: "🇸🇦" }
  ];

  // Initialize when component mounts
  useEffect(() => {
    if (isAuthenticated && isOpen) {
      initializeChatbot();
    }
  }, [isAuthenticated, isOpen]);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Initialize chatbot with student information
  const initializeChatbot = async () => {
    if (!isAuthenticated) {
      setError("Please log in to use the chatbot.");
      return;
    }

    setIsLoading(true);
    setConnectionStatus('checking');
    
    try {
      // Check API health
      await checkApiHealth();
      
      // Get student information
      await fetchStudentInfo();
      
      // Get curriculum information
      await fetchCurriculumInfo();
      
      // Load chat history
      await loadChatHistory();
      
      setConnectionStatus('connected');
      
      // Add welcome message if no existing messages
      if (messages.length === 0) {
        addMessage({
          text: `👋 Hello ${studentInfo?.student_name || username}! I'm your AI Study Assistant. I can help you with your ${studentInfo?.student_class || 'studies'}. How can I assist you today?`,
          sender: "ai",
          canSpeak: true
        });
      }

    } catch (error) {
      console.error("Initialization error:", error);
      setError(`Failed to initialize chatbot: ${error.message}`);
      setConnectionStatus('disconnected');
    } finally {
      setIsLoading(false);
    }
  };

  // Check API health
  const checkApiHealth = async () => {
    try {
      const response = await fetch(`${API_URL}/health`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem('accessToken')}`,
          "Accept": "application/json"
        }
      });

      if (!response.ok) {
        throw new Error(`Health check failed: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      throw new Error(`API health check failed: ${error.message}`);
    }
  };

  // Fetch student information
  const fetchStudentInfo = async () => {
    try {
      const response = await fetch(`${API_URL}/student-info`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem('accessToken')}`,
          "Accept": "application/json"
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch student info: ${response.status}`);
      }
      
      const data = await response.json();
      setStudentInfo(data);
      return data;
    } catch (error) {
      console.warn("Could not fetch student info:", error);
      return null;
    }
  };

  // Fetch curriculum information
  const fetchCurriculumInfo = async () => {
    try {
      const response = await fetch(`${API_URL}/curriculum-info`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem('accessToken')}`,
          "Accept": "application/json"
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch curriculum info: ${response.status}`);
      }
      
      const data = await response.json();
      setCurriculumInfo(data);
      return data;
    } catch (error) {
      console.warn("Could not fetch curriculum info:", error);
      return null;
    }
  };

  // Load chat history
  const loadChatHistory = async () => {
    try {
      const response = await fetch(`${API_URL}/chat-history`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem('accessToken')}`,
          "Accept": "application/json"
        }
      });

      if (response.ok) {
        const data = await response.json();
        // Process and load historical messages if needed
        console.log("Chat history loaded:", data);
      }
    } catch (error) {
      console.warn("Could not load chat history:", error);
    }
  };

  // Add message function
  const addMessage = (message) => {
    messageCounter.current += 1;
    const newMsg = {
      id: `msg_${Date.now()}_${messageCounter.current}`,
      timestamp: new Date(),
      ...message
    };
    
    setMessages(prev => [...prev, newMsg]);
  };

  // Send text message using new API
  const sendTextMessage = async (e) => {
    e?.preventDefault();
    if (!newMessage.trim() || !isAuthenticated) return;

    addMessage({ text: newMessage, sender: "user" });
    const messageText = newMessage;
    setNewMessage("");
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/chat`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem('accessToken')}`,
          "Accept": "application/json"
        },
        body: JSON.stringify({
          query: messageText,
          language: currentLanguage
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      addMessage({
        text: data.reply || "I received your message!",
        sender: "ai",
        canSpeak: true,
        audioUrl: data.audio || null
      });

    } catch (error) {
      console.error("Text message error:", error);
      addMessage({
        text: `Sorry, I couldn't process your message. Error: ${error.message}. Please try again.`,
        sender: "ai"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Send image with message using new API
  const sendImageMessage = async (command) => {
    if (!selectedImage || !isAuthenticated) return;

    const imageText = command === "solve it" ? "📸 Please solve this problem step by step" : "📸 Please check if my work is correct";
    
    addMessage({ 
      text: imageText, 
      sender: "user", 
      imageUrl: imagePreview 
    });
    
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append('query', command);
      formData.append('language', currentLanguage);
      formData.append('image', selectedImage);

      const response = await fetch(`${API_URL}/chat`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      addMessage({
        text: formatImageResponse(data, command),
        sender: "ai",
        canSpeak: true,
        audioUrl: data.audio || null
      });

    } catch (error) {
      console.error("Image message error:", error);
      addMessage({
        text: `❌ **Image Analysis Failed**\n\nSorry, I couldn't process your image. Error: ${error.message}\n\nPlease try again with a clearer image.`,
        sender: "ai"
      });
    } finally {
      setIsLoading(false);
      clearImageSelection();
    }
  };

  // Process audio using new API
  const sendVoiceMessage = async () => {
    if (!audioBlob || !isAuthenticated) return;

    addMessage({ 
      text: `🎵 Voice message (${formatTime(recordingTime)})`, 
      sender: "user", 
      type: "voice" 
    });
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append('language', currentLanguage);
      
      const audioFile = new File([audioBlob], `voice_${Date.now()}.wav`, { 
        type: 'audio/wav' 
      });
      formData.append('audio', audioFile);

      const response = await fetch(`${API_URL}/process-audio`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      let responseText = data.response || "Voice message processed!";
      
      if (data.transcription) {
        responseText = `I heard: "${data.transcription}"\n\n${responseText}`;
      }
      
      addMessage({
        text: responseText,
        sender: "ai",
        canSpeak: true,
        audioUrl: data.audio || null,
        transcription: data.transcription
      });

    } catch (error) {
      console.error("Voice message error:", error);
      addMessage({
        text: `Sorry, I couldn't process your voice message. Error: ${error.message}`,
        sender: "ai"
      });
    } finally {
      setIsLoading(false);
      setAudioBlob(null);
      setRecordingTime(0);
    }
  };

  // Format image response based on command
  const formatImageResponse = (data, command) => {
    const commandEmoji = command === "solve it" ? "🧮" : "✅";
    const commandLabel = command === "solve it" ? "Step-by-Step Solution" : "Correction Analysis";
    
    return `${commandEmoji} **${commandLabel}:**\n\n${data.reply}`;
  };

  // Play audio response if available
  const playResponseAudio = async (audioUrl) => {
    if (!audioUrl || isPlayingAudio) return;
    
    setIsPlayingAudio(true);
    
    try {
      const audio = new Audio(audioUrl);
      
      audio.onended = () => {
        setIsPlayingAudio(false);
      };
      
      audio.onerror = () => {
        setIsPlayingAudio(false);
        setError("Audio playback failed.");
      };
      
      await audio.play();
    } catch (error) {
      console.error("Audio playback error:", error);
      setIsPlayingAudio(false);
      setError("Audio playback is not available.");
    }
  };

  // Voice recording functions (keeping existing implementation)
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          sampleRate: 16000,
          channelCount: 1,
          volume: 1.0,
          echoCancellation: true,
          noiseSuppression: true
        } 
      });

      const recorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      const audioChunks = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.push(event.data);
        }
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        setAudioBlob(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
      setRecordingTime(0);

      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime(prev => {
          if (prev >= 60) {
            stopRecording();
            return prev;
          }
          return prev + 1;
        });
      }, 1000);

    } catch (error) {
      console.error("Recording start error:", error);
      setError("Failed to start recording. Please check microphone permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state === "recording") {
      mediaRecorder.stop();
    }
    
    setIsRecording(false);
    
    if (recordingIntervalRef.current) {
      clearInterval(recordingIntervalRef.current);
    }
  };

  // Image handling functions (keeping existing implementation)
  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setError('Please select a valid image file (PNG, JPEG, GIF, or WebP)');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('Image must be smaller than 10MB');
      return;
    }

    setSelectedImage(file);
    setImagePreview(URL.createObjectURL(file));
    setShowImageModal(true);
    setError(null);
  };

  const clearImageSelection = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setShowImageModal(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Utility functions
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getConnectionStatusColor = () => {
    switch (connectionStatus) {
      case 'connected': return '#10b981';
      case 'checking': return '#f59e0b';
      case 'disconnected': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const formatMessageText = (text) => {
    if (typeof text !== 'string') return text;

    // Enhanced formatting for step-by-step solutions
    if (text.includes('**Step') || text.includes('Step ')) {
      const steps = text.split(/(?=\*\*Step|\nStep)/);
      return (
        <div style={{ lineHeight: "1.6" }}>
          {steps.map((step, index) => (
            <div key={index} style={{
              marginBottom: index < steps.length - 1 ? '12px' : '0',
              padding: step.toLowerCase().includes('step') ? '8px 12px' : '0',
              backgroundColor: step.toLowerCase().includes('step') ? '#f0f9ff' : 'transparent',
              borderLeft: step.toLowerCase().includes('step') ? '3px solid #0ea5e9' : 'none',
              borderRadius: '4px'
            }}>
              {step.split('\n').map((line, i) => (
                <React.Fragment key={i}>
                  {line}
                  {i !== step.split('\n').length - 1 && <br />}
                </React.Fragment>
              ))}
            </div>
          ))}
        </div>
      );
    }

    // Regular text formatting
    return text.split('\n').map((line, i) => (
      <React.Fragment key={i}>
        {line}
        {i !== text.split('\n').length - 1 && <br />}
      </React.Fragment>
    ));
  };

  // Clear chat
  const clearChat = () => {
    setMessages([]);
    addMessage({
      text: `🔄 Chat cleared! Hello again ${studentInfo?.student_name || username}! How can I help you with your studies?`,
      sender: "ai",
      canSpeak: true
    });
  };

  if (!isAuthenticated) {
    return null; // Don't show chatbot if user is not authenticated
  }

  return (
    <div className="multilingual-chatbox-container">
      {/* Chat Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          background: connectionStatus === 'connected' 
            ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
            : "linear-gradient(45deg, #f44336, #d32f2f)",
          border: "none",
          color: "white",
          fontSize: "24px",
          cursor: "pointer",
          zIndex: 1000,
          boxShadow: "0 4px 15px rgba(0,0,0,0.2)"
        }}
      >
        <FontAwesomeIcon icon={isOpen ? faTimes : faCommentDots} />
        
        {/* Connection status indicator */}
        <div style={{
          position: "absolute",
          top: "-5px",
          right: "-5px",
          width: "15px",
          height: "15px",
          borderRadius: "50%",
          background: getConnectionStatusColor(),
          border: "2px solid white"
        }} />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="chat-window" style={{
          position: "fixed",
          bottom: "90px",
          right: "20px",
          width: "400px",
          height: "600px",
          background: "white",
          borderRadius: "15px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
          zIndex: 1001,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden"
        }}>
          {/* Header */}
          <div style={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
            padding: "15px 20px",
            borderRadius: "15px 15px 0 0",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}>
            <div>
              <h4 style={{ margin: 0, fontSize: "16px" }}>
                🤖 Study Assistant
              </h4>
              <small style={{ 
                opacity: 0.9,
                fontSize: "12px",
                display: "flex",
                alignItems: "center",
                gap: "5px"
              }}>
                <FontAwesomeIcon icon={faUser} />
                {studentInfo?.student_name || username} • {studentInfo?.student_class || 'Student'}
              </small>
            </div>

            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              {/* Language Selector */}
              <div style={{ position: "relative" }}>
                <button
                  onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
                  style={{
                    background: "rgba(255,255,255,0.2)",
                    border: "1px solid rgba(255,255,255,0.3)",
                    color: "white",
                    borderRadius: "5px",
                    padding: "5px 8px",
                    cursor: "pointer",
                    fontSize: "12px"
                  }}
                >
                  <FontAwesomeIcon icon={faLanguage} style={{ marginRight: "5px" }} />
                  {languages.find(l => l.code === currentLanguage)?.flag}
                </button>

                {showLanguageDropdown && (
                  <div style={{
                    position: "absolute",
                    top: "35px",
                    right: "0",
                    background: "white",
                    borderRadius: "8px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                    zIndex: 1002,
                    minWidth: "180px"
                  }}>
                    {languages.map((lang) => (
                      <div
                        key={lang.code}
                        onClick={() => {
                          setCurrentLanguage(lang.code);
                          setShowLanguageDropdown(false);
                        }}
                        style={{
                          padding: "10px 15px",
                          cursor: "pointer",
                          color: "#333",
                          fontSize: "14px",
                          borderBottom: "1px solid #f0f0f0",
                          display: "flex",
                          alignItems: "center",
                          gap: "8px"
                        }}
                      >
                        <span>{lang.flag}</span>
                        <span>{lang.name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Clear Chat Button */}
              <button
                onClick={clearChat}
                style={{
                  background: "rgba(255,255,255,0.2)",
                  border: "1px solid rgba(255,255,255,0.3)",
                  color: "white",
                  borderRadius: "5px",
                  padding: "5px",
                  cursor: "pointer"
                }}
              >
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div style={{
              background: "#fee2e2",
              color: "#dc2626",
              padding: "10px",
              fontSize: "14px",
              borderBottom: "1px solid #fecaca"
            }}>
              <FontAwesomeIcon icon={faExclamationTriangle} style={{ marginRight: "8px" }} />
              {error}
              <button
                onClick={() => setError(null)}
                style={{
                  float: "right",
                  background: "none",
                  border: "none",
                  color: "#dc2626",
                  cursor: "pointer"
                }}
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
          )}

          {/* Messages Container */}
          <div style={{
            flex: 1,
            padding: "15px",
            overflowY: "auto",
            background: "#f8fafc"
          }}>
            {messages.map((message) => (
              <div
                key={message.id}
                style={{
                  display: "flex",
                  justifyContent: message.sender === "user" ? "flex-end" : "flex-start",
                  marginBottom: "15px"
                }}
              >
                <div style={{
                  background: message.sender === "user" 
                    ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" 
                    : "#ffffff",
                  color: message.sender === "user" ? "white" : "#333",
                  borderRadius: "15px",
                  padding: "12px 16px",
                  maxWidth: "85%",
                  wordBreak: "break-word",
                  boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
                }}>
                  {/* Image preview if available */}
                  {message.imageUrl && (
                    <img 
                      src={message.imageUrl} 
                      alt="Uploaded" 
                      style={{
                        maxWidth: "100%",
                        maxHeight: "200px",
                        borderRadius: "8px",
                        marginBottom: "10px"
                      }}
                    />
                  )}
                  
                  <div style={{ fontSize: "14px", lineHeight: "1.4" }}>
                    {formatMessageText(message.text)}
                  </div>

                  {/* Audio playback button for AI responses */}
                  {message.sender === "ai" && message.audioUrl && (
                    <div style={{ marginTop: "8px" }}>
                      <button
                        onClick={() => playResponseAudio(message.audioUrl)}
                        disabled={isPlayingAudio}
                        style={{
                          background: "transparent",
                          border: "1px solid #ddd",
                          borderRadius: "15px",
                          padding: "4px 8px",
                          fontSize: "11px",
                          cursor: isPlayingAudio ? "not-allowed" : "pointer",
                          opacity: isPlayingAudio ? 0.5 : 1
                        }}
                      >
                        <FontAwesomeIcon icon={faVolumeUp} /> 
                        {isPlayingAudio ? "Playing..." : "🔊 Play"}
                      </button>
                    </div>
                  )}
                  
                  <div style={{
                    fontSize: "11px",
                    color: message.sender === "user" ? "rgba(255,255,255,0.8)" : "#999",
                    marginTop: "5px",
                    textAlign: message.sender === "user" ? "right" : "left"
                  }}>
                    {message.timestamp?.toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}

            {/* Loading indicator */}
            {isLoading && (
              <div style={{
                display: "flex",
                justifyContent: "flex-start",
                marginBottom: "15px"
              }}>
                <div style={{
                  background: "#ffffff",
                  borderRadius: "15px",
                  padding: "12px 16px",
                  color: "#666",
                  fontSize: "14px"
                }}>
                  <FontAwesomeIcon icon={faSpinner} spin style={{ marginRight: "8px" }} />
                  Thinking...
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Voice Recording Modal */}
          {isRecording && (
            <div style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(0,0,0,0.5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 2000
            }}>
              <div style={{
                background: "white",
                borderRadius: "20px",
                padding: "30px",
                textAlign: "center",
                maxWidth: "300px"
              }}>
                <div style={{ fontSize: "48px", color: "#ef4444", marginBottom: "15px" }}>
                  <FontAwesomeIcon icon={faMicrophone} />
                </div>
                <h3 style={{ margin: "0 0 10px 0" }}>Recording...</h3>
                <div style={{
                  fontSize: "24px",
                  color: "#ef4444",
                  marginBottom: "15px",
                  fontFamily: "monospace"
                }}>
                  {formatTime(recordingTime)}
                </div>
                <p style={{ fontSize: "12px", color: "#666", marginBottom: "20px" }}>
                  Speak clearly. Max 60 seconds.
                </p>
                <button
                  onClick={stopRecording}
                  style={{
                    background: "#dc2626",
                    color: "white",
                    border: "none",
                    padding: "10px 20px",
                    borderRadius: "15px",
                    cursor: "pointer",
                    fontSize: "14px"
                  }}
                >
                  Stop Recording
                </button>
              </div>
            </div>
          )}

          {/* Voice Preview */}
          {audioBlob && !isRecording && (
            <div style={{
              background: "#e0f2fe",
              padding: "15px 20px",
              borderTop: "1px solid #b3e5fc",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between"
            }}>
              <span style={{ fontSize: "14px", color: "#0277bd" }}>
                🎵 Voice recorded ({formatTime(recordingTime)})
              </span>
              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  onClick={sendVoiceMessage}
                  disabled={isLoading}
                  style={{
                    background: "#2563eb",
                    color: "white",
                    border: "none",
                    padding: "6px 12px",
                    borderRadius: "10px",
                    cursor: isLoading ? "not-allowed" : "pointer",
                    fontSize: "12px"
                  }}
                >
                  Send
                </button>
                <button
                  onClick={() => setAudioBlob(null)}
                  style={{
                    background: "#6b7280",
                    color: "white",
                    border: "none",
                    padding: "6px 12px",
                    borderRadius: "10px",
                    cursor: "pointer",
                    fontSize: "12px"
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Image Modal */}
          {showImageModal && selectedImage && (
            <div style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(0,0,0,0.5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 2000
            }}>
              <div style={{
                background: "white",
                borderRadius: "20px",
                padding: "20px",
                maxWidth: "400px",
                textAlign: "center"
              }}>
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  style={{
                    maxWidth: "100%",
                    maxHeight: "300px",
                    borderRadius: "10px",
                    marginBottom: "15px"
                  }}
                />
                <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
                  <button
                    onClick={() => sendImageMessage("solve it")}
                    style={{
                      background: "#2563eb",
                      color: "white",
                      border: "none",
                      padding: "10px 15px",
                      borderRadius: "10px",
                      cursor: "pointer"
                    }}
                  >
                    🧮 Solve It
                  </button>
                  <button
                    onClick={() => sendImageMessage("correct it")}
                    style={{
                      background: "#059669",
                      color: "white",
                      border: "none",
                      padding: "10px 15px",
                      borderRadius: "10px",
                      cursor: "pointer"
                    }}
                  >
                    ✅ Check Work
                  </button>
                  <button
                    onClick={clearImageSelection}
                    style={{
                      background: "#6b7280",
                      color: "white",
                      border: "none",
                      padding: "10px 15px",
                      borderRadius: "10px",
                      cursor: "pointer"
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Input Area */}
          <div style={{
            padding: "15px 20px",
            borderTop: "1px solid #e5e7eb",
            background: "white",
            borderRadius: "0 0 15px 15px"
          }}>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "10px"
            }}>
              {/* Image Upload */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                style={{ display: "none" }}
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading}
                style={{
                  background: "#f3f4f6",
                  border: "1px solid #d1d5db",
                  borderRadius: "10px",
                  padding: "8px",
                  cursor: isLoading ? "not-allowed" : "pointer",
                  opacity: isLoading ? 0.5 : 1
                }}
              >
                <FontAwesomeIcon icon={faImage} />
              </button>

              {/* Voice Recording */}
              <button
                onClick={isRecording ? stopRecording : startRecording}
                disabled={isLoading}
                style={{
                  background: isRecording ? "#dc2626" : "#f3f4f6",
                  border: `1px solid ${isRecording ? "#dc2626" : "#d1d5db"}`,
                  borderRadius: "10px",
                  padding: "8px",
                  cursor: isLoading ? "not-allowed" : "pointer",
                  opacity: isLoading ? 0.5 : 1,
                  color: isRecording ? "white" : "#374151"
                }}
              >
                <FontAwesomeIcon icon={isRecording ? faStop : faMicrophone} />
              </button>

              {/* Text Input */}
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendTextMessage(e)}
                placeholder={`Ask me anything in ${languages.find(l => l.code === currentLanguage)?.name}...`}
                disabled={isLoading}
                style={{
                  flex: 1,
                  padding: "10px 15px",
                  border: "1px solid #d1d5db",
                  borderRadius: "20px",
                  outline: "none",
                  fontSize: "14px"
                }}
              />

              {/* Send Button */}
              <button
                onClick={sendTextMessage}
                disabled={isLoading || !newMessage.trim()}
                style={{
                  background: (!isLoading && newMessage.trim()) ? "#2563eb" : "#d1d5db",
                  color: "white",
                  border: "none",
                  borderRadius: "10px",
                  padding: "8px 12px",
                  cursor: (!isLoading && newMessage.trim()) ? "pointer" : "not-allowed"
                }}
              >
                <FontAwesomeIcon icon={faPaperPlane} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MultilingualChatBox;