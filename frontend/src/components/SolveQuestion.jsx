import React, { useState, useContext, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Form, Button, Spinner, Alert, Row, Col } from "react-bootstrap";
import axiosInstance from "../api/axiosInstance";
import "./SolveQuestion.css";
import QuestionListModal from "./QuestionListModal";
import { ProgressContext } from "../contexts/ProgressContext";
import { NotificationContext } from "../contexts/NotificationContext";
import { QuestContext } from "../contexts/QuestContext";
import { QUEST_TYPES } from "../models/QuestSystem";
import { useSoundFeedback } from "../hooks/useSoundFeedback";
import { useTimer } from "../contexts/TimerContext";
import StudyTimer from "./StudyTimer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera, faUpload } from "@fortawesome/free-solid-svg-icons";
import "./StudyTimer.css";
import { useCurrentQuestion } from "../contexts/CurrentQuestionContext";
import MarkdownWithMath from "./MarkdownWithMath";
import CameraCapture from "./CameraCapture";

function SolveQuestion() {
  const location = useLocation();
  const navigate = useNavigate();

  // Progress and Notification Contexts
  const { updateStudySession } = useContext(ProgressContext);
  const { addProgressNotification } = useContext(NotificationContext);
  const { updateQuestProgress } = useContext(QuestContext);

  // Timer context
  const { 
    startTimer, 
    stopTimer, 
    isTimerActive 
  } = useTimer();

  // Sound feedback hook
  const { playQuestionSolvedSound, playAchievementSound } = useSoundFeedback();

  // State for tracking study session
  const [studyTime, setStudyTime] = useState(0);
  const [images, setImages] = useState([]);
  const [isSolveEnabled, setIsSolveEnabled] = useState(true);
  const [showQuestionListModal, setShowQuestionListModal] = useState(false);
  const [processingButton, setProcessingButton] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);
  const [imageSourceType, setImageSourceType] = useState("upload"); // "upload" or "camera"

  // Extract data from location state - UPDATED to properly handle questionId
  const {
    question,
    questionId, // The original question ID from backend (required)
    index,
    questionList, 
    class_id,
    subject_id,
    topic_ids,
    subtopic,
    selectedQuestions,
  } = location.state || {};

  const { questionNumber } = location.state || {};
  const question_image = location.state?.image || 
                      location.state?.questionImage || 
                      questionList?.[index]?.image || 
                      questionList?.[index]?.question_image || "";

  const [currentQuestion, setCurrentQuestion] = useState({
    question: question,
    questionNumber: questionNumber || (index !== undefined ? index + 1 : 1),
    image: question_image,
    id: questionId, // Use only the original backend question ID
    originalQuestionId: questionId // Store the original backend question ID (same as id)
  });

  console.log("questionList", questionList);

  const { setCurrentQuestion: setContextQuestion } = useCurrentQuestion();

  // Start timer when component mounts (only if we have original question ID)
  useEffect(() => {
  if (currentQuestion.originalQuestionId) {
    startTimer(currentQuestion.originalQuestionId);
  }
    
    // Stop timer when component unmounts
  return () => {
    const timeSpent = stopTimer();
    console.log(`Study session ended. Time spent: ${timeSpent}ms`);
  };
}, [currentQuestion.originalQuestionId]);

  // Log state for debugging
  useEffect(() => {
    console.log("Location state:", location.state);
    console.log("Current question:", currentQuestion);
    console.log("Selected Questions:", selectedQuestions);
    console.log("Question List:", questionList);
  }, [location.state, currentQuestion, selectedQuestions, questionList]);

  // Update currentQuestion when location state changes
  // Update currentQuestion when location state changes
