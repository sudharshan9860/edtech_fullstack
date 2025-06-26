import React, { useState, useContext, useEffect, useRef, useCallback } from "react";
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

  // Extract data from location state once
  const locationData = location.state || {};
  const {
    question,
    index,
    questionList,
    class_id,
    subject_id,
    topic_ids,
    subtopic,
    selectedQuestions,
    questionNumber: locationQuestionNumber,
    questionId: locationQuestionId,
    image: locationImage
  } = locationData;

  // State for tracking study session
  const [studyTime, setStudyTime] = useState(0);
  const [images, setImages] = useState([]);
  const [isSolveEnabled, setIsSolveEnabled] = useState(true);
  const [showQuestionListModal, setShowQuestionListModal] = useState(false);
  const [processingButton, setProcessingButton] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);
  const [imageSourceType, setImageSourceType] = useState("upload"); // "upload" or "camera"

  // Initialize current question state
  const [currentQuestion, setCurrentQuestion] = useState(() => {
    const questionId = locationQuestionId || `question_${index}_${Date.now()}`;
    const questionNumber = locationQuestionNumber || (index !== undefined ? index + 1 : 1);
    const question_image = locationImage || questionList?.[index]?.image || "";

    return {
      question: question || "",
      questionNumber,
      image: question_image,
      id: questionId
    };
  });

  const { setCurrentQuestion: setContextQuestion } = useCurrentQuestion();

  // Use refs to track if we've already processed the location state
  const hasInitialized = useRef(false);
  const lastLocationKey = useRef(location.key);

  // Memoized timer functions to prevent re-renders
  const memoizedStartTimer = useCallback(startTimer, [startTimer]);
  const memoizedStopTimer = useCallback(stopTimer, [stopTimer]);

  // Only run timer setup once when component mounts or question changes
  useEffect(() => {
    console.log("Timer effect running for question:", currentQuestion.id);
    
    if (currentQuestion.id && !hasInitialized.current) {
      memoizedStartTimer(currentQuestion.id);
      hasInitialized.current = true;
    }
    
    // Cleanup function
    return () => {
      if (hasInitialized.current) {
        const timeSpent = memoizedStopTimer();
        console.log(`Study session ended. Time spent: ${timeSpent}ms`);
      }
    };
  }, [currentQuestion.id, memoizedStartTimer, memoizedStopTimer]);

  // Handle location state changes only when location.key changes
  useEffect(() => {
    // Only process if this is a new navigation (different location key)
    if (location.key !== lastLocationKey.current && location.state) {
      console.log("Processing new location state");
      lastLocationKey.current = location.key;
      
      const newQuestionId = locationQuestionId || `question_${index}_${Date.now()}`;
      const newQuestionNumber = locationQuestionNumber || (index !== undefined ? index + 1 : 1);
      const newImage = locationImage || "";
      
      const newQuestion = {
        question: question || "",
        questionNumber: newQuestionNumber,
        image: newImage,
        id: newQuestionId
      };

      setCurrentQuestion(newQuestion);
      setContextQuestion(newQuestion);

      // Reset other state
      setImages([]);
      setError(null);
      setUploadProgress(0);
      setProcessingButton(null);
      setIsSolveEnabled(true);

      // Update timer for new question
      memoizedStopTimer();
      memoizedStartTimer(newQuestionId);
      hasInitialized.current = true;
    }
  }, [location.key, location.state]); // Only depend on location.key and location.state

  // Log state for debugging - remove duplicate console.log
  useEffect(() => {
    console.log("Location state:", location.state);
    console.log("Current question:", currentQuestion);
    console.log("Selected Questions:", selectedQuestions);
    if (questionList) {
      console.log("questionList", questionList);
    }
  }, [location.state, currentQuestion, selectedQuestions, questionList]);

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
  const handleCapturedImage = useCallback((capturedImageBlob) => {
    // Convert blob to File object
    const file = new File([capturedImageBlob], `captured-solution-${Date.now()}.jpg`, { type: 'image/jpeg' });
    setImages(prevImages => [...prevImages, file]);
    setIsSolveEnabled(false);
    setError(null);
  }, []);

  // Handle upload progress
  const handleUploadProgress = useCallback((percent) => {
    setUploadProgress(percent);
  }, []);

  // Handle timer completion
  const handleTimerComplete = useCallback((seconds) => {
    setStudyTime(seconds);
  }, []);

  // Handlers for different actions
  const handleSubmit = useCallback(() => {
    // Stop the timer and get the time spent
    const timeSpentMs = memoizedStopTimer();
    const timeSpentMinutes = Math.ceil(timeSpentMs / 60000);
    
    // Add study time to the request
    sendFormData({ 
      submit: true,
      study_time_seconds: Math.floor(timeSpentMs / 1000),
      study_time_minutes: timeSpentMinutes
    }, "submit");
  }, [memoizedStopTimer]);

  const handleSolve = useCallback(() => {
    // Stop the timer and get the time spent
    const timeSpentMs = memoizedStopTimer();
    const timeSpentMinutes = Math.ceil(timeSpentMs / 60000);
    
    sendFormData({ 
      solve: true,
      study_time_seconds: Math.floor(timeSpentMs / 1000),
      study_time_minutes: timeSpentMinutes
    }, "solve");
  }, [memoizedStopTimer]);

  const handleExplain = useCallback(() => {
    // Stop the timer and get the time spent
    const timeSpentMs = memoizedStopTimer();
    const timeSpentMinutes = Math.ceil(timeSpentMs / 60000);
    
    sendFormData({ 
      explain: true,
      study_time_seconds: Math.floor(timeSpentMs / 1000),
      study_time_minutes: timeSpentMinutes
    }, "explain");
  }, [memoizedStopTimer]);

  // Enhanced handleCorrect function
  const handleCorrect = useCallback(async () => {
    console.log("Starting handleCorrect function");
    setProcessingButton("correct");
    setError(null);

    // Stop the timer and get the time spent
    const timeSpentMs = memoizedStopTimer();
    const timeSpentMinutes = Math.ceil(timeSpentMs / 60000);

    const formData = new FormData();
    formData.append("class_id", class_id);
    formData.append("subject_id", subject_id);
    formData.append("topic_ids", topic_ids);
    formData.append("question", currentQuestion.question);
    formData.append("subtopic", subtopic);
    formData.append("correct", true);
    formData.append("study_time_seconds", Math.floor(timeSpentMs / 1000));
    formData.append("study_time_minutes", timeSpentMinutes);

    
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
        memoizedStartTimer(currentQuestion.id);
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
  }, [memoizedStopTimer, currentQuestion, images, class_id, subject_id, topic_ids, subtopic, handleUploadProgress, updateStudySession, updateQuestProgress, navigate, questionList, playQuestionSolvedSound, memoizedStartTimer]);

  // New handler for Gap Analysis
  const handleGapAnalysis = useCallback(() => {
    // Stop the timer before navigating
    memoizedStopTimer();

    navigate("/gap-analysis", {
      state: {
        question: currentQuestion.question,
        questionImage: currentQuestion.image,
        class_id,
        subject_id,
        topic_ids,
      },
    });
  }, [memoizedStopTimer, navigate, currentQuestion, class_id, subject_id, topic_ids]);

  // Send form data with progress tracking
  const sendFormData = useCallback(async (flags = {}, actionType) => {
    setProcessingButton(actionType);
    setError(null);

    const formData = new FormData();
    formData.append("class_id", class_id);
    formData.append("subject_id", subject_id);
    formData.append("topic_ids", topic_ids);
    formData.append("question", currentQuestion.question);
    formData.append("subtopic", subtopic);

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
        },
      });
    } catch (error) {
      console.error("API Error:", error);

      // Set user-friendly error message
      if (error.code === "ECONNABORTED") {
        setError(
          "Request timed out. Please try with a smaller image or check your connection."
        );
      } else if (error.friendlyMessage) {
        setError(error.friendlyMessage);
      } else {
        setError("Failed to perform the action. Please try again.");
      }

      setProcessingButton(null);
      setUploadProgress(0);
      
      // Restart timer since submission failed
      memoizedStartTimer(currentQuestion.id);
    }
  }, [class_id, subject_id, topic_ids, currentQuestion.question, subtopic, images, handleUploadProgress, updateStudySession, navigate, questionList, currentQuestion.image, currentQuestion.questionNumber, memoizedStartTimer]);

  // Cancel image upload
  const handleCancelImage = useCallback((index) => {
    const updatedImages = images.filter((_, i) => i !== index);
    setImages(updatedImages);
    setIsSolveEnabled(updatedImages.length === 0);
  }, [images]);

  // Select question from list
  const handleQuestionSelect = useCallback((
    selectedQuestion,
    selectedIndex,
    selectedImage
  ) => {
    console.log("Question selected in SolveQuestion");
    console.log("Selected question:", selectedQuestion);
    console.log("Selected image:", selectedImage);

    // Stop the current timer
    memoizedStopTimer();

    const newQuestionId = `question_${selectedIndex}_${Date.now()}`;
    
    const newQuestion = {
      question: selectedQuestion,
      questionNumber: selectedIndex + 1,
      image: selectedImage,
      id: newQuestionId
    };

    setCurrentQuestion(newQuestion);

    // Start a new timer for the selected question
    memoizedStartTimer(newQuestionId);

    // Reset image related state
    setImages([]);
    setIsSolveEnabled(true);
    setError(null);
    setUploadProgress(0);

    // Close modal
    setShowQuestionListModal(false);
  }, [memoizedStopTimer, memoizedStartTimer]);

  // Handle back button click
  const handleBackClick = useCallback(() => {
    // Stop the timer before navigating back
    memoizedStopTimer();
    navigate(-1);
  }, [memoizedStopTimer, navigate]);

  // Determine if a specific button is processing
  const isButtonProcessing = useCallback((buttonType) => {
    return processingButton === buttonType;
  }, [processingButton]);

  // Determine if any button is processing (to disable all buttons)
  const isAnyButtonProcessing = useCallback(() => {
    return processingButton !== null;
  }, [processingButton]);

  return (
    <div className="solve-question-wrapper">
      <div className="solve-question-container">
        {/* Header section with timer */}
        <div className="solve-question-header d-flex justify-content-end align-items-center mb-3">
          {/* Study Timer */}
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

        {/* Image Upload Section */}
        <Form onSubmit={(e) => e.preventDefault()}>
          <Form.Group controlId="formImage">
            <Form.Label>Add Solution Images</Form.Label>
            
            {/* Image Source Selection Buttons */}
            <div className="image-source-buttons mb-3">
              <Button
                variant={imageSourceType === "upload" ? "primary" : "outline-primary"}
                className="me-2"
                onClick={() => setImageSourceType("upload")}
                disabled={isAnyButtonProcessing()}
              >
                <FontAwesomeIcon icon={faUpload} className="me-2" />
                Upload Images
              </Button>
              <Button
                variant={imageSourceType === "camera" ? "primary" : "outline-primary"}
                onClick={() => setImageSourceType("camera")}
                disabled={isAnyButtonProcessing()}
              >
                <FontAwesomeIcon icon={faCamera} className="me-2" />
                Take Photo
              </Button>
            </div>

            {/* Conditional rendering based on image source type */}
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
                  // For text documents, use higher resolution
                  width: { ideal: 4096 },
                  height: { ideal: 3072 },
                  // Additional constraints for clarity
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

        {/* Upload Progress Bar */}
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

        {/* Image Previews */}
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
            {images.length > 0 && (
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
                Clear All Images
              </Button>
            )}
          </div>
        )}

        {/* New Button Layout */}
        <div className="button-grid mt-4">
          {/* Top Row with Navigation and Submit */}
          <Row className="mb-3">
            <Col xs={6} md={3}>
              <Button
                variant="secondary"
                onClick={handleBackClick}
                className="btn-back w-100"
                disabled={isAnyButtonProcessing()}
              >
                Back
              </Button>
            </Col>
            <Col xs={6} md={3}>
              <Button
                variant="primary"
                onClick={() => setShowQuestionListModal(true)}
                className="btn-question-list w-100"
                disabled={isAnyButtonProcessing()}
              >
                Question List
              </Button>
            </Col>
          </Row>

          {/* Bottom Row with Action Buttons */}
          <Row>
            <Col xs={6} md={3} className="mb-2">
              <Button
                variant={isSolveEnabled ? "primary" : "secondary"}
                onClick={handleSolve}
                className="w-100 solve-btn"
                disabled={!isSolveEnabled || isAnyButtonProcessing()}
              >
                {isButtonProcessing("solve") ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                    />{" "}
                    Processing...
                  </>
                ) : (
                  "Solve"
                )}
              </Button>
            </Col>
            <Col xs={6} md={3} className="mb-2">
              <Button
                variant="primary"
                onClick={handleCorrect}
                className="w-100 btn-correct"
                disabled={images.length === 0 || isAnyButtonProcessing()}
              >
                {isButtonProcessing("correct") ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                    />{" "}
                    Processing...
                  </>
                ) : (
                  "Correct"
                )}
              </Button>
            </Col>
            <Col xs={6} md={3} className="mb-2">
              <Button
                variant="primary"
                onClick={handleExplain}
                className="w-100 explain-btn"
                disabled={isAnyButtonProcessing()}
              >
                {isButtonProcessing("explain") ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                    />{" "}
                    Processing...
                  </>
                ) : (
                  "Explain"
                )}
              </Button>
            </Col>
            <Col xs={6} md={3} className="mb-2">
              <Button
                variant="info"
                onClick={handleGapAnalysis}
                className="w-100 gap-btn"
                disabled={isAnyButtonProcessing()}
              >
                Gap Analysis
              </Button>
            </Col>
          </Row>
        </div>
      </div>

      {/* Question List Modal */}
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