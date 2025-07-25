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
  faExclamationTriangle,
  faEye
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
  }, []);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Helper function to convert AudioBuffer to WAV
  const audioBufferToWav = (buffer) => {
    const length = buffer.length;
    const sampleRate = buffer.sampleRate;
    const arrayBuffer = new ArrayBuffer(44 + length * 2);
    const view = new DataView(arrayBuffer);
    
    // WAV header
    const writeString = (offset, string) => {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
      }
    };
    
    writeString(0, 'RIFF');
    view.setUint32(4, 36 + length * 2, true);
    writeString(8, 'WAVE');
    writeString(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true); // PCM format
    view.setUint16(22, 1, true); // mono
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
    writeString(36, 'data');
    view.setUint32(40, length * 2, true);
    
    // Convert float samples to 16-bit PCM
    const floatSamples = buffer.getChannelData(0);
    let offset = 44;
    for (let i = 0; i < length; i++) {
      const sample = Math.max(-1, Math.min(1, floatSamples[i]));
      view.setInt16(offset, sample * 0x7FFF, true);
      offset += 2;
    }
    
    return arrayBuffer;
  };

  // Convert WebM to WAV using Web Audio API
  const convertToWav = async (audioBlob) => {
    try {
      console.log('Converting audio to WAV format...');
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const arrayBuffer = await audioBlob.arrayBuffer();
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
      
      // Convert to WAV format
      const wavBuffer = audioBufferToWav(audioBuffer);
      const wavBlob = new Blob([wavBuffer], { type: 'audio/wav' });
      
      console.log('WAV conversion successful:', {
        originalSize: audioBlob.size,
        convertedSize: wavBlob.size,
        originalType: audioBlob.type,
        convertedType: wavBlob.type
      });
      
      return wavBlob;
    } catch (error) {
      console.error('WAV conversion failed:', error);
      // Return original blob if conversion fails
      return audioBlob;
    }
  };

  // Create session with enhanced error handling
  const createSession = async () => {
    setIsLoading(true);
    setConnectionStatus('checking');
    
    try {
      console.log('Attempting to create session with API:', API_URL);
      
      const response = await fetch(`${API_URL}/create_session`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({})
      });

      console.log('Session creation response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Session creation error response:', errorText);
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Session creation response data:', data);
      
      if (data.session_id || data.id || (typeof data === 'string' && data.length > 0)) {
        const sessionIdValue = data.session_id || data.id || data;
        setSessionId(sessionIdValue);
        setConnectionStatus('connected');
        console.log('Session created successfully:', sessionIdValue);
        
        // Add welcome message
        addMessage({
          text: `🎉 **Welcome to Multilingual AI Assistant!**

I'm your multilingual AI assistant. I can help you with:
        
• 📝 Math problems with step-by-step solutions
• 🎤 Voice messages in ${languages.find(l => l.code === currentLanguage)?.name}
• 📸 Image analysis and problem solving
• 🌐 Communication in 9 languages

What would you like help with today?`,
          sender: "ai",
          canSpeak: true
        });
      } else {
        throw new Error('No session ID received from server');
      }

    } catch (error) {
      console.error("Session creation error:", error);
      setError(`Failed to start chat: ${error.message}. Please check if the AI service is running on ${API_URL}.`);
      setConnectionStatus('disconnected');
      
      // Add fallback message
      addMessage({
        text: `⚠️ **Connection Issue**

I'm having trouble connecting to the AI service. This might be because:

• The AI server is currently offline
• Network connectivity issues
• Service is temporarily unavailable

**You can still try:**
• Refreshing the page
• Checking your internet connection
• Trying again in a few moments

I apologize for the inconvenience!`,
        sender: "ai"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Add message to chat with unique keys
  const addMessage = (message) => {
    messageCounter.current += 1;
    const newMsg = {
      id: `msg_${Date.now()}_${messageCounter.current}`,
      timestamp: new Date(),
      ...message
    };
    setMessages(prev => [...prev, newMsg]);
  };

  // Send text message
  const sendTextMessage = async (e) => {
    e?.preventDefault();
    if (!newMessage.trim() || !sessionId) return;

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
      let responseText = data.response || data.message || data.step_by_step_solution || "I received your message!";
      
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

  // Change language
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

  // Voice recording with enhanced format support
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          sampleRate: 16000,  // Standard rate for speech recognition
          channelCount: 1,    // Mono
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
      } else if (MediaRecorder.isTypeSupported('audio/wav')) {
        mimeType = 'audio/wav';
      }

      console.log('Recording with MIME type:', mimeType);

      const recorder = new MediaRecorder(stream, { mimeType });
      const audioChunks = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.push(event.data);
        }
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: mimeType });
        console.log('Recording stopped, blob created:', {
          size: audioBlob.size,
          type: audioBlob.type,
          actualMimeType: mimeType
        });
        
        // Always convert to WAV for backend compatibility
        try {
          const wavBlob = await convertToWav(audioBlob);
          setAudioBlob(wavBlob);
        } catch (conversionError) {
          console.warn('WAV conversion failed, using original format:', conversionError);
          setAudioBlob(audioBlob);
        }
        
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

  // Send voice message with proper WAV conversion
  const sendVoiceMessage = async () => {
    if (!audioBlob || !sessionId) {
      console.error('Missing required data:', { audioBlob: !!audioBlob, sessionId });
      return;
    }

    addMessage({ 
      text: `🎵 Voice message (${formatTime(recordingTime)})`, 
      sender: "user", 
      type: "voice" 
    });
    setIsLoading(true);

    try {
      console.log('=== PROCESSING VOICE WITH WAV CONVERSION ===');
      
      // Check original audio format
      console.log('Original audio:', {
        size: audioBlob.size,
        type: audioBlob.type
      });

      // Ensure we have a proper WAV file
      let finalAudioBlob = audioBlob;
      if (!audioBlob.type.includes('wav')) {
        console.log('Converting to WAV format...');
        finalAudioBlob = await convertToWav(audioBlob);
        console.log('Converted audio:', {
          size: finalAudioBlob.size,
          type: finalAudioBlob.type
        });
      }

      // Create FormData with proper WAV file
      const formData = new FormData();
      formData.append('session_id', sessionId);
      formData.append('language', currentLanguage);
      
      // Create proper WAV file
      const audioFile = new File([finalAudioBlob], `voice_${Date.now()}.wav`, { 
        type: 'audio/wav' 
      });
      formData.append('audio', audioFile);

      console.log('Sending WAV file:', {
        name: audioFile.name,
        size: audioFile.size,
        type: audioFile.type
      });

      const response = await fetch(`${API_URL}/chat/voice`, {
        method: "POST",
        body: formData
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }
      
      const data = await response.json();
      console.log('✅ Success response:', data);
      
      let responseText = data.response || data.message || data.transcription || "Voice message processed!";
      
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

      console.log('=== VOICE MESSAGE SUCCESS ===');

    } catch (error) {
      console.error('=== VOICE MESSAGE ERROR ===');
      console.error('Error details:', error);
      
      let userFriendlyMessage = "Sorry, I couldn't process your voice message.";
      
      if (error.message.includes('Invalid audio format')) {
        userFriendlyMessage += " There was an issue with the audio format.";
      } else if (error.message.includes('Audio too short')) {
        userFriendlyMessage += " The recording was too short.";
      } else if (error.message.includes('No speech detected')) {
        userFriendlyMessage += " No speech was detected.";
      } else if (error.message.includes('HTTP 500')) {
        userFriendlyMessage += " There's a server processing error.";
      }
      
      addMessage({
        text: userFriendlyMessage + `\n\nTechnical details: ${error.message}`,
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

    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setError('Please select a valid image file (PNG preferred, JPEG, GIF, or WebP also supported)');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('Image must be smaller than 10MB. Please compress or select a smaller image.');
      return;
    }

    setSelectedImage(file);
    setImagePreview(URL.createObjectURL(file));
    setShowImageModal(true);
  };

  // Send image with command selection
  const sendImage = async (selectedCommand = null) => {
    if (!selectedImage || !sessionId) return;

    setShowImageModal(false);
    addMessage({ 
      text: `📸 Image uploaded for ${selectedCommand || "analysis"}`, 
      sender: "user",
      imageUrl: imagePreview
    });
    setIsLoading(true);

    try {
      // Step 1: Upload image first
      const uploadData = new FormData();
      uploadData.append('session_id', sessionId);
      uploadData.append('image', selectedImage);

      console.log('Uploading image:', {
        session_id: sessionId,
        image_size: selectedImage.size,
        image_type: selectedImage.type,
        image_name: selectedImage.name,
        command: selectedCommand
      });

      const uploadResponse = await fetch(`${API_URL}/upload_image`, {
        method: "POST",
        body: uploadData
      });

      console.log('Image upload response status:', uploadResponse.status);

      if (!uploadResponse.ok) {
        const errorText = await uploadResponse.text();
        console.error('Image upload error:', errorText);
        throw new Error(`Upload failed: HTTP ${uploadResponse.status}`);
      }

      const uploadResult = await uploadResponse.json();
      console.log('Upload result:', uploadResult);

      // Step 2: Use the selected command
      const commandToUse = selectedCommand || "solve it";
      
      const commandResponse = await fetch(`${API_URL}/image_command`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          command: commandToUse,
          session_id: sessionId,
          language: currentLanguage
        })
      });

      console.log(`Command "${commandToUse}" response status:`, commandResponse.status);

      if (!commandResponse.ok) {
        const errorText = await commandResponse.text();
        console.error('Command error response:', errorText);
        throw new Error(`Processing failed: HTTP ${commandResponse.status}`);
      }

      const data = await commandResponse.json();
      console.log('Command response data:', data);
      
      // Handle different response formats
      let responseText = data.response || data.solution || data.step_by_step_solution || "I analyzed your image!";
      
      // Handle array responses (step-by-step solutions)
      if (Array.isArray(responseText)) {
        responseText = responseText.join('\n\n');
      }
      
      // Add appropriate emoji and label based on command
      const commandEmoji = commandToUse === "solve it" ? "🧮" : "✅";
      const commandLabel = commandToUse === "solve it" ? "Solution" : "Correction";
      
      // Add detected text if available
      let finalResponse = responseText;
      if (data.detected_text) {
        finalResponse = `📝 **Detected Text:** ${data.detected_text}\n\n${commandEmoji} **${commandLabel}:**\n\n${responseText}`;
      } else {
        finalResponse = `${commandEmoji} **${commandLabel} Complete:**\n\n${responseText}`;
      }
      
      addMessage({
        text: finalResponse,
        sender: "ai",
        canSpeak: true,
        confidence: data.confidence,
        detectedText: data.detected_text,
        commandUsed: commandToUse
      });

    } catch (error) {
      console.error("Image processing error:", error);
      const commandText = selectedCommand ? ` using "${selectedCommand}"` : "";
      addMessage({
        text: `❌ **Image Analysis Failed**

Sorry, I couldn't process your image${commandText}. Error: ${error.message}

🔧 **Please try:**
• Using a clearer, high-resolution image
• Ensuring the image shows the problem clearly  
• Uploading a PNG or JPEG format (PNG preferred)
• Checking your internet connection
• Describing the problem in text instead

💡 **Alternative:** Type your math question and I'll solve it step-by-step!

Example: *"Solve x² + 5x + 6 = 0"* or *"Find the derivative of 3x² + 2x + 1"*`,
        sender: "ai"
      });
    } finally {
      setIsLoading(false);
      setSelectedImage(null);
      setImagePreview(null);
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    }
  };

  // Clear image selection
  const clearImageSelection = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setShowImageModal(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Clear chat
  const clearChat = async () => {
    if (!sessionId) return;
    
    try {
      setMessages([]);
      await createSession(); // Create new session
    } catch (error) {
      console.error("Clear chat error:", error);
      setError("Failed to clear chat. Please refresh the page.");
    }
  };

  // Play AI response as audio
  const playResponseAudio = async (text, messageId) => {
    if (!sessionId || isPlayingAudio) return;
    
    setIsPlayingAudio(true);
    
    try {
      const response = await fetch(`${API_URL}/text_to_speech`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "audio/mpeg"
        },
        body: JSON.stringify({
          text: text.replace(/\*\*/g, '').replace(/\*/g, ''), // Remove markdown
          session_id: sessionId,
          language: currentLanguage
        })
      });

      if (response.ok) {
        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        
        audio.onended = () => {
          setIsPlayingAudio(false);
          URL.revokeObjectURL(audioUrl);
        };
        
        audio.onerror = () => {
          setIsPlayingAudio(false);
          URL.revokeObjectURL(audioUrl);
        };
        
        await audio.play();
      } else {
        throw new Error('TTS service unavailable');
      }
    } catch (error) {
      console.error("TTS error:", error);
      setIsPlayingAudio(false);
      setError("Text-to-speech is currently unavailable.");
    }
  };

  // Format message text with math support
  const formatMessageText = (text) => {
    if (typeof text !== 'string') return text;

    // Handle step-by-step solutions
    if (text.includes('**Step') || text.includes('Step ')) {
      const steps = text.split(/(?=\*\*Step|\nStep)/);
      return (
        <div style={{ lineHeight: "1.6" }}>
          {steps.map((step, index) => (
            <div key={index} style={{
              marginBottom: index < steps.length - 1 ? '10px' : '0',
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
        <div className="chat-box" style={{
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
            background: "linear-gradient(45deg, #00b8d4, #013788)",
            color: "white",
            padding: "15px 20px",
            borderRadius: "15px 15px 0 0",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}>
            <div>
              <h4 style={{ margin: 0, fontSize: "16px" }}>
                🤖 AI Assistant
              </h4>
              <small style={{ 
                opacity: 0.9,
                fontSize: "12px",
                display: "flex",
                alignItems: "center",
                gap: "5px"
              }}>
                <div style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  background: getConnectionStatusColor()
                }} />
                {connectionStatus === 'connected' && `Speaking ${languages.find(l => l.code === currentLanguage)?.name}`}
                {connectionStatus === 'checking' && 'Connecting...'}
                {connectionStatus === 'disconnected' && 'Disconnected'}
              </small>
            </div>

            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              {/* Language Selector */}
              <div style={{ position: "relative" }}>
                <button
                  onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
                  disabled={connectionStatus !== 'connected'}
                  style={{
                    background: "transparent",
                    border: "1px solid rgba(255,255,255,0.3)",
                    color: "white",
                    borderRadius: "5px",
                    padding: "5px 8px",
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
                title="Clear chat"
              >
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div style={{
              background: "#ffe6e6",
              color: "#d8000c",
              padding: "10px 15px",
              fontSize: "12px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderBottom: "1px solid #ffcccb"
            }}>
              <span><FontAwesomeIcon icon={faExclamationTriangle} /> {error}</span>
              <button
                onClick={() => setError(null)}
                style={{
                  background: "none",
                  border: "none",
                  color: "#d8000c",
                  cursor: "pointer",
                  padding: "0 5px"
                }}
              >
                ×
              </button>
            </div>
          )}

          {/* Messages Area */}
          <div style={{
            flex: 1,
            padding: "15px",
            overflowY: "auto",
            background: "#f8f9fa"
          }}>
            {messages.map((message) => (
              <div
                key={message.id}
                style={{
                  alignSelf: message.sender === "user" ? "flex-end" : "flex-start",
                  background: message.sender === "user" 
                    ? "linear-gradient(45deg, #00b8d4, #013788)" 
                    : "#ffffff",
                  color: message.sender === "user" ? "white" : "#333",
                  borderRadius: "15px",
                  padding: "12px 16px",
                  marginBottom: "15px",
                  maxWidth: "85%",
                  wordBreak: "break-word",
                  boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                  display: "block"
                }}
              >
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

                {/* Voice confidence and transcription info */}
                {message.confidence && (
                  <div style={{
                    fontSize: "11px",
                    opacity: 0.7,
                    marginTop: "5px"
                  }}>
                    Confidence: {Math.round(message.confidence * 100)}%
                  </div>
                )}

                {/* Play audio button for AI responses */}
                <div style={{ marginTop: "8px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  {message.sender === "ai" && message.canSpeak && (
                    <button
                      onClick={() => playResponseAudio(message.text, message.id)}
                      disabled={isPlayingAudio || connectionStatus !== 'connected'}
                      style={{
                        background: "transparent",
                        border: "1px solid #ddd",
                        borderRadius: "15px",
                        padding: "4px 8px",
                        fontSize: "11px",
                        cursor: (isPlayingAudio || connectionStatus !== 'connected') ? "not-allowed" : "pointer",
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
                accept="image/png,image/jpeg,image/jpg,image/gif,image/webp"
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
                title="Upload image (PNG/JPEG preferred)"
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
                {isLoading ? 
                  <FontAwesomeIcon icon={faSpinner} spin /> : 
                  <FontAwesomeIcon icon={faPaperPlane} />
                }
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Preview Modal */}
      {showImageModal && selectedImage && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0,0,0,0.8)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 2000
        }}>
          <div style={{
            background: "white",
            borderRadius: "15px",
            padding: "20px",
            maxWidth: "90%",
            maxHeight: "90%",
            overflow: "auto",
            minWidth: "400px"
          }}>
            <h3 style={{ marginTop: 0, marginBottom: "15px", textAlign: "center" }}>
              📸 Choose Analysis Type
            </h3>
            
            <img 
              src={imagePreview} 
              alt="Preview" 
              style={{
                maxWidth: "100%",
                maxHeight: "300px",
                borderRadius: "8px",
                marginBottom: "15px",
                display: "block",
                margin: "0 auto 15px"
              }}
            />
            
            <div style={{
              background: "#f8f9fa",
              padding: "15px",
              borderRadius: "8px",
              marginBottom: "20px",
              fontSize: "14px"
            }}>
              <strong style={{ color: "#333" }}>🤖 What should I do with this image?</strong>
              
              <div style={{ marginTop: "15px" }}>
                <div style={{
                  padding: "12px",
                  border: "2px solid #2196F3",
                  borderRadius: "8px",
                  marginBottom: "10px",
                  background: "#f0f8ff",
                  cursor: "pointer"
                }}>
                  <div style={{ display: "flex", alignItems: "center", marginBottom: "5px" }}>
                    <span style={{ fontSize: "20px", marginRight: "8px" }}>🧮</span>
                    <strong style={{ color: "#1976D2" }}>Solve It</strong>
                  </div>
                  <p style={{ margin: 0, fontSize: "13px", color: "#666", paddingLeft: "28px" }}>
                    I'll analyze and solve the math problems or questions in your image
                  </p>
                </div>
                
                <div style={{
                  padding: "12px",
                  border: "2px solid #4CAF50",
                  borderRadius: "8px",
                  background: "#f0fff0",
                  cursor: "pointer"
                }}>
                  <div style={{ display: "flex", alignItems: "center", marginBottom: "5px" }}>
                    <span style={{ fontSize: "20px", marginRight: "8px" }}>✅</span>
                    <strong style={{ color: "#388E3C" }}>Correct It</strong>
                  </div>
                  <p style={{ margin: 0, fontSize: "13px", color: "#666", paddingLeft: "28px" }}>
                    I'll check and correct the answers or solutions shown in your image
                  </p>
                </div>
              </div>
            </div>
            
            <div style={{ display: "flex", gap: "10px", justifyContent: "center", flexWrap: "wrap" }}>
              <button
                onClick={clearImageSelection}
                style={{
                  background: "#6c757d",
                  color: "white",
                  border: "none",
                  padding: "12px 20px",
                  borderRadius: "20px",
                  cursor: "pointer",
                  fontSize: "14px",
                  minWidth: "100px"
                }}
              >
                Cancel
              </button>
              
              <button
                onClick={() => sendImage("solve it")}
                disabled={connectionStatus !== 'connected'}
                style={{
                  background: connectionStatus === 'connected' 
                    ? "linear-gradient(45deg, #2196F3, #1976D2)"
                    : "#cccccc",
                  color: "white",
                  border: "none",
                  padding: "12px 20px",
                  borderRadius: "20px",
                  cursor: connectionStatus === 'connected' ? "pointer" : "not-allowed",
                  fontSize: "14px",
                  minWidth: "120px",
                  boxShadow: "0 2px 5px rgba(0,0,0,0.2)"
                }}
              >
                🧮 Solve It
              </button>
              
              <button
                onClick={() => sendImage("correct it")}
                disabled={connectionStatus !== 'connected'}
                style={{
                  background: connectionStatus === 'connected' 
                    ? "linear-gradient(45deg, #4CAF50, #388E3C)"
                    : "#cccccc",
                  color: "white",
                  border: "none",
                  padding: "12px 20px",
                  borderRadius: "20px",
                  cursor: connectionStatus === 'connected' ? "pointer" : "not-allowed",
                  fontSize: "14px",
                  minWidth: "120px",
                  boxShadow: "0 2px 5px rgba(0,0,0,0.2)"
                }}
              >
                ✅ Correct It
              </button>
            </div>
            
            <div style={{
              marginTop: "15px",
              fontSize: "12px",
              color: "#666",
              textAlign: "center",
              padding: "10px",
              background: "#fff3e0",
              borderRadius: "8px"
            }}>
              💡 <strong>Tip:</strong> Choose "Solve It" for questions you need help with, 
              or "Correct It" to check your existing answers
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