useEffect(() => {
  if (location.state && location.state.questionId) {
    console.log("Location state received:", location.state);
    
    const newQuestion = {
      question: location.state.question || "",
      questionNumber: location.state.questionNumber || (index !== undefined ? index + 1 : 1),
      image: location.state.image || location.state.questionImage || "", // ✅ FIXED: Handle both field names
      id: location.state.questionId,
      originalQuestionId: location.state.questionId
    };

    console.log("Setting new question with image:", newQuestion.image);
    
    setCurrentQuestion(newQuestion);
    setContextQuestion(newQuestion);

    // Stop previous timer and start a new one
    stopTimer();
    startTimer(location.state.questionId);

    // Reset other state
    setImages([]);
    setError(null);
    setUploadProgress(0);
    setProcessingButton(null);
  }
}, [location.state, index, setContextQuestion]);

  // Helper function to convert base64 to Blob
  const base64ToBlob = (base64Data, mimeType) => {
    try {
      // Remove data URL prefix if it exists
      const dataStart = base64Data.indexOf(",");
      const actualData =
        dataStart !== -1 ? base64Data.slice(dataStart + 1) : base64Data;

      const byteCharacters = atob(actualData);
      const byteArrays = [];

      for (let offset = 0; offset < byteCharacters.length; offset += 512) {
        const slice = byteCharacters.slice(offset, offset + 512);

        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
      }

      return new Blob(byteArrays, { type: mimeType });
    } catch (error) {
      console.error("Error converting base64 to blob:", error);
      return null;
    }
  };

  // Handle image upload
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    // Validate file size before accepting
    const oversizedFiles = files.filter((file) => file.size > 5 * 1024 * 1024); // 5MB limit

    if (oversizedFiles.length > 0) {
      setError(
        `Some files exceed the 5MB size limit. Please select smaller images.`
      );
      return;
    }

    setImages(prevImages => [...prevImages, ...files]);
    setIsSolveEnabled(false);
    setError(null); // Clear previous errors
  };

  // Handle captured image from camera
  const handleCapturedImage = (capturedImageBlob) => {
    // Convert blob to File object
    const file = new File([capturedImageBlob], `captured-solution-${Date.now()}.jpg`, { type: 'image/jpeg' });
    setImages(prevImages => [...prevImages, file]);
    setIsSolveEnabled(false);
    setError(null);
  };

  // Handle upload progress
  const handleUploadProgress = (percent) => {
    setUploadProgress(percent);
  };

  // Handle timer completion
  const handleTimerComplete = (seconds) => {
    setStudyTime(seconds);
  };

  // Handlers for different actions
  const handleSubmit = () => {
    // Stop the timer and get the time spent
    const timeSpentMs = stopTimer();
    const timeSpentMinutes = Math.ceil(timeSpentMs / 60000);
    
    // Add study time to the request
    sendFormData({ 
      submit: true,
      study_time_seconds: Math.floor(timeSpentMs / 1000),
      study_time_minutes: timeSpentMinutes
    }, "submit");
  };

  const handleSolve = () => {
    // Stop the timer and get the time spent
    const timeSpentMs = stopTimer();
    const timeSpentMinutes = Math.ceil(timeSpentMs / 60000);
    
    sendFormData({ 
      solve: true,
      study_time_seconds: Math.floor(timeSpentMs / 1000),
      study_time_minutes: timeSpentMinutes
    }, "solve");
  };

  const handleExplain = () => {
    // Stop the timer and get the time spent
    const timeSpentMs = stopTimer();
    const timeSpentMinutes = Math.ceil(timeSpentMs / 60000);
    
    sendFormData({ 
      explain: true,
      study_time_seconds: Math.floor(timeSpentMs / 1000),
      study_time_minutes: timeSpentMinutes
    }, "explain");
  };

  // Enhanced handleCorrect function
  const handleCorrect = async () => {
    console.log("Starting handleCorrect function");
    setProcessingButton("correct");
    setError(null);

  // // Validate that we have the original question ID from backend
  // if (!currentQuestion.originalQuestionId) {
  //   setError("Cannot submit: Missing original question ID from backend");
  //   setProcessingButton(null);
  //   return;
  // }

    // Stop the timer and get the time spent
    const timeSpentMs = stopTimer();
    const timeSpentMinutes = Math.ceil(timeSpentMs / 60000);

    const formData = new FormData();
    formData.append("class_id", class_id);
    formData.append("subject_id", subject_id);
    formData.append("topic_ids", topic_ids);
    formData.append("question", currentQuestion.question);
    // IMPORTANT: Add the original question ID from backend (required)
    // formData.append("question_id", currentQuestion.originalQuestionId);
    formData.append("subtopic", subtopic);
    formData.append("correct", true);
    formData.append("study_time_seconds", Math.floor(timeSpentMs / 1000));
    formData.append("study_time_minutes", timeSpentMinutes);

    // In handleCorrect function, ADD this line after the existing formData.append calls:
if (currentQuestion.originalQuestionId || currentQuestion.id) {
  formData.append("question_id", currentQuestion.originalQuestionId || currentQuestion.id);
}

    // IMPORTANT: Add the original question ID from backend
    if (currentQuestion.originalQuestionId) {
      formData.append("question_id", currentQuestion.originalQuestionId);
    }

    // Helper: finalize and send the form after appending everything
    const finalizeAndSendForm = async () => {
      // Add user's solution images
      if (images.length > 0) {
        images.forEach((image) => {
          formData.append("ans_img", image);
        });
      }

      try {
        setUploadProgress(0);
        const response = await axiosInstance.uploadFile(
          "/anssubmit/",
          formData,
          handleUploadProgress
        );

        // Update study session
        updateStudySession(
          new Date().toISOString().split("T")[0], 
          timeSpentMinutes, 
          1, 
          100
        );

        // Update quest progress
        updateQuestProgress("daily_solve_questions", 1, QUEST_TYPES.DAILY);

        // Navigate to result page
        navigate("/resultpage", {
          state: {
            ...response.data,
            actionType: "correct",
            questionList,
            class_id,
            subject_id,
            topic_ids,
            subtopic,
            questionImage: currentQuestion.image,
            questionNumber: currentQuestion.questionNumber,
            // Add the student's uploaded/captured images
            studentImages: images.map(img => URL.createObjectURL(img))
          },
        });

        playQuestionSolvedSound(true, 100);
      } catch (error) {
        console.error("API Error:", error);
        if (error.code === "ECONNABORTED") {
          setError(
            "Request timed out. Please try with a smaller image or check your connection."
          );
        } else if (error.friendlyMessage) {
          setError(error.friendlyMessage);
        } else {
          setError("Failed to correct the solution. Please try again.");
        }
        setProcessingButton(null);
        setUploadProgress(0);
        
        // Restart timer since submission failed
        startTimer(currentQuestion.id);
      }
    };

    // Process question image as base64
    if (currentQuestion.image) {
      if (currentQuestion.image.startsWith("data:image")) {
        // Already base64 – send as-is
        console.log("Detected base64 question image");
        formData.append("ques_img", currentQuestion.image);
        finalizeAndSendForm();
      } else if (currentQuestion.image.startsWith("http")) {
        try {
          const imageResponse = await fetch(currentQuestion.image);
          if (!imageResponse.ok) {
            throw new Error(`Failed to fetch image: ${imageResponse.status}`);
          }

          const blob = await imageResponse.blob();
          const reader = new FileReader();

          reader.onloadend = async () => {
            const base64String = reader.result;
            formData.append("question_img_base64", base64String);
            finalizeAndSendForm(); // Proceed after conversion
          };

          reader.readAsDataURL(blob);
        } catch (fetchError) {
          console.error(
            "Error fetching or converting image to base64:",
            fetchError
          );
          setError(`Error fetching image: ${fetchError.message}`);
          finalizeAndSendForm(); // Proceed even if image failed
        }
      } else {
        console.warn(
          "Unsupported image format:",
          currentQuestion.image.substring(0, 30)
        );
        finalizeAndSendForm();
      }
    } else {
      // No question image to process
      finalizeAndSendForm();
    }
  };

  // UPDATE: Modified sendFormData function to include question_id
  const sendFormData = async (flags = {}, actionType) => {
    setProcessingButton(actionType);
    setError(null);

  // // Validate that we have the original question ID from backend
  // if (!currentQuestion.originalQuestionId) {
  //   setError("Cannot submit: Missing original question ID from backend");
  //   setProcessingButton(null);
  //   return;
  // }

  // console.log("🔍 DEBUG: Sending question_id to backend:", currentQuestion.originalQuestionId);
  // console.log("🔍 DEBUG: Current question object:", currentQuestion);
  // console.log("🔍 DEBUG: Action type:", actionType);

    const formData = new FormData();
    formData.append("class_id", class_id);
    formData.append("subject_id", subject_id);
    formData.append("topic_ids", topic_ids);
    formData.append("question", currentQuestion.question);
    formData.append("ques_img", currentQuestion.image || "");
    formData.append("subtopic", subtopic);

    // IMPORTANT: Add the original question ID from backend (required)
    // formData.append("question_id", currentQuestion.originalQuestionId);

    

    // Debug: Log all form data entries
  // console.log("🔍 DEBUG: FormData entries:");
  // for (let [key, value] of formData.entries()) {
  //   if (key === "question_id") {
  //     console.log(`  ✅ ${key}:`, value);
  //   } else {
  //     console.log(`  📝 ${key}:`, key === "ques_img" ? `[${value.length} chars]` : value);
  //   }
  // }

  // In sendFormData function, ADD this line after the existing formData.append calls:
if (currentQuestion.originalQuestionId || currentQuestion.id) {
  formData.append("question_id", currentQuestion.originalQuestionId || currentQuestion.id);
}
    
    // Append additional data from flags
    Object.entries(flags).forEach(([key, value]) => {
      formData.append(key, value);
    });

    // Add images if required by the action
    if (flags.submit) {
      images.forEach((image) => {
        formData.append("ans_img", image);
      });
    }

    try {
      // Use the custom upload method for actions with file uploads
      let response;

      if (flags.submit) {
        // Use custom upload method with progress tracking
        response = await axiosInstance.uploadFile(
          "/anssubmit/",
          formData,
          handleUploadProgress
        );
      } else {
        // Regular request for actions without file uploads
        response = await axiosInstance.post("/anssubmit/", formData);
      }

      // Update study session with time info if available
      if (flags.study_time_minutes) {
        updateStudySession(
          new Date().toISOString().split("T")[0],
          flags.study_time_minutes,
          1,
          0 // Accuracy unknown at this point
        );
      }

      // Navigate to results page
      navigate("/resultpage", {
        state: {
          ...response.data,
          actionType,
          questionList,
          class_id,
          subject_id,
          topic_ids,
          subtopic,
          questionImage: currentQuestion.image,
          questionNumber: currentQuestion.questionNumber,
          // questionId: currentQuestion.originalQuestionId, // Pass the original question ID
          studentImages: images.map(img => URL.createObjectURL(img))
        },
      });

      if (actionType === "solve" || actionType === "correct") {
        const accuracy = response.data.accuracy || response.data.obtained_marks || 0;
        playQuestionSolvedSound(true, accuracy);
      }

    } catch (error) {
      console.error("API Error:", error);

      // Set user-friendly error message
      if (error.response && error.response.status === 500) {
      const errorText = error.response.data || error.message;
      if (errorText.includes("QuestionWithImage matching query does not exist")) {
        setError("This question is not available for solving/explanation. The question might not be properly stored in the database.");
      } else {
        setError("Server error occurred. Please try again later.");
      }
    } else if (error.code === "ECONNABORTED") {
      setError("Request timed out. Please try with a smaller image or check your connection.");
    } else if (error.friendlyMessage) {
      setError(error.friendlyMessage);
    } else {
      setError("Failed to perform the action. Please try again.");
    }

      setProcessingButton(null);
      setUploadProgress(0);
      
     // Restart timer since submission failed (using original question ID)
      if (currentQuestion.id) {
      startTimer(currentQuestion.id);
    }
    }
  };

  // Cancel image upload
  const handleCancelImage = (index) => {
    const updatedImages = images.filter((_, i) => i !== index);
    setImages(updatedImages);
    setIsSolveEnabled(updatedImages.length === 0);
  };

  // UPDATE: Modified handleQuestionSelect to preserve question ID
  const handleQuestionSelect = (selectedQuestion, selectedIndex, selectedImage, questionId = null) => {
  console.log("Question selected in SolveQuestion");
  console.log("Selected question:", selectedQuestion);
  console.log("Selected image:", selectedImage);
  console.log("Question ID:", questionId);

    // Stop the current timer
    stopTimer();

   // Use questionId if provided, otherwise get from questionList
  const actualQuestionData = questionList?.[selectedIndex];
  const originalQuestionId = questionId || actualQuestionData?.id || actualQuestionData?.question_id;

  // Only proceed if we have an original question ID from backend
  if (!originalQuestionId) {
    console.error("No original question ID found for selected question");
    setError("Unable to select question: Missing question ID");
    return;
  }

    // const newQuestionId = `question_${selectedIndex}_${Date.now()}`;
    
    setCurrentQuestion({
      question: selectedQuestion,
      questionNumber: selectedIndex + 1,
      image: selectedImage,
      id: originalQuestionId, // Use only the original backend question ID
      originalQuestionId: originalQuestionId
    });

  // Start a new timer for the selected question using the original ID
    startTimer(originalQuestionId);

    // Reset image related state
    setImages([]);
    setIsSolveEnabled(true);
    setError(null);
    setUploadProgress(0);

    // Close modal
    setShowQuestionListModal(false);
  };

  // Handle back button click
  const handleBackClick = () => {
    // Stop the timer before navigating back
    stopTimer();
    navigate("/student-dash");
  };

  // Determine if a specific button is processing
  const isButtonProcessing = (buttonType) => {
    return processingButton === buttonType;
  };

  // Determine if any button is processing (to disable all buttons)
  const isAnyButtonProcessing = () => {
    return processingButton !== null;
  };

  // Clean up object URLs when component unmounts
  useEffect(() => {
    return () => {
      images.forEach(img => {
        if (img instanceof File) {
          const url = URL.createObjectURL(img);
          URL.revokeObjectURL(url);
        }
      });
    };
  }, [images]);

  return (
    <div className="solve-question-wrapper">
      <div className="solve-question-container">
        <div className="solve-question-content">
          {/* Header section with timer */}
          <div className="solve-question-header d-flex justify-content-between align-items-center mb-3">
            <StudyTimer 
              isActive={isTimerActive}
              questionId={currentQuestion.id}
              onTimerComplete={handleTimerComplete}
              className={processingButton ? "stopped" : ""}
            />
          </div>

          {/* Question Display Section */}
          <div className="question-text-container">
            <span className="question-title">
              Question {currentQuestion.questionNumber}
            </span>
            {currentQuestion.image && (
              <img
                src={currentQuestion.image}
                alt="Question"
                className="question-image"
              />
            )}
            <div className="question-text"><MarkdownWithMath content={currentQuestion.question} /></div>
          </div>

          {/* Error Message */}
          {error && (
            <Alert variant="danger" className="my-3">
              {error}
            </Alert>
          )}

          {/* Image Upload Section - Keep your existing upload section here */}
          <Form onSubmit={(e) => e.preventDefault()}>
            <Form.Group controlId="formImage">
              <Form.Label>Add Solution Images</Form.Label>
              
              {/* Image Source Selection Buttons */}
              <div className="image-source-buttons mb-3">
                <Button
                  variant={imageSourceType === "camera" ? "primary" : "outline-primary"}
                  onClick={() => setImageSourceType("camera")}
                  disabled={isAnyButtonProcessing()}
                >
                  <FontAwesomeIcon icon={faCamera} className="me-2" />
                  Take Photo
                </Button>
              </div>

              {/* Keep your existing conditional rendering and image upload logic here */}
              {imageSourceType === "upload" ? (
                <>
                  <Form.Control
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    disabled={isAnyButtonProcessing()}
                  />
                  <Form.Text className="text-muted">
                    Maximum file size: 5MB per image. You can select multiple images.
                  </Form.Text>
                </>
              ) : (
                <div style={{
                  border: '2px dashed #dee2e6',
                  borderRadius: '8px',
                  padding: '20px',
                  backgroundColor: '#f8f9fa',
                  marginTop: '10px'
                }}>
                <CameraCapture
                  onImageCapture={handleCapturedImage}
                  videoConstraints={{ 
                    facingMode: { ideal: "environment" },
                    width: { ideal: 4096 },
                    height: { ideal: 3072 },
                    focusMode: { ideal: "continuous" },
                    exposureMode: { ideal: "continuous" }
                  }}
                />
                  <p className="text-muted mt-2 text-center">
                    Click "Capture" to take a photo of your solution
                  </p>
                </div>
              )}
            </Form.Group>
          </Form>

          {/* Upload Progress Bar - Keep your existing progress bar */}
          {isAnyButtonProcessing() && uploadProgress > 0 && (
            <div className="upload-progress mt-3">
              <div className="progress">
                <div
                  className="progress-bar progress-bar-striped progress-bar-animated"
                  role="progressbar"
                  style={{ width: `${uploadProgress}%` }}
                  aria-valuenow={uploadProgress}
                  aria-valuemin="0"
                  aria-valuemax="100"
                >
                  {uploadProgress}%
                </div>
              </div>
              <p className="text-center mt-1">
                Uploading... Please don't close this page.
              </p>
            </div>
          )}

          {/* Image Previews - Keep your existing image preview logic */}
          {images.length > 0 && (
            <div className="uploaded-images mt-3">
              <h6>Solution Images ({images.length})</h6>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
                gap: '12px',
                marginTop: '12px'
              }}>
                {images.map((image, index) => (
                  <div key={index} className="image-preview-container" style={{ position: 'relative' }}>
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`Preview ${index + 1}`}
                      className="image-preview"
                      style={{
                        width: '100%',
                        height: '150px',
                        objectFit: 'cover',
                        borderRadius: '8px',
                        border: '1px solid #dee2e6'
                      }}
                    />
                    <button
                      type="button"
                      className="image-remove-btn"
                      onClick={() => handleCancelImage(index)}
                      disabled={isAnyButtonProcessing()}
                      aria-label="Remove image"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
              <Button
                variant="outline-danger"
                size="sm"
                className="mt-2"
                onClick={() => {
                  setImages([]);
                  setIsSolveEnabled(true);
                }}
                disabled={isAnyButtonProcessing()}
              >
                Clear All
              </Button>
            </div>
          )}

          {/* Add padding at bottom to prevent content from being hidden behind fixed buttons */}
          <div style={{ height: '120px' }}></div>
        </div>

        {/* FIXED BOTTOM BUTTON CONTAINER - CORRECTED */}
        <div className="fixed-bottom-buttons-container">
          {/* Top Row with Navigation - Full Width Buttons */}
          <Row className="mb-2">
            <Col xs={6}>
              <Button
                variant="secondary"
                onClick={handleBackClick}
                className="btn-back w-100"
                disabled={isAnyButtonProcessing()}
                style={{ 
                  padding: '12px 20px',
                  fontSize: '16px',
                  fontWeight: '500',
                  borderRadius: '8px'
                }}
              >
                ← Back
              </Button>
            </Col>
            <Col xs={6}>
              <Button
                variant="primary"
                onClick={() => setShowQuestionListModal(true)}
                className="btn-question-list w-100"
                disabled={isAnyButtonProcessing()}
                style={{ 
                  padding: '12px 20px',
                  fontSize: '16px',
                  fontWeight: '500',
                  borderRadius: '8px'
                }}
              >
                📋 Question List
              </Button>
            </Col>
          </Row>

          {/* Bottom Row with Action Buttons - Evenly Spaced */}
          <Row className="g-2">
            <Col xs={4}>
              <Button
                variant={isSolveEnabled ? "success" : "secondary"}
                onClick={handleSolve}
                className="w-100 solve-btn"
                disabled={!isSolveEnabled || isAnyButtonProcessing()}
                style={{ 
                  padding: '14px 8px',
                  fontSize: '15px',
                  fontWeight: '600',
                  borderRadius: '8px',
                  minHeight: '50px'
                }}
              >
                {isButtonProcessing("solve") ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                    />
                    <br />
                    <small>Processing...</small>
                  </>
                ) : (
                  <>
                    🔍
                    <br />
                    <span>Solve</span>
                  </>
                )}
              </Button>
            </Col>
            <Col xs={4}>
              <Button
                variant="primary"
                onClick={handleCorrect}
                className="w-100 btn-correct"
                disabled={images.length === 0 || isAnyButtonProcessing()}
                style={{ 
                  padding: '14px 8px',
                  fontSize: '15px',
                  fontWeight: '600',
                  borderRadius: '8px',
                  minHeight: '50px'
                }}
              >
                {isButtonProcessing("correct") ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                    />
                    <br />
                    <small>Processing...</small>
                  </>
                ) : (
                  <>
                    ✅
                    <br />
                    <span>Auto-Correct</span>
                  </>
                )}
              </Button>
            </Col>
            <Col xs={4}>
              <Button
                variant="info"
                onClick={handleExplain}
                className="w-100 explain-btn"
                disabled={isAnyButtonProcessing()}
                style={{ 
                  padding: '14px 8px',
                  fontSize: '15px',
                  fontWeight: '600',
                  borderRadius: '8px',
                  minHeight: '50px'
                }}
              >
                {isButtonProcessing("explain") ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                    />
                    <br />
                    <small>Processing...</small>
                  </>
                ) : (
                  <>
                    💡
                    <br />
                    <span>Explain</span>
                  </>
                )}
              </Button>
            </Col>
          </Row>
        </div>
      </div>

      {/* Question List Modal - Keep your existing modal */}
      <QuestionListModal
        show={showQuestionListModal}
        onHide={() => setShowQuestionListModal(false)}
        questionList={Array.isArray(selectedQuestions) && selectedQuestions.length > 0 ? selectedQuestions : questionList}
        onQuestionClick={handleQuestionSelect}
        isMultipleSelect={false}
        onMultipleSelectSubmit={null}
      />
    </div>
  );
}

export default SolveQuestion;