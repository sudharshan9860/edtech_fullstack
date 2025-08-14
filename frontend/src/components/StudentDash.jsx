// Enhanced StudentDash.jsx - Modern Design with Better UX and Chapter Debugging - FIXED
import React, { useState, useEffect, useContext } from "react";
import { BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import { Form, Button, Row, Col, Container, Alert, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import confetti from 'canvas-confetti';
import "./StudentDash.css";
import axiosInstance from "../api/axiosInstance";
import QuestionListModal from "./QuestionListModal";
import { NotificationContext } from '../contexts/NotificationContext';
import Select from "react-select";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AuthContext } from "./AuthContext";
import RecentSessions from "./RecentSessions";
import {
  faSchool,
  faBookOpen,
  faListAlt,
  faClipboardQuestion,
  faQuestionCircle,
  faRocket,
  faSpinner, // ADD THIS LINE
  faGraduationCap,
  faBrain,
  faLightbulb,
  faBars,
  faTimes,
  faSun,
  faMoon,
  faFire,
  faTrophy,
  faMagic,
  faStar,
  faChartLine,
  faCalendarAlt,
  faUsers,
  faBookmark,
} from "@fortawesome/free-solid-svg-icons";
import UnifiedSessions from "./UnifiedSessions";

function StudentDash() {
  const navigate = useNavigate();
  const { username } = useContext(AuthContext);

  // Dark mode state with improved persistence
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true';
  });

  // State for dropdown data
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [subTopics, setSubTopics] = useState([]);
  const [worksheets, setWorksheets] = useState([]);

  // State for selections with smart defaults
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedChapters, setSelectedChapters] = useState([]);
  const [questionType, setQuestionType] = useState("");
  const [questionLevel, setQuestionLevel] = useState("");
  const [selectedWorksheet, setSelectedWorksheet] = useState("");
  const [showQuestionList, setShowQuestionList] = useState(false);
  const [questionList, setQuestionList] = useState([]);
  const [selectedQuestions, setSelectedQuestions] = useState([]);

// ADD THESE MISSING STATE VARIABLES after your existing useState declarations:
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState(null);
const [success, setSuccess] = useState('');

  // ADD these missing state variables after your existing useState declarations:
const [selectedTopics, setSelectedTopics] = useState([]); // Add this line
const [selectedSubtopic, setSelectedSubtopic] = useState(""); // Add this line
const [selectedQuestionsData, setSelectedQuestionsData] = useState([]); // Add this line
const [showQuestionListModal, setShowQuestionListModal] = useState(false); // Add this line

const { addNotification } = useContext(NotificationContext);


// Add this INSIDE your StudentDash function, after the useState declarations:
useEffect(() => {
  console.log('StudentDash State Debug:', {
    selectedClass,
    selectedSubject,
    selectedTopics,
    selectedSubtopic,
    questionList: questionList?.length || 0
  });
}, [selectedClass, selectedSubject, selectedTopics, selectedSubtopic, questionList]);

  // Extract class from username (e.g., 10HPS24 -> 10, 12ABC24 -> 12)
  const extractClassFromUsername = (username) => {
    if (!username) return "";
    // Extract first 2 characters for class number
    const classNumber = username.substring(0, 2);
    return isNaN(classNumber) ? "" : classNumber;
  };

  // Enhanced time-based greeting with more personalization
  const getTimeBasedGreeting = () => {
    const currentHour = new Date().getHours();
    if (currentHour >= 0 && currentHour < 6) {
      return "Good Night";
    } else if (currentHour >= 6 && currentHour < 12) {
      return "Good Morning";
    } else if (currentHour >= 12 && currentHour < 17) {
      return "Good Afternoon";
    } else if (currentHour >= 17 && currentHour < 21) {
      return "Good Evening";
    } else {
      return "Good Night";
    }
  };

  // Get motivational message based on time
  const getMotivationalMessage = () => {
    const messages = [
      "Ready to unlock your mathematical genius today? Let's dive into some exciting problem-solving! 🚀",
      "Time to explore the fascinating world of mathematics! Every problem is a new adventure waiting to be solved! ✨",
      "Mathematics is the language of the universe - let's learn to speak it fluently! 🌟",
      "Today's learning journey begins with a single step. Let's make it count! 💪",
      "Ready to turn complex problems into simple solutions? Your mathematical journey awaits! 🎯"
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  };

  // Toggle dark mode with smooth transition
  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem('darkMode', newMode.toString());
    document.body.classList.toggle('dark-mode', newMode);
  };

  // Apply dark mode on component mount
  useEffect(() => {
    document.body.classList.toggle('dark-mode', isDarkMode);
  }, [isDarkMode]);

  // Determine if generate button should be enabled
  const isGenerateButtonEnabled = () => {
    if (questionType === "external") {
      return (
        selectedClass !== "" &&
        selectedSubject !== "" &&
        selectedChapters.length > 0 &&
        questionType !== "" &&
        questionLevel !== ""
      );
    }

    if (questionType === "worksheets") {
      return (
        selectedClass !== "" &&
        selectedSubject !== "" &&
        selectedChapters.length > 0 &&
        questionType !== "" &&
        selectedWorksheet !== ""
      );
    }

    return (
      selectedClass !== "" &&
      selectedSubject !== "" &&
      selectedChapters.length > 0 &&
      questionType !== ""
    );
  };

  // Fetch classes and set defaults with debugging
  useEffect(() => {
    async function fetchData() {
      try {
        console.log("🔍 Fetching classes...");
        const classResponse = await axiosInstance.get("/classes/");
        console.log("📋 Classes API Response:", classResponse.data);
        
        const classesData = classResponse.data.data;
        setClasses(classesData);

        // Set default class based on username
        const defaultClass = extractClassFromUsername(username);
        console.log("👤 Username:", username, "Extracted Class:", defaultClass);
        
        if (defaultClass) {
          const matchingClass = classesData.find(cls => 
            cls.class_name.includes(defaultClass) || cls.class_code === defaultClass
          );
          console.log("🎯 Matching class found:", matchingClass);
          
          if (matchingClass) {
            setSelectedClass(matchingClass.class_code);
            console.log("✅ Auto-selected class:", matchingClass.class_code);
          }
        }
      } catch (error) {
        console.error("❌ Error fetching classes", error);
      }
    }
    fetchData();
  }, [username]);

  // Fetch subjects and set default with enhanced debugging
  useEffect(() => {
    async function fetchSubjects() {
      if (selectedClass) {
        try {
          console.log("🔍 Fetching subjects for class:", selectedClass);
          
          const subjectResponse = await axiosInstance.post("/subjects/", {
            class_id: selectedClass,
          });
          
          console.log("📚 Subjects API Response:", subjectResponse.data);
          
          const subjectsData = subjectResponse.data.data;
          setSubjects(subjectsData);

          // Set default subject to Mathematics
          const mathSubject = subjectsData.find(subject => 
            subject.subject_name.toLowerCase().includes('math')
          );
          if (mathSubject) {
            setSelectedSubject(mathSubject.subject_code);
            console.log("📐 Auto-selected Math subject:", mathSubject);
          } else {
            console.log("⚠ No Math subject found, available subjects:", subjectsData);
          }

          // Reset dependent fields
          setSelectedChapters([]);
          setQuestionType("");
          setQuestionLevel("");
          setSelectedWorksheet("");
        } catch (error) {
          console.error("❌ Error fetching subjects:", error);
          console.error("📄 Error details:", error.response?.data);
          setSubjects([]);
        }
      }
    }
    fetchSubjects();
  }, [selectedClass]);

  // Fetch chapters with comprehensive debugging - FIXED
  useEffect(() => {
    async function fetchChapters() {
      if (selectedSubject && selectedClass) {
        try {
          console.log("🔍 Fetching chapters with parameters:");
          console.log("   📖 Subject ID:", selectedSubject);
          console.log("   🏫 Class ID:", selectedClass);
          
          const chapterResponse = await axiosInstance.post("/chapters/", {
            subject_id: selectedSubject,
            class_id: selectedClass,
          });
          
          console.log("📚 Chapters API Response:", chapterResponse.data);
          console.log("📊 Response structure:", {
            hasData: !!chapterResponse.data.data,
            dataLength: chapterResponse.data.data?.length,
            firstChapter: chapterResponse.data.data?.[0]
          });
          
          if (chapterResponse.data && chapterResponse.data.data) {
            setChapters(chapterResponse.data.data);
            console.log("✅ Chapters set successfully:", chapterResponse.data.data.length, "chapters");
            console.log("📝 First few chapters:", chapterResponse.data.data.slice(0, 3));
            
            // Log the structure of chapters to verify field names
            if (chapterResponse.data.data.length > 0) {
              console.log("🔍 Chapter structure:", Object.keys(chapterResponse.data.data[0]));
            }
          } else {
            console.warn("⚠ No chapters data found in response");
            setChapters([]);
          }
          
          setSelectedChapters([]);
          setQuestionType("");
          setQuestionLevel("");
          setSelectedWorksheet("");
        } catch (error) {
          console.error("❌ Error fetching chapters:", error);
          console.error("📄 Error details:", error.response?.data);
          setChapters([]);
        }
      } else {
        console.log("⚠ Cannot fetch chapters - missing requirements:");
        console.log("   📖 Selected Subject:", selectedSubject);
        console.log("   🏫 Selected Class:", selectedClass);
      }
    }
    fetchChapters();
  }, [selectedSubject, selectedClass]);

  // Effect for fetching subtopics when External question type is selected
  useEffect(() => {
    async function fetchSubTopics() {
      if (
        questionType === "external" &&
        selectedClass &&
        selectedSubject &&
        selectedChapters.length > 0
      ) {
        try {
          const response = await axiosInstance.post("/question-images/", {
            classid: selectedClass,
            subjectid: selectedSubject,
            topicid: selectedChapters[0], // Using first chapter for subtopics
            external: true,
          });
          console.log("Subtopics response:", response);
          setSubTopics(response.data.subtopics || []);
        } catch (error) {
          console.error("Error fetching subtopics:", error);
          setSubTopics([]);
        }
      }
    }
    fetchSubTopics();
  }, [questionType, selectedClass, selectedSubject, selectedChapters]);

  // Effect for fetching worksheets when Worksheets question type is selected
  useEffect(() => {
    async function fetchWorksheets() {
      if (
        questionType === "worksheets" &&
        selectedClass &&
        selectedSubject &&
        selectedChapters.length > 0
      ) {
        try {
          const response = await axiosInstance.post("/question-images/", {
            classid: selectedClass,
            subjectid: selectedSubject,
            topicid: selectedChapters[0], // Using first chapter for worksheets
            worksheets: true,
          });
          console.log("Worksheets response:", response);
          setWorksheets(response.data.worksheets || []);
        } catch (error) {
          console.error("Error fetching worksheets:", error);
          setWorksheets([]);
        }
      }
    }
    fetchWorksheets();
  }, [questionType, selectedClass, selectedSubject, selectedChapters]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 🎉 TRIGGER CONFETTI IMMEDIATELY ON CLICK
    triggerConfettiEffect();
    
    // Your existing validation logic
    if (!isGenerateButtonEnabled()) {
      console.error("Please select all required fields");
      setError("Please select all required fields");
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess('');

    // Your existing API call logic continues here...
    try {
          const requestData = {
            classid: Number(selectedClass),
            subjectid: Number(selectedSubject),
            topicid: selectedChapters,
            solved: questionType === "solved",
            exercise: questionType === "exercise",
            // external: questionType === "external",
            // worksheets: questionType === "worksheets",
            subtopic: questionType === "external" ? questionLevel : null,
            worksheet_name: questionType === "worksheets" ? selectedWorksheet : null,
    };

      console.log("Submitting request:", requestData);

      const response = await axiosInstance.post("/question-images/", requestData);
      console.log("API Response:", response.data);

      // Add success notification
    addNotification({
      type: 'success',
      title: 'Questions Generated!',
      message: `Found ${response.data.questions.length} questions for your selection`,
      duration: 4000
    });

    // Process questions with images - PRESERVE the original backend IDs
    if (response.data && response.data.questions && Array.isArray(response.data.questions)) {
      const questionsWithImages = (response.data.questions || []).map((question, index) => ({
        ...question,
        originalIndex: index, // Store the array index separately if needed
        question: question.question,
        image: question.question_image
          ? `data:image/png;base64,${question.question_image}`
          : null,
      }));

    console.log("Processed questions with preserved IDs:", questionsWithImages);
    setQuestionList(questionsWithImages);
    setSelectedQuestions([]);
    setShowQuestionListModal(true); // This is CORRECT

    // 🎉 TRIGGER SUCCESS CONFETTI WHEN QUESTIONS ARE LOADED
    // triggerSuccessConfetti();
     } else {
            throw new Error("No questions found in response");
    }

    } catch (error) {
      console.error("Error generating questions:", error);
      alert("Failed to generate questions. Please try again.");
      // Add error notification
    addNotification({
      type: 'error',
      title: 'Generation Failed',
      message: 'Failed to generate questions. Please try again.',
      duration: 6000
    });
    } finally {
        setIsLoading(false);
    }
  };

// Enhanced question click handler - UPDATED to use preserved question IDs
const handleQuestionClick = (questionObj, index) => {
  console.log("Question clicked:", questionObj, index);
  
  // FIXED: Use selectedChapters instead of selectedTopics
  const topicIds = selectedChapters && Array.isArray(selectedChapters) 
    ? selectedChapters.join(',') 
    : '';

  navigate('/solvequestion', {
    state: {
      question: questionObj.question,
      questionId: questionObj.id,
      questionNumber: index + 1,
      questionList: questionList,
      class_id: selectedClass,
      subject_id: selectedSubject,
      topic_ids: topicIds,
      subtopic: questionLevel || '',
      image: questionObj.image || questionObj.question_image || '',
      index: index,
      selectedQuestions: selectedQuestionsData || [],
      questionLevel: questionObj.level,
      originalQuestionId: questionObj.id
    }
  });
};

// Updated question click handler for single question navigation
const handleQuestionClickFromModal = (questionText, index, questionImage, questionId) => {
  console.log("Question selected from modal:", {
    questionText,
    index,
    questionImage,
    questionId
  });

  // Navigate directly to solve question page
  navigate('/solvequestion', {
    state: {
      question: questionText,
      questionId: questionId,
      image: questionImage, // ✅ FIXED: Use 'image' field name consistently
      fromQuestionSelection: true,
      questionIndex: index,
       class_id: selectedClass,
      subject_id: selectedSubject,
      topic_ids: selectedChapters,
      subtopic: questionLevel
    }
  });

  // Close the modal
  setShowQuestionListModal(false);
};

// Updated handler for the submit button (backup - won't be used much now)
const handleMultipleSelectSubmit = (selectedQuestionsData) => {
  console.log("Question selected:", selectedQuestionsData);
  
  if (selectedQuestionsData && selectedQuestionsData.length > 0) {
    const selectedQuestion = selectedQuestionsData[0];
    
    navigate('/solvequestion', {
      state: {
        question: selectedQuestion.question,
        questionId: selectedQuestion.id,
        questionImage: selectedQuestion.image,
        fromQuestionSelection: true,
        class_id: selectedClass,
        subject_id: selectedSubject,
        topic_ids: selectedChapters,
        subtopic: questionLevel
      }
    });
  }
  
  setShowQuestionListModal(false);
};

  // If you want confetti when the modal opens, you can also add this:
// useEffect(() => {
//     if (showQuestionList && questionList.length > 0) {
//         // Small celebration when modal opens
//         setTimeout(() => {
//             confetti({
//                 particleCount: 30,
//                 spread: 60,
//                 origin: { x: 0.5, y: 0.3 },
//                 colors: ['#00BCD4', '#00E5FF', '#FFD700'],
//                 zIndex: 999999
//             });
//         }, 300);
//     }
// }, [showQuestionList]);

  // Reset dependent fields when question type changes
  useEffect(() => {
    if (questionType !== "external") {
      setQuestionLevel("");
    }
    if (questionType !== "worksheets") {
      setSelectedWorksheet("");
    }
  }, [questionType]);

  // Enhanced styles for react-select with portal rendering for full visibility
  const selectStyles = {
    control: (provided, state) => ({
      ...provided,
      backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
      borderColor: state.isFocused 
        ? (isDarkMode ? '#7c3aed' : '#667eea') 
        : (isDarkMode ? '#475569' : '#e2e8f0'),
      color: isDarkMode ? '#f1f5f9' : '#2d3748',
      minHeight: '56px',
      border: `2px solid ${state.isFocused 
        ? (isDarkMode ? '#7c3aed' : '#667eea') 
        : (isDarkMode ? '#475569' : '#e2e8f0')}`,
      borderRadius: '12px',
      boxShadow: state.isFocused 
        ? `0 0 0 4px ${isDarkMode ? 'rgba(124, 58, 237, 0.1)' : 'rgba(102, 126, 234, 0.1)'}` 
        : 'none',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      '&:hover': {
        borderColor: isDarkMode ? '#6366f1' : '#5a67d8',
      },
    }),
    menuPortal: (provided) => ({
      ...provided,
      zIndex: 10000,
      position: 'fixed',
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
      zIndex: 10000,
      borderRadius: '12px',
      border: `2px solid ${isDarkMode ? '#7c3aed' : '#667eea'}`,
      boxShadow: isDarkMode 
        ? '0 25px 50px -12px rgba(0, 0, 0, 0.9)'
        : '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      maxHeight: '500px',
      overflow: 'hidden',
      position: 'fixed',
      width: 'auto',
      minWidth: '450px',
      maxWidth: '600px',
    }),
    menuList: (provided) => ({
      ...provided,
      maxHeight: '470px',
      padding: '12px',
      overflowY: 'auto',
      overflowX: 'hidden',
      scrollbarWidth: 'thin',
      scrollbarColor: `${isDarkMode ? '#7c3aed' : '#667eea'} ${isDarkMode ? '#334155' : '#f8fafc'}`,
      '&::-webkit-scrollbar': {
        width: '12px',
      },
      '&::-webkit-scrollbar-track': {
        background: isDarkMode ? '#334155' : '#f8fafc',
        borderRadius: '6px',
        margin: '4px',
      },
      '&::-webkit-scrollbar-thumb': {
        background: isDarkMode ? '#7c3aed' : '#667eea',
        borderRadius: '6px',
        border: `2px solid ${isDarkMode ? '#334155' : '#f8fafc'}`,
      },
      '&::-webkit-scrollbar-thumb:hover': {
        background: isDarkMode ? '#6366f1' : '#5a67d8',
      },
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused
        ? (isDarkMode ? '#7c3aed' : '#667eea')
        : state.isSelected
        ? (isDarkMode ? '#6366f1' : '#5a67d8')
        : (isDarkMode ? '#1e293b' : '#ffffff'),
      color: state.isFocused || state.isSelected 
        ? '#ffffff' 
        : (isDarkMode ? '#f1f5f9' : '#2d3748'),
      padding: '16px 20px',
      cursor: 'pointer',
      fontSize: '15px',
      fontWeight: state.isSelected ? '600' : '500',
      lineHeight: '1.5',
      whiteSpace: 'normal',
      wordWrap: 'break-word',
      minHeight: '50px',
      display: 'flex',
      alignItems: 'center',
      borderBottom: `1px solid ${isDarkMode ? '#475569' : '#f1f5f9'}`,
      transition: 'all 0.2s ease',
      position: 'relative',
      '&:hover': {
        backgroundColor: isDarkMode ? '#7c3aed' : '#667eea',
        color: '#ffffff',
        transform: 'translateX(4px)',
      },
      '&:last-child': {
        borderBottom: 'none',
      },
    }),
    multiValue: (provided) => ({
      ...provided,
      backgroundColor: isDarkMode ? '#6366f1' : '#667eea',
      borderRadius: '8px',
      margin: '3px',
      padding: '2px',
    }),
    multiValueLabel: (provided) => ({
      ...provided,
      color: '#ffffff',
      fontWeight: '600',
      fontSize: '13px',
      padding: '6px 10px',
    }),
    multiValueRemove: (provided) => ({
      ...provided,
      color: '#ffffff',
      borderRadius: '0 8px 8px 0',
      '&:hover': {
        backgroundColor: '#ef4444',
        color: '#ffffff',
        transform: 'scale(1.1)',
      },
    }),
    placeholder: (provided) => ({
      ...provided,
      color: isDarkMode ? '#94a3b8' : '#6b7280',
      fontSize: '15px',
      fontWeight: '500',
    }),
    singleValue: (provided) => ({
      ...provided,
      color: isDarkMode ? '#f1f5f9' : '#2d3748',
      fontSize: '15px',
      fontWeight: '600',
    }),
    dropdownIndicator: (provided, state) => ({
      ...provided,
      color: isDarkMode ? '#94a3b8' : '#6b7280',
      transform: state.selectProps.menuIsOpen ? 'rotate(180deg)' : 'rotate(0deg)',
      transition: 'transform 0.3s ease',
      '&:hover': {
        color: isDarkMode ? '#7c3aed' : '#667eea',
      },
    }),
    clearIndicator: (provided) => ({
      ...provided,
      color: isDarkMode ? '#94a3b8' : '#6b7280',
      '&:hover': {
        color: isDarkMode ? '#ef4444' : '#dc2626',
      },
    }),
    indicatorSeparator: (provided) => ({
      ...provided,
      backgroundColor: isDarkMode ? '#475569' : '#e2e8f0',
    }),
  };

  // Add this sound effect function
const playConfettiSound = () => {
    try {
        // Create a pleasant success chime using Web Audio API
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        // Create main success tone
        const oscillator1 = audioContext.createOscillator();
        const gainNode1 = audioContext.createGain();
        
        oscillator1.connect(gainNode1);
        gainNode1.connect(audioContext.destination);
        
        // Success chime sequence
        oscillator1.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
        oscillator1.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1); // E5
        oscillator1.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2); // G5
        
        gainNode1.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode1.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.01);
        gainNode1.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.4);
        
        oscillator1.start(audioContext.currentTime);
        oscillator1.stop(audioContext.currentTime + 0.4);
        
        // Add a secondary harmonic for richness
        setTimeout(() => {
            const oscillator2 = audioContext.createOscillator();
            const gainNode2 = audioContext.createGain();
            
            oscillator2.connect(gainNode2);
            gainNode2.connect(audioContext.destination);
            
            oscillator2.frequency.setValueAtTime(1046.5, audioContext.currentTime); // C6
            gainNode2.gain.setValueAtTime(0, audioContext.currentTime);
            gainNode2.gain.linearRampToValueAtTime(0.05, audioContext.currentTime + 0.01);
            gainNode2.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.3);
            
            oscillator2.start(audioContext.currentTime);
            oscillator2.stop(audioContext.currentTime + 0.3);
        }, 100);
        
    } catch (error) {
        console.log('Audio not supported or blocked:', error);
        // Fallback: try to play a simple beep
        try {
            const beep = new Audio("data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjiS1/LNeSsFJHfH8N+QQAoUXrTp66hVFApGn+DyvmwhBjiS1/LNeSsFJHfH8N+QQAoUXrTp66hVFApGn+DyvmwhBjiS1/LNeSsFJHfH8N+QQAoUXrTp66hVFApGn+DyvmwhBjiS1/LNeSsFJHfH8N+QQAoUXrTp66hVFApGn+DyvmwhBjiS1/LNeSsFJHfH8N+QQAoUXrTp66hVFApGn+DyvmwhBjiS1/LNeSsFJHfH8N+QQAoUXrTp66hVFApGn+DyvmwhBjiS1/LNeSsFJHfH8N+QQAoUXrTp66hVFApGn+DyvmwhBjiS1/LNeSsFJHfH8N+QQAoUXrTp66hVFApGn+DyvmwhBjiS1/LNeSsFJHfH8N+QQAoUXrTp66hVFApGn+DyvmwhBjiS1/LNeSsFJHfH8N+QQAoUXrTp66hVFApGn+DyvmwhBjiS1/LNeSsFJHfH8N+QQAoUXrTp66hVFApGn+DyvmwhBjiS1/LNeSsFJHfH8N+QQAoUXrTp66hVFApGn+DyvmwhBjiS2/LNeSsFJHfH8N+QQAoUXrTp66hVFApGn+DyvmwhBjiS2/LNeSsFJHfH8N+QQAoUXrTp66hVFApGn+DyvmwhBjiS2/LNeSsFJHfH8N+QQAoUXrTp66hVFApGn+DyvmzhBjiS2/LNeSsFJHfH8N+QQAoUXrTp66hVFApGn+DyvmzhBjiS2/LNeSsFJHfH8N+QQAoUXrTp66hVFApGn+DyvmzhBjiS2/LNeSsFJHfH8N+QQAoUXrTp66hVFApGn+DyvmwhBjiS2/LNeSsFJHfH8N+QQAoUXrTp66hVFApGn+DyvmwhBjiS2/LNeSsFJHfH8N+QQAoUXrTp66hVFApGn+DyvmwhBjiS2/LNeSsFJHfH8N+QQAoUXrTp66hVFApGn+DyvmwhBjiS2/LNeSsFJHfH8N+QQAoUXrTp66hVFApGn+DyvmwhBjiS2/LNeSsFJHfH8N+QQAoUXrTp66hVFApGn+DyvmwhBjiS2/LNeSsFJHfH8N+QQAoUXrTp66hVFApGn+DyvmwhBjiS2/LNeSsFJHfH8N+QQAoUXrTp66hVFApGn+DyvmwhBjiS2/LNeSsFJHfH8N+QQAoUXrTp66hVFApGn+DyvmzhBjiS2/LNeSsFJHfH8N+QQAoUXrTp66hVFApGn+DyvmzhBjiS2/LNeSsFJHfH8N+QQAoUXrTp66hVFApGn+DyvmzhBjiS2/LNeSsFJHfH8N+QQAoUXrTp66hVFApGn+DyvmzhBjiS2/LNeSsFJHfH8N+QQAoUXrTp66hVFApGn+DyvmzhBjiS2/LNeSsFJHfH8N+QQAoUXrTp66hVFApGn+DyvmzhBjiS2/LNeSsFJHfH8N+QQAoUXrTp66hVFApGn+DyvmzhBjiS2/LNeSsFJHfH8N+QQAoUXrTp66hVFApGn+DyvmwhBjiS2/LNeSsFJHfH8N+QQAoUXrTp66hVFApGn+DyvmwhBjiS2/LNeSsFJHfH8N+QQAoUXrTp66hVFApGn+DyvmwhBjiS2/LNeSsFJHfH8N+QQAoUXrTp66hVFApGn+DyvmwhBjiS2/LNeSsFJHfH8N+QQAoUXrTp66hVFApGn+DyvmwhBjiS2/LNeSsFJHfH8N+QQAoUXrTp66hVFApGn+DyvmwhBjiS2/LNeSsFJHfH8N+QQAoUXrTp66hVFApGn+DyvmwhBjiS2/LNeSsFJHfH8N+QQAoUXrTp66hVFApGn+DyvmwhBjiS2/LNeSsFJHfH8N+QQAoUXrTp66hVFApGn+DyvmwhBjiS2/LNeSsFJHfH8N+QQAoUXrTp66hVFApGn+DyvmwhBjiS2/LNeSsFJHfH8N+QQAoUXrTp66hVFApGn+DyvmwhBjiS2/LNeSsFJHfH8N+QQAoUXrTp66hVFApGn+DyvmwhBjiS2/LNeSsFJHfH8N+QQAoUXrTp66hVFApGn+DyvmwhBjiS2/LNeSsFJHfH8N+QQAoUXrTp66hVFApGn+DyvmwhBjiS2/LNeSsFJHfH8N+QQAoUXrTp66hVFApGn+DyvmwhBjiS2/LNeSsFJHfH8N+QQAoUXrTp66hVFApGn+DyvmwhBjiS2/LNeSsFJHfH8N+QQAoUXrTp66hVFApGn+DyvmwhBjiS2/LNeSsFJHfH8N+QQAoUXrTp66hVFApGn+DyvmwhBjiS2/LNeSsFJHfH8N+QQAoUXrTp66hVFApGn+DyvmwhBjiS2/LNeSsFJHfH8N+QQAoUXrTp66hVFApGn+DyvmwhBjiS2/LNeSsFJHfH8N+QQAoUXrTp66hVFApGn+DyvmwhBjiS2/LNeSsFJHfH8N+QQAoUXrTp66hVFApGn+DyvmwhBjiS2/LNeSsFJHfH8N+QQAoUXrTp66hVFApGn+DyvmwhBjiS2/LNeSsFJHfH8N+QQAoUXrTp66hVFApGn+DyvmwhBjiS2/LNeSsFJHfH8N+QQAoUXrTp66hVFApGn+DyvmwhBjiS2/LNeSsFJHfH8N+QQAoUXrTp66hVFApGn+DyvmwhBjiS2/LNeSsFJHfH8N+QQAoUXrTp6");
            beep.volume = 0.1;
            beep.play();
        } catch (e) {
            console.log('All audio methods failed');
        }
    }
};

// Add this call to your triggerConfettiEffect function:
// playConfettiSound();

  // Add these functions inside your StudentDash component (before the return statement)
// Enhanced confetti function with sound and better positioning
const triggerConfettiEffect = () => {
    // 🔊 PLAY SOUND FIRST
    playConfettiSound();
    
    // Get the button element for positioning
    const button = document.querySelector('.btn-generate-enhanced');
    const buttonRect = button?.getBoundingClientRect();
    
    // Calculate position relative to viewport
    const x = buttonRect ? (buttonRect.left + buttonRect.width / 2) / window.innerWidth : 0.5;
    const y = buttonRect ? (buttonRect.top + buttonRect.height / 2) / window.innerHeight : 0.5;
    
    // Create confetti with higher z-index
    const confettiConfig = {
        zIndex: 999999,
        disableForReducedMotion: false
    };
    
    // Initial burst from button - ENHANCED
    confetti({
        particleCount: 80,
        spread: 70,
        origin: { x, y },
        colors: ['#00BCD4', '#001B6C', '#00E5FF', '#3F51B5', '#2196F3', '#FFD700'],
        gravity: 0.8,
        scalar: 1.4,
        drift: 0,
        ticks: 400,
        shapes: ['square', 'circle'],
        ...confettiConfig
    });
    
    // Secondary burst with different pattern
    setTimeout(() => {
        confetti({
            particleCount: 50,
            spread: 100,
            origin: { x, y },
            colors: ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FF69B4'],
            gravity: 0.6,
            scalar: 0.9,
            drift: 0.3,
            ticks: 300,
            shapes: ['circle'],
            ...confettiConfig
        });
    }, 200);
    
    // Left side burst to cover sidebar area
    setTimeout(() => {
        confetti({
            particleCount: 30,
            spread: 60,
            origin: { x: 0.1, y: 0.6 },
            colors: ['#00BCD4', '#00E5FF', '#3F51B5'],
            gravity: 0.7,
            scalar: 1.2,
            drift: 0.1,
            ticks: 350,
            ...confettiConfig
        });
    }, 100);
    
    // Right side burst for balance
    setTimeout(() => {
        confetti({
            particleCount: 30,
            spread: 60,
            origin: { x: 0.9, y: 0.6 },
            colors: ['#2196F3', '#FFD700', '#FF6B6B'],
            gravity: 0.7,
            scalar: 1.2,
            drift: -0.1,
            ticks: 350,
            ...confettiConfig
        });
    }, 150);
};

// Enhanced success confetti - REMOVE the triggerSuccessConfetti call from handleSubmit
const triggerSuccessConfetti = () => {
    // This function can stay but remove its call from handleSubmit
    // Only keep the first confetti effect in handleSubmit
};

// Success sound for when questions load
const playSuccessSound = () => {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        // Create a celebratory fanfare
        const createTone = (freq, startTime, duration, volume = 0.1) => {
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(freq, startTime);
            gainNode.gain.setValueAtTime(0, startTime);
            gainNode.gain.linearRampToValueAtTime(volume, startTime + 0.01);
            gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
            
            oscillator.start(startTime);
            oscillator.stop(startTime + duration);
        };
        
        // Success fanfare sequence
        const now = audioContext.currentTime;
        createTone(523.25, now, 0.3); // C5
        createTone(659.25, now + 0.1, 0.3); // E5
        createTone(783.99, now + 0.2, 0.3); // G5
        createTone(1046.50, now + 0.3, 0.4); // C6
        
    } catch (error) {
        console.log('Success sound failed:', error);
    }
};

  return (
    <div className={`student-dash-wrapper ${isDarkMode ? 'dark-mode' : ''}`}>
      {/* Enhanced Fixed Sidebar */}
      <div className="sidebar-fixed">
        {/* <div className="sidebar-header">
          <div className="sidebar-brand">
            <FontAwesomeIcon icon={faGraduationCap} className="brand-icon" />
            <span>AI Educator</span>
          </div>
        </div> */}

        <div className="sidebar-content">
          {/* Enhanced Progress Card with Animation */}
          <div className="progress-card">
            <div className="progress-icon">
              <FontAwesomeIcon icon={faBrain} />
            </div>
            <div className="progress-details">
              <h4>89%</h4>
              <span>Progress</span>
            </div>
          </div>

          {/* Enhanced Streak Card */}
          <div className="streak-card">
            <div className="streak-icon">
              <FontAwesomeIcon icon={faFire} />
            </div>
            <div className="streak-details">
              <h4>5</h4>
              <span>Day Streak</span>
            </div>
          </div>

          {/* Enhanced Badges Card */}
          <div className="badges-card">
            <div className="badges-icon">
              <FontAwesomeIcon icon={faTrophy} />
            </div>
            <div className="badges-details">
              <h4>3</h4>
              <span>Badges</span>
            </div>
          </div>

          {/* Enhanced Dark Mode Toggle
          <div className="dark-mode-toggle" onClick={toggleDarkMode}>
            <FontAwesomeIcon icon={isDarkMode ? faSun : faMoon} />
            <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
          </div> */}
        </div>
      </div>

      {/* Enhanced Main Content */}
      <div className="main-content-fixed">
        {/* Enhanced Greeting Header with Dynamic Content */}
        <div className="greeting-header">
          <div className="greeting-content">
            <div className="greeting-text">
              <h1>
                <FontAwesomeIcon icon={faGraduationCap} className="me-1" />
                {getTimeBasedGreeting()}, {username}! 
                <span className="graduation-emoji">🎓</span>
              </h1>
              {/* <p>Class 10 Student • {getMotivationalMessage()}</p> */}
              <div className="motivation-buttons">
                <Button variant="warning" size="sm" className="motivation-btn">
                  <FontAwesomeIcon icon={faStar} className="me-1" />
                  Keep Going!
                </Button>
                <Button variant="info" size="sm" className="motivation-btn">
                  <FontAwesomeIcon icon={faTrophy} className="me-1" />
                  You're Awesome!
                </Button>
              </div>
            </div>
            <div className="current-date">
              <h2>{new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                month: 'long', 
                day: 'numeric' 
              })}</h2>
              {/* <p>{new Date().getFullYear()}</p> */}
            </div>
          </div>
        </div>

        {/* Enhanced Motivational Quote */}
        {/* <div className="motivational-quote">
          <FontAwesomeIcon icon={faMagic} className="quote-icon" />
          <div className="quote-content">
            <h3>"Mathematics is not about numbers, equations, or algorithms: it is about understanding!"</h3>
            <p>— William Paul Thurston</p>
          </div>
        </div> */}

        <Container className="py-1">
          {/* Enhanced Learning Adventure Section */}
          <div className="learning-adventure-section">
            {/* <div className="section-header">
              <h2>
                <FontAwesomeIcon icon={faRocket} className="me-2" />
                🚀 Start Your Learning Adventure
              </h2>
              <p>Select your preferences and let's begin this exciting mathematical journey!</p>
            </div> */}

            <div className="form-container">
              <Form onSubmit={handleSubmit}>
                <Row className="form-row">
                  <Col md={6}>
                    <Form.Group controlId="formClass">
                      <Form.Label>
                        <FontAwesomeIcon icon={faSchool} className="me-2" />
                        Class
                      </Form.Label>
                      <Form.Control
                        as="select"
                        value={selectedClass}
                        onChange={(e) => {
                          console.log("🏫 Class selection changed to:", e.target.value);
                          setSelectedClass(e.target.value);
                        }}
                        className="form-control-enhanced"
                      >
                        <option value="">Select Class</option>
                        {classes.map((cls) => (
                          <option key={cls.class_code} value={cls.class_code}>
                            {cls.class_name}
                          </option>
                        ))}
                      </Form.Control>
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group controlId="formSubject">
                      <Form.Label>
                        <FontAwesomeIcon icon={faBookOpen} className="me-2" />
                        Subject
                      </Form.Label>
                      <Form.Control
                        as="select"
                        value={selectedSubject}
                        onChange={(e) => {
                          console.log("📚 Subject selection changed to:", e.target.value);
                          setSelectedSubject(e.target.value);
                        }}
                        className="form-control-enhanced"
                        disabled={!selectedClass}
                      >
                        <option value="">Select Subject</option>
                        {subjects.map((subject) => (
                          <option
                            key={subject.subject_code}
                            value={subject.subject_code}
                          >
                            {subject.subject_name}
                          </option>
                        ))}
                      </Form.Control>
                    </Form.Group>
                  </Col>
                </Row>

<Row className="form-row">
  <Col md={6}>
    <Form.Group controlId="formChapters">
      <Form.Label>
        <FontAwesomeIcon icon={faListAlt} className="me-2" />
        Chapters (Select Multiple) - {chapters.length} Available
      </Form.Label>
      
      <Select
        isMulti
        value={selectedChapters.map(chapterCode => {
          const chapter = chapters.find(ch => ch.topic_code === chapterCode);
          return chapter ? { value: chapter.topic_code, label: chapter.name } : null;
        }).filter(Boolean)}
        onChange={(selectedOptions) => {
          const values = selectedOptions ? selectedOptions.map(option => option.value) : [];
          setSelectedChapters(values);
          console.log("Selected chapters:", values);
        }}
        options={chapters.map(chapter => ({
          value: chapter.topic_code,
          label: chapter.name
        }))}
        placeholder="Select chapters..."
        isDisabled={!selectedSubject || chapters.length === 0}
        className="chapters-select-final"
        classNamePrefix="select"
        closeMenuOnSelect={false}
        isSearchable={true}
        isClearable={true}
        hideSelectedOptions={false}
        // CRITICAL: Render dropdown at body level to avoid container constraints
        menuPortalTarget={document.body}
        styles={{
          control: (provided, state) => ({
            ...provided,
            minHeight: '56px',
            border: '2px solid #e2e8f0',
            borderRadius: '12px',
            backgroundColor: 'white',
            '&:hover': {
              borderColor: '#667eea',
            },
            boxShadow: state.isFocused ? '0 0 0 3px rgba(102, 126, 234, 0.1)' : 'none',
          }),
          // CRITICAL: Portal-specific styling
          menuPortal: (provided) => ({
            ...provided,
            zIndex: 99999,
          }),
          menu: (provided) => ({
            ...provided,
            borderRadius: '12px',
            border: '2px solid #667eea',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
            // FIXED: Use viewport height to ensure dropdown is never cut off
            maxHeight: 'min(70vh, 500px)',
            minWidth: '400px',
            maxWidth: '600px',
          }),
          menuList: (provided) => ({
            ...provided,
            // CRITICAL: Enough height for all chapters + comfortable scrolling
            maxHeight: 'min(65vh, 450px)',
            overflowY: 'auto',
            padding: '8px',
            // Enhanced scrollbar
            scrollbarWidth: 'thin',
            scrollbarColor: '#667eea #f1f5f9',
          }),
          option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isFocused 
              ? '#667eea' 
              : state.isSelected 
              ? '#5a67d8' 
              : 'white',
            color: state.isFocused || state.isSelected ? 'white' : '#2d3748',
            padding: '10px 14px',
            margin: '2px 0',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: state.isSelected ? '600' : '400',
            // Ensure text wraps for long chapter names
            whiteSpace: 'normal',
            wordBreak: 'break-word',
            lineHeight: '1.4',
            minHeight: '40px',
            display: 'flex',
            alignItems: 'center',
          }),
          multiValue: (provided) => ({
            ...provided,
            backgroundColor: '#667eea',
            borderRadius: '6px',
            margin: '2px',
          }),
          multiValueLabel: (provided) => ({
            ...provided,
            color: 'white',
            fontWeight: '600',
            fontSize: '12px',
            padding: '3px 6px',
          }),
          multiValueRemove: (provided) => ({
            ...provided,
            color: 'white',
            borderRadius: '0 6px 6px 0',
            '&:hover': {
              backgroundColor: '#e53e3e',
              color: 'white',
            },
          }),
          placeholder: (provided) => ({
            ...provided,
            color: '#6b7280',
            fontWeight: '500',
          }),
          dropdownIndicator: (provided, state) => ({
            ...provided,
            color: '#6b7280',
            transform: state.selectProps.menuIsOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.3s ease',
            padding: '8px',
          }),
        }}
      />
      
      {/* Enhanced action buttons */}
      <div className="mt-2 d-flex gap-2 flex-wrap">
        {/* <Button
          variant="outline-primary"
          size="sm"
          onClick={() => setSelectedChapters(chapters.map(ch => ch.topic_code))}
          disabled={!chapters.length}
          style={{ fontSize: '11px', padding: '4px 8px', borderRadius: '6px' }}
        >
          Select All ({chapters.length})
        </Button> */}
        <Button
          variant="outline-secondary"
          size="sm"
          onClick={() => setSelectedChapters([])}
          disabled={!selectedChapters.length}
          style={{ fontSize: '11px', padding: '4px 8px', borderRadius: '6px' }}
        >
          Clear ({selectedChapters.length})
        </Button>
        {/* <Button
          variant="outline-info"
          size="sm"
          onClick={() => {
            // console.log("📊 Chapter Debug Info:");
            // console.log("Total chapters loaded:", chapters.length);
            // console.log("Chapters:", chapters.map(ch => ch.name));
            // console.log("Selected chapters:", selectedChapters.length);
          }}
          style={{ fontSize: '11px', padding: '4px 8px', borderRadius: '6px' }}
        >
        </Button> */}
      </div>
      
      <small className="text-muted mt-1 d-block">
        {/* <strong>{selectedChapters.length}</strong> of <strong>{chapters.length}</strong> chapters selected */}
        {chapters.length === 13 && (
          <span className="text-success ms-2">
            {/* ✅ All chapters loaded */}
          </span>
        )}
        {chapters.length !== 13 && chapters.length > 0 && (
          <span className="text-warning ms-2">
            {/* ⚠ Expected 13 chapters, found {chapters.length} */}
          </span>
        )}
      </small>
    </Form.Group>
  </Col>

  <Col md={6}>
    <Form.Group controlId="formQuestionType">
      <Form.Label>
        <FontAwesomeIcon icon={faClipboardQuestion} className="me-2" />
        Question Type
      </Form.Label>
      <Form.Control
        as="select"
        value={questionType}
        onChange={(e) => setQuestionType(e.target.value)}
        className="form-control-enhanced"
        disabled={selectedChapters.length === 0}
      >
        <option value="">Select Question Type</option>
        <option value="solved">📚 Solved Examples</option>
        <option value="exercise">💪 Practice Exercises</option>
        <option value="external">🎯 Set of Questions</option>
        <option value="worksheets">📄 Worksheets</option>
      </Form.Control>
    </Form.Group>
  </Col>
</Row>

{/* Debug info - Remove after confirming all chapters work
{chapters.length > 0 && (
  <div style={{ 
    background: '#e8f5e8', 
    padding: '15px', 
    borderRadius: '8px', 
    margin: '15px 0',
    fontSize: '14px',
    border: '1px solid #4ade80'
  }}>
    <strong>✅ Chapter Status:</strong>
    <br />• <strong>Total Loaded:</strong> {chapters.length} chapters
    <br />• <strong>Currently Selected:</strong> {selectedChapters.length} chapters
    <br />• <strong>Available Chapters:</strong>
    <div style={{ 
      maxHeight: '120px', 
      overflow: 'auto', 
      marginTop: '8px',
      fontSize: '12px',
      background: 'white',
      padding: '8px',
      borderRadius: '4px'
    }}>
      {chapters.map((ch, idx) => (
        <div key={ch.topic_code} style={{ 
          color: selectedChapters.includes(ch.topic_code) ? '#059669' : '#374151',
          fontWeight: selectedChapters.includes(ch.topic_code) ? 'bold' : 'normal'
        }}>
          {idx + 1}. {ch.name} {selectedChapters.includes(ch.topic_code) ? '✓' : ''}
        </div>
      ))}
    </div>
  </div>
)} */}

                {questionType === "external" && (
                  <Row className="form-row">
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>
                          <FontAwesomeIcon icon={faBookmark} className="me-2" />
                          Select The Set
                        </Form.Label>
                        <Form.Control
                          as="select"
                          value={questionLevel}
                          onChange={(e) => setQuestionLevel(e.target.value)}
                          className="form-control-enhanced"
                        >
                          <option value="">Select The Set</option>
                          {subTopics.map((subTopic, index) => (
                            <option key={subTopic} value={subTopic}>
                              Exercise {index + 1}
                            </option>
                          ))}
                        </Form.Control>
                      </Form.Group>
                    </Col>
                  </Row>
                )}

                {questionType === "worksheets" && (
                  <Row className="form-row">
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>
                          <FontAwesomeIcon icon={faUsers} className="me-2" />
                          Select Worksheet
                        </Form.Label>
                        <Form.Control
                          as="select"
                          value={selectedWorksheet}
                          onChange={(e) => setSelectedWorksheet(e.target.value)}
                          className="form-control-enhanced"
                        >
                          <option value="">Select Worksheet</option>
                          {worksheets.map((worksheet) => (
                            <option key={worksheet.id} value={worksheet.worksheet_name}>
                              {worksheet.worksheet_name}
                            </option>
                          ))}
                        </Form.Control>
                      </Form.Group>
                    </Col>
                  </Row>
                )}

            {error && (
                <Alert variant="danger" dismissible onClose={() => setError(null)}>
                    {error}
                </Alert>
            )}

            {success && (
                <Alert variant="success" dismissible onClose={() => setSuccess('')}>
                    {success}
                </Alert>
            )}


                <div className="form-actions">
                    <Button
                        variant="primary"
                        type="submit"
                        className="btn-generate-enhanced"
                        disabled={!isGenerateButtonEnabled() || isLoading}
                        onClick={handleSubmit}
                    >
                        <FontAwesomeIcon 
                                icon={isLoading ? faSpinner : faRocket} 
                                className={`me-2 ${isLoading ? 'fa-spin' : ''}`} 
                            />
                            {isLoading ? 'Generating...' : 'Generate Questions'}
                        </Button>
                </div>
              </Form>
            </div>
          </div>

          {/* Recent Sessions */} 
         <UnifiedSessions />
        </Container>
      </div>

      {/* Enhanced Question List Modal */}
          {/* Enhanced Question List Modal */}
          <QuestionListModal
            show={showQuestionListModal}
            onHide={() => setShowQuestionListModal(false)}
            questionList={questionList}
            onQuestionClick={handleQuestionClickFromModal}
            isMultipleSelect={questionType === "external" || questionType === "Set of Questions"} // Updated condition
            onMultipleSelectSubmit={handleMultipleSelectSubmit}
            worksheetName={questionType === "worksheets" ? selectedWorksheet : ""}
          />
    </div>
  );
}

export default StudentDash;