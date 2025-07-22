import React, { useState, useRef, useEffect } from "react";
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
  faExclamationTriangle
} from "@fortawesome/free-solid-svg-icons";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";

const MultilingualChatBox = () => {
  // Basic State
  const [isOpen, setIsOpen] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [currentLanguage, setCurrentLanguage] = useState("en");
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

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

  // API URL
  const API_URL = process.env.REACT_APP_MULTILINGUAL_API_URL || "http://139.59.71.57";

  // Languages
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

  // Initialize session when component loads
  useEffect(() => {
    createSession();
    return () => {
      // Cleanup
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
    };
  }, []);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Check API connection
  const checkConnection = async () => {
    try {
      const response = await fetch(`${API_URL}/`, {
        method: "GET",
        headers: { "Content-Type": "application/json" }
      });
      
      if (response.ok) {
        setConnectionStatus('connected');
        return true;
      } else {
        setConnectionStatus('disconnected');
        return false;
      }
    } catch (error) {
      console.error("Connection check failed:", error);
      setConnectionStatus('disconnected');
      return false;
    }
  };

  // Create session with API
  const createSession = async () => {
    try {
      setIsLoading(true);
      setConnectionStatus('checking');
      
      // First check if API is accessible
      const isConnected = await checkConnection();
      if (!isConnected) {
        setError("Unable to connect to the AI service. Please check your internet connection.");
        setConnectionStatus('disconnected');
        return;
      }

      const response = await fetch(`${API_URL}/create_session`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        }
      });

      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }
      
      const data = await response.json();
      const sessionIdValue = data.session_id || data;
      setSessionId(sessionIdValue);
      setConnectionStatus('connected');
      
      // Welcome message
      addMessage({
        text: `Hello! I'm your multilingual AI assistant. I can help you with:
        
• 📝 Math problems with step-by-step solutions
• 🎤 Voice messages in ${languages.find(l => l.code === currentLanguage)?.name}
• 📸 Image analysis and problem solving
• 🌐 Communication in 20+ languages

What would you like help with today?`,
        sender: "ai",
        canSpeak: true
      });

    } catch (error) {
      console.error("Session creation error:", error);
      setError(`Failed to start chat: ${error.message}. The AI service might be temporarily unavailable.`);
      setConnectionStatus('disconnected');
    } finally {
      setIsLoading(false);
    }
  };

  // Add message to chat with unique keys
  const addMessage = (message) => {
    messageCounter.current += 1;
    const newMsg = {
      id: `msg_${Date.now()}_${messageCounter.current}`, // Unique key
      timestamp: new Date(),
      ...message
    };
    setMessages(prev => [...prev, newMsg]);
  };

  // Send text message with enhanced math processing
  const sendTextMessage = async (e) => {
    e?.preventDefault();
    if (!newMessage.trim() || !sessionId) return;

    // Add user message
    addMessage({ text: newMessage, sender: "user" });
    const messageText = newMessage;
    setNewMessage("");
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/chat/text`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          text: messageText,
          session_id: sessionId,
          language: currentLanguage
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Handle different response formats
      let responseText = data.response || data.message || data.step_by_step_solution || "I received your message!";
      
      // If it's an array (step-by-step solution), format it properly
      if (Array.isArray(responseText)) {
        responseText = responseText.join('\n\n');
      }
      
      addMessage({
        text: responseText,
        sender: "ai",
        canSpeak: true,
        confidence: data.confidence
      });

    } catch (error) {
      console.error("Text message error:", error);
      addMessage({
        text: `Sorry, I couldn't process your message. Error: ${error.message}. Please try again or check your connection.`,
        sender: "ai"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Change language with better error handling
  const changeLanguage = async (langCode) => {
    if (!sessionId) {
      setError("Please wait for the session to initialize first.");
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(`${API_URL}/update_language`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          session_id: sessionId,
          language: langCode
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      setCurrentLanguage(langCode);
      const langName = languages.find(l => l.code === langCode)?.name;
      addMessage({
        text: `🌐 Language changed to ${langName}! I'll now respond in ${langName}. Try asking me a math question or upload an image of a problem!`,
        sender: "ai",
        canSpeak: true
      });

    } catch (error) {
      console.error("Language change error:", error);
      setError(`Failed to change language: ${error.message}`);
    } finally {
      setIsLoading(false);
      setShowLanguageDropdown(false);
    }
  };

  // Fixed voice recording with better browser support
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          sampleRate: 44100,
          channelCount: 1,
          volume: 1.0,
          echoCancellation: true,
          noiseSuppression: true
        } 
      });

      // Try different MIME types for better browser support
      let mimeType = 'audio/webm';
      if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
        mimeType = 'audio/webm;codecs=opus';
      } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
        mimeType = 'audio/mp4';
      } else if (MediaRecorder.isTypeSupported('audio/ogg;codecs=opus')) {
        mimeType = 'audio/ogg;codecs=opus';
      }

      const recorder = new MediaRecorder(stream, { mimeType });
      const audioChunks = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.push(event.data);
        }
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: mimeType });
        setAudioBlob(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      recorder.onerror = (event) => {
        console.error('MediaRecorder error:', event.error);
        setError(`Recording error: ${event.error.name}`);
        stream.getTracks().forEach(track => track.stop());
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
      setRecordingTime(0);

      // Timer with max duration
      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime(prev => {
          if (prev >= 60) { // 60 second max
            stopRecording();
            return prev;
          }
          return prev + 1;
        });
      }, 1000);

    } catch (error) {
      console.error("Recording start error:", error);
      let errorMessage = "Failed to start recording. ";
      
      if (error.name === 'NotAllowedError') {
        errorMessage += "Please allow microphone access in your browser settings.";
      } else if (error.name === 'NotFoundError') {
        errorMessage += "No microphone found. Please check your microphone is connected.";
      } else if (error.name === 'NotSupportedError') {
        errorMessage += "Voice recording is not supported in your browser. Try using Chrome or Firefox.";
      } else {
        errorMessage += error.message;
      }
      
      setError(errorMessage);
    }
  };

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state === "recording") {
      mediaRecorder.stop();
    }
    
    setIsRecording(false);
    
    if (recordingIntervalRef.current) {
      clearInterval(recordingIntervalRef.current);
    }
  };

  // Send voice message with better error handling
  const sendVoiceMessage = async () => {
    if (!audioBlob || !sessionId) return;

    addMessage({ 
      text: `🎵 Voice message (${formatTime(recordingTime)})`, 
      sender: "user",
      type: "voice"
    });
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append('session_id', sessionId);
      formData.append('language', currentLanguage);
      formData.append('audio', audioBlob, `voice_${Date.now()}.webm`);

      const response = await fetch(`${API_URL}/chat/voice`, {
        method: "POST",
        body: formData
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      let responseText = data.response || data.message || data.transcription || "I heard your voice message!";
      
      // Include transcription if available
      if (data.transcription && data.transcription !== responseText) {
        responseText = `I heard: "${data.transcription}"\n\n${responseText}`;
      }
      
      addMessage({
        text: responseText,
        sender: "ai",
        canSpeak: true,
        confidence: data.confidence,
        transcription: data.transcription
      });

    } catch (error) {
      console.error("Voice message error:", error);
      addMessage({
        text: `Sorry, I couldn't process your voice message. Error: ${error.message}. Please try again or use text instead.`,
        sender: "ai"
      });
    } finally {
      setIsLoading(false);
      setAudioBlob(null);
      setRecordingTime(0);
    }
  };

  // Handle image selection with validation
  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setError('Please select a valid image file (JPEG, PNG, GIF, or WebP)');
      return;
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      setError('Image must be smaller than 10MB. Please compress or select a smaller image.');
      return;
    }

    setSelectedImage(file);
    setImagePreview(URL.createObjectURL(file));
    setShowImageModal(true);
  };

  // Send image with enhanced processing
  const sendImage = async () => {
    if (!selectedImage || !sessionId) return;

    setShowImageModal(false);
    addMessage({ 
      text: "📸 Image uploaded for analysis", 
      sender: "user",
      imageUrl: imagePreview
    });
    setIsLoading(true);

    try {
      // Upload image first
      const uploadData = new FormData();
      uploadData.append('session_id', sessionId);
      uploadData.append('image', selectedImage);

      const uploadResponse = await fetch(`${API_URL}/upload_image`, {
        method: "POST",
        body: uploadData
      });

      if (!uploadResponse.ok) {
        throw new Error(`Upload failed: HTTP ${uploadResponse.status}`);
      }

      // Process image with solve command
      const commandResponse = await fetch(`${API_URL}/image_command`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          command: "solve",
          session_id: sessionId,
          language: currentLanguage
        })
      });

      if (!commandResponse.ok) {
        throw new Error(`Processing failed: HTTP ${commandResponse.status}`);
      }

      const data = await commandResponse.json();
      
      let responseText = data.response || data.solution || "I analyzed your image!";
      
      // Handle array responses (step-by-step solutions)
      if (Array.isArray(responseText)) {
        responseText = responseText.join('\n\n');
      }
      
      // Add detected text if available
      if (data.detected_text) {
        responseText = `📝 **Detected Text:** ${data.detected_text}\n\n🧮 **Solution:**\n\n${responseText}`;
      }
      
      addMessage({
        text: responseText,
        sender: "ai",
        canSpeak: true,
        confidence: data.confidence,
        detectedText: data.detected_text
      });

    } catch (error) {
      console.error("Image processing error:", error);
      addMessage({
        text: `Sorry, I couldn't process your image. Error: ${error.message}. Please try again with a clearer image or check your connection.`,
        sender: "ai"
      });
    } finally {
      setIsLoading(false);
      clearImageSelection();
    }
  };

  // Clear image selection
  const clearImageSelection = () => {
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setSelectedImage(null);
    setImagePreview(null);
    setShowImageModal(false);
  };

  // Enhanced text-to-speech
  const playTextToSpeech = async (text) => {
    if (!sessionId || !text || isPlayingAudio) return;

    try {
      setIsPlayingAudio(true);
      
      // Clean text for TTS (remove markdown and special characters)
      const cleanText = text.replace(/[*#`_~]/g, '').replace(/\$[^$]*\$/g, 'mathematical expression');
      
      const response = await fetch(
        `${API_URL}/tts/${sessionId}?text=${encodeURIComponent(cleanText)}&language=${currentLanguage}`,
        { method: "GET" }
      );

      if (!response.ok) {
        throw new Error(`TTS failed: HTTP ${response.status}`);
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      
      audio.onended = () => {
        setIsPlayingAudio(false);
        URL.revokeObjectURL(audioUrl);
      };
      
      audio.onerror = (e) => {
        console.error("Audio playback error:", e);
        setIsPlayingAudio(false);
        URL.revokeObjectURL(audioUrl);
        setError("Failed to play audio");
      };
      
      await audio.play();

    } catch (error) {
      console.error("TTS error:", error);
      setIsPlayingAudio(false);
      setError(`Text-to-speech failed: ${error.message}`);
    }
  };

  // Clear chat with confirmation
  const clearChat = async () => {
    if (!window.confirm("Are you sure you want to clear the chat history?")) return;
    
    if (!sessionId) return;

    try {
      setIsLoading(true);
      await fetch(`${API_URL}/clear_chat`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: sessionId })
      });

      setMessages([]);
      addMessage({
        text: "🧹 Chat cleared! I'm ready to help you with new questions. Try asking about math, uploading images, or speaking in any language!",
        sender: "ai",
        canSpeak: true
      });
    } catch (error) {
      console.error("Clear chat error:", error);
      setError(`Failed to clear chat: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Enhanced message formatting with better math rendering
  const formatMessage = (text) => {
    if (!text) return null;

    if (Array.isArray(text)) {
      return (
        <div>
          {text.map((paragraph, index) => (
            <p key={index} style={{ marginBottom: '10px' }}>
              {formatMessage(paragraph)}
            </p>
          ))}
        </div>
      );
    }

    // Handle step-by-step solutions
    if (text.includes('Step') && text.includes('\n')) {
      const steps = text.split('\n').filter(line => line.trim());
      return (
        <div>
          {steps.map((step, index) => (
            <div key={index} style={{ 
              marginBottom: '8px',
              paddingLeft: step.toLowerCase().includes('step') ? '0' : '15px',
              fontWeight: step.toLowerCase().includes('step') ? 'bold' : 'normal'
            }}>
              {formatMathInText(step)}
            </div>
          ))}
        </div>
      );
    }

    return formatMathInText(text);
  };

  const formatMathInText = (text) => {
    const segments = text.split(/(\$\$.*?\$\$|\$.*?\$)/g);

    return segments.map((segment, index) => {
      try {
        if (segment.startsWith("$$") && segment.endsWith("$$")) {
          return <BlockMath key={index}>{segment.slice(2, -2)}</BlockMath>;
        } else if (segment.startsWith("$") && segment.endsWith("$")) {
          return <InlineMath key={index}>{segment.slice(1, -1)}</InlineMath>;
        } else {
          return <span key={index}>{segment}</span>;
        }
      } catch (error) {
        console.warn("Math rendering error:", error);
        return <span key={index}>{segment}</span>;
      }
    });
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Connection status indicator
  const getConnectionStatusColor = () => {
    switch (connectionStatus) {
      case 'connected': return '#4caf50';
      case 'disconnected': return '#f44336';
      case 'checking': return '#ff9800';
      default: return '#9e9e9e';
    }
  };

  return (
    <>
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
            ? "linear-gradient(45deg, #00b8d4, #013788)"
            : "linear-gradient(45deg, #f44336, #d32f2f)",
          border: "none",
          color: "white",
          fontSize: "24px",
          cursor: "pointer",
          zIndex: 1000,
          boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
          position: "relative"
        }}
      >
        <FontAwesomeIcon icon={isOpen ? faTimes : faCommentDots} />
        
        {/* Connection status indicator */}
        <div style={{
          position: "absolute",
          top: "2px",
          right: "2px",
          width: "12px",
          height: "12px",
          borderRadius: "50%",
          backgroundColor: getConnectionStatusColor(),
          border: "2px solid white"
        }} />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div style={{
          position: "fixed",
          bottom: "90px",
          right: "20px",
          width: "400px",
          height: "600px",
          background: "white",
          borderRadius: "15px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
          display: "flex",
          flexDirection: "column",
          zIndex: 999
        }}>
          {/* Header */}
          <div style={{
            background: connectionStatus === 'connected' 
              ? "linear-gradient(45deg, #00b8d4, #013788)"
              : "linear-gradient(45deg, #f44336, #d32f2f)",
            color: "white",
            padding: "15px",
            borderRadius: "15px 15px 0 0",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between"
          }}>
            <div>
              <h5 style={{ margin: 0, fontSize: "16px" }}>
                AI Assistant {connectionStatus !== 'connected' && <FontAwesomeIcon icon={faExclamationTriangle} />}
              </h5>
              <span style={{ fontSize: "12px", opacity: 0.8 }}>
                {connectionStatus === 'connected' 
                  ? languages.find(l => l.code === currentLanguage)?.name
                  : `Connection: ${connectionStatus}`
                }
              </span>
            </div>
            
            <div style={{ display: "flex", gap: "10px" }}>
              {/* Language Button */}
              <div style={{ position: "relative" }}>
                <button
                  onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
                  disabled={connectionStatus !== 'connected'}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "white",
                    cursor: connectionStatus === 'connected' ? "pointer" : "not-allowed",
                    opacity: connectionStatus === 'connected' ? 1 : 0.5
                  }}
                >
                  <FontAwesomeIcon icon={faLanguage} />
                </button>

                {/* Language Dropdown */}
                {showLanguageDropdown && connectionStatus === 'connected' && (
                  <div style={{
                    position: "absolute",
                    top: "100%",
                    right: 0,
                    background: "white",
                    borderRadius: "8px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                    minWidth: "150px",
                    maxHeight: "200px",
                    overflowY: "auto",
                    zIndex: 1000
                  }}>
                    {languages.map((lang) => (
                      <div
                        key={lang.code}
                        onClick={() => changeLanguage(lang.code)}
                        style={{
                          padding: "10px 15px",
                          cursor: "pointer",
                          color: "#333",
                          fontSize: "14px",
                          backgroundColor: currentLanguage === lang.code ? "#f0f8ff" : "transparent",
                          borderBottom: "1px solid #f0f0f0"
                        }}
                        onMouseEnter={(e) => e.target.style.backgroundColor = "#f5f5f5"}
                        onMouseLeave={(e) => e.target.style.backgroundColor = currentLanguage === lang.code ? "#f0f8ff" : "transparent"}
                      >
                        {lang.flag} {lang.name} {currentLanguage === lang.code && "✓"}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Clear Chat Button */}
              <button
                onClick={clearChat}
                disabled={connectionStatus !== 'connected' || !sessionId}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "white",
                  cursor: (connectionStatus === 'connected' && sessionId) ? "pointer" : "not-allowed",
                  opacity: (connectionStatus === 'connected' && sessionId) ? 1 : 0.5
                }}
              >
                <FontAwesomeIcon icon={faTrash} />
              </button>

              {/* Close Button */}
              <button
                onClick={() => setIsOpen(false)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "white",
                  cursor: "pointer"
                }}
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div style={{
              background: "#ffebee",
              color: "#c62828",
              padding: "10px",
              margin: "10px",
              borderRadius: "4px",
              fontSize: "14px",
              borderLeft: "4px solid #f44336"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <FontAwesomeIcon icon={faExclamationTriangle} style={{ marginRight: "8px" }} />
                  {error}
                </div>
                <button
                  onClick={() => setError(null)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#c62828",
                    cursor: "pointer",
                    fontSize: "16px",
                    padding: "0"
                  }}
                >
                  ×
                </button>
              </div>
            </div>
          )}

          {/* Connection Status */}
          {connectionStatus === 'disconnected' && (
            <div style={{
              background: "#fff3e0",
              color: "#e65100",
              padding: "10px",
              margin: "10px",
              borderRadius: "4px",
              fontSize: "14px",
              textAlign: "center",
              borderLeft: "4px solid #ff9800"
            }}>
              <FontAwesomeIcon icon={faExclamationTriangle} style={{ marginRight: "8px" }} />
              AI service is currently unavailable. Please check your connection and try again.
              <button
                onClick={createSession}
                style={{
                  background: "#ff9800",
                  color: "white",
                  border: "none",
                  padding: "5px 10px",
                  borderRadius: "3px",
                  marginLeft: "10px",
                  cursor: "pointer",
                  fontSize: "12px"
                }}
              >
                Retry
              </button>
            </div>
          )}

          {/* Messages */}
          <div style={{
            flex: 1,
            padding: "15px",
            overflowY: "auto",
            display: "flex",
            flexDirection: "column"
          }}>
            {messages.map((message) => (
              <div
                key={message.id}
                style={{
                  marginBottom: "15px",
                  alignSelf: message.sender === "user" ? "flex-end" : "flex-start",
                  maxWidth: "85%"
                }}
              >
                <div style={{
                  padding: "12px 16px",
                  borderRadius: "15px",
                  background: message.sender === "user" 
                    ? "linear-gradient(45deg, #00b8d4, #0052cc)"
                    : "#f0f0f0",
                  color: message.sender === "user" ? "white" : "#333",
                  borderBottomRightRadius: message.sender === "user" ? "5px" : "15px",
                  borderBottomLeftRadius: message.sender === "ai" ? "5px" : "15px",
                  wordWrap: "break-word"
                }}>
                  {/* Image if present */}
                  {message.imageUrl && (
                    <img
                      src={message.imageUrl}
                      alt="Uploaded"
                      style={{
                        maxWidth: "100%",
                        borderRadius: "8px",
                        marginBottom: "8px"
                      }}
                    />
                  )}
                  
                  {/* Message text */}
                  {formatMessage(message.text)}
                  
                  {/* Confidence indicator */}
                  {message.confidence && (
                    <div style={{ fontSize: "11px", opacity: 0.7, marginTop: "5px" }}>
                      Confidence: {Math.round(message.confidence * 100)}%
                    </div>
                  )}
                  
                  {/* Play button for AI messages */}
                  {message.sender === "ai" && message.canSpeak && (
                    <button
                      onClick={() => playTextToSpeech(message.text)}
                      disabled={isPlayingAudio || connectionStatus !== 'connected'}
                      style={{
                        background: "none",
                        border: "1px solid #00b8d4",
                        color: "#00b8d4",
                        borderRadius: "10px",
                        padding: "4px 8px",
                        fontSize: "12px",
                        cursor: (isPlayingAudio || connectionStatus !== 'connected') ? "not-allowed" : "pointer",
                        marginTop: "8px",
                        opacity: (isPlayingAudio || connectionStatus !== 'connected') ? 0.5 : 1
                      }}
                    >
                      <FontAwesomeIcon icon={faVolumeUp} /> 
                      {isPlayingAudio ? "Playing..." : "🔊 Play"}
                    </button>
                  )}
                </div>
                
                <div style={{
                  fontSize: "11px",
                  color: "#999",
                  marginTop: "5px",
                  textAlign: message.sender === "user" ? "right" : "left"
                }}>
                  {message.timestamp?.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit"
                  })}
                </div>
              </div>
            ))}

            {/* Loading indicator */}
            {isLoading && (
              <div style={{
                alignSelf: "flex-start",
                background: "#f0f0f0",
                borderRadius: "15px",
                padding: "12px 16px",
                marginBottom: "15px"
              }}>
                <FontAwesomeIcon icon={faSpinner} spin /> AI is thinking...
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Voice Recording Overlay */}
          {isRecording && (
            <div style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(255, 0, 0, 0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 10
            }}>
              <div style={{
                background: "white",
                borderRadius: "20px",
                padding: "30px",
                textAlign: "center",
                boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
                border: "2px solid #ff4444"
              }}>
                <FontAwesomeIcon 
                  icon={faMicrophone} 
                  style={{ 
                    fontSize: "48px", 
                    color: "#ff4444", 
                    marginBottom: "15px",
                    animation: "pulse 1.5s infinite"
                  }}
                />
                <div style={{ fontSize: "18px", marginBottom: "10px", fontWeight: "bold" }}>
                  Recording in {languages.find(l => l.code === currentLanguage)?.name}...
                </div>
                <div style={{ fontSize: "24px", color: "#ff4444", marginBottom: "20px" }}>
                  {formatTime(recordingTime)}
                </div>
                <div style={{ fontSize: "12px", color: "#666", marginBottom: "20px" }}>
                  Release to stop recording (max 60 seconds)
                </div>
                <button
                  onClick={stopRecording}
                  style={{
                    background: "#dc3545",
                    color: "white",
                    border: "none",
                    padding: "10px 20px",
                    borderRadius: "20px",
                    cursor: "pointer",
                    fontSize: "14px"
                  }}
                >
                  <FontAwesomeIcon icon={faStop} /> Stop Recording
                </button>
              </div>
            </div>
          )}

          {/* Voice Preview */}
          {audioBlob && !isRecording && (
            <div style={{
              background: "#e3f2fd",
              padding: "10px 15px",
              borderTop: "1px solid #ddd",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between"
            }}>
              <span style={{ fontSize: "14px" }}>
                🎵 Voice message recorded ({formatTime(recordingTime)})
              </span>
              <div style={{ display: "flex", gap: "5px" }}>
                <button
                  onClick={sendVoiceMessage}
                  disabled={!sessionId || connectionStatus !== 'connected'}
                  style={{
                    background: "#007bff",
                    color: "white",
                    border: "none",
                    padding: "5px 10px",
                    borderRadius: "10px",
                    cursor: (!sessionId || connectionStatus !== 'connected') ? "not-allowed" : "pointer",
                    fontSize: "12px",
                    opacity: (!sessionId || connectionStatus !== 'connected') ? 0.5 : 1
                  }}
                >
                  <FontAwesomeIcon icon={faPaperPlane} /> Send
                </button>
                <button
                  onClick={() => setAudioBlob(null)}
                  style={{
                    background: "#6c757d",
                    color: "white",
                    border: "none",
                    padding: "5px 10px",
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

          {/* Input Area */}
          <div style={{
            padding: "15px",
            borderTop: "1px solid #eee",
            borderRadius: "0 0 15px 15px",
            background: connectionStatus !== 'connected' ? "#f5f5f5" : "white"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <input
                type="text"
                placeholder={connectionStatus === 'connected' 
                  ? `Ask anything in ${languages.find(l => l.code === currentLanguage)?.name}...`
                  : "Connecting to AI service..."
                }
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendTextMessage(e)}
                disabled={isLoading || connectionStatus !== 'connected'}
                style={{
                  flex: 1,
                  padding: "10px 15px",
                  border: "1px solid #ddd",
                  borderRadius: "20px",
                  outline: "none",
                  backgroundColor: connectionStatus !== 'connected' ? "#f0f0f0" : "white"
                }}
              />

              {/* Image Upload */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageSelect}
                accept="image/*"
                style={{ display: 'none' }}
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading || connectionStatus !== 'connected'}
                style={{
                  background: "#f8f9fa",
                  border: "1px solid #ddd",
                  borderRadius: "50%",
                  width: "40px",
                  height: "40px",
                  cursor: (isLoading || connectionStatus !== 'connected') ? "not-allowed" : "pointer",
                  opacity: (isLoading || connectionStatus !== 'connected') ? 0.5 : 1
                }}
                title="Upload image"
              >
                <FontAwesomeIcon icon={faImage} />
              </button>

              {/* Voice Record */}
              <button
                onMouseDown={startRecording}
                onMouseUp={stopRecording}
                onTouchStart={startRecording}
                onTouchEnd={stopRecording}
                disabled={isLoading || connectionStatus !== 'connected'}
                style={{
                  background: isRecording ? "#ff4444" : "#f8f9fa",
                  border: "1px solid #ddd",
                  borderRadius: "50%",
                  width: "40px",
                  height: "40px",
                  cursor: (isLoading || connectionStatus !== 'connected') ? "not-allowed" : "pointer",
                  color: isRecording ? "white" : "#333",
                  opacity: (isLoading || connectionStatus !== 'connected') ? 0.5 : 1
                }}
                title="Hold to record voice message"
              >
                <FontAwesomeIcon icon={isRecording ? faMicrophoneSlash : faMicrophone} />
              </button>

              {/* Send Button */}
              <button
                onClick={sendTextMessage}
                disabled={!newMessage.trim() || isLoading || connectionStatus !== 'connected'}
                style={{
                  background: "linear-gradient(45deg, #00b8d4, #013788)",
                  color: "white",
                  border: "none",
                  borderRadius: "50%",
                  width: "40px",
                  height: "40px",
                  cursor: (!newMessage.trim() || isLoading || connectionStatus !== 'connected') ? "not-allowed" : "pointer",
                  opacity: (!newMessage.trim() || isLoading || connectionStatus !== 'connected') ? 0.5 : 1
                }}
                title="Send message"
              >
                {isLoading ? (
                  <FontAwesomeIcon icon={faSpinner} spin />
                ) : (
                  <FontAwesomeIcon icon={faPaperPlane} />
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Modal */}
      {showImageModal && (
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
            borderRadius: "12px",
            padding: "20px",
            maxWidth: "500px",
            width: "90%",
            maxHeight: "80vh",
            overflowY: "auto"
          }}>
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "20px"
            }}>
              <h3 style={{ margin: 0 }}>📸 Process Image</h3>
              <button
                onClick={clearImageSelection}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "18px",
                  cursor: "pointer",
                  color: "#999"
                }}
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            
            {imagePreview && (
              <div style={{ textAlign: "center", marginBottom: "20px" }}>
                <img
                  src={imagePreview}
                  alt="Preview"
                  style={{
                    maxWidth: "100%",
                    maxHeight: "300px",
                    borderRadius: "8px",
                    border: "2px solid #ddd"
                  }}
                />
              </div>
            )}
            
            <div style={{
              background: "#f0f8ff",
              padding: "15px",
              borderRadius: "8px",
              marginBottom: "20px",
              fontSize: "14px"
            }}>
              <strong>📚 I can help with:</strong>
              <ul style={{ marginTop: "10px", paddingLeft: "20px" }}>
                <li>Math problems and equations</li>
                <li>Geometry and diagrams</li>
                <li>Physics problems</li>
                <li>Chemistry equations</li>
                <li>Text extraction and translation</li>
              </ul>
            </div>
            
            <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
              <button
                onClick={clearImageSelection}
                style={{
                  background: "#6c757d",
                  color: "white",
                  border: "none",
                  padding: "10px 20px",
                  borderRadius: "20px",
                  cursor: "pointer"
                }}
              >
                Cancel
              </button>
              <button
                onClick={sendImage}
                disabled={connectionStatus !== 'connected'}
                style={{
                  background: connectionStatus === 'connected' 
                    ? "linear-gradient(45deg, #00b8d4, #013788)"
                    : "#cccccc",
                  color: "white",
                  border: "none",
                  padding: "10px 20px",
                  borderRadius: "20px",
                  cursor: connectionStatus === 'connected' ? "pointer" : "not-allowed"
                }}
              >
                <FontAwesomeIcon icon={faPaperPlane} /> Analyze Image
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Click outside to close language dropdown */}
      {showLanguageDropdown && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 500
          }}
          onClick={() => setShowLanguageDropdown(false)}
        />
      )}

      {/* CSS for animations */}
      <style jsx>{`
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }
      `}</style>
    </>
  );
};

export default MultilingualChatBox;