// src/components/ChatBox.jsx
import React, { useEffect, useRef, useState } from "react";
import { Button, Form, InputGroup, Modal } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCommentDots,
  faPaperPlane,
  faTimes,
  faUpload,
  faMicrophone,
  faStop,
  faTrash,
  faVolumeUp,
  faLanguage,
} from "@fortawesome/free-solid-svg-icons";
import "katex/dist/katex.min.css";
import { InlineMath } from "react-katex";
import axios from "axios";
import MarkdownWithMath from "./MarkdownWithMath";
import "./ChatBox.css";

// ====== API BASE ======
const API_URL = "https://chatbot.smartlearners.ai";

// Axios client (no login cookies; pure session-based)
const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
});

// ====== Helpers for formatting ======
const formatMessage = (text) => {
  if (!text) return null;
  if (Array.isArray(text)) {
    return (
      <div className="paragraph-solution">
        {text.map((p, i) => (
          <p key={i} className="solution-paragraph">
            {formatMessageText(p)}
          </p>
        ))}
      </div>
    );
  }
  return formatMessageText(text);
};

const formatMessageText = (text) => {
  if (!text) return null;
  if (typeof text === "string") text = text.trim();
  const segments = text.split(/(\$\$.*?\$\$|\$.*?\$|```[\s\S]*?```)/g);

  return segments.map((segment, index) => {
    if (segment.startsWith("$$") && segment.endsWith("$$")) {
      return <MarkdownWithMath key={index} content={segment.slice(2, -2)} />;
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

// ====== Component ======
const ChatBox = ({ username }) => {
  // UI
  const [isOpen, setIsOpen] = useState(false);
  const toggleChat = () => setIsOpen((o) => !o);

  // Session + connection
  const [sessionId, setSessionId] = useState(null);
  const [studentInfo, setStudentInfo] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState("checking"); // checking | connected | disconnected

  // Chat
  const [messages, setMessages] = useState([
    {
      id: "hello",
      text: "👋 Hi! I’m your Math Assistant. Ask a doubt, upload a problem image, or use voice.",
      sender: "ai",
      timestamp: new Date(),
      canSpeak: true,
    },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [language, setLanguage] = useState("en");

  // Files / image
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  // Audio
  const [isRecording, setIsRecording] = useState(false);
  const [recorder, setRecorder] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);

  // Image action modal (Solve / Correct)
  const [showImageModal, setShowImageModal] = useState(false);

  // Refs
  const messagesEndRef = useRef(null);
  const hasInitialized = useRef(false);

  // ====== Effects ======
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  useEffect(() => {
    // Create a session on mount (no login)
    if (hasInitialized.current) return;
    hasInitialized.current = true;
    createSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  // ====== Session handling ======
  const createSession = async () => {
    setConnectionStatus("checking");
    try {
      const studentId = username || `web_${Date.now()}`;
      const fd = new FormData();
      fd.append("student_id", studentId);

      const res = await api.post("/create_session", fd);
      if (!res.data?.session_id) throw new Error("No session_id");
      setSessionId(res.data.session_id);
      setStudentInfo(res.data.student_info || null);
      setConnectionStatus("connected");

      // fetch existing messages
      await fetchSession(res.data.session_id);
    } catch (e) {
      console.error("create_session error:", e);
      setConnectionStatus("disconnected");
      setMessages((prev) => [
        ...prev,
        {
          id: "conn_fail",
          text:
            "⚠️ Unable to connect to AI service right now. Please refresh the page or try again later.",
          sender: "ai",
          timestamp: new Date(),
        },
      ]);
    }
  };

  const fetchSession = async (sid) => {
    try {
      const res = await api.get(`/session/${sid}`);
      const items = (res.data?.messages || []).map((m, i) => ({
        id: `hist_${i}_${Date.now()}`,
        text: m.content,
        sender: m.role === "assistant" ? "ai" : "user",
        timestamp: new Date(),
        canSpeak: m.role === "assistant",
      }));
      if (items.length) {
        setMessages(items);
      }
    } catch (e) {
      // Silently ignore
    }
  };

  const clearChat = async () => {
    if (!sessionId) return;
    try {
      await api.delete(`/clear-session/${sessionId}`);
    } catch (e) {
      // ignore
    } finally {
      // reset UI + create a fresh session
      setMessages([
        {
          id: "cleared",
          text:
            "🧹 Chat cleared. Starting a fresh session… Ask your next question!",
          sender: "ai",
          timestamp: new Date(),
        },
      ]);
      setSessionId(null);
      setStudentInfo(null);
      setConnectionStatus("checking");
      await createSession();
    }
  };

  // ====== File handlers ======
  const handleFileButtonClick = () => fileInputRef.current?.click();
  const handleFileChange = (e) => handleFile(e.target.files?.[0]);

  const handleFile = (file) => {
    if (!file) return;
    if (!file.type.match("image.*")) {
      alert("Please upload an image file");
      return;
    }
    if (file.size > 12 * 1024 * 1024) {
      alert("Image must be ≤ 12MB");
      return;
    }
    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setShowImageModal(true);
  };

  const clearSelectedFile = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setSelectedFile(null);
    setPreviewUrl(null);
    setShowImageModal(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // ====== Audio recording ======
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);
      const chunks = [];
      mr.ondataavailable = (e) => e.data.size > 0 && chunks.push(e.data);
      mr.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/webm" });
        setAudioBlob(blob);
        stream.getTracks().forEach((t) => t.stop());
      };
      mr.start();
      setRecorder(mr);
      setIsRecording(true);
    } catch (err) {
      alert("Microphone access denied or unavailable.");
    }
  };

  const stopRecording = () => {
    if (recorder && recorder.state === "recording") recorder.stop();
    setIsRecording(false);
  };

  // ====== Message senders ======
  const sendAudio = async () => {
    if (!audioBlob || !sessionId) return;

    const id = Date.now();
    setMessages((prev) => [
      ...prev,
      {
        id,
        text: "[🎤 Voice message]",
        sender: "user",
        timestamp: new Date(),
      },
    ]);
    setIsTyping(true);

    try {
      const form = new FormData();
      form.append("session_id", sessionId);
      form.append("language", language);
      form.append("audio", audioBlob, "recording.webm");

      const res = await api.post("/process-audio", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessages((prev) => [
        ...prev,
        {
          id: id + 1,
          text: res?.data?.response || "Sorry, I couldn't process the audio.",
          sender: "ai",
          timestamp: new Date(),
          canSpeak: true,
          audio: res?.data?.audio, // base64 mp3 (if provided)
        },
      ]);
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        {
          id: id + 1,
          text:
            "❌ Error processing your audio. Please try again.",
          sender: "ai",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsTyping(false);
      setAudioBlob(null);
    }
  };

  const sendImageWithCommand = async (command) => {
    // Triggered from modal: "solve it" | "correct it"
    setShowImageModal(false);
    await sendMessageBase(command, selectedFile);
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() && !selectedFile) return;
    await sendMessageBase(newMessage.trim(), selectedFile);
  };

  const sendMessageBase = async (text, imageFile) => {
    if (!sessionId) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          text: "Connecting… please try again in a moment.",
          sender: "ai",
          timestamp: new Date(),
        },
      ]);
      return;
    }

    const id = Date.now();
    setMessages((prev) => [
      ...prev,
      {
        id,
        text,
        sender: "user",
        timestamp: new Date(),
        image: imageFile ? previewUrl : null,
      },
    ]);
    setNewMessage("");
    setIsTyping(true);

    try {
      // If image present -> /chat (multipart)
      if (imageFile) {
        const fd = new FormData();
        fd.append("session_id", sessionId);
        fd.append("query", text || "");
        fd.append("language", language);
        fd.append("image", imageFile, imageFile.name || `image_${Date.now()}.jpg`);

        const res = await api.post("/chat", fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        setMessages((prev) => [
          ...prev,
          {
            id: id + 1,
            text: res?.data?.reply || "I've analyzed your image!",
            sender: "ai",
            timestamp: new Date(),
            canSpeak: true,
            audio: res?.data?.audio,
          },
        ]);
      } else {
        // Pure text -> /chat-simple
        const res = await api.post("/chat-simple", {
          session_id: sessionId,
          query: text || "",
          language,
        });

        setMessages((prev) => [
          ...prev,
          {
            id: id + 1,
            text: res?.data?.reply || "I received your message!",
            sender: "ai",
            timestamp: new Date(),
            canSpeak: true,
            audio: res?.data?.audio,
          },
        ]);
      }
    } catch (e) {
      console.error("sendMessage error:", e);
      setMessages((prev) => [
        ...prev,
        {
          id: id + 1,
          text:
            "❌ Sorry, I couldn't process that right now. Please try again.",
          sender: "ai",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsTyping(false);
      // Clear image (if any)
      clearSelectedFile();
    }
  };

  // ====== Audio playback (server-provided base64 mp3) ======
  const playResponseAudio = async (base64Audio) => {
    if (!base64Audio) return;
    try {
      const url = `data:audio/mp3;base64,${base64Audio}`;
      const audio = new Audio(url);
      await audio.play();
    } catch (e) {
      // ignore
    }
  };

  // ====== Render ======
  return (
    <div className="chat-box-container">
      {/* Floating Toggle */}
      <button
        className={`chat-toggle-btn ${isOpen ? "open" : ""}`}
        onClick={toggleChat}
        title={isOpen ? "Close chat" : "Ask a question"}
      >
        <FontAwesomeIcon icon={isOpen ? faTimes : faCommentDots} />
        {!isOpen && <span className="chat-label">Ask a question</span>}
      </button>

      {/* Chat Window */}
      <div className={`chat-box ${isOpen ? "open" : ""}`}>
        {/* Header */}
        <div className="chat-header">
          <h5>
            🤖 {studentInfo?.student_class || "Class"} Math Assistant
          </h5>
          <div className="flex-grow" />

          {/* Language */}
          <Form.Select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            size="sm"
            style={{ width: 140, marginRight: 8 }}
          >
            <option value="en">English</option>
            <option value="hi">Hindi</option>
            <option value="te">Telugu</option>
          </Form.Select>

          {/* Clear chat */}
          <Button
            variant="outline-light"
            size="sm"
            onClick={clearChat}
            disabled={connectionStatus !== "connected" || !sessionId}
            title="Clear chat & start new session"
            style={{ marginRight: 8 }}
          >
            <FontAwesomeIcon icon={faTrash} /> Clear
          </Button>

          {/* Connection dot */}
          <Button variant="outline-light" size="sm" disabled>
            <FontAwesomeIcon icon={faLanguage} />{" "}
            {connectionStatus === "connected"
              ? "Connected"
              : connectionStatus === "checking"
              ? "Connecting..."
              : "Disconnected"}
          </Button>

          <button className="close-btn" onClick={toggleChat}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        {/* Messages */}
        <div className="chat-messages">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`message ${
                m.sender === "user" ? "user-message" : "ai-message"
              }`}
            >
              <div className="message-bubble">
                {formatMessage(m.text)}
                {m.image && (
                  <div className="message-image-container">
                    <img
                      src={m.image}
                      alt="User uploaded"
                      className="message-image"
                    />
                  </div>
                )}
              </div>

              {/* Bubble footer */}
              <div
                className="message-time"
                style={{ display: "flex", gap: 8, alignItems: "center" }}
              >
                {m.canSpeak && m.audio && (
                  <Button
                    size="sm"
                    variant="light"
                    onClick={() => playResponseAudio(m.audio)}
                    title="Play AI audio"
                  >
                    <FontAwesomeIcon icon={faVolumeUp} /> Play
                  </Button>
                )}
                {m.timestamp
                  ? new Date(m.timestamp).toLocaleTimeString([], {
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

        {/* Input */}
        <Form onSubmit={sendMessage} className="chat-input">
          <InputGroup>
            <Form.Control
              type="text"
              placeholder={
                connectionStatus === "connected"
                  ? "Type your question..."
                  : "Connecting to AI service..."
              }
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              disabled={connectionStatus !== "connected" || isTyping}
            />

            {/* File chooser (hidden) */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              style={{ display: "none" }}
              disabled={connectionStatus !== "connected" || isTyping}
            />

            {/* Image thumbnail or Upload button */}
            {previewUrl ? (
              <div className="input-thumbnail-container">
                <div className="input-thumbnail">
                  <img
                    src={previewUrl}
                    alt="Thumbnail"
                    className="thumbnail-image"
                  />
                  <button
                    className="remove-thumbnail-btn"
                    onClick={(e) => {
                      e.preventDefault();
                      clearSelectedFile();
                    }}
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
                title="Upload image"
                disabled={connectionStatus !== "connected" || isTyping}
              >
                <FontAwesomeIcon icon={faUpload} />
              </Button>
            )}

            {/* Audio record / stop */}
            {!isRecording ? (
              <Button
                className="ms-1 d-flex align-items-center justify-content-center"
                type="button"
                onClick={startRecording}
                title="Start recording"
                disabled={connectionStatus !== "connected" || isTyping}
              >
                <FontAwesomeIcon icon={faMicrophone} />
              </Button>
            ) : (
              <Button
                className="ms-1 d-flex align-items-center justify-content-center btn-danger"
                type="button"
                onClick={stopRecording}
                title="Stop recording"
              >
                <FontAwesomeIcon icon={faStop} />
              </Button>
            )}

            {/* Send (text or audio) */}
            {audioBlob ? (
              <Button
                className="ms-1 d-flex align-items-center justify-content-center btn-success"
                type="button"
                onClick={sendAudio}
                title="Send voice message"
              >
                <FontAwesomeIcon icon={faPaperPlane} />
              </Button>
            ) : (
              <Button
                className="ms-1 d-flex align-items-center justify-content-center"
                type="submit"
                disabled={
                  connectionStatus !== "connected" ||
                  isTyping ||
                  (!newMessage.trim() && !selectedFile)
                }
                title="Send message"
              >
                <FontAwesomeIcon icon={faPaperPlane} />
              </Button>
            )}
          </InputGroup>
        </Form>
      </div>

      {/* Image action modal */}
      <Modal show={showImageModal} onHide={clearSelectedFile} centered>
        <Modal.Header closeButton>
          <Modal.Title>📸 Choose Analysis</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {previewUrl && (
            <div style={{ textAlign: "center", marginBottom: 12 }}>
              <img
                src={previewUrl}
                alt="preview"
                style={{
                  maxWidth: "100%",
                  maxHeight: 240,
                  borderRadius: 8,
                  objectFit: "contain",
                }}
              />
            </div>
          )}
          <div className="d-grid gap-2">
            <Button
              variant="primary"
              onClick={() => sendImageWithCommand("solve it")}
              disabled={connectionStatus !== "connected"}
            >
              🧮 Solve It
            </Button>
            <Button
              variant="success"
              onClick={() => sendImageWithCommand("correct it")}
              disabled={connectionStatus !== "connected"}
            >
              ✅ Correct It
            </Button>
          </div>
          <div
            style={{
              marginTop: 12,
              fontSize: 12,
              color: "#555",
              background: "#fff3cd",
              border: "1px solid #ffeeba",
              padding: 8,
              borderRadius: 6,
            }}
          >
            💡 Tip: Use “Solve It” for new questions, “Correct It” to check your
            answers.
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={clearSelectedFile}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ChatBox;